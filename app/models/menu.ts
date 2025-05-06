import { Ingredient } from './ingredient';

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  type: MenuType;
  isActive: boolean;
  availability: {
    daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
    timeStart?: string;   // HH:MM format
    timeEnd?: string;     // HH:MM format
    seasonStart?: string; // MM-DD format
    seasonEnd?: string;   // MM-DD format
  };
  categories: MenuCategory[];
  themeId?: string;       // Référence à un thème
  template?: string;      // Identifiant du template ou référence
  createdAt: Date;
  updatedAt: Date;
}

export type MenuType = 'regular' | 'daily' | 'seasonal' | 'lunch' | 'dinner' | 'brunch' | 'drinks' | 'custom';

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  ingredients: Ingredient[];
  allergens: string[];
  dietaryRestrictions: string[];
  calories?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  order: number;
  recommendedPairings?: string[];
  options?: MenuItemOption[];
  aiGenerated?: boolean;
}

export interface MenuItemOption {
  id: string;
  name: string;
  choices: {
    id: string;
    name: string;
    priceAdjustment: number;
  }[];
  required: boolean;
  multipleSelection: boolean;
}

export interface DailyMenu {
  id: string;
  restaurantId: string;
  date: string;
  weather?: {
    condition: string;
    temperature: number;
    icon: string;
  };
  starters: MenuItem[];
  mains: MenuItem[];
  desserts: MenuItem[];
  price?: number;
  isPublished: boolean;
  themeId?: string;       // Référence à un thème
  template?: string;      // Identifiant du template ou référence
  createdAt: Date;
  updatedAt: Date;
} 