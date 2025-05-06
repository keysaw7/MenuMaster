import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { menu } from '@/app/data/menu';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { preferences, allergens, restrictions } = await request.json();

    // Filtrer les plats en fonction des allergènes et restrictions
    let filteredMenu = [...menu];

    // Filtrage par allergènes
    if (allergens && allergens.length > 0) {
      filteredMenu = filteredMenu.filter(dish => 
        !allergens.some((allergen: string) => dish.allergens.includes(allergen))
      );
    }

    // Filtrage par restrictions alimentaires
    if (restrictions && restrictions.length > 0) {
      filteredMenu = filteredMenu.filter(dish => {
        if (restrictions.includes('végétarien')) {
          return dish.dietaryRestrictions.includes('végétarien');
        }
        if (restrictions.includes('sans porc')) {
          return !dish.ingredients.some(ingredient => 
            ['porc', 'jambon', 'saucisson', 'charcuterie'].includes(ingredient.toLowerCase())
          );
        }
        return true;
      });
    }

    // Si aucun plat ne correspond aux critères
    if (filteredMenu.length === 0) {
      return NextResponse.json({ 
        recommendation: "Désolé, aucun plat ne correspond à vos critères. Veuillez ajuster vos préférences.",
        dishes: []
      });
    }

    // Préparer le contexte pour l'IA
    const menuContext = filteredMenu.map(dish => ({
      name: dish.name,
      category: dish.category,
      description: dish.description,
      ingredients: dish.ingredients,
      allergens: dish.allergens,
      dietaryRestrictions: dish.dietaryRestrictions,
      price: dish.price
    }));

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Tu es un sommelier et chef cuisinier expert de la cuisine corse. Tu dois aider les clients à comprendre les plats et répondre à leurs questions sur la cuisine corse.
          
          Voici notre carte actuelle : ${JSON.stringify(menuContext)}
          
          Si le client pose une question sur un plat ou un ingrédient :
          1. Explique-lui en détail ce que c'est
          2. Indique si ce plat/ingrédient est présent dans notre carte
          3. Si oui, mentionne son nom exact pour que nous puissions l'identifier
          
          Si le client demande des recommandations :
          1. Suggère des plats de notre carte qui pourraient lui plaire
          2. Explique pourquoi ces plats pourraient lui convenir
          3. Mentionne les noms exacts des plats recommandés
          
          Réponds de manière professionnelle et chaleureuse, comme un vrai chef corse.`
        },
        {
          role: "user",
          content: preferences
        }
      ],
      model: "gpt-4.1-nano",
    });

    const recommendation = completion.choices[0].message.content || "";

    // Trouver les plats mentionnés dans la réponse
    const mentionedDishes = filteredMenu.filter(dish => 
      recommendation.toLowerCase().includes(dish.name.toLowerCase())
    );

    return NextResponse.json({ 
      recommendation,
      dishes: mentionedDishes
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la génération des recommandations." },
      { status: 500 }
    );
  }
} 