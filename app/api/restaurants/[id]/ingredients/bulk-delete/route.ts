import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// Endpoint pour supprimer tous les ingrédients d'un restaurant
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Récupérer l'ID du restaurant
    const restaurantId = await params.id;
    
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
    
    console.log(`Suppression de tous les ingrédients pour le restaurant ID: ${restaurantId}`);
    
    // Compter les ingrédients avant suppression
    const count = await prisma.ingredientInventory.count({
      where: { restaurantId }
    });
    
    // Supprimer tous les ingrédients liés à ce restaurant
    await prisma.ingredientInventory.deleteMany({
      where: { restaurantId }
    });
    
    console.log(`${count} ingrédients supprimés pour le restaurant ${restaurantId}`);
    
    return NextResponse.json({
      success: true,
      message: `Tous les ingrédients du restaurant ont été supprimés`,
      count
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des ingrédients:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression des ingrédients' },
      { status: 500 }
    );
  }
} 