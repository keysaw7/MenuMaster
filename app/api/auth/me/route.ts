import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken, verifyToken } from '@/app/lib/auth';

const prisma = new PrismaClient();

// Fonction utilitaire pour analyser le token à partir de l'en-tête Authorization
async function getUserFromAuthHeader(request: NextRequest) {
  try {
    // Récupérer l'en-tête Authorization
    const authHeader = request.headers.get('Authorization');
    
    // Si l'en-tête n'existe pas ou n'est pas au format Bearer, retourner null
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    // Extraire le token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return null;
    }
    
    // Vérifier le token
    return await verifyToken(token);
  } catch (error) {
    console.error('Erreur lors de l\'extraction du token depuis l\'en-tête:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  console.log("API /api/auth/me appelée");
  try {
    // Récupérer l'utilisateur depuis le token dans les cookies
    console.log("Tentative de récupération du token utilisateur depuis les cookies");
    let tokenData = await getUserFromToken(request);
    
    // Si aucun token n'est trouvé dans les cookies, essayer l'en-tête Authorization
    if (!tokenData) {
      console.log("Aucun token utilisateur trouvé dans les cookies, tentative avec l'en-tête Authorization");
      tokenData = await getUserFromAuthHeader(request);
    }
    
    console.log("Données du token:", tokenData);

    // Si aucun utilisateur n'est connecté
    if (!tokenData) {
      console.log("Aucun token utilisateur valide trouvé");
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les informations utilisateur depuis la base de données
    console.log("Recherche de l'utilisateur dans la base de données avec ID:", tokenData.id);
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
    console.log("Utilisateur trouvé:", user ? "Oui" : "Non");

    if (!user) {
      console.log("Utilisateur non trouvé dans la base de données");
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les restaurants de l'utilisateur
    console.log("Recherche des restaurants de l'utilisateur");
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
          }
        }
      }
    });
    console.log(`Nombre de restaurants trouvés: ${userRestaurants.length}`);
    
    if (userRestaurants.length > 0) {
      console.log("Premier restaurant - ID:", userRestaurants[0].restaurant.id);
      console.log("Premier restaurant - Type de cuisine:", typeof userRestaurants[0].restaurant.cuisine);
      console.log("Premier restaurant - Adresse:", typeof userRestaurants[0].restaurant.address);
    }

    // Définir un type pour l'élément du tableau userRestaurants
    type UserRestaurant = {
      restaurant: {
        id: string;
        name: string;
        description: string;
        cuisine: any;
        address: any;
        contact: any;
        hours: any;
        settings: any;
        features: any;
      };
      role: string;
    };

    // Fonction pour analyser les champs JSON
    const parseJsonField = (field: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return field;
        }
      }
      return field;
    };

    // Préparer les données des restaurants avec le parsing des champs JSON
    console.log("Préparation des données des restaurants");
    const restaurants = userRestaurants.map((ur: UserRestaurant) => {
      try {
        let restaurantData = {
          id: ur.restaurant.id,
          name: ur.restaurant.name,
          description: ur.restaurant.description,
          role: ur.role,
          // Traitement des champs JSON
          cuisine: parseJsonField(ur.restaurant.cuisine),
          address: parseJsonField(ur.restaurant.address),
          contact: parseJsonField(ur.restaurant.contact),
          hours: parseJsonField(ur.restaurant.hours),
          settings: parseJsonField(ur.restaurant.settings),
          features: parseJsonField(ur.restaurant.features)
        };
        return restaurantData;
      } catch (e) {
        console.error("Erreur lors du traitement d'un restaurant:", e);
        return {
          id: ur.restaurant.id,
          name: ur.restaurant.name,
          description: ur.restaurant.description,
          role: ur.role,
          cuisine: [],
          address: {},
          contact: {},
          hours: {},
          settings: {},
          features: {}
        };
      }
    });

    // Retourner la réponse
    console.log("Envoi de la réponse avec utilisateur et restaurants");
    return NextResponse.json({
      user,
      restaurants
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