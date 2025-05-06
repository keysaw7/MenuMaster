import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ID utilisateur du token
    const tokenUserId = '200a481b-e37c-490f-a4f9-438f9dd620b3';
    const userEmail = 'mathisquillet@orange.fr';
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { id: tokenUserId }
    });
    
    if (existingUser) {
      return NextResponse.json({ 
        message: 'L\'utilisateur existe déjà', 
        user: existingUser 
      });
    }
    
    // Hasher un mot de passe par défaut
    const hashedPassword = await hashPassword('Password123!');
    
    // Créer l'utilisateur avec l'ID spécifique
    const user = await prisma.user.create({
      data: {
        id: tokenUserId,
        name: 'Mathis Quillet',
        email: userEmail,
        passwordHash: hashedPassword,
        role: 'OWNER',
      }
    });
    
    // Créer également un restaurant par défaut
    const restaurant = await prisma.restaurant.create({
      data: {
        name: 'Mon Restaurant',
        description: 'Description de mon restaurant',
        cuisine: [],
        address: {},
        contact: { email: userEmail },
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
    
    return NextResponse.json({
      message: 'Utilisateur et restaurant recréés avec succès',
      user,
      restaurant
    });
  } catch (error) {
    console.error('Erreur lors de la recréation de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la recréation de l\'utilisateur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 