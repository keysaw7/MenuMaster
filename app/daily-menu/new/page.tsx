'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Restaurant = {
  id: string;
  name: string;
};

type Ingredient = {
  id: string;
  name: string;
  isAvailable: boolean;
  quantity: number;
  unit: string;
};

type WeatherInfo = {
  temperature: number;
  condition: string;
  icon: string;
};

type MenuItem = {
  name: string;
  description: string;
  ingredients: string[];
};

type DailyMenu = {
  id?: string;
  restaurantId: string;
  date: string;
  starters: MenuItem[];
  mains: MenuItem[];
  desserts: MenuItem[];
  price?: number;
  isPublished: boolean;
  weather?: WeatherInfo;
};

// Données d'exemple pour simuler une réponse de l'API
const mockIngredients: Ingredient[] = [
  { id: '1', name: 'Tomates', isAvailable: true, quantity: 5, unit: 'kg' },
  { id: '2', name: 'Courgettes', isAvailable: true, quantity: 3, unit: 'kg' },
  { id: '3', name: 'Aubergines', isAvailable: true, quantity: 2, unit: 'kg' },
  { id: '4', name: 'Poivrons', isAvailable: true, quantity: 1.5, unit: 'kg' },
  { id: '5', name: 'Oignons', isAvailable: true, quantity: 2, unit: 'kg' },
  { id: '6', name: 'Ail', isAvailable: true, quantity: 0.5, unit: 'kg' },
  { id: '7', name: 'Pommes de terre', isAvailable: true, quantity: 8, unit: 'kg' },
  { id: '8', name: 'Poisson (Bar)', isAvailable: true, quantity: 3, unit: 'kg' },
  { id: '9', name: 'Viande (Bœuf)', isAvailable: true, quantity: 4, unit: 'kg' },
  { id: '10', name: 'Poulet', isAvailable: true, quantity: 5, unit: 'kg' },
  { id: '11', name: 'Œufs', isAvailable: true, quantity: 24, unit: 'unités' },
  { id: '12', name: 'Crème fraîche', isAvailable: true, quantity: 1, unit: 'l' },
  { id: '13', name: 'Fromage (Comté)', isAvailable: true, quantity: 1, unit: 'kg' },
  { id: '14', name: 'Fraises', isAvailable: true, quantity: 1.5, unit: 'kg' },
  { id: '15', name: 'Chocolat', isAvailable: true, quantity: 0.8, unit: 'kg' },
];

const mockWeather: WeatherInfo = {
  temperature: 24,
  condition: 'Ensoleillé',
  icon: '☀️',
};

const mockGeneratedMenu: DailyMenu = {
  restaurantId: '1',
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
  isPublished: false
};

export default function NewDailyMenuPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [generatedMenu, setGeneratedMenu] = useState<DailyMenu | null>(null);
  const [menuPrice, setMenuPrice] = useState<string>('');
  const [menuDate, setMenuDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'ingredients' | 'menu'>('ingredients');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Charger les restaurants de l'utilisateur
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        // Simuler la réponse API
        setTimeout(() => {
          setRestaurants([
            { id: '1', name: 'Le Bistrot Français' },
            { id: '2', name: 'La Table Provençale' }
          ]);
          setSelectedRestaurant('1');
          setLoading(false);
        }, 500);
        
        // Dans un environnement réel, on utiliserait cette requête API :
        // const response = await fetch('/api/restaurants');
        // if (!response.ok) {
        //   throw new Error('Erreur lors de la récupération des restaurants');
        // }
        // const data = await response.json();
        // setRestaurants(data.restaurants);
        // if (data.restaurants.length > 0) {
        //   setSelectedRestaurant(data.restaurants[0].id);
        // }
      } catch (err) {
        setError('Impossible de charger vos restaurants');
        console.error(err);
      }
    };

    fetchRestaurants();
  }, []);

  // Charger les ingrédients disponibles quand un restaurant est sélectionné
  useEffect(() => {
    if (!selectedRestaurant) return;

    const fetchIngredients = async () => {
      setLoading(true);
      // Simuler la réponse API
      setTimeout(() => {
        setAvailableIngredients(mockIngredients);
        setWeather(mockWeather);
        setLoading(false);
      }, 500);
    };

    fetchIngredients();
  }, [selectedRestaurant]);

  const handleIngredientToggle = (ingredientId: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredientId)) {
        return prev.filter(id => id !== ingredientId);
      } else {
        return [...prev, ingredientId];
      }
    });
  };

  const handleGenerateMenu = async () => {
    if (!selectedRestaurant) {
      setError('Veuillez sélectionner un restaurant');
      return;
    }

    setGenerating(true);
    setError(null);

    // Simuler la génération du menu
    setTimeout(() => {
      setGeneratedMenu(mockGeneratedMenu);
      setGenerating(false);
      setStep(2);
      setActiveTab('menu');
    }, 1500);

    // Dans un environnement réel, on utiliserait cette requête API :
    // try {
    //   const response = await fetch('/api/daily-menu/generate', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       restaurantId: selectedRestaurant,
    //       date: menuDate,
    //       ingredients: selectedIngredients,
    //       weather: weather,
    //     }),
    //   });
    //
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || 'Erreur lors de la génération du menu');
    //   }
    //
    //   const data = await response.json();
    //   setGeneratedMenu(data.menu);
    //   setStep(2);
    //   setActiveTab('menu');
    // } catch (err) {
    //   if (err instanceof Error) {
    //     setError(err.message);
    //   } else {
    //     setError('Une erreur est survenue lors de la génération du menu');
    //   }
    //   console.error(err);
    // } finally {
    //   setGenerating(false);
    // }
  };

  const handleSaveMenu = async () => {
    if (!generatedMenu || !selectedRestaurant) {
      setError('Aucun menu à enregistrer');
      return;
    }

    setLoading(true);
    setError(null);

    // Simuler la sauvegarde du menu
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);

    // Dans un environnement réel, on utiliserait cette requête API :
    // try {
    //   const menuToSave = {
    //     ...generatedMenu,
    //     restaurantId: selectedRestaurant,
    //     date: menuDate,
    //     price: menuPrice ? parseFloat(menuPrice) : undefined,
    //     isPublished: false,
    //   };
    //
    //   const response = await fetch('/api/daily-menu', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(menuToSave),
    //   });
    //
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || 'Erreur lors de l\'enregistrement du menu');
    //   }
    //
    //   setStep(3);
    // } catch (err) {
    //   if (err instanceof Error) {
    //     setError(err.message);
    //   } else {
    //     setError('Une erreur est survenue lors de l\'enregistrement du menu');
    //   }
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handlePublishMenu = async () => {
    if (!generatedMenu) return;
    
    // Simuler la publication du menu
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  const renderIngredientTab = () => (
    <div className="mt-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ingrédients disponibles</h3>
        <p className="text-sm text-gray-600 mb-4">
          Sélectionnez les ingrédients que vous souhaitez mettre en valeur dans votre menu du jour. 
          Notre Ami intelligent créera un menu qui met en avant ces ingrédients, en tenant compte de la météo.
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2 max-h-80 overflow-y-auto p-2 border border-gray-200 rounded-md bg-gray-50">
          {loading ? (
            <div className="w-full py-10 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            availableIngredients.map(ingredient => (
              <div 
                key={ingredient.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                  selectedIngredients.includes(ingredient.id)
                    ? 'bg-indigo-100 border border-indigo-200'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleIngredientToggle(ingredient.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ingredient.id)}
                  onChange={() => {}}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">{ingredient.name}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {ingredient.quantity} {ingredient.unit}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Informations météorologiques</h3>
        <p className="text-sm text-gray-600 mb-4">
          Conditions météorologiques prises en compte pour générer un menu adapté.
        </p>
        
        {weather ? (
          <div className="flex items-center bg-blue-50 p-4 rounded-lg">
            <div className="text-4xl mr-4">{weather.icon}</div>
            <div>
              <div className="font-medium">{weather.condition}</div>
              <div className="text-sm text-gray-600">{weather.temperature}°C</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            Informations météo non disponibles
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGenerateMenu}
          disabled={generating || selectedIngredients.length === 0}
          className={`px-6 py-3 text-white rounded-md shadow-sm ${
            generating || selectedIngredients.length === 0
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {generating ? (
            <>
              <span className="inline-block mr-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              Génération en cours...
            </>
          ) : (
            'Générer le menu'
          )}
        </button>
      </div>
    </div>
  );

  const renderMenuTab = () => (
    <div className="mt-6">
      {generatedMenu ? (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix du menu (€)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={menuPrice}
              onChange={(e) => setMenuPrice(e.target.value)}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Prix du menu"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Menu proposé</h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">Entrées</h4>
              <div className="space-y-4">
                {generatedMenu.starters.map((starter, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900">{starter.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{starter.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {starter.ingredients.map((ingredient, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">Plats</h4>
              <div className="space-y-4">
                {generatedMenu.mains.map((main, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900">{main.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{main.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {main.ingredients.map((ingredient, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">Desserts</h4>
              <div className="space-y-4">
                {generatedMenu.desserts.map((dessert, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900">{dessert.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{dessert.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {dessert.ingredients.map((ingredient, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                setActiveTab('ingredients');
                setStep(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Revenir aux ingrédients
            </button>
            <button
              type="button"
              onClick={handleSaveMenu}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md shadow-sm ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer le menu'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun menu généré</h3>
          <p className="mt-1 text-sm text-gray-500">
            Générez d'abord un menu en sélectionnant vos ingrédients.
          </p>
        </div>
      )}
    </div>
  );

  const renderSuccessStep = () => (
    <div className="mt-6 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="mt-3 text-lg font-medium text-gray-900">Menu enregistré avec succès</h3>
      <p className="mt-2 text-sm text-gray-500">
        Votre menu du jour a bien été enregistré. Vous pouvez maintenant le publier ou y revenir plus tard.
      </p>
      <div className="mt-6 flex justify-center space-x-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retour au tableau de bord
        </button>
        <button
          type="button"
          onClick={handlePublishMenu}
          className="px-4 py-2 text-white rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Publier le menu
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Créer un menu du jour</h1>
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
        
        <div className="bg-blue-50 p-4 mb-6 rounded-lg border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Notre <span className="font-semibold">Ami intelligent</span> génère des suggestions de menus du jour en fonction de vos ingrédients disponibles et des conditions météorologiques. Par temps chaud, il privilégiera des plats frais et légers, tandis que par temps froid, il suggérera des plats plus réconfortants.
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-between">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              1. Sélection des ingrédients
            </span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              2. Revue du menu généré
            </span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              3. Finalisation
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant
            </label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              disabled={loading || step > 1}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Sélectionnez un restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date du menu
            </label>
            <input
              type="date"
              value={menuDate}
              onChange={(e) => setMenuDate(e.target.value)}
              disabled={loading || step > 1}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          {step < 3 && (
            <div>
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm ${
                      activeTab === 'ingredients'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Ingrédients
                  </button>
                  <button
                    onClick={() => setActiveTab('menu')}
                    disabled={!generatedMenu}
                    className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm ${
                      activeTab === 'menu'
                        ? 'border-indigo-500 text-indigo-600'
                        : !generatedMenu
                          ? 'border-transparent text-gray-300 cursor-not-allowed'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Menu généré
                  </button>
                </nav>
              </div>

              {activeTab === 'ingredients' ? renderIngredientTab() : renderMenuTab()}
            </div>
          )}

          {step === 3 && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
} 