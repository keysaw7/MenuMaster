import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromToken } from '@/app/lib/auth';

// Routes qui nécessitent une authentification
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/daily-menu',
  '/restaurant'
];

// Routes d'authentification (pas besoin de redirection si déjà connecté)
const authRoutes = ['/login', '/register'];

// Routes publiques spécifiques (accessibles à tous)
const publicRoutes = [
  '/',
  '/menu',
  '/contact',
  '/features',
  '/pricing',
  '/privacy',
  '/terms',
  '/accessibility',
  '/reset',
  '/wipe-cookies'
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Vérification du token d'authentification et récupération de l'utilisateur
  const user = await getUserFromToken(request);
  
  // Activation du mode debug pour voir les informations dans la console
  console.log(`Middleware - Path: ${path}, User authenticated: ${!!user}`);
  
  // Vérifier si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => path === route || path.startsWith(`${route}/`));
  
  // Vérifier si c'est une route d'authentification
  const isAuthRoute = authRoutes.some(route => path === route);
  
  // Vérifier si c'est une route publique spécifique
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(`${route}/`));
  
  // Vérifier si c'est une route API
  const isApiRoute = path.startsWith('/api/');
  
  // Si l'utilisateur accède à une route protégée et n'est pas connecté
  if (isProtectedRoute && !user) {
    console.log('Redirection vers la page de connexion (route protégée)');
    
    // Stocker la page d'origine pour y retourner après connexion
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    
    return NextResponse.redirect(redirectUrl);
  }
  
  // Si l'utilisateur est connecté et tente d'accéder à une page d'authentification
  if (isAuthRoute && user) {
    console.log('Redirection vers le tableau de bord (utilisateur déjà connecté)');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Pour toutes les autres routes, on laisse passer
  return NextResponse.next();
}

// Configuration pour Edge Runtime - matcher définit les routes où le middleware sera exécuté
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|assets).*)'],
} 