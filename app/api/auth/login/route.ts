import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, generateToken } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('API de connexion appelée');
    
    const body = await request.json();
    const { email, password } = body;
    
    console.log('Tentative de connexion pour:', email);

    // Validation des données
    if (!email || !password) {
      console.log('Validation échouée: email ou mot de passe manquant');
      return NextResponse.json(
        { error: 'Email et mot de passe sont requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('Utilisateur non trouvé:', email);
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      console.log('Mot de passe incorrect pour:', email);
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    console.log('Authentification réussie pour:', email);

    // Rechercher les restaurants de l'utilisateur
    const userRestaurants = await prisma.usersOnRestaurants.findMany({
      where: { userId: user.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    
    console.log('Restaurants trouvés:', userRestaurants.length);

    // Définir un type pour l'élément du tableau userRestaurants
    type UserRestaurant = {
      restaurant: {
        id: string;
        name: string;
      };
    };

    // Générer un token JWT
    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    console.log('Token JWT généré avec succès');

    // Créer la réponse avec token et utilisateur
    const responseData = {
      message: 'Connexion réussie',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      restaurants: userRestaurants.map((ur: UserRestaurant) => ur.restaurant),
      token: token // Inclure le token pour le débogage et l'utilisation côté client
    };

    // Créer la réponse
    const response = NextResponse.json(responseData);
    
    // Définir le cookie d'authentification dans la réponse
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
      sameSite: 'strict',
    });
    
    // Ajouter un cookie lisible côté client pour vérifier l'état de connexion
    response.cookies.set({
      name: 'auth-status',
      value: 'logged-in',
      httpOnly: false, // Accessible en JavaScript
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
      sameSite: 'strict',
    });
    
    console.log('Réponse de connexion prête à être envoyée');
    return response;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 