'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface DailyMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert';
  ingredients: string[];
  allergens: string[];
  imageUrl?: string;
  aiGenerated: boolean;
}

interface Weather {
  condition: string;
  temperature: number;
  icon: string;
}

export default function DailyMenuPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const [restaurant, setRestaurant] = useState<{ name: string; id: string } | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dailyMenu, setDailyMenu] = useState<{
    starters: DailyMenuItem[];
    mains: DailyMenuItem[];
    desserts: DailyMenuItem[];
    price?: number;
    isPublished: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Remplacer par de vrais appels API quand la base de données sera prête
        // Simuler un chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Restaurant fictif
        const mockRestaurant = {
          id: restaurantId,
          name: restaurantId === '1' ? 'Chez Minnà' : 'L\'Atelier Gourmand',
        };
        
        // Données météo fictives
        const mockWeather = {
          condition: 'rainy',
          temperature: 16,
          icon: '/images/weather/rainy.svg',
        };
        
        // Menu du jour fictif (null pour simuler qu'il n'existe pas encore)
        const mockDailyMenu = null;
        
        setRestaurant(mockRestaurant);
        setWeather(mockWeather);
        setDailyMenu(mockDailyMenu);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId, date]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    // Réinitialiser le menu lors d'un changement de date
    setDailyMenu(null);
    setLoading(true);
  };

  const handleGenerateMenu = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Remplacer par un vrai appel API
      // Simuler une génération IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Menu fictif généré
      const generatedMenu = {
        starters: [
          {
            id: '1',
            name: 'Velouté de potimarron',
            description: 'Un velouté onctueux parfait pour les jours de pluie, avec des notes de cannelle et muscade.',
            price: 9,
            category: 'starter' as const,
            ingredients: ['Potimarron', 'Oignon', 'Crème', 'Cannelle', 'Muscade'],
            allergens: ['lait'],
            aiGenerated: true,
          },
          {
            id: '2',
            name: 'Tarte fine aux champignons',
            description: 'Tarte croustillante garnie de champignons de saison et d\'herbes fraîches.',
            price: 11,
            category: 'starter' as const,
            ingredients: ['Pâte feuilletée', 'Champignons', 'Échalotes', 'Thym', 'Crème fraîche'],
            allergens: ['gluten', 'lait'],
            aiGenerated: true,
          },
        ],
        mains: [
          {
            id: '3',
            name: 'Risotto aux champignons',
            description: 'Risotto crémeux aux champignons, parfait pour une journée pluvieuse d\'automne.',
            price: 18,
            category: 'main' as const,
            ingredients: ['Riz arborio', 'Champignons', 'Parmesan', 'Oignon', 'Vin blanc'],
            allergens: ['lait'],
            aiGenerated: true,
          },
          {
            id: '4',
            name: 'Pot-au-feu traditionnel',
            description: 'Un plat mijoté réconfortant avec des légumes de saison, idéal par temps frais et pluvieux.',
            price: 22,
            category: 'main' as const,
            ingredients: ['Bœuf', 'Carottes', 'Poireaux', 'Navets', 'Pommes de terre'],
            allergens: [],
            aiGenerated: true,
          },
        ],
        desserts: [
          {
            id: '5',
            name: 'Tarte aux pommes tiède',
            description: 'Tarte aux pommes servie tiède avec une boule de glace à la vanille.',
            price: 8,
            category: 'dessert' as const,
            ingredients: ['Pommes', 'Pâte brisée', 'Cannelle', 'Vanille', 'Sucre'],
            allergens: ['gluten', 'lait', 'œuf'],
            aiGenerated: true,
          },
        ],
        price: 32,
        isPublished: false,
      };
      
      setDailyMenu(generatedMenu);
      setSuccess('Menu du jour généré avec succès !');
    } catch (err) {
      setError('Erreur lors de la génération du menu');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublishMenu = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDailyMenu(prev => prev ? { ...prev, isPublished: true } : null);
      setSuccess('Menu du jour publié avec succès !');
    } catch (err) {
      setError('Erreur lors de la publication du menu');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDisplay = () => {
    if (!weather) return null;
    
    const weatherLabels: Record<string, string> = {
      'clear': 'Ensoleillé',
      'partlyCloudy': 'Partiellement nuageux',
      'cloudy': 'Nuageux',
      'rainy': 'Pluvieux',
      'stormy': 'Orageux',
      'snowy': 'Neigeux',
      'foggy': 'Brumeux',
      'windy': 'Venteux',
      'hot': 'Très chaud',
      'cold': 'Très froid',
    };
    
    return (
      <div className="flex items-center space-x-2">
        <Image
          src={weather.icon || `/images/weather/${weather.condition}.svg`}
          alt={weatherLabels[weather.condition] || weather.condition}
          width={36}
          height={36}
          className="object-cover"
        />
        <div>
          <span className="text-lg font-medium">{weather.temperature}°C</span>
          <span className="ml-2 text-sm text-gray-500">{weatherLabels[weather.condition] || weather.condition}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link href={`/dashboard/restaurants/${restaurantId}`} className="text-indigo-600 hover:text-indigo-800 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Menu du jour - {restaurant?.name || 'Chargement...'}
              </h1>
              <p className="text-sm text-gray-500">
                Générez et publiez automatiquement un menu adapté aux conditions météo
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
        ) : (
          <>
            {error && (
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
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date du menu</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={date}
                        onChange={handleDateChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      />
                    </div>
                    {weather && (
                      <div className="mt-4 md:mt-0">
                        <span className="block text-sm font-medium text-gray-700">Météo prévue</span>
                        {getWeatherDisplay()}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    {!dailyMenu ? (
                      <button
                        onClick={handleGenerateMenu}
                        disabled={generating}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${generating ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {generating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Génération en cours...
                          </>
                        ) : (
                          <>
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Générer le menu du jour
                          </>
                        )}
                      </button>
                    ) : !dailyMenu.isPublished ? (
                      <button
                        onClick={handlePublishMenu}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Publier le menu
                      </button>
                    ) : (
                      <div className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-green-800 bg-green-100">
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Menu publié
                      </div>
                    )}
                  </div>
                </div>

                {dailyMenu ? (
                  <div>
                    <div className="border-b border-gray-200 mb-6">
                      <h2 className="text-xl font-semibold">Menu du jour - {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
                      {dailyMenu.price && (
                        <p className="text-lg font-medium text-gray-700 mb-2">Menu complet : {dailyMenu.price.toFixed(2)} €</p>
                      )}
                      <p className="text-sm text-gray-500 mb-4">Ce menu a été généré en tenant compte des conditions météorologiques prévues pour la journée.</p>
                    </div>

                    <div className="space-y-8">
                      {/* Entrées */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Entrées</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dailyMenu.starters.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between">
                                <h4 className="text-md font-semibold">{item.name}</h4>
                                <span className="text-md font-medium">{item.price.toFixed(2)} €</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1 mb-1">
                                  {item.ingredients.map((ingredient, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      {ingredient}
                                    </span>
                                  ))}
                                </div>
                                {item.allergens.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {item.allergens.map((allergen, index) => (
                                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        {allergen}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {item.aiGenerated && (
                                <div className="mt-2 flex items-center text-xs text-indigo-600">
                                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                  </svg>
                                  Généré par IA
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Plats */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Plats</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dailyMenu.mains.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between">
                                <h4 className="text-md font-semibold">{item.name}</h4>
                                <span className="text-md font-medium">{item.price.toFixed(2)} €</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1 mb-1">
                                  {item.ingredients.map((ingredient, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      {ingredient}
                                    </span>
                                  ))}
                                </div>
                                {item.allergens.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {item.allergens.map((allergen, index) => (
                                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        {allergen}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {item.aiGenerated && (
                                <div className="mt-2 flex items-center text-xs text-indigo-600">
                                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                  </svg>
                                  Généré par IA
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Desserts */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Desserts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dailyMenu.desserts.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between">
                                <h4 className="text-md font-semibold">{item.name}</h4>
                                <span className="text-md font-medium">{item.price.toFixed(2)} €</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1 mb-1">
                                  {item.ingredients.map((ingredient, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      {ingredient}
                                    </span>
                                  ))}
                                </div>
                                {item.allergens.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {item.allergens.map((allergen, index) => (
                                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        {allergen}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {item.aiGenerated && (
                                <div className="mt-2 flex items-center text-xs text-indigo-600">
                                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                  </svg>
                                  Généré par IA
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="mt-2 text-xl font-medium text-gray-900">Pas encore de menu généré</h3>
                    <p className="mt-1 text-gray-500">Cliquez sur "Générer le menu du jour" pour créer un menu basé sur les conditions météorologiques.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
} 