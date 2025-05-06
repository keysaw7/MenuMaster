import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  console.log('API de déconnexion (GET) appelée');
  
  // Créer une réponse avec redirection
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  
  // Forcer la suppression du cookie auth-token
  response.cookies.set({
    name: 'auth-token',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  
  // Forcer la suppression du cookie auth-status
  response.cookies.set({
    name: 'auth-status',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  
  console.log('Cookies de session supprimés avec succès');
  return response;
}

export async function POST() {
  console.log('API de déconnexion (POST) appelée');
  
  // Créer une réponse JSON
  const response = NextResponse.json({ success: true, message: 'Déconnexion réussie' });
  
  // Forcer la suppression du cookie auth-token
  response.cookies.set({
    name: 'auth-token',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  
  // Forcer la suppression du cookie auth-status
  response.cookies.set({
    name: 'auth-status',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  
  console.log('Cookies de session supprimés avec succès');
  return response;
} 