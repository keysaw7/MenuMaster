import OpenAI from 'openai';
import { WeatherCondition, weatherFoodSuggestions } from '@/app/models/weather';
import { Ingredient } from '@/app/models/ingredient';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type MenuGenerationOptions = {
  weatherCondition: WeatherCondition;
  temperature?: number;
  date?: string;
  availableIngredients?: Ingredient[];
  cuisine?: string[];
  dietaryRestrictions?: string[];
  city?: string;
};

/**
 * Générateur de menus basés sur les conditions météorologiques et d'autres facteurs
 */
export async function generateDailyMenu(options: MenuGenerationOptions) {
  const { 
    weatherCondition, 
    temperature,
    date,
    availableIngredients = [], 
    cuisine = [], 
    dietaryRestrictions = [],
    city = 'Paris'
  } = options;
  
  try {
    // Extraire les noms des ingrédients disponibles pour le prompt
    const ingredientNames = availableIngredients.map(ing => ing.name);

    // Construire le prompt pour l'IA
    const prompt = buildAIPrompt({
      weatherCondition,
      temperature,
      date,
      availableIngredients: ingredientNames,
      cuisine,
      dietaryRestrictions,
      city
    });

    // Appeler l'API OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es un chef cuisinier expert qui crée des menus du jour adaptés aux conditions météo, ingrédients disponibles et préférences culinaires. Tu réponds toujours en JSON valide sans aucun texte supplémentaire."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // Récupérer et parser la réponse
    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error("L'API n'a pas renvoyé de contenu valide");
    }
    
    const generatedMenu = JSON.parse(responseContent);
    
    // S'assurer que le menu est bien structuré
    if (!generatedMenu.starters || !generatedMenu.mains || !generatedMenu.desserts) {
      throw new Error("Le format du menu généré est invalide");
    }
    
    console.log("Menu généré avec succès:", generatedMenu);
    
    return {
      starters: generatedMenu.starters,
      mains: generatedMenu.mains,
      desserts: generatedMenu.desserts,
      price: generatedMenu.price || Math.round(28 + (Math.random() * 8 - 4)), // Prix par défaut si non fourni
      weatherCondition,
    };
  } catch (error) {
    console.error("Erreur lors de la génération du menu:", error);
    
    // En cas d'erreur, utiliser le fallback avec les suggestions prédéfinies
    console.log("Utilisation du système de fallback pour la génération du menu");
    
    // Récupérer les suggestions pour les conditions météo
    const suggestions = weatherFoodSuggestions[weatherCondition];
    
    if (!suggestions) {
      throw new Error(`Pas de suggestions disponibles pour la condition météo: ${weatherCondition}`);
    }
    
    // Générer les plats du menu avec l'ancienne méthode
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
}

/**
 * Construit le prompt à envoyer à l'API OpenAI
 */
function buildAIPrompt(options: {
  weatherCondition: WeatherCondition;
  temperature?: number;
  date?: string;
  availableIngredients?: string[];
  cuisine?: string[];
  dietaryRestrictions?: string[];
  city?: string;
}) {
  const {
    weatherCondition,
    temperature,
    date,
    availableIngredients,
    cuisine,
    dietaryRestrictions,
    city
  } = options;

  // Construire une description lisible de la météo
  let weatherDescription = `Le temps est ${weatherCondition.toLowerCase()}`;
  if (temperature !== undefined) {
    weatherDescription += ` avec une température de ${temperature}°C`;
  }
  
  // Formater les informations sur les cuisines préférées
  const cuisineInfo = cuisine && cuisine.length > 0 
    ? `Le restaurant se spécialise dans la cuisine ${cuisine.join(', ')}.` 
    : `Le restaurant propose une cuisine française traditionnelle.`;
  
  // Formater les restrictions alimentaires
  const restrictionsInfo = dietaryRestrictions && dietaryRestrictions.length > 0
    ? `Le menu doit respecter les restrictions alimentaires suivantes : ${dietaryRestrictions.join(', ')}.`
    : "";
  
  // Formater les ingrédients disponibles
  const ingredientsInfo = availableIngredients && availableIngredients.length > 0
    ? `Les ingrédients disponibles sont : ${availableIngredients.join(', ')}.`
    : "Tous les ingrédients de saison sont disponibles.";
  
  // Construire le prompt complet
  return `
Génère un menu du jour pour un restaurant à ${city}${date ? ` le ${date}` : ' aujourd\'hui'}.
${weatherDescription}.
${cuisineInfo}
${restrictionsInfo}
${ingredientsInfo}

Le menu doit être composé de:
- 2 entrées (starters)
- 2 plats principaux (mains)
- 1 dessert (desserts)

Chaque plat doit avoir:
- Un nom (name)
- Une description détaillée et appétissante (description)
- Une liste d'ingrédients principaux (ingredients)

Suggère également un prix pour le menu complet (price).

Fournis la réponse sous forme de JSON avec le format suivant:
{
  "starters": [
    {
      "name": "Nom de l'entrée 1",
      "description": "Description détaillée",
      "ingredients": ["ingrédient 1", "ingrédient 2", "..."]
    },
    {
      "name": "Nom de l'entrée 2",
      "description": "Description détaillée",
      "ingredients": ["ingrédient 1", "ingrédient 2", "..."]
    }
  ],
  "mains": [
    {
      "name": "Nom du plat 1",
      "description": "Description détaillée",
      "ingredients": ["ingrédient 1", "ingrédient 2", "..."]
    },
    {
      "name": "Nom du plat 2",
      "description": "Description détaillée",
      "ingredients": ["ingrédient 1", "ingrédient 2", "..."]
    }
  ],
  "desserts": [
    {
      "name": "Nom du dessert",
      "description": "Description détaillée",
      "ingredients": ["ingrédient 1", "ingrédient 2", "..."]
    }
  ],
  "price": 32
}
`;
}

/**
 * Génère des plats à partir des suggestions pour une catégorie spécifique.
 */
function generateDishes(
  category: 'starter' | 'main' | 'dessert',
  count: number,
  suggestions: {
    suitable: string[];
    avoid: string[];
    ingredients: string[];
    descriptions: string[];
    [key: string]: string[];
  },
  cuisinePreferences: string[],
  availableIngredients: Ingredient[],
  dietaryRestrictions: string[]
) {
  const availableIngredientNames = availableIngredients.map(ing => ing.name);
  
  return Array(count).fill(null).map(() => {
    const ingredients = getRandomItems(suggestions.ingredients || [], 3);
    
    return {
      name: `${getRandomItem(suggestions.suitable || ["Délicieux plat"])}`,
      description: `Un plat ${getRandomItem(suggestions.descriptions || ["savoureux"])} préparé avec soin, idéal pour cette météo.`,
      ingredients: ingredients
    };
  });
}

// Fonctions utilitaires pour le fallback
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 