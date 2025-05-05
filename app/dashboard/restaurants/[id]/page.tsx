'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DashboardNavigation from '@/app/components/DashboardNavigation';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logo: string;
    coverImage: string;
    currency: string;
  };
  features: {
    hasAlcohol: boolean;
    acceptsReservations: boolean;
    hasTakeout: boolean;
    hasDelivery: boolean;
    isDailyMenuEnabled: boolean;
    isAiRecommendationEnabled: boolean;
  };
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface DailyMenu {
  id: string;
  date: string;
  isPublished: boolean;
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [latestDailyMenu, setLatestDailyMenu] = useState<DailyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Remplacer par des appels API réels quand la base de données sera prête
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Restaurant fictif
        const mockRestaurant = {
          id: restaurantId,
          name: restaurantId === '1' ? 'Chez Minnà' : 'L\'Atelier Gourmand',
          description: restaurantId === '1' 
            ? 'Une cuisine corse authentique et raffinée, entre tradition et modernité' 
            : 'Cuisine française contemporaine avec des produits de saison',
          cuisine: restaurantId === '1' ? ['Corse', 'Méditerranéenne'] : ['Française', 'Gastronomique'],
          address: {
            street: restaurantId === '1' ? '15 Rue de la Citadelle' : '34 Rue de la Paix',
            city: restaurantId === '1' ? 'Bonifacio' : 'Paris',
            postalCode: restaurantId === '1' ? '20169' : '75002',
            country: 'France',
          },
          contact: {
            phone: '+33 4 95 73 04 58',
            email: `contact@${restaurantId === '1' ? 'chezminna' : 'ateliergourmand'}.fr`,
            website: restaurantId === '1' ? 'https://www.chezminna.fr' : 'https://www.ateliergourmand.fr',
          },
          settings: {
            primaryColor: restaurantId === '1' ? '#4f46e5' : '#d946ef',
            secondaryColor: '#ffffff',
            fontFamily: 'Inter',
            logo: '/images/placeholder-logo.png',
            coverImage: '/images/placeholder-restaurant.jpg',
            currency: '€',
          },
          features: {
            hasAlcohol: true,
            acceptsReservations: true,
            hasTakeout: restaurantId === '1' ? false : true,
            hasDelivery: restaurantId === '1' ? false : true,
            isDailyMenuEnabled: true,
            isAiRecommendationEnabled: true,
          },
        };
        
        // Plats populaires fictifs
        const mockPopularItems = [
          {
            id: '1',
            name: restaurantId === '1' ? 'Assiette de Charcuterie' : 'Carpaccio de Saint-Jacques',
            category: 'entrée',
            price: restaurantId === '1' ? 18 : 16,
          },
          {
            id: '2',
            name: restaurantId === '1' ? 'Risotto au vermentinu' : 'Filet de bœuf Rossini',
            category: 'plat',
            price: restaurantId === '1' ? 22 : 32,
          },
          {
            id: '3',
            name: restaurantId === '1' ? 'Cannelés à l\'immortelle' : 'Paris-Brest',
            category: 'dessert',
            price: restaurantId === '1' ? 8 : 9,
          },
        ];
        
        // Menu du jour fictif
        const today = new Date().toISOString().split('T')[0];
        const mockDailyMenu = {
          id: '1',
          date: today,
          isPublished: true,
        };
        
        setRestaurant(mockRestaurant);
        setPopularItems(mockPopularItems);
        setLatestDailyMenu(mockDailyMenu);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données du restaurant');
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {restaurant?.name || 'Chargement...'}
              </h1>
              <p className="text-sm text-gray-500">
                Gérez votre restaurant et consultez les statistiques
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
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
        ) : (
          <>
            {/* Navigation du tableau de bord */}
            <DashboardNavigation restaurantId={restaurantId} />

            <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations du restaurant */}
              <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={restaurant?.settings.coverImage || '/images/placeholder-restaurant.jpg'}
                    alt={restaurant?.name || 'Restaurant'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{restaurant?.name}</h2>
                  <p className="text-gray-600 mb-4">{restaurant?.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Informations</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700">
                            {restaurant?.address.street}, {restaurant?.address.postalCode} {restaurant?.address.city}, {restaurant?.address.country}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700">{restaurant?.contact.phone}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">{restaurant?.contact.email}</span>
                        </li>
                        {restaurant?.contact.website && (
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <a href={restaurant.contact.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                              {restaurant.contact.website}
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Caractéristiques</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <svg className={`h-5 w-5 ${restaurant?.features.hasAlcohol ? 'text-green-500' : 'text-gray-300'} mr-2`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-700">Vente d'alcool</span>
                        </li>
                        <li className="flex items-center">
                          <svg className={`h-5 w-5 ${restaurant?.features.acceptsReservations ? 'text-green-500' : 'text-gray-300'} mr-2`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-700">Réservations</span>
                        </li>
                        <li className="flex items-center">
                          <svg className={`h-5 w-5 ${restaurant?.features.hasTakeout ? 'text-green-500' : 'text-gray-300'} mr-2`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-700">À emporter</span>
                        </li>
                        <li className="flex items-center">
                          <svg className={`h-5 w-5 ${restaurant?.features.hasDelivery ? 'text-green-500' : 'text-gray-300'} mr-2`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-700">Livraison</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions rapides */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h2>
                <div className="space-y-3">
                  <Link
                    href={`/dashboard/restaurants/${restaurantId}/menu`}
                    className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Gérer le menu
                    </span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  <Link
                    href={`/dashboard/restaurants/${restaurantId}/daily-menu`}
                    className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Gérer le menu du jour
                    </span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  <Link
                    href={`/dashboard/restaurants/${restaurantId}/ai-assistant`}
                    className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Assistant IA
                    </span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  <Link
                    href={`/r/${restaurantId}`}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir la page publique
                    </span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Statistiques et aperçu */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Menu populaire */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Plats populaires</h2>
                  {popularItems.length > 0 ? (
                    <div className="space-y-4">
                      {popularItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                          </div>
                          <span className="text-lg font-medium text-gray-900">{item.price.toFixed(2)} €</span>
                        </div>
                      ))}
                      <div className="mt-4 text-center">
                        <Link
                          href={`/dashboard/restaurants/${restaurantId}/menu`}
                          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          Voir tous les plats
                          <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun plat populaire trouvé.</p>
                  )}
                </div>
                
                {/* État du menu du jour */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Menu du jour</h2>
                    {latestDailyMenu ? (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${latestDailyMenu.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {latestDailyMenu.isPublished ? 'Publié' : 'Non publié'}
                      </span>
                    ) : null}
                  </div>
                  
                  {latestDailyMenu ? (
                    <div>
                      <p className="text-gray-600 mb-4">
                        {latestDailyMenu.isPublished
                          ? 'Votre menu du jour est actif et visible par vos clients.'
                          : 'Votre menu du jour est en attente de publication.'}
                      </p>
                      <Link
                        href={`/dashboard/restaurants/${restaurantId}/daily-menu`}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        {latestDailyMenu.isPublished ? 'Voir le menu du jour' : 'Publier le menu du jour'}
                        <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-4">Vous n'avez pas encore créé de menu du jour.</p>
                      <Link
                        href={`/dashboard/restaurants/${restaurantId}/daily-menu`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Créer le menu du jour
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Météo et suggestions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Météo et suggestions</h2>
                <div className="bg-blue-50 rounded-lg p-4 mb-4 flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">Aujourd'hui à {restaurant?.address.city}</p>
                    <p className="text-gray-600 text-sm">16°C - Nuageux avec éclaircies</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Plats suggérés pour cette météo :</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Risotto aux champignons
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Soupe à l'oignon gratinée
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Tarte aux pommes tiède
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Link
                      href={`/dashboard/restaurants/${restaurantId}/daily-menu`}
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Générer un menu basé sur la météo
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
} 