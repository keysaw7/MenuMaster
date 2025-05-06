import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Récupérer l'ID du menu
    const menuId = context.params.id;
    
    if (!menuId) {
      return NextResponse.json(
        { error: 'ID de menu manquant' },
        { status: 400 }
      );
    }
    
    // Récupérer l'utilisateur
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }
    
    console.log(`Publication du menu ID: ${menuId}`);
    
    // Récupérer le menu pour vérifier les permissions
    const menu = await prisma.dailyMenu.findUnique({
      where: {
        id: menuId
      },
      select: {
        restaurantId: true,
        isPublished: true
      }
    });
    
    if (!menu) {
      return NextResponse.json(
        { error: 'Menu non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier que l'utilisateur a accès à ce restaurant
    const hasAccess = await prisma.usersOnRestaurants.findFirst({
      where: {
        userId: user.id,
        restaurantId: menu.restaurantId
      }
    });
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Accès refusé à ce menu' },
        { status: 403 }
      );
    }
    
    // Si le menu est déjà publié, ne rien faire
    if (menu.isPublished) {
      return NextResponse.json({
        success: true,
        message: 'Menu déjà publié'
      });
    }
    
    // Mettre à jour le menu pour le publier
    const updatedMenu = await prisma.dailyMenu.update({
      where: {
        id: menuId
      },
      data: {
        isPublished: true
      }
    });
    
    console.log(`Menu ${menuId} publié avec succès`);
    
    return NextResponse.json({
      success: true,
      menu: {
        id: updatedMenu.id,
        isPublished: updatedMenu.isPublished
      }
    });
  } catch (error) {
    console.error('Erreur lors de la publication du menu:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la publication du menu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 