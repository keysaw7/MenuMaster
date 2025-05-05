export interface Ingredient {
  id: string;
  name: string;
  category: string;
  isAvailable: boolean;
  quantity?: number;
  unit?: string;
  allergen?: boolean;
  dietary?: { 
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  };
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IngredientCategory = 
  | 'meat'
  | 'poultry'
  | 'seafood'
  | 'vegetable'
  | 'fruit'
  | 'grain'
  | 'dairy'
  | 'herb'
  | 'spice'
  | 'sauce'
  | 'oil'
  | 'nut'
  | 'bean'
  | 'bakery'
  | 'sweetener'
  | 'alcohol'
  | 'beverage'
  | 'other';

export interface InventoryIngredient extends Ingredient {
  quantity: number;
  unit: string;
  purchasePrice?: number;
  supplier?: string;
  expiryDate?: string;
} 