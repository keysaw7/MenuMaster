// Utilitaire d'authentification côté client

// Types pour les données utilisateur
export type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
};

/**
 * Vérifie si l'utilisateur est connecté en cherchant des preuves d'authentification
 * dans les cookies ou le localStorage
 */
export function isAuthenticated(): boolean {
  try {
    // Vérifier d'abord si nous avons un cookie d'état d'authentification
    const hasAuthCookie = document.cookie
      .split('; ')
      .some(cookie => cookie.startsWith('auth-status=logged-in'));
    
    if (hasAuthCookie) {
      return true;
    }
    
    // Sinon, vérifier le localStorage comme solution de secours
    const token = localStorage.getItem('auth-token');
    return !!token;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
}

/**
 * Récupère les données utilisateur depuis le localStorage
 */
export function getUser(): UserData | null {
  try {
    const userData = localStorage.getItem('auth-user');
    if (!userData) return null;
    
    return JSON.parse(userData) as UserData;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
}

/**
 * Récupère le token d'authentification depuis le localStorage
 */
export function getToken(): string | null {
  try {
    return localStorage.getItem('auth-token');
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
}

/**
 * Stocke les données d'authentification dans le localStorage
 */
export function setAuthData(token: string, user: UserData): void {
  try {
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user', JSON.stringify(user));
  } catch (error) {
    console.error('Erreur lors du stockage des données d\'authentification:', error);
  }
}

/**
 * Efface les données d'authentification du localStorage
 */
export function clearAuthData(): void {
  try {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  } catch (error) {
    console.error('Erreur lors de la suppression des données d\'authentification:', error);
  }
}

/**
 * Déconnecte l'utilisateur (côté client)
 */
export async function logout(): Promise<boolean> {
  try {
    // Appeler l'API de déconnexion pour supprimer les cookies côté serveur
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    // Supprimer les données dans le localStorage
    clearAuthData();
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return false;
  }
} 