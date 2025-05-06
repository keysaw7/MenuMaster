import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/lib/auth';
import { menu as demoMenu } from '@/app/data/menu';

const prisma = new PrismaClient();

// Récupérer le menu d'un restaurant (menu fixe)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'ID du restaurant
    const restaurantId = await params.id;
    
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'ID de restaurant manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier si c'est le restaurant démo et retourner directement les données du menu démo
    if (restaurantId === '1') {
      const demoRestaurantData = {
        id: '1',
        name: 'Chez Minnà/Démo',
        menu: demoMenu
      };
      return NextResponse.json(demoRestaurantData);
    }
    
    // Pour les autres restaurants, récupérer les menus de la base de données
    const menus = await prisma.menu.findMany({
      where: {
        restaurantId,
        type: 'regular',
        isActive: true
      }
    });
    
    if (menus.length === 0) {
      // Aucun menu trouvé, on peut renvoyer une réponse vide ou une erreur
      return NextResponse.json(
        { message: 'Aucun menu trouvé pour ce restaurant' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(menus[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du menu:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du menu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Créer ou mettre à jour le menu d'un restaurant
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'ID du restaurant
    const restaurantId = await params.id;
    
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'ID de restaurant manquant' },
        { status: 400 }
      );
    }
    
    // Cas spécial pour le restaurant démo
    if (restaurantId === '1') {
      // Pour le restaurant démo, retourner directement les données du menu démo
      const categorizedMenu: { [key: string]: any[] } = {};
      
      demoMenu.forEach(dish => {
        if (!categorizedMenu[dish.category]) {
          categorizedMenu[dish.category] = [];
        }
        categorizedMenu[dish.category].push(dish);
      });
      
      // Formater les données pour correspondre à notre schéma
      const categories = Object.keys(categorizedMenu).map((category, idx) => {
        return {
          id: `cat-${idx}`,
          name: category === 'entrée' ? 'Entrées' : 
                category === 'plat' ? 'Plats' : 
                category === 'dessert' ? 'Desserts' : category,
          description: `Nos ${category === 'entrée' ? 'entrées' : 
                        category === 'plat' ? 'plats' : 
                        category === 'dessert' ? 'desserts' : category} de démonstration`,
          order: idx,
          items: categorizedMenu[category].map((dish, itemIdx) => ({
            id: dish.id || `item-${idx}-${itemIdx}`,
            name: dish.name,
            description: dish.description,
            price: dish.price,
            ingredients: dish.ingredients,
            allergens: dish.allergens,
            dietaryRestrictions: dish.dietaryRestrictions,
            imageUrl: dish.imageUrl,
            order: itemIdx,
            isAvailable: true,
            recommendedPairings: dish.recommendedPairings || []
          }))
        };
      });
      
      const demoMenuData = {
        id: 'demo-menu',
        restaurantId: '1',
        name: "Carte Chez Minnà/Démo",
        description: "Notre sélection de plats de démonstration",
        type: "regular",
        isActive: true,
        availability: {
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Tous les jours
          timeStart: "12:00",
          timeEnd: "22:00"
        },
        categories
      };
      
      return NextResponse.json({
        success: true,
        menu: demoMenuData
      });
    }
    
    // Pour les autres restaurants, procéder normalement
    // Vérifier l'authentification
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
        restaurantId
      }
    });
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Accès refusé à ce restaurant' },
        { status: 403 }
      );
    }
    
    // Récupérer les informations du restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId
      }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si un menu existe déjà pour ce restaurant
    const existingMenu = await prisma.menu.findFirst({
      where: {
        restaurantId,
        type: 'regular',
        isActive: true
      }
    });
    
    // Récupérer les données du corps de la requête
    let menuData;
    
    try {
      // Essayer de récupérer les données du corps de la requête
      const body = await request.json();
      menuData = body;
    } catch (e) {
      return NextResponse.json(
        { error: "Aucune donnée de menu fournie" },
        { status: 400 }
      );
    }
    
    // Créer ou mettre à jour le menu
    let menu;
    
    if (existingMenu) {
      // Mettre à jour le menu existant
      menu = await prisma.menu.update({
        where: {
          id: existingMenu.id
        },
        data: {
          name: menuData.name || existingMenu.name,
          description: menuData.description || existingMenu.description,
          type: menuData.type || existingMenu.type,
          isActive: menuData.isActive !== undefined ? menuData.isActive : existingMenu.isActive,
          availability: menuData.availability || existingMenu.availability,
          categories: menuData.categories || existingMenu.categories
        }
      });
    } else {
      // Créer un nouveau menu
      menu = await prisma.menu.create({
        data: {
          restaurantId,
          name: menuData.name || "Menu principal",
          description: menuData.description || `Menu principal du restaurant ${restaurant.name}`,
          type: menuData.type || "regular",
          isActive: menuData.isActive !== undefined ? menuData.isActive : true,
          availability: menuData.availability || {
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
            timeStart: "12:00",
            timeEnd: "22:00"
          },
          categories: menuData.categories || []
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      menu
    });
  } catch (error) {
    console.error('Erreur lors de la création/mise à jour du menu:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création/mise à jour du menu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 