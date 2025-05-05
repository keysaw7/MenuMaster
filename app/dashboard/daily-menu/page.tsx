'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type MenuItem = {
  name: string;
  description: string;
  ingredients: string[];
};

type DailyMenu = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  starters: MenuItem[];
  mains: MenuItem[];
  desserts: MenuItem[];
  price?: number;
  isPublished: boolean;
  weather?: {
    temperature: number;
    condition: string;
    icon: string;
  };
};

// Simuler des données stockées localement
const mockSavedMenus: DailyMenu[] = [
  {
    id: '1',
    restaurantId: '1',
    restaurantName: 'Le Bistrot Français',
    date: new Date().toISOString().split('T')[0],
    starters: [
      {
        name: 'Gaspacho de tomates fraîches',
        description: 'Soupe froide de tomates, poivrons et concombres, relevée d\'un filet d\'huile d\'olive et de basilic frais',
        ingredients: ['Tomates', 'Poivrons', 'Concombre', 'Huile d\'olive', 'Basilic']
      },
      {
        name: 'Carpaccio de courgettes au citron',
        description: 'Fines tranches de courgettes crues marinées au citron et huile d\'olive, agrémentées de copeaux de parmesan',
        ingredients: ['Courgettes', 'Citron', 'Parmesan', 'Huile d\'olive']
      }
    ],
    mains: [
      {
        name: 'Filet de bar grillé aux herbes de Provence',
        description: 'Filet de bar cuit sur la peau, accompagné d\'un écrasé de pommes de terre à l\'huile d\'olive et aux herbes fraîches',
        ingredients: ['Bar', 'Pommes de terre', 'Herbes de Provence', 'Huile d\'olive']
      },
      {
        name: 'Ratatouille traditionnelle et son œuf poché',
        description: 'Légumes du soleil mijotés lentement à l\'huile d\'olive, accompagnés d\'un œuf poché',
        ingredients: ['Tomates', 'Courgettes', 'Aubergines', 'Poivrons', 'Oignons', 'Œufs']
      }
    ],
    desserts: [
      {
        name: 'Salade de fraises au basilic',
        description: 'Fraises fraîches marinées au sirop léger et basilic, servies avec un sorbet citron',
        ingredients: ['Fraises', 'Basilic', 'Citron', 'Sucre']
      },
      {
        name: 'Moelleux au chocolat cœur coulant',
        description: 'Gâteau au chocolat à la texture fondante avec un cœur coulant, servi tiède avec une boule de glace vanille',
        ingredients: ['Chocolat', 'Œufs', 'Beurre', 'Farine', 'Sucre']
      }
    ],
    isPublished: true,
    price: 29.90,
    weather: {
      temperature: 24,
      condition: 'Ensoleillé',
      icon: '☀️',
    }
  }
];

// Essayer de récupérer des menus sauvegardés dans le localStorage
const getSavedMenus = (): DailyMenu[] => {
  if (typeof window !== 'undefined') {
    try {
      const savedMenus = localStorage.getItem('savedDailyMenus');
      if (savedMenus) {
        const parsedMenus = JSON.parse(savedMenus);
        console.log('Menus récupérés du localStorage:', parsedMenus);
        
        // Vérifier que c'est bien un tableau
        if (Array.isArray(parsedMenus)) {
          return parsedMenus;
        } else {
          console.error('Les menus sauvegardés ne sont pas un tableau:', parsedMenus);
        }
      } else {
        console.log('Aucun menu trouvé dans localStorage, utilisation des données de test');
      }
    } catch (e) {
      console.error('Erreur lors de la lecture des menus sauvegardés:', e);
    }
  }
  return mockSavedMenus;
};

export default function DailyMenuPage() {
  const router = useRouter();
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fonction pour charger les menus depuis localStorage
  const loadMenus = () => {
    try {
      setLoading(true);
      const savedMenus = getSavedMenus();
      console.log('Menus chargés dans le composant:', savedMenus);
      setMenus(savedMenus);
    } catch (error) {
      console.error('Erreur lors du chargement des menus:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour rafraîchir manuellement les menus
  const handleRefresh = () => {
    setRefreshing(true);
    try {
      // Vider le cache du routeur si possible
      if (typeof window !== 'undefined') {
        // Force refresh from server
        window.location.reload();
      } else {
        loadMenus();
        setTimeout(() => setRefreshing(false), 500);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMenus();
    
    // Ajouter un écouteur d'événement pour détecter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedDailyMenus') {
        console.log('Changement détecté dans localStorage, rechargement des menus');
        loadMenus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handlePublish = (menuId: string) => {
    setMenus(prev => 
      prev.map(menu => 
        menu.id === menuId 
          ? { ...menu, isPublished: true } 
          : menu
      )
    );

    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      const updatedMenus = menus.map(menu => 
        menu.id === menuId 
          ? { ...menu, isPublished: true } 
          : menu
      );
      localStorage.setItem('savedDailyMenus', JSON.stringify(updatedMenus));
    }
  };

  const handleDelete = (menuId: string) => {
    setMenus(prev => prev.filter(menu => menu.id !== menuId));

    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      const updatedMenus = menus.filter(menu => menu.id !== menuId);
      localStorage.setItem('savedDailyMenus', JSON.stringify(updatedMenus));
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Menus enregistrés</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            disabled={refreshing}
          >
            {refreshing ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
          </button>
          <Link
            href="/daily-menu/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            Créer un nouveau menu
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : menus.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Aucun menu enregistré</h2>
          <p className="text-gray-500 mb-6">
            Vous n'avez pas encore créé de menu du jour. Créez votre premier menu pour commencer.
          </p>
          <Link
            href="/daily-menu/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            Créer un menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{menu.restaurantName}</h2>
                    <p className="text-gray-600">{formatDate(menu.date)}</p>
                  </div>
                  {menu.weather && (
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-xl mr-1">{menu.weather.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{menu.weather.temperature}°C</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">Entrées</h3>
                  <ul className="text-sm text-gray-600">
                    {menu.starters.map((starter, idx) => (
                      <li key={idx} className="mb-1">{starter.name}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">Plats</h3>
                  <ul className="text-sm text-gray-600">
                    {menu.mains.map((main, idx) => (
                      <li key={idx} className="mb-1">{main.name}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">Desserts</h3>
                  <ul className="text-sm text-gray-600">
                    {menu.desserts.map((dessert, idx) => (
                      <li key={idx} className="mb-1">{dessert.name}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span className="font-bold text-lg text-indigo-600">
                    {menu.price ? `${menu.price.toFixed(2)} €` : 'Prix non défini'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(menu.id)}
                      className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      Supprimer
                    </button>
                    {!menu.isPublished && (
                      <button
                        onClick={() => handlePublish(menu.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Publier
                      </button>
                    )}
                    <Link
                      href={`/daily-menu/${menu.id}`}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                    >
                      Détails
                    </Link>
                  </div>
                </div>

                {menu.isPublished && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Publié
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 