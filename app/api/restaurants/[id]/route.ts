import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/restaurants/[id] - Récupérer un restaurant par son ID
export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const id = await context.params.id;

    // Cas spécial pour le restaurant démo
    if (id === '1') {
      return NextResponse.json({
        id: '1',
        name: 'Chez Minnà/Démo',
        description: 'Restaurant de démonstration avec toutes les fonctionnalités disponibles',
        cuisine: ['Corse', 'Méditerranéenne'],
        address: {
          street: '15 Rue de la Citadelle',
          city: 'Bonifacio',
          postalCode: '20169',
          country: 'France',
          coordinates: {
            latitude: 41.387397,
            longitude: 9.159784
          }
        },
        contact: {
          phone: '+33 4 95 73 04 58',
          email: 'contact@chezminnademo.fr',
          website: 'https://www.chezminnademo.fr'
        },
        hours: {
          "1": [{ open: "12:00", close: "14:30" }, { open: "19:00", close: "22:30" }],
          "2": [{ open: "12:00", close: "14:30" }, { open: "19:00", close: "22:30" }],
          "3": [{ open: "12:00", close: "14:30" }, { open: "19:00", close: "22:30" }],
          "4": [{ open: "12:00", close: "14:30" }, { open: "19:00", close: "22:30" }],
          "5": [{ open: "12:00", close: "14:30" }, { open: "19:00", close: "23:00" }],
          "6": [{ open: "12:00", close: "15:00" }, { open: "19:00", close: "23:00" }],
          "0": [{ open: "12:00", close: "15:00" }]
        },
        settings: {
          primaryColor: '#4f46e5',
          secondaryColor: '#ffffff',
          fontFamily: 'Inter',
          logo: '/images/placeholder-logo.png',
          coverImage: '/images/placeholder-restaurant.jpg',
          currency: '€'
        },
        features: {
          hasAlcohol: true,
          acceptsReservations: true,
          hasTakeout: false,
          hasDelivery: false,
          isDailyMenuEnabled: true,
          isAiRecommendationEnabled: true
        },
        menus: [
          {
            id: 'demo-menu',
            name: 'Carte Chez Minnà/Démo',
            type: 'regular'
          }
        ],
        dailyMenus: []
      });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        menus: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        dailyMenus: {
          where: { isPublished: true },
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du restaurant' },
      { status: 500 }
    );
  }
}

// PUT /api/restaurants/[id] - Mettre à jour un restaurant
export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
    const data = await request.json();

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant non trouvé' },
        { status: 404 }
      );
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        cuisine: data.cuisine,
        address: data.address,
        contact: data.contact,
        hours: data.hours,
        settings: data.settings,
        features: data.features,
      },
    });

    return NextResponse.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du restaurant' },
      { status: 500 }
    );
  }
}

// DELETE /api/restaurants/[id] - Supprimer un restaurant
export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const id = context.params.id;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant non trouvé' },
        { status: 404 }
      );
    }

    await prisma.restaurant.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Restaurant supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du restaurant' },
      { status: 500 }
    );
  }
} 