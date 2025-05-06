'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WipeCookiesPage() {
  const router = useRouter();

  useEffect(() => {
    // Fonction pour supprimer tous les cookies
    const deleteAllCookies = () => {
      const cookies = document.cookie.split(';');
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        
        // Suppression du cookie en définissant une date d'expiration passée
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      }
    };

    // Supprimer tous les cookies
    deleteAllCookies();
    
    // Message dans la console
    console.log('Tous les cookies ont été supprimés');

    // Rediriger vers la page d'accueil après une courte attente
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-6">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Suppression des cookies...</h1>
        <p className="text-gray-600 mb-6">
          Nous supprimons toutes les données de session.
          <br />
          Vous serez redirigé automatiquement.
        </p>
      </div>
    </div>
  );
} 