import { WeatherCondition, weatherFoodSuggestions } from '@/app/models/weather';
import { MenuItem } from '@/app/models/menu';
import { Ingredient } from '@/app/models/ingredient';

interface MenuGenerationOptions {
  weatherCondition: WeatherCondition;
  availableIngredients?: Ingredient[];
  cuisine?: string[];
  dietaryRestrictions?: string[];
  budget?: 'low' | 'medium' | 'high';
  seasonality?: 'winter' | 'spring' | 'summer' | 'fall';
}

// Interface pour les plats générés par l'IA
interface GeneratedMenuItem extends MenuItem {
  category: 'starter' | 'main' | 'dessert';
}

/**
 * Générateur de menus basés sur les conditions météorologiques et d'autres facteurs
 */
export async function generateDailyMenu(options: MenuGenerationOptions) {
  const { weatherCondition, availableIngredients = [], cuisine = [], dietaryRestrictions = [] } = options;
  
  // TODO: Dans une version future, cette fonction pourrait appeler une API d'IA
  // comme OpenAI ou un autre service pour générer des menus plus pertinents et variés.
  // Pour l'instant, nous utilisons une logique simple basée sur des suggestions prédéfinies.
  
  // Simuler un délai d'appel à une API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Récupérer les suggestions pour les conditions météo
  const suggestions = weatherFoodSuggestions[weatherCondition];
  
  if (!suggestions) {
    throw new Error(`Pas de suggestions disponibles pour la condition météo: ${weatherCondition}`);
  }
  
  // Générer les plats du menu
  const starters = generateDishes('starter', 2, suggestions, cuisine, availableIngredients, dietaryRestrictions);
  const mains = generateDishes('main', 2, suggestions, cuisine, availableIngredients, dietaryRestrictions);
  const desserts = generateDishes('dessert', 1, suggestions, cuisine, availableIngredients, dietaryRestrictions);
  
  // Calculer un prix total pour le menu
  const basePrice = 28; // Prix de base
  
  // Prix réel entre 26 et 34 selon la complexité des plats
  const totalPrice = Math.round(basePrice + (Math.random() * 8 - 4));
  
  return {
    starters,
    mains,
    desserts,
    price: totalPrice,
    weatherCondition,
  };
}

/**
 * Génère un ensemble de plats selon les critères
 */
function generateDishes(
  category: 'starter' | 'main' | 'dessert',
  count: number,
  suggestions: any,
  cuisine: string[],
  availableIngredients: Ingredient[],
  dietaryRestrictions: string[]
): GeneratedMenuItem[] {
  const result: GeneratedMenuItem[] = [];
  
  // Base de plats pour chaque catégorie
  const starterOptions = [
    {
      name: 'Velouté de potimarron',
      description: 'Un velouté onctueux parfait pour les jours de pluie, avec des notes de cannelle et muscade.',
      ingredients: ['Potimarron', 'Oignon', 'Crème', 'Cannelle', 'Muscade'],
      allergens: ['lait'],
      price: 9,
      isWarm: true,
      isCold: false,
    },
    {
      name: 'Tarte fine aux champignons',
      description: 'Tarte croustillante garnie de champignons de saison et d\'herbes fraîches.',
      ingredients: ['Pâte feuilletée', 'Champignons', 'Échalotes', 'Thym', 'Crème fraîche'],
      allergens: ['gluten', 'lait'],
      price: 11,
      isWarm: true,
      isCold: false,
    },
    {
      name: 'Carpaccio de betteraves',
      description: 'Fines tranches de betteraves marinées au vinaigre balsamique et huile d\'olive.',
      ingredients: ['Betterave', 'Vinaigre balsamique', 'Huile d\'olive', 'Ciboulette', 'Échalote'],
      allergens: [],
      price: 8,
      isWarm: false,
      isCold: true,
    },
    {
      name: 'Gaspacho de tomates',
      description: 'Soupe froide rafraîchissante à base de tomates, concombre et poivron.',
      ingredients: ['Tomate', 'Concombre', 'Poivron', 'Ail', 'Huile d\'olive'],
      allergens: [],
      price: 7,
      isWarm: false,
      isCold: true,
    },
    {
      name: 'Salade de chèvre chaud',
      description: 'Salade verte avec toasts de chèvre chaud au miel et noix.',
      ingredients: ['Salade', 'Fromage de chèvre', 'Miel', 'Noix', 'Toasts'],
      allergens: ['gluten', 'lait', 'fruits à coque'],
      price: 10,
      isWarm: true,
      isCold: true,
    },
  ];
  
  const mainOptions = [
    {
      name: 'Risotto aux champignons',
      description: 'Risotto crémeux aux champignons, parfait pour une journée pluvieuse d\'automne.',
      ingredients: ['Riz arborio', 'Champignons', 'Parmesan', 'Oignon', 'Vin blanc'],
      allergens: ['lait'],
      price: 18,
      isWarm: true,
      isCold: false,
    },
    {
      name: 'Pot-au-feu traditionnel',
      description: 'Un plat mijoté réconfortant avec des légumes de saison, idéal par temps frais et pluvieux.',
      ingredients: ['Bœuf', 'Carottes', 'Poireaux', 'Navets', 'Pommes de terre'],
      allergens: [],
      price: 22,
      isWarm: true,
      isCold: false,
    },
    {
      name: 'Filet de dorade grillé',
      description: 'Filet de dorade grillé accompagné de légumes de saison et sauce vierge.',
      ingredients: ['Dorade', 'Tomates', 'Courgettes', 'Huile d\'olive', 'Citron'],
      allergens: ['poisson'],
      price: 24,
      isWarm: true,
      isCold: false,
    },
    {
      name: 'Salade niçoise',
      description: 'Salade fraîche avec thon, œufs, olives et légumes croquants.',
      ingredients: ['Thon', 'Œufs', 'Tomates', 'Olives', 'Haricots verts'],
      allergens: ['poisson', 'œuf'],
      price: 16,
      isWarm: false,
      isCold: true,
    },
    {
      name: 'Tajine d\'agneau aux abricots',
      description: 'Tajine d\'agneau parfumé aux épices, avec abricots secs et amandes.',
      ingredients: ['Agneau', 'Abricots secs', 'Amandes', 'Cannelle', 'Miel'],
      allergens: ['fruits à coque'],
      price: 21,
      isWarm: true,
      isCold: false,
    },
  ];
  
  const dessertOptions = [
    {
      name: 'Tarte aux pommes tiède',
      description: 'Tarte aux pommes servie tiède avec une boule de glace à la vanille.',
      ingredients: ['Pommes', 'Pâte brisée', 'Cannelle', 'Vanille', 'Sucre'],
      allergens: ['gluten', 'lait', 'œuf'],
      price: 8,
      isWarm: true,
      isCold: false,
    },
    {
      name: 'Mousse au chocolat',
      description: 'Mousse au chocolat légère et aérienne, parfaite en toute saison.',
      ingredients: ['Chocolat noir', 'Œufs', 'Sucre', 'Crème'],
      allergens: ['œuf', 'lait'],
      price: 7,
      isWarm: false,
      isCold: true,
    },
    {
      name: 'Salade de fruits frais',
      description: 'Salade de fruits frais de saison, rafraîchissante et légère.',
      ingredients: ['Fruits de saison', 'Jus de citron', 'Menthe', 'Sucre'],
      allergens: [],
      price: 6,
      isWarm: false,
      isCold: true,
    },
    {
      name: 'Crème brûlée à la vanille',
      description: 'Crème onctueuse à la vanille avec une fine couche de caramel craquant.',
      ingredients: ['Crème', 'Œufs', 'Vanille', 'Sucre'],
      allergens: ['lait', 'œuf'],
      price: 8,
      isWarm: false,
      isCold: true,
    },
    {
      name: 'Fondant au chocolat',
      description: 'Gâteau au chocolat au cœur coulant, servi chaud avec une boule de glace.',
      ingredients: ['Chocolat', 'Beurre', 'Œufs', 'Farine', 'Sucre'],
      allergens: ['gluten', 'lait', 'œuf'],
      price: 9,
      isWarm: true,
      isCold: false,
    },
  ];
  
  // Sélectionner les plats selon les conditions météo
  const options = category === 'starter' ? starterOptions : 
                 category === 'main' ? mainOptions : dessertOptions;
  
  // Filtrer les plats qui correspondent aux conditions météo
  // Par exemple, privilégier les plats chauds quand il fait froid et vice versa
  const isWeatherCold = ['cold', 'rainy', 'snowy', 'windy', 'foggy'].includes(suggestions.condition);
  const isWeatherHot = ['hot', 'clear'].includes(suggestions.condition);
  
  // Filtrer les options selon la météo
  let filteredOptions = options;
  if (isWeatherCold) {
    filteredOptions = options.filter(o => o.isWarm);
  } else if (isWeatherHot) {
    filteredOptions = options.filter(o => o.isCold);
  }
  
  // Si on n'a pas assez d'options après filtrage, revenir aux options complètes
  if (filteredOptions.length < count) {
    filteredOptions = options;
  }
  
  // Mélanger le tableau pour avoir des résultats différents à chaque fois
  const shuffled = [...filteredOptions].sort(() => 0.5 - Math.random());
  
  // Sélectionner les plats
  for (let i = 0; i < count && i < shuffled.length; i++) {
    const dish = shuffled[i];
    
    result.push({
      id: `${category}-${i + 1}`,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      ingredients: dish.ingredients.map((name: string) => ({
        id: `ing-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        category: 'other',
        isAvailable: true,
        dietaryRestrictions: JSON.stringify([]),
        restaurantId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      allergens: dish.allergens,
      dietaryRestrictions: [],
      category: category,
      isAvailable: true,
      isPopular: false,
      isNew: false,
      order: i,
      aiGenerated: true,
      imageUrl: undefined,
      thumbnailUrl: undefined,
      calories: undefined,
      recommendedPairings: undefined,
      options: undefined
    });
  }
  
  return result;
} 