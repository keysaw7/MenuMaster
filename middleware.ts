import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromToken } from '@/app/lib/auth';

// Routes qui nécessitent une authentification
const protectedRoutes = ['/dashboard', '/profile', '/menu', '/settings'];

// Routes d'authentification (pas besoin de redirection si déjà connecté)
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  // Vérification du token d'authentification
  const user = await getUserFromToken(request);
  const path = request.nextUrl.pathname;
  
  // Si l'utilisateur accède à une route protégée et n'est pas connecté
  if (protectedRoutes.some(route => path.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Si l'utilisateur est connecté et tente d'accéder à une page d'authentification
  if (authRoutes.includes(path) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configuration pour Edge Runtime
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 