import { NextResponse } from 'next/server';
import { generateDailyMenu } from '@/app/lib/services/ai-menu-generator';
import { WeatherCondition } from '@/app/models/weather';
import { Ingredient } from '@/app/models/ingredient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      weatherCondition, 
      temperature, 
      date, 
      availableIngredients: initialIngredients = [], 
      cuisine: initialCuisine = [], 
      dietaryRestrictions = [],
      city = 'Paris',
      restaurantId
    } = body;

    // Utiliser des variables modifiables
    let availableIngredients = [...initialIngredients];
    let cuisine = [...initialCuisine];

    // Validation des données reçues
    if (!weatherCondition) {
      return NextResponse.json(
        { error: 'La condition météorologique est requise.' },
        { status: 400 }
      );
    }

    // Vérification que weatherCondition est un type valide
    const validWeatherConditions: WeatherCondition[] = [
      'clear', 'partlyCloudy', 'cloudy', 'rainy', 'stormy', 
      'snowy', 'foggy', 'windy', 'hot', 'cold'
    ];

    if (!validWeatherConditions.includes(weatherCondition as WeatherCondition)) {
      return NextResponse.json(
        { error: `Condition météo invalide. Valeurs acceptées: ${validWeatherConditions.join(', ')}` },
        { status: 400 }
      );
    }

    console.log(`Génération de menu demandée pour la condition météo: ${weatherCondition}`);
    
    // Récupérer les informations du restaurant et son menu fixe s'il est fourni
    let restaurantMenu = null;
    let restaurantName = null;
    let restaurantIngredients = [];
    let restaurantCuisine = [];
    
    if (restaurantId) {
      try {
        // Récupérer les informations du restaurant
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: restaurantId },
          select: { name: true, cuisine: true }
        });
        
        if (restaurant) {
          restaurantName = restaurant.name;
          
          // Récupérer la cuisine du restaurant
          if (restaurant.cuisine) {
            // S'assurer que c'est un tableau
            restaurantCuisine = Array.isArray(restaurant.cuisine) ? restaurant.cuisine : [];
            console.log(`Style(s) culinaire(s) du restaurant identifié(s): ${restaurantCuisine.join(', ')}`);
            
            // Utiliser en priorité la cuisine du restaurant, et non celle passée en paramètre
            cuisine = restaurantCuisine.length > 0 ? restaurantCuisine : cuisine;
          }
          
          // Si cuisine est vide à ce stade, utiliser celle passée en paramètre
          if ((!cuisine || cuisine.length === 0) && initialCuisine.length > 0) {
            cuisine = initialCuisine;
            console.log(`Utilisation du style culinaire spécifié en paramètre: ${cuisine.join(', ')}`);
          }
          
          // Récupérer le menu fixe du restaurant
          const menu = await prisma.menu.findFirst({
            where: {
              restaurantId,
              type: 'regular',
              isActive: true
            }
          });
          
          if (menu) {
            restaurantMenu = menu;
            console.log(`Menu fixe trouvé pour le restaurant "${restaurantName}" (ID: ${restaurantId})`);
          } else {
            console.log(`Aucun menu fixe trouvé pour le restaurant "${restaurantName}" (ID: ${restaurantId})`);
          }
          
          // Récupérer les ingrédients disponibles du restaurant s'ils ne sont pas fournis
          if (!availableIngredients || availableIngredients.length === 0) {
            const ingredientInventory = await prisma.ingredientInventory.findMany({
              where: {
                restaurantId: restaurantId,
                isAvailable: true
              },
              include: {
                ingredient: true
              }
            });
            
            // Transformer les ingrédients dans le format attendu
            restaurantIngredients = ingredientInventory.map((inventory: any) => ({
              id: inventory.id,
              name: inventory.ingredient.name,
              category: inventory.ingredient.category,
              isAvailable: inventory.isAvailable,
              quantity: inventory.quantity,
              unit: inventory.unit,
              allergen: inventory.ingredient.isAllergen,
              dietary: inventory.ingredient.dietaryRestrictions || {},
              restaurantId: inventory.restaurantId,
              createdAt: inventory.createdAt,
              updatedAt: inventory.updatedAt
            }));
            
            console.log(`${restaurantIngredients.length} ingrédients du restaurant récupérés pour la génération du menu`);
            
            // Utiliser les ingrédients du restaurant si aucun n'a été fourni
            if (restaurantIngredients.length > 0) {
              availableIngredients = restaurantIngredients;
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations du restaurant:", error);
        // Continue sans les informations du restaurant
      }
    }
    
    // Conversion des données d'ingrédients au format attendu par le service
    const formattedIngredients: Ingredient[] = availableIngredients.map((ing: any) => ({
      id: ing.id || `ing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: ing.name,
      category: ing.category || 'other',
      isAvailable: true,
      quantity: ing.quantity,
      unit: ing.unit,
      allergen: ing.allergen || false,
      dietary: ing.dietary || {},
      restaurantId: ing.restaurantId || '',
      createdAt: ing.createdAt || new Date(),
      updatedAt: ing.updatedAt || new Date()
    }));

    // Si un menu de restaurant existe, extraire les informations pertinentes pour le générateur
    let restaurantCuisineType = cuisine;
    let restaurantMenuSimplified: {
      categories: {
        name: string;
        items: {
          name: string;
          description: string;
          ingredients: string[];
        }[];
      }[];
    } = {
      categories: []
    };
    
    if (restaurantMenu) {
      // Extraire les types de cuisine du menu existant
      const allIngredients = new Set<string>();
      const allDishNames = [];
      
      if (restaurantMenu.categories && Array.isArray(restaurantMenu.categories)) {
        restaurantMenuSimplified.categories = restaurantMenu.categories.map((category: any) => {
          // Récupérer les noms des plats et leurs ingrédients
          if (category.items && Array.isArray(category.items)) {
            category.items.forEach((item: any) => {
              allDishNames.push(item.name);
              
              if (item.ingredients && Array.isArray(item.ingredients)) {
                item.ingredients.forEach((ingredient: string) => allIngredients.add(ingredient));
              }
            });
          }
          
          return {
            name: category.name,
            items: (category.items || []).map((item: any) => ({
              name: item.name,
              description: item.description,
              ingredients: item.ingredients || []
            }))
          };
        });
      }
      
      // Si aucun type de cuisine n'est spécifié, ne pas essayer de le déduire ici
      // L'API OpenAI va analyser le menu et déduire le type de cuisine elle-même
    }

    // Appel au service de génération de menu
    const generatedMenu = await generateDailyMenu({
      weatherCondition: weatherCondition as WeatherCondition,
      temperature,
      date,
      availableIngredients: formattedIngredients,
      cuisine: restaurantCuisineType, // Le type de cuisine est optionnel, l'IA peut le déduire du menu
      dietaryRestrictions,
      city,
      restaurantName: restaurantName || undefined,
      restaurantMenu: restaurantMenuSimplified
    });

    return NextResponse.json(generatedMenu);
  } catch (error) {
    console.error('Erreur lors de la génération du menu:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération du menu.' },
      { status: 500 }
    );
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
} 