import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'utilisateur depuis le token
    const tokenData = await getUserFromToken(request);

    // Si aucun utilisateur n'est connecté
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les informations utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: tokenData.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les restaurants de l'utilisateur
    const userRestaurants = await prisma.usersOnRestaurants.findMany({
      where: { userId: user.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            description: true,
            cuisine: true,
          }
        }
      }
    });

    // Définir un type pour l'élément du tableau userRestaurants
    type UserRestaurant = {
      restaurant: {
        id: string;
        name: string;
        description: string;
        cuisine: string[] | string | any;
      };
      role: string;
    };

    // Retourner la réponse
    return NextResponse.json({
      user,
      restaurants: userRestaurants.map((ur: UserRestaurant) => ({
        ...ur.restaurant,
        role: ur.role
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 