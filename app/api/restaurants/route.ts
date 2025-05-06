import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/lib/auth';

const prisma = new PrismaClient();

// GET - Récupérer tous les restaurants de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    // Récupérer l'utilisateur à partir du token de la requête
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }
    
    console.log(`Récupération des restaurants pour l'utilisateur ID: ${user.id}`);
    
    // Récupérer les restaurants associés à l'utilisateur
    const restaurants = await prisma.restaurant.findMany({
      where: {
        users: {
          some: {
            userId: user.id
          }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        cuisine: true,
        address: true,
        contact: true
      }
    });
    
    console.log(`${restaurants.length} restaurants trouvés pour l'utilisateur`);
    
    return NextResponse.json(restaurants);
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

    // Préparer les données de cuisine
    let cuisineData;
    if (Array.isArray(data.cuisineTypes)) {
      cuisineData = data.cuisineTypes;
    } else if (typeof data.cuisineTypes === 'string') {
      try {
        cuisineData = JSON.parse(data.cuisineTypes);
      } catch (e) {
        cuisineData = [data.cuisineTypes];
      }
    } else {
      cuisineData = [];
    }

    // Créer le restaurant et l'association avec l'utilisateur
    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        description: data.description || '',
        cuisine: cuisineData, // Stocké directement comme JSON
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