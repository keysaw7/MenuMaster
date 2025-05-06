import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/lib/auth';
import { Ingredient } from '@/app/models/ingredient';

const prisma = new PrismaClient();

// Interface pour typer l'inventaire d'ingrédients
interface IngredientInventoryWithIngredient {
  id: string;
  restaurantId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  isAvailable: boolean;
  ingredient: {
    id: string;
    name: string;
    category: string;
    isAllergen: boolean;
    dietaryRestrictions: any;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'ID du restaurant
    const restaurantId = params.id;
    
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'ID de restaurant manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier l'authentification de l'utilisateur
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }
    
    console.log(`Récupération des ingrédients pour le restaurant ID: ${restaurantId}`);
    
    // Vérifier que l'utilisateur a accès à ce restaurant
    const hasAccess = await prisma.usersOnRestaurants.findFirst({
      where: {
        userId: user.id,
        restaurantId: restaurantId
      }
    });
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Accès refusé à ce restaurant' },
        { status: 403 }
      );
    }
    
    // Récupérer les ingrédients disponibles pour le restaurant
    const ingredientInventory = await prisma.ingredientInventory.findMany({
      where: {
        restaurantId: restaurantId,
        isAvailable: true
      },
      include: {
        ingredient: true
      }
    });
    
    // Formatter les ingrédients pour le frontend
    const ingredients = ingredientInventory.map((inventory: IngredientInventoryWithIngredient) => ({
      id: inventory.id,
      name: inventory.ingredient.name,
      category: inventory.ingredient.category,
      isAvailable: inventory.isAvailable,
      quantity: inventory.quantity,
      unit: inventory.unit,
      allergen: inventory.ingredient.isAllergen,
      dietary: inventory.ingredient.dietaryRestrictions,
      restaurantId: inventory.restaurantId
    }));
    
    console.log(`${ingredients.length} ingrédients trouvés pour le restaurant ${restaurantId}`);
    
    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('Erreur lors de la récupération des ingrédients:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des ingrédients' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 