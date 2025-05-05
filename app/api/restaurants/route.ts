import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/lib/auth';

const prisma = new PrismaClient();

// GET - Récupérer tous les restaurants de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer les restaurants associés à l'utilisateur
    const userRestaurants = await prisma.usersOnRestaurants.findMany({
      where: { userId: user.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            description: true,
            cuisine: true,
            address: true,
            contact: true,
            hours: true,
            settings: true,
            features: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    });

    type UserRestaurantRelation = {
      restaurant: {
        id: string;
        name: string;
        description: string;
        cuisine: string[];
        address: any;
        contact: any;
        hours: any;
        settings: any;
        features: any;
        createdAt: Date;
        updatedAt: Date;
      };
      role: string;
    };

    const restaurants = userRestaurants.map((ur: UserRestaurantRelation) => ({
      ...ur.restaurant,
      role: ur.role
    }));

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des restaurants' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Créer un nouveau restaurant
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer les données du formulaire
    const data = await request.json();
    
    // Validation des données requises
    if (!data.name) {
      return NextResponse.json(
        { error: 'Le nom du restaurant est requis' },
        { status: 400 }
      );
    }

    // Créer le restaurant et l'association avec l'utilisateur
    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        description: data.description || '',
        cuisine: data.cuisineTypes ? JSON.stringify(data.cuisineTypes) : JSON.stringify([]),
        address: data.address || {},
        contact: data.contact || {},
        hours: data.hours || {},
        settings: {},
        features: {},
        users: {
          create: {
            userId: user.id,
            role: 'OWNER'
          }
        }
      }
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du restaurant:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du restaurant' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 