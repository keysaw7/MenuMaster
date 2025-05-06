import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'utilisateur
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }
    
    console.log(`Récupération des menus du jour pour l'utilisateur ID: ${user.id}`);
    
    // Récupérer tous les restaurants accessibles à l'utilisateur
    const userRestaurants = await prisma.usersOnRestaurants.findMany({
      where: {
        userId: user.id
      },
      select: {
        restaurantId: true
      }
    });
    
    const restaurantIds = userRestaurants.map((r: { restaurantId: string }) => r.restaurantId);
    
    if (restaurantIds.length === 0) {
      return NextResponse.json([]);
    }
    
    // Récupérer les menus du jour pour ces restaurants
    const dailyMenus = await prisma.dailyMenu.findMany({
      where: {
        restaurantId: {
          in: restaurantIds
        }
      },
      include: {
        restaurant: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Formater les menus pour le frontend
    const formattedMenus = dailyMenus.map((menu: any) => ({
      id: menu.id,
      restaurantId: menu.restaurantId,
      restaurantName: menu.restaurant.name,
      date: menu.date,
      starters: menu.starters,
      mains: menu.mains,
      desserts: menu.desserts,
      price: menu.price,
      isPublished: menu.isPublished,
      weather: menu.weather
    }));
    
    console.log(`${formattedMenus.length} menus trouvés`);
    
    return NextResponse.json(formattedMenus);
  } catch (error) {
    console.error('Erreur lors de la récupération des menus:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des menus' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 