import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { hashPassword, generateToken } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Log de démarrage de l'API
    console.log('API d\'inscription appelée');
    
    const body = await request.json();
    const { name, email, password, restaurantName } = body;
    
    // Log des données reçues (sans mot de passe)
    console.log('Données reçues:', { name, email, restaurantName });

    // Validation des données
    if (!name || !email || !password || !restaurantName) {
      console.log('Validation échouée: champs manquants');
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        console.log('Email déjà utilisé:', email);
        return NextResponse.json(
          { error: 'Un utilisateur avec cet email existe déjà' },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.error('Erreur lors de la vérification d\'utilisateur existant:', dbError);
      return NextResponse.json(
        { error: 'Erreur de base de données lors de la vérification de l\'email' },
        { status: 500 }
      );
    }

    // Hachage du mot de passe
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
      console.log('Mot de passe haché avec succès');
    } catch (hashError) {
      console.error('Erreur lors du hachage du mot de passe:', hashError);
      return NextResponse.json(
        { error: 'Erreur lors du traitement du mot de passe' },
        { status: 500 }
      );
    }

    // Transaction pour créer l'utilisateur et le restaurant
    let result;
    try {
      result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Créer l'utilisateur
        const user = await tx.user.create({
          data: {
            name,
            email,
            passwordHash: hashedPassword,
            role: 'OWNER', // Rôle par défaut pour les nouveaux inscrits
          }
        });
        
        console.log('Utilisateur créé avec succès, ID:', user.id);

        // Créer le restaurant
        const restaurant = await tx.restaurant.create({
          data: {
            name: restaurantName,
            description: '',
            cuisine: [], // Stocké directement comme JSON (tableau vide)
            address: {},
            contact: { email },
            hours: {},
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
        
        console.log('Restaurant créé avec succès, ID:', restaurant.id);
        
        return { user, restaurant };
      });
    } catch (txError) {
      console.error('Erreur lors de la transaction:', txError);
      return NextResponse.json(
        { error: 'Erreur lors de la création du compte et du restaurant' },
        { status: 500 }
      );
    }

    // Générer un token JWT
    let token;
    try {
      token = await generateToken({
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      });
      console.log('Token JWT généré avec succès');
    } catch (tokenError) {
      console.error('Erreur lors de la génération du token:', tokenError);
      return NextResponse.json(
        { error: 'Erreur lors de la génération du token d\'authentification' },
        { status: 500 }
      );
    }

    // Préparer les données de réponse
    const responseData = {
      message: 'Inscription réussie',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      restaurant: {
        id: result.restaurant.id,
        name: result.restaurant.name,
      },
      token: token // Inclure le token pour le débogage et l'utilisation côté client
    };
    
    // Créer la réponse
    const response = NextResponse.json(responseData, { status: 201 });

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
    
    console.log('Inscription réussie, envoi de la réponse');
    return response;
  } catch (error) {
    console.error('Erreur globale lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
      console.log('Déconnexion Prisma réussie');
    } catch (disconnectError) {
      console.error('Erreur lors de la déconnexion Prisma:', disconnectError);
    }
  }
} 