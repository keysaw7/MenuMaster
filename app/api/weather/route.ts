import { NextResponse } from 'next/server';

// Utilisez votre propre clé API OpenWeatherMap (à mettre dans .env.local)
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'votre_cle_api';

// Vérification de base pour la clé API
const isAPIKeySet = OPENWEATHER_API_KEY !== 'votre_cle_api' && OPENWEATHER_API_KEY.length > 10;

// Ville par défaut pour la météo (Paris, France)
const DEFAULT_CITY = 'Paris,fr';

type WeatherResponse = {
  temperature: number;
  condition: string;
  icon: string;
  error?: string;
};

// Mode de fallback pour éviter d'utiliser l'API externe en cas de problème
const FALLBACK_MODE = true;

// Fonction pour convertir les codes météo en icônes
function getWeatherIcon(weatherCode: string): string {
  try {
    const code = weatherCode.substring(0, 2);
    
    switch (code) {
      case '01': return '☀️'; // Ciel dégagé
      case '02': return '🌤️'; // Quelques nuages
      case '03': return '☁️'; // Nuages épars
      case '04': return '☁️'; // Nuageux
      case '09': return '🌧️'; // Averses
      case '10': return '🌦️'; // Pluie
      case '11': return '⛈️'; // Orages
      case '13': return '❄️'; // Neige
      case '50': return '🌫️'; // Brouillard
      default: return '🌡️';
    }
  } catch (error) {
    console.error('Erreur lors de la conversion du code météo:', error);
    return '🌡️';
  }
}

// Fonction pour convertir les conditions météo en français
function translateWeatherCondition(condition: string): string {
  try {
    if (!condition) return 'Inconnu';
    
    const conditions: {[key: string]: string} = {
      'clear sky': 'Ciel dégagé',
      'few clouds': 'Quelques nuages',
      'scattered clouds': 'Nuages épars',
      'broken clouds': 'Nuageux',
      'overcast clouds': 'Couvert',
      'light rain': 'Pluie légère',
      'moderate rain': 'Pluie modérée',
      'heavy intensity rain': 'Forte pluie',
      'thunderstorm': 'Orage',
      'snow': 'Neige',
      'mist': 'Brume',
      'fog': 'Brouillard'
    };
    
    return conditions[condition.toLowerCase()] || condition;
  } catch (error) {
    console.error('Erreur lors de la traduction de la condition météo:', error);
    return 'Inconnu';
  }
}

// Fonction pour obtenir une température réaliste selon la saison
function getRealisticTemperature(month: number = new Date().getMonth()): number {
  try {
    if (month >= 5 && month <= 8) { // Été (juin-septembre)
      return Math.floor(Math.random() * 10) + 15; // 15-25°C
    } else if (month >= 11 || month <= 2) { // Hiver (décembre-mars)
      return Math.floor(Math.random() * 10) + 0; // 0-10°C
    } else { // Printemps/Automne
      return Math.floor(Math.random() * 10) + 10; // 10-20°C
    }
  } catch (error) {
    console.error('Erreur lors du calcul de la température:', error);
    return 15; // Valeur par défaut
  }
}

// Fonction pour générer des données météo simulées
function getFallbackWeatherData(date: string, errorMessage?: string): WeatherResponse {
  try {
    const requestDate = new Date(date);
    const month = requestDate.getMonth();
    const temperature = getRealisticTemperature(month);
    
    // Déterminer la condition en fonction de la température et d'un facteur aléatoire
    let condition = 'Ciel dégagé';
    let icon = '☀️';
    
    const random = Math.random();
    if (temperature < 5) {
      if (random < 0.3) {
        condition = 'Neige';
        icon = '❄️';
      } else {
        condition = 'Nuageux';
        icon = '☁️';
      }
    } else if (temperature < 15) {
      if (random < 0.4) {
        condition = 'Pluie légère';
        icon = '🌦️';
      } else {
        condition = 'Nuages épars';
        icon = '🌤️';
      }
    } else {
      if (random < 0.2) {
        condition = 'Quelques nuages';
        icon = '🌤️';
      }
    }
    
    return {
      temperature,
      condition,
      icon,
      error: errorMessage
    };
  } catch (error) {
    console.error('Erreur lors de la génération des données météo de secours:', error);
    return {
      temperature: 15,
      condition: 'Données simulées',
      icon: '🌡️',
      error: 'Erreur système'
    };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Paramètres de la requête
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const city = searchParams.get('city') || DEFAULT_CITY;
    
    console.log(`Demande météo pour: Ville=${city}, Date=${date}`);
    console.log(`Clé API utilisée: ${OPENWEATHER_API_KEY.substring(0, 3)}...${OPENWEATHER_API_KEY.length > 6 ? OPENWEATHER_API_KEY.substring(OPENWEATHER_API_KEY.length - 3) : ''}`);
    console.log(`Clé API valide: ${isAPIKeySet ? 'Oui' : 'Non'}`);
    
    // Si le mode de fallback est activé ou si la clé API n'est pas définie, renvoyer des données simulées
    if (FALLBACK_MODE || !isAPIKeySet) {
      console.log('Mode de fallback activé ou clé API non définie, utilisation de données simulées');
      const errorMsg = !isAPIKeySet ? 'Clé API OpenWeatherMap non configurée' : 'Mode de fallback activé';
      return NextResponse.json(getFallbackWeatherData(date, errorMsg));
    }
    
    // Vérifier si la date est dans le futur (max 5 jours pour la version gratuite)
    const today = new Date();
    const requestDate = new Date(date);
    const diffTime = requestDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let apiUrl;
    
    // Si la date est aujourd'hui ou dans le passé, utiliser l'API météo actuelle
    // Sinon, utiliser l'API de prévision
    if (diffDays <= 0) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`;
      console.log(`Utilisation de l'API météo actuelle: ${apiUrl.replace(OPENWEATHER_API_KEY, 'API_KEY')}`);
    } else if (diffDays <= 5) {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`;
      console.log(`Utilisation de l'API prévisions: ${apiUrl.replace(OPENWEATHER_API_KEY, 'API_KEY')}`);
    } else {
      // Pour les dates au-delà de 5 jours, nous ne pouvons pas obtenir de données précises avec l'API gratuite
      console.log(`Date trop éloignée: ${diffDays} jours dans le futur`);
      return NextResponse.json(getFallbackWeatherData(date, 'Les prévisions ne sont disponibles que pour les 5 prochains jours'));
    }
    
    try {
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const statusText = `${response.status} ${response.statusText}`;
        console.error(`Erreur API météo: ${statusText}`);
        
        // Tenter de lire le corps de la réponse d'erreur
        try {
          const errorData = await response.json();
          console.error('Détails de l\'erreur:', errorData);
        } catch (e) {
          console.error('Impossible de lire les détails de l\'erreur');
        }
        
        throw new Error(`Erreur API météo: ${statusText}`);
      }
      
      const data = await response.json();
      console.log('Données brutes reçues de l\'API:', JSON.stringify(data, null, 2));
      
      // Traiter les données en fonction du type de réponse (actuelle ou prévision)
      if (diffDays <= 0) {
        // Données météo actuelles
        if (!data.main || typeof data.main.temp !== 'number') {
          console.error('Données météo invalides:', data);
          throw new Error('Données météo invalides ou incomplètes');
        }
        
        // Vérifier que la température est réaliste (entre -50°C et +50°C)
        let temp = Math.round(data.main.temp);
        if (temp < -50 || temp > 50) {
          console.warn(`Température anormale reçue: ${temp}°C, ajustement à une valeur réaliste`);
          temp = getRealisticTemperature();
        }
        
        const weatherData: WeatherResponse = {
          temperature: temp,
          condition: data.weather && data.weather[0] ? translateWeatherCondition(data.weather[0].description) : 'Inconnu',
          icon: data.weather && data.weather[0] ? getWeatherIcon(data.weather[0].icon) : '🌡️'
        };
        
        console.log('Données météo actuelles traitées:', weatherData);
        return NextResponse.json(weatherData);
      } else {
        // Données de prévision - trouver l'entrée pour la date spécifiée
        // Les prévisions sont données toutes les 3 heures, on prend celle de midi
        if (!data.list || !Array.isArray(data.list) || data.list.length === 0) {
          console.error('Données de prévision invalides:', data);
          throw new Error('Données de prévision invalides ou incomplètes');
        }
        
        const dateStr = date + ' 12:00:00';
        const forecast = data.list.find((item: any) => item.dt_txt && item.dt_txt.includes(dateStr));
        
        // Fonction pour traiter les données météo des prévisions
        const processWeatherData = (forecastData: any): WeatherResponse => {
          if (!forecastData.main || typeof forecastData.main.temp !== 'number') {
            throw new Error('Données de prévision incomplètes');
          }
          
          // Vérifier que la température est réaliste
          let temp = Math.round(forecastData.main.temp);
          if (temp < -50 || temp > 50) {
            console.warn(`Température anormale reçue: ${temp}°C, ajustement à une valeur réaliste`);
            temp = getRealisticTemperature(new Date(date).getMonth());
          }
          
          return {
            temperature: temp,
            condition: forecastData.weather && forecastData.weather[0] 
              ? translateWeatherCondition(forecastData.weather[0].description) 
              : 'Inconnu',
            icon: forecastData.weather && forecastData.weather[0] 
              ? getWeatherIcon(forecastData.weather[0].icon) 
              : '🌡️'
          };
        };
        
        try {
          if (forecast) {
            const weatherData = processWeatherData(forecast);
            console.log('Données prévision midi traitées:', weatherData);
            return NextResponse.json(weatherData);
          } else {
            // Si on ne trouve pas exactement midi, on prend la première prévision du jour
            const dayForecast = data.list.find((item: any) => item.dt_txt && item.dt_txt.includes(date));
            
            if (dayForecast) {
              const weatherData = processWeatherData(dayForecast);
              console.log('Données première prévision du jour traitées:', weatherData);
              return NextResponse.json(weatherData);
            }
          }
        } catch (error) {
          console.error('Erreur lors du traitement des prévisions:', error);
          throw error;
        }
      }
      
      // Si on arrive ici, c'est qu'on n'a pas trouvé de données pour la date spécifiée
      throw new Error('Aucune donnée disponible pour cette date');
      
    } catch (fetchError) {
      console.error('Erreur lors de la récupération des données météo:', fetchError);
      // En cas d'erreur avec l'API externe, on renvoie des données simulées
      return NextResponse.json(
        getFallbackWeatherData(date, fetchError instanceof Error ? fetchError.message : 'Erreur de connexion à l\'API')
      );
    }
    
  } catch (error) {
    console.error('Erreur météo générale:', error);
    
    // En cas d'erreur, on renvoie toujours des données simulées avec un message d'erreur
    return NextResponse.json(
      getFallbackWeatherData(
        new Date().toISOString().split('T')[0], 
        error instanceof Error ? error.message : 'Une erreur est survenue'
      )
    );
  }
} 