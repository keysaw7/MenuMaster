import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/restaurants/[id]/daily-menu - Récupérer le menu du jour
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const date = dateParam || new Date().toISOString().split('T')[0];

    // Vérifier si le restaurant existe
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant non trouvé' },
        { status: 404 }
      );
    }

    // Chercher le menu du jour pour la date spécifiée
    const dailyMenu = await prisma.dailyMenu.findFirst({
      where: {
        restaurantId: id,
        date: date,
      },
    });

    if (!dailyMenu) {
      return NextResponse.json(
        { message: 'Aucun menu du jour trouvé pour cette date' },
        { status: 404 }
      );
    }

    return NextResponse.json(dailyMenu);
  } catch (error) {
    console.error('Error fetching daily menu:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du menu du jour' },
      { status: 500 }
    );
  }
}

// POST /api/restaurants/[id]/daily-menu - Générer un nouveau menu du jour
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
    const data = await request.json();
    const { date, weather } = data;

    // Vérifier si le restaurant existe
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
          where: {
            isAvailable: true,
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si un menu existe déjà pour cette date
    const existingMenu = await prisma.dailyMenu.findFirst({
      where: {
        restaurantId: id,
        date: date,
      },
    });

    if (existingMenu) {
      return NextResponse.json(
        { error: 'Un menu du jour existe déjà pour cette date' },
        { status: 400 }
      );
    }

    // TODO: Implémenter la logique de génération de menu basée sur la météo et les ingrédients disponibles
    // Pour l'instant, nous allons simplement créer un menu par défaut

    const defaultMenu = {
      starters: [
        {
          id: '1',
          name: 'Velouté de saison',
          description: 'Velouté de légumes de saison',
          price: 8,
          ingredients: ['Légumes de saison', 'Crème', 'Épices'],
          allergens: ['lait'],
        },
        {
          id: '2',
          name: 'Salade composée',
          description: 'Salade fraîche avec des produits locaux',
          price: 9,
          ingredients: ['Salade', 'Tomates', 'Concombre', 'Vinaigrette maison'],
          allergens: [],
        },
      ],
      mains: [
        {
          id: '3',
          name: 'Plat du jour',
          description: 'Le plat du chef, inspiré par les produits frais du marché',
          price: 16,
          ingredients: ['Produits frais du marché'],
          allergens: [],
        },
      ],
      desserts: [
        {
          id: '4',
          name: 'Tarte du jour',
          description: 'Tarte aux fruits de saison',
          price: 7,
          ingredients: ['Pâte', 'Fruits de saison', 'Sucre'],
          allergens: ['gluten', 'œuf'],
        },
      ],
    };

    // Créer le menu du jour
    const newDailyMenu = await prisma.dailyMenu.create({
      data: {
        restaurantId: id,
        date: date,
        weather: weather,
        starters: defaultMenu.starters,
        mains: defaultMenu.mains,
        desserts: defaultMenu.desserts,
        price: 28, // Prix du menu complet
        isPublished: false,
      },
    });

    return NextResponse.json(newDailyMenu, { status: 201 });
  } catch (error) {
    console.error('Error generating daily menu:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du menu du jour' },
      { status: 500 }
    );
  }
}

// PUT /api/restaurants/[id]/daily-menu - Mettre à jour un menu du jour existant
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
    const data = await request.json();
    const { date, isPublished, starters, mains, desserts, price } = data;

    // Vérifier si le restaurant existe
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant non trouvé' },
        { status: 404 }
      );
    }

    // Trouver le menu du jour existant
    const existingMenu = await prisma.dailyMenu.findFirst({
      where: {
        restaurantId: id,
        date: date,
      },
    });

    if (!existingMenu) {
      return NextResponse.json(
        { error: 'Menu du jour non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le menu
    const updatedMenu = await prisma.dailyMenu.update({
      where: {
        id: existingMenu.id,
      },
      data: {
        starters: starters || existingMenu.starters,
        mains: mains || existingMenu.mains,
        desserts: desserts || existingMenu.desserts,
        price: price || existingMenu.price,
        isPublished: isPublished !== undefined ? isPublished : existingMenu.isPublished,
      },
    });

    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error('Error updating daily menu:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du menu du jour' },
      { status: 500 }
    );
  }
}

// DELETE /api/restaurants/[id]/daily-menu - Supprimer un menu du jour
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    if (!dateParam) {
      return NextResponse.json(
        { error: 'Le paramètre date est requis' },
        { status: 400 }
      );
    }

    // Vérifier si le restaurant existe
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant non trouvé' },
        { status: 404 }
      );
    }

    // Trouver le menu du jour existant
    const existingMenu = await prisma.dailyMenu.findFirst({
      where: {
        restaurantId: id,
        date: dateParam,
      },
    });

    if (!existingMenu) {
      return NextResponse.json(
        { error: 'Menu du jour non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le menu
    await prisma.dailyMenu.delete({
      where: {
        id: existingMenu.id,
      },
    });

    return NextResponse.json(
      { message: 'Menu du jour supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting daily menu:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du menu du jour' },
      { status: 500 }
    );
  }
} 