import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/app/lib/auth';
import { Ingredient } from '@/app/models/ingredient';
import { prisma } from '@/app/lib/db/prisma';

// Interface pour typer les paramètres de route
interface RouteParams {
  params: {
    id: string;
  };
}

// Interface pour typer l'inventaire d'ingrédients
interface IngredientInventoryWithIngredient {
  id: string;
  restaurantId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  isAvailable: boolean;
  ingredient: {
    id: string;
    name: string;
    category: string;
    isAllergen: boolean;
    dietaryRestrictions: any;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Récupérer l'ID du restaurant
    const restaurantId = await params.id;
    
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'ID de restaurant manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier l'authentification de l'utilisateur
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }
    
    console.log(`Récupération des ingrédients pour le restaurant ID: ${restaurantId}`);
    
    // Vérifier que l'utilisateur a accès à ce restaurant
    const hasAccess = await prisma.usersOnRestaurants.findFirst({
      where: {
        userId: user.id,
        restaurantId: restaurantId
      }
    });
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Accès refusé à ce restaurant' },
        { status: 403 }
      );
    }
    
    // Récupérer les ingrédients disponibles pour le restaurant
    const ingredientInventory = await prisma.ingredientInventory.findMany({
      where: {
        restaurantId: restaurantId,
        isAvailable: true
      },
      include: {
        ingredient: true
      }
    });
    
    // Formatter les ingrédients pour le frontend
    const ingredients = ingredientInventory.map((inventory: IngredientInventoryWithIngredient) => ({
      id: inventory.id,
      name: inventory.ingredient.name,
      category: inventory.ingredient.category,
      isInStock: inventory.isAvailable,
      quantity: inventory.quantity,
      unit: inventory.unit,
      allergen: inventory.ingredient.isAllergen,
      dietary: inventory.ingredient.dietaryRestrictions,
      restaurantId: inventory.restaurantId
    }));
    
    console.log(`${ingredients.length} ingrédients trouvés pour le restaurant ${restaurantId}`);
    
    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error('Erreur lors de la récupération des ingrédients:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des ingrédients' },
      { status: 500 }
    );
  }
}

// Ajouter une fonction POST pour créer des ingrédients
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Récupérer l'ID du restaurant depuis les paramètres de route
    const restaurantId = await params.id;
    
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'ID de restaurant manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier l'authentification de l'utilisateur
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }
    
    // Vérifier que l'utilisateur a accès à ce restaurant
    const hasAccess = await prisma.usersOnRestaurants.findFirst({
      where: {
        userId: user.id,
        restaurantId: restaurantId
      }
    });
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Accès refusé à ce restaurant' },
        { status: 403 }
      );
    }
    
    // Récupérer les informations du restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId
      }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant non trouvé' },
        { status: 404 }
      );
    }
    
    // Compter les ingrédients actuels
    const currentIngredients = await prisma.ingredientInventory.count({
      where: { restaurantId }
    });
    
    if (currentIngredients > 0) {
      return NextResponse.json({
        message: `Ce restaurant a déjà ${currentIngredients} ingrédients`,
        count: currentIngredients
      });
    }
    
    // Définir les ingrédients en fonction du type de restaurant
    let ingredientsData = [];
    let body;
    
    // Essayer de lire les ingrédients du corps de la requête
    try {
      body = await request.json();
    } catch (e) {
      console.log("Pas de corps JSON valide dans la requête");
      body = null;
    }
    
    // Si des ingrédients ont été fournis dans la requête, les utiliser
    if (body && body.ingredients && Array.isArray(body.ingredients) && body.ingredients.length > 0) {
      ingredientsData = body.ingredients;
      console.log(`Utilisation des ${ingredientsData.length} ingrédients fournis dans la requête`);
    } 
    // Sinon, déterminer les ingrédients par défaut en fonction du type de restaurant
    else {
      // Identifier si c'est un restaurant corse
      const isCorsican = typeof restaurant.cuisine === 'object' && 
        Array.isArray(restaurant.cuisine) && 
        restaurant.cuisine.some((c: any) => 
          c.toLowerCase().includes('corse') || 
          restaurant.name.toLowerCase().includes('minnà') || 
          restaurant.name.toLowerCase().includes('minna'));
      
      if (isCorsican) {
        console.log("Restaurant identifié comme corse, utilisation d'ingrédients typiques corses");
        
        // Ingrédients typiques de la cuisine corse
        ingredientsData = [
          { name: 'Figatellu', category: 'charcuterie', isAllergen: false },
          { name: 'Prisuttu', category: 'charcuterie', isAllergen: false },
          { name: 'Lonzu', category: 'charcuterie', isAllergen: false },
          { name: 'Coppa', category: 'charcuterie', isAllergen: false },
          { name: 'Brocciu', category: 'fromage', isAllergen: true, allergenType: 'lait' },
          { name: 'Tomme corse', category: 'fromage', isAllergen: true, allergenType: 'lait' },
          { name: 'Fromage frais', category: 'fromage', isAllergen: true, allergenType: 'lait' },
          { name: 'Miel', category: 'épicerie', isAllergen: false },
          { name: 'Châtaignes', category: 'épicerie', isAllergen: true, allergenType: 'fruits à coque' },
          { name: 'Canistrelli', category: 'boulangerie', isAllergen: true, allergenType: 'gluten' },
          { name: 'Herbes du maquis', category: 'herbes', isAllergen: false },
          { name: 'Nepita', category: 'herbes', isAllergen: false },
          { name: 'Huile d\'olive', category: 'huiles', isAllergen: false },
          { name: 'Vermentinu', category: 'boissons', isAllergen: false },
          { name: 'Agrumes corses', category: 'fruits', isAllergen: false },
          { name: 'Olives corses', category: 'épicerie', isAllergen: false },
          { name: 'Nuciola', category: 'épicerie', isAllergen: true, allergenType: 'fruits à coque' },
          { name: 'Marjolaine', category: 'herbes', isAllergen: false },
          { name: 'Polenta', category: 'céréales', isAllergen: false },
          { name: 'Pistache', category: 'fruits à coque', isAllergen: true, allergenType: 'fruits à coque' },
        ];
      } else {
        console.log("Utilisation d'ingrédients de base pour ce restaurant");
        
        // Ingrédients de base pour tout type de restaurant
        ingredientsData = [
          { name: 'Poulet', category: 'viande', isAllergen: false },
          { name: 'Bœuf', category: 'viande', isAllergen: false },
          { name: 'Porc', category: 'viande', isAllergen: false },
          { name: 'Thon', category: 'poisson', isAllergen: true, allergenType: 'poisson' },
          { name: 'Saumon', category: 'poisson', isAllergen: true, allergenType: 'poisson' },
          { name: 'Œufs', category: 'produits laitiers', isAllergen: true, allergenType: 'œuf' },
          { name: 'Lait', category: 'produits laitiers', isAllergen: true, allergenType: 'lait' },
          { name: 'Beurre', category: 'produits laitiers', isAllergen: true, allergenType: 'lait' },
          { name: 'Crème', category: 'produits laitiers', isAllergen: true, allergenType: 'lait' },
          { name: 'Fromage', category: 'produits laitiers', isAllergen: true, allergenType: 'lait' },
          { name: 'Farine', category: 'épicerie', isAllergen: true, allergenType: 'gluten' },
          { name: 'Riz', category: 'céréales', isAllergen: false },
          { name: 'Pâtes', category: 'céréales', isAllergen: true, allergenType: 'gluten' },
          { name: 'Pommes de terre', category: 'légumes', isAllergen: false },
          { name: 'Tomates', category: 'légumes', isAllergen: false },
          { name: 'Oignons', category: 'légumes', isAllergen: false },
          { name: 'Ail', category: 'légumes', isAllergen: false },
          { name: 'Carottes', category: 'légumes', isAllergen: false },
          { name: 'Courgettes', category: 'légumes', isAllergen: false },
          { name: 'Aubergines', category: 'légumes', isAllergen: false },
        ];
      }
    }
    
    // Vérification finale que ingredientsData est un tableau valide
    if (!Array.isArray(ingredientsData) || ingredientsData.length === 0) {
      console.log("Aucun ingrédient à créer");
      return NextResponse.json({
        error: "Aucun ingrédient à créer"
      }, { status: 400 });
    }
    
    console.log(`Création de ${ingredientsData.length} ingrédients pour le restaurant ${restaurantId}`);
    
    // Créer les ingrédients dans la base de données
    const createdIngredients = [];
    
    for (const data of ingredientsData) {
      // Vérifier si l'ingrédient existe déjà dans la base
      let ingredient = await prisma.ingredient.findFirst({
        where: {
          name: data.name
        }
      });
      
      // Si l'ingrédient n'existe pas, le créer
      if (!ingredient) {
        ingredient = await prisma.ingredient.create({
          data: {
            name: data.name,
            category: data.category,
            isAllergen: data.isAllergen || false,
            allergenType: data.allergenType,
            dietaryRestrictions: data.dietaryRestrictions || {}
          }
        });
      }
      
      // Créer l'entrée dans l'inventaire du restaurant
      const inventoryItem = await prisma.ingredientInventory.create({
        data: {
          restaurantId: restaurantId,
          ingredientId: ingredient.id,
          quantity: 1,
          unit: data.unit || 'kg',
          isAvailable: true
        },
        include: {
          ingredient: true
        }
      });
      
      createdIngredients.push({
        id: inventoryItem.id,
        name: inventoryItem.ingredient.name,
        category: inventoryItem.ingredient.category,
        isAvailable: inventoryItem.isAvailable,
        quantity: inventoryItem.quantity,
        unit: inventoryItem.unit,
        allergen: inventoryItem.ingredient.isAllergen,
        dietary: inventoryItem.ingredient.dietaryRestrictions,
        restaurantId: inventoryItem.restaurantId
      });
    }
    
    console.log(`${createdIngredients.length} ingrédients créés pour le restaurant ${restaurantId}`);
    
    return NextResponse.json({
      success: true,
      ingredients: createdIngredients
    });
  } catch (error) {
    console.error('Erreur lors de la création des ingrédients:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création des ingrédients' },
      { status: 500 }
    );
  }
} 