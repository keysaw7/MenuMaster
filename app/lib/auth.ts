import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { NextRequest, NextResponse } from 'next/server';

// Type pour les données du token JWT
export type TokenData = {
  id: string;
  email: string;
  role: string;
};

// Constantes pour les JWT
const JWT_SECRET = process.env.JWT_SECRET || 'menu-master-dev-secret';
const JWT_EXPIRES_IN = '7d'; // Durée de validité du token JWT

/**
 * Génère un token JWT pour un utilisateur
 */
export async function generateToken(user: TokenData): Promise<string> {
  const encoder = new TextEncoder();
  const secret = encoder.encode(JWT_SECRET);
  
  return new SignJWT(user as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
}

/**
 * Vérifie et décode un token JWT
 */
export async function verifyToken(token: string): Promise<TokenData | null> {
  try {
    const encoder = new TextEncoder();
    const secret = encoder.encode(JWT_SECRET);
    
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenData;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return null;
  }
}

/**
 * Hachage du mot de passe
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Vérification du mot de passe
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Définit le cookie d'authentification (côté serveur uniquement)
 */
export function setAuthCookie(token: string) {
  // Attention: Cette fonction doit être appelée uniquement dans le contexte serveur
  setCookie('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
    sameSite: 'strict',
  });
}

/**
 * Supprime le cookie d'authentification (côté serveur uniquement)
 */
export function removeAuthCookie() {
  // Attention: Cette fonction doit être appelée uniquement dans le contexte serveur
  deleteCookie('auth-token');
}

/**
 * Récupère l'utilisateur à partir du token JWT dans les cookies
 */
export async function getUserFromToken(req?: NextRequest): Promise<TokenData | null> {
  let tokenValue: string | undefined;
  
  if (req) {
    // Utilisation des cookies de la requête dans les routes API ou middleware
    tokenValue = req.cookies.get('auth-token')?.value;
  } else {
    // Utilisation des cookies côté serveur (dans les routes)
    tokenValue = getCookie('auth-token')?.toString();
  }

  if (!tokenValue) {
    return null;
  }

  return verifyToken(tokenValue);
}

/**
 * Middleware pour vérifier l'authentification
 */
export async function authMiddleware(req: NextRequest) {
  const user = await getUserFromToken(req);
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return NextResponse.next();
}

/**
 * Middleware pour vérifier les autorisations
 */
export async function requireRole(req: NextRequest, allowedRoles: string[]) {
  const user = await getUserFromToken(req);
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  return NextResponse.next();
} 