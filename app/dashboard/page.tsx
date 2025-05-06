'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Restaurant = {
  id: string;
  name: string;
  description: string;
  cuisine: string[] | string;
  role: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Récupération des données utilisateur");
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          console.error("Réponse non OK:", response.status, response.statusText);
          if (response.status === 401) {
            // Non authentifié, rediriger vers la page de connexion
            router.push('/login');
            return;
          }
          throw new Error('Erreur lors de la récupération des données utilisateur');
        }
        
        const data = await response.json();
        console.log("Données reçues:", JSON.stringify(data).substring(0, 200) + "...");
        
        if (!data.user) {
          console.error("Pas d'utilisateur dans les données");
          throw new Error('Données utilisateur invalides');
        }
        
        setUser(data.user);
        
        // Traitement des restaurants
        if (Array.isArray(data.restaurants)) {
          console.log(`${data.restaurants.length} restaurants reçus`);
          
          // S'assurer que tous les restaurants ont le bon format
          const formattedRestaurants = data.restaurants.map((restaurant: any) => ({
            id: restaurant.id || '',
            name: restaurant.name || '',
            description: restaurant.description || '',
            cuisine: Array.isArray(restaurant.cuisine) ? restaurant.cuisine : [],
            role: restaurant.role || 'USER'
          }));
          
          setRestaurants(formattedRestaurants);
          
          // Sélectionner automatiquement le premier restaurant s'il y en a un
          if (formattedRestaurants.length > 0) {
            setSelectedRestaurant(formattedRestaurants[0].id);
          }
        } else {
          console.error("Format de restaurants invalide:", data.restaurants);
          setRestaurants([]);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les données utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>
      
      {/* Réorganisation horizontale des sections Bienvenue et Sélection de restaurant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {user && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Bienvenue, {user.name} 👋</h2>
            {restaurants.length > 0 ? (
              <p className="mt-1 text-sm text-gray-500">
                Vous gérez {restaurants.length} restaurant{restaurants.length > 1 ? 's' : ''}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                Vous n'avez pas encore ajouté de restaurant
              </p>
            )}
          </div>
        )}

        {/* Sélection du restaurant si l'utilisateur en a plusieurs */}
        {restaurants.length > 1 && (
          <div className="bg-white shadow rounded-lg p-6">
            <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionnez un restaurant
            </label>
            <select
              id="restaurant-select"
              value={selectedRestaurant || ''}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 font-medium"
            >
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id} className="text-gray-900 font-medium">
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte 1: Gestion de Menu */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Gestion de la carte</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Gérez les plats et boissons proposés dans votre restaurant
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <Link
              href="/menu"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
            >
              Accéder
            </Link>
          </div>
        </div>

        {/* Carte 2: Créer un menu du jour */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Ami chef cuistot</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Créez un menu du jour avec l'aide de notre Ami intelligent
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <Link
              href="/daily-menu/new"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              Créer
            </Link>
          </div>
        </div>

        {/* Carte pour initialiser les ingrédients */}
        {selectedRestaurant && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Gestion des ingrédients</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Gérez la liste des ingrédients pour votre restaurant
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <Link
                href={`/dashboard/restaurants/${selectedRestaurant}/ingredients`}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                Gérer
              </Link>
            </div>
          </div>
        )}

        {/* Ligne de séparation */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b border-gray-300 my-4"></div>

        {/* Carte 3: Ajouter un restaurant */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Nouveau restaurant</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ajoutez un nouveau restaurant à votre compte
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <Link
              href="/restaurant/new"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Ajouter
            </Link>
          </div>
        </div>

        {/* Carte 4: Profil utilisateur */}
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Profil</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Gérez vos informations personnelles
                </p>
              </div>
            </div>
          </div>
          <div className="mt-auto bg-gray-50 px-6 py-4">
            <Link
              href="/profile"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Mon profil
            </Link>
          </div>
        </div>

        {/* Carte 5: Menus du jour enregistrés */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900">Menus enregistrés</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Consultez et gérez vos menus du jour enregistrés
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <Link
              href="/dashboard/daily-menu"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Voir les menus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 