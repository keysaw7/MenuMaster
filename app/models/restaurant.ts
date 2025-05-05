export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
    }[];
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logo: string;
    coverImage: string;
    currency: string;
  };
  features: {
    hasAlcohol: boolean;
    acceptsReservations: boolean;
    hasTakeout: boolean;
    hasDelivery: boolean;
    isDailyMenuEnabled: boolean;
    isAiRecommendationEnabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantPreview {
  id: string;
  name: string;
  cuisine: string[];
  coverImage: string;
  city: string;
} 