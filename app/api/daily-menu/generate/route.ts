import { NextResponse } from 'next/server';
import { generateDailyMenu } from '@/app/lib/services/ai-menu-generator';
import { WeatherCondition } from '@/app/models/weather';
import { Ingredient } from '@/app/models/ingredient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      weatherCondition, 
      temperature, 
      date, 
      availableIngredients = [], 
      cuisine = [], 
      dietaryRestrictions = [],
      city = 'Paris'
    } = body;

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
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Appel au service de génération de menu
    const generatedMenu = await generateDailyMenu({
      weatherCondition: weatherCondition as WeatherCondition,
      temperature,
      date,
      availableIngredients: formattedIngredients,
      cuisine,
      dietaryRestrictions,
      city
    });

    return NextResponse.json(generatedMenu);
  } catch (error) {
    console.error('Erreur lors de la génération du menu:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération du menu.' },
      { status: 500 }
    );
  }
} 