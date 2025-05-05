import { WeatherData, WeatherCondition } from '@/app/models/weather';

/**
 * Service pour récupérer les données météorologiques
 */
export async function getWeatherData(
  city: string,
  country: string,
  date?: string
): Promise<WeatherData> {
  // TODO: Intégrer une véritable API météo (OpenWeatherMap, WeatherAPI, etc.)
  // Pour l'instant, on utilise des données simulées

  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Date à utiliser (aujourd'hui par défaut)
  const targetDate = date ? new Date(date) : new Date();
  const formattedDate = targetDate.toISOString().split('T')[0];
  
  // Générer des données météo pseudo-aléatoires mais cohérentes
  const conditions: WeatherCondition[] = [
    'clear', 'partlyCloudy', 'cloudy', 'rainy', 
    'stormy', 'snowy', 'foggy', 'windy', 'hot', 'cold'
  ];
  
  // Utiliser la ville et la date comme "seed" pour obtenir une météo cohérente
  const seed = city.length + targetDate.getDate() + targetDate.getMonth();
  const condition = conditions[seed % conditions.length];
  
  // Générer une température cohérente avec la condition
  let baseTemp = 15; // température de base
  const month = targetDate.getMonth(); // 0-11
  
  // Ajuster la température en fonction de la saison (hémisphère nord)
  if (month >= 0 && month <= 2) baseTemp = 5; // hiver
  else if (month >= 3 && month <= 5) baseTemp = 15; // printemps
  else if (month >= 6 && month <= 8) baseTemp = 25; // été
  else baseTemp = 15; // automne
  
  // Ajuster la température en fonction de la condition
  let temperature = baseTemp;
  switch (condition) {
    case 'hot': temperature = baseTemp + 10; break;
    case 'cold': temperature = baseTemp - 10; break;
    case 'snowy': temperature = Math.min(baseTemp, 2); break;
    case 'rainy': temperature = baseTemp - 2; break;
    case 'stormy': temperature = baseTemp - 3; break;
    case 'clear': temperature = baseTemp + 3; break;
    default: temperature = baseTemp;
  }
  
  // Simuler une prévision sur 5 jours
  const forecast = [];
  for (let i = 1; i <= 5; i++) {
    const forecastDate = new Date(targetDate);
    forecastDate.setDate(targetDate.getDate() + i);
    
    // Légère variation de la météo chaque jour
    const forecastSeed = seed + i;
    const forecastCondition = conditions[forecastSeed % conditions.length];
    
    // Légère variation de température
    const tempVariation = (Math.random() * 6) - 3;
    const forecastTemp = Math.round(temperature + tempVariation);
    
    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      temperature: {
        min: Math.round(forecastTemp - 3),
        max: Math.round(forecastTemp + 3)
      },
      condition: forecastCondition,
      icon: `/images/weather/${forecastCondition}.svg`,
      precipitation: forecastCondition === 'rainy' || forecastCondition === 'stormy' ? 
        Math.round(Math.random() * 80) + 20 : Math.round(Math.random() * 20)
    });
  }
  
  // Construire et retourner les données météo
  return {
    location: {
      city,
      country,
      coordinates: {
        // Coordonnées fictives
        latitude: 48.856614,
        longitude: 2.3522219
      }
    },
    current: {
      temperature: Math.round(temperature),
      condition,
      icon: `/images/weather/${condition}.svg`,
      humidity: Math.round(Math.random() * 50) + 30,
      windSpeed: Math.round(Math.random() * 30),
      precipitation: condition === 'rainy' || condition === 'stormy' ? 
        Math.round(Math.random() * 80) + 20 : Math.round(Math.random() * 20),
      feelsLike: Math.round(temperature - 2 + Math.random() * 4)
    },
    forecast,
    lastUpdated: new Date()
  };
}

/**
 * Convertit les coordonnées géographiques en nom de ville
 */
export async function getCityFromCoordinates(
  latitude: number,
  longitude: number
): Promise<{ city: string; country: string }> {
  // TODO: Intégrer une véritable API de géocodage inverse
  // Pour l'instant, retourner Paris par défaut
  return {
    city: 'Paris',
    country: 'France'
  };
}

/**
 * Obtient la condition météo adaptée pour l'IA de génération de menu
 */
export function getWeatherConditionForMenu(weatherData: WeatherData): WeatherCondition {
  const { condition, temperature } = weatherData.current;
  
  // Logique pour déterminer la condition météo à utiliser pour le menu
  // On pourrait avoir une logique plus complexe ici, par exemple en combinant 
  // la condition et la température
  
  if (temperature > 30) return 'hot';
  if (temperature < 5) return 'cold';
  
  return condition;
} 