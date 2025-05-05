import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/restaurants/[id] - Récupérer un restaurant par son ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

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
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
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
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

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