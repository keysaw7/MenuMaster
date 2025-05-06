import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'utilisateur
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }
    
    // Récupérer les données du menu
    const menuData = await request.json();
    const {
      restaurantId,
      date,
      starters,
      mains,
      desserts,
      price,
      weather,
      isPublished = false
    } = menuData;
    
    // Vérification des données
    if (!restaurantId || !date || !starters || !mains || !desserts) {
      return NextResponse.json(
        { error: 'Données de menu incomplètes' },
        { status: 400 }
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
    
    console.log('Sauvegarde du menu pour le restaurant:', restaurantId);
    
    // Créer le menu dans la base de données
    const savedMenu = await prisma.dailyMenu.create({
      data: {
        restaurantId,
        date,
        starters: starters,
        mains: mains,
        desserts: desserts,
        price: price || null,
        weather: weather || null,
        isPublished
      }
    });
    
    console.log('Menu sauvegardé avec succès:', savedMenu.id);
    
    return NextResponse.json({
      success: true,
      menu: {
        id: savedMenu.id,
        restaurantId: savedMenu.restaurantId,
        date: savedMenu.date
      }
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du menu:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la sauvegarde du menu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 