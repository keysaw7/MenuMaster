export interface WeatherData {
  location: {
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  current: {
    temperature: number;
    condition: WeatherCondition;
    icon: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    feelsLike: number;
  };
  forecast?: {
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    condition: WeatherCondition;
    icon: string;
    precipitation: number;
  }[];
  lastUpdated: Date;
}

export type WeatherCondition = 
  | 'clear' 
  | 'partlyCloudy' 
  | 'cloudy' 
  | 'rainy' 
  | 'stormy' 
  | 'snowy' 
  | 'foggy' 
  | 'windy' 
  | 'hot' 
  | 'cold';

// Mapping entre conditions météo et suggestions culinaires
export const weatherFoodSuggestions: Record<WeatherCondition, {
  suitable: string[];
  avoid: string[];
  ingredients: string[];
  descriptions: string[];
}> = {
  clear: {
    suitable: ['grillades', 'salades', 'fruits frais', 'plats légers'],
    avoid: ['soupes chaudes', 'ragoûts', 'plats mijotés'],
    ingredients: ['légumes frais', 'fruits de saison', 'herbes fraîches'],
    descriptions: ['frais', 'léger', 'coloré', 'vitaminé']
  },
  partlyCloudy: {
    suitable: ['grillades', 'salades composées', 'plats méditerranéens'],
    avoid: ['plats très lourds'],
    ingredients: ['légumes colorés', 'herbes aromatiques', 'fromages légers'],
    descriptions: ['équilibré', 'savoureux', 'harmonieux']
  },
  cloudy: {
    suitable: ['plats complets', 'tartes salées', 'quiches', 'gratins légers'],
    avoid: ['plats très épicés'],
    ingredients: ['légumes racines', 'fromages', 'herbes'],
    descriptions: ['réconfortant', 'gourmand', 'équilibré']
  },
  rainy: {
    suitable: ['soupes', 'plats mijotés légers', 'risottos'],
    avoid: ['salades froides', 'plats très légers'],
    ingredients: ['légumes de saison', 'céréales', 'aromates'],
    descriptions: ['chaleureux', 'réconfortant', 'parfumé']
  },
  stormy: {
    suitable: ['ragoûts', 'cassoulets légers', 'potées', 'cocottes'],
    avoid: ['plats froids', 'crudités'],
    ingredients: ['viandes mijotées', 'légumes racines', 'épices douces'],
    descriptions: ['généreux', 'enveloppant', 'chaleureux']
  },
  snowy: {
    suitable: ['fondues', 'raclettes', 'gratins', 'plats mijotés riches'],
    avoid: ['plats froids', 'salades simples'],
    ingredients: ['fromages riches', 'pommes de terre', 'viandes confites'],
    descriptions: ['réconfortant', 'chaleureux', 'généreux', 'cocooning']
  },
  foggy: {
    suitable: ['soupes veloutées', 'plats parfumés', 'currys doux'],
    avoid: ['plats trop fades'],
    ingredients: ['champignons', 'épices douces', 'herbes aromatiques'],
    descriptions: ['parfumé', 'enveloppant', 'subtil']
  },
  windy: {
    suitable: ['tartes salées', 'plats au four', 'quiches'],
    avoid: ['plats difficiles à manger en extérieur'],
    ingredients: ['légumes de saison', 'fromages de caractère'],
    descriptions: ['robuste', 'consistant', 'satisfaisant']
  },
  hot: {
    suitable: ['gazpachos', 'salades fraîches', 'ceviches', 'plats froids'],
    avoid: ['plats mijotés', 'plats très riches'],
    ingredients: ['concombre', 'agrumes', 'herbes fraîches', 'fruits d\'eau'],
    descriptions: ['rafraîchissant', 'léger', 'désaltérant', 'vif']
  },
  cold: {
    suitable: ['soupes consistantes', 'plats en sauce', 'ragoûts'],
    avoid: ['plats froids', 'desserts glacés'],
    ingredients: ['racines', 'viandes braisées', 'épices chaudes'],
    descriptions: ['réchauffant', 'généreux', 'riche', 'consistant']
  }
}; 