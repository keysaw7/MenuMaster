import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Supprimer le cookie d'authentification
    removeAuthCookie();

    // Retourner la réponse
    return NextResponse.json({
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la déconnexion' },
      { status: 500 }
    );
  }
} 