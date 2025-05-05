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
  const [city, setCity] = useState<string>('Paris,fr');
  const [showMenu, setShowMenu] = useState(false);

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

  // Mettre à jour la météo lorsque la date change
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Afficher information de débogage
        console.log(`Récupération de la météo pour: ${menuDate} à ${city}`);
        
        // Utiliser la nouvelle API météo avec la ville sélectionnée
        const response = await fetch(`/api/weather?date=${menuDate}&city=${encodeURIComponent(city)}`);
        
        if (!response.ok) {
          console.error(`Erreur HTTP: ${response.status} ${response.statusText}`);
          throw new Error(`Erreur lors de la récupération des données météo: ${response.status}`);
        }
        
        const weatherData = await response.json();
        console.log('Données météo reçues:', weatherData);
        
        // Vérifier si une erreur a été renvoyée par l'API
        if (weatherData.error) {
          console.warn('Avertissement météo:', weatherData.error);
          // On utilise quand même les données car notre API renvoie des données par défaut même en cas d'erreur
        }
        
        // Vérifier les valeurs reçues
        const temp = weatherData.temperature;
        if (typeof temp !== 'number' || temp < -50 || temp > 50) {
          console.warn(`Température anormale reçue: ${temp}°C, utilisation de données simulées`);
          throw new Error('Données météo invalides');
        }
        
        setWeather({
          temperature: weatherData.temperature,
          condition: weatherData.condition || 'Inconnu',
          icon: weatherData.icon || '🌡️'
        });
      } catch (error) {
        console.error('Erreur météo:', error);
        // En cas d'erreur, utiliser les données simulées avec un message d'erreur
        setWeather({
          ...mockWeather,
          temperature: Math.floor(Math.random() * 10) + 10, // Température plus réaliste entre 10 et 20°C
          condition: 'Données simulées'
        });
        
        // Afficher un message d'erreur temporaire
        setError(`Impossible de récupérer les données météo pour ${city}. Vérifiez le format de la ville (ex: Paris,fr)`);
        setTimeout(() => setError(null), 5000); // Effacer le message après 5 secondes
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [menuDate, city, mockWeather]);

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
      setShowMenu(true);
    }, 1500);
  };

  const handleSaveMenu = () => {
    if (!generatedMenu) return;
    
    // Créer un objet menu avec toutes les informations nécessaires
    const menuToSave = {
      id: `menu_${Date.now()}`, // Générer un ID unique
      restaurantId: selectedRestaurant,
      restaurantName: restaurants.find(r => r.id === selectedRestaurant)?.name || 'Restaurant',
      date: menuDate,
      starters: generatedMenu.starters,
      mains: generatedMenu.mains,
      desserts: generatedMenu.desserts,
      price: menuPrice ? parseFloat(menuPrice) : undefined,
      isPublished: false,
      weather: weather || undefined
    };
    
    console.log('Menu à sauvegarder:', menuToSave);
    
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      try {
        // Récupérer les menus existants ou initialiser un tableau vide
        let savedMenus = [];
        const savedMenusJSON = localStorage.getItem('savedDailyMenus');
        
        if (savedMenusJSON) {
          savedMenus = JSON.parse(savedMenusJSON);
          console.log('Menus existants récupérés:', savedMenus);
        } else {
          console.log('Aucun menu existant trouvé');
        }
        
        // Vérifier que savedMenus est bien un tableau
        if (!Array.isArray(savedMenus)) {
          console.warn('savedMenus n\'est pas un tableau, initialisation d\'un nouveau tableau');
          savedMenus = [];
        }
        
        // Ajouter le nouveau menu
        savedMenus.push(menuToSave);
        console.log('Menus après ajout:', savedMenus);
        
        // Sauvegarder le tableau mis à jour
        localStorage.setItem('savedDailyMenus', JSON.stringify(savedMenus));
        console.log('Menus sauvegardés avec succès dans localStorage');
        
        // Afficher une notification de succès
        alert('Menu sauvegardé avec succès !');
        
        // Rediriger vers le dashboard des menus
        router.push('/dashboard/daily-menu');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du menu:', error);
        setError('Une erreur est survenue lors de la sauvegarde du menu');
      }
    }
  };

  const renderIngredientsList = () => (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Ingrédients disponibles</h3>
      <p className="text-base text-gray-700 mb-4">
        Sélectionnez les ingrédients que vous souhaitez mettre en valeur dans votre menu (optionnel).
      </p>
      
      <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto p-2">
        {loading ? (
          <div className="w-full py-10 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          availableIngredients.map(ingredient => (
            <div 
              key={ingredient.id}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                selectedIngredients.includes(ingredient.id)
                  ? 'bg-indigo-100 border border-indigo-300 shadow-sm'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => handleIngredientToggle(ingredient.id)}
            >
              <input
                type="checkbox"
                checked={selectedIngredients.includes(ingredient.id)}
                onChange={() => {}}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-3 text-base font-medium text-gray-700">{ingredient.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                {ingredient.quantity} {ingredient.unit}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderGeneratedMenu = () => {
    if (!generatedMenu) return null;

    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Menu généré</h2>
          <div className="flex items-center">
            <div className="mr-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix du menu (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={menuPrice}
                onChange={(e) => setMenuPrice(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Prix"
              />
            </div>
            <button
              onClick={handleSaveMenu}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Enregistrer le menu
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Entrées */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Entrées</h3>
            <div className="space-y-4">
              {generatedMenu.starters.map((starter, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-900">{starter.name}</h4>
                  <p className="text-sm text-gray-700 mt-1">{starter.description}</p>
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

          {/* Plats */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Plats</h3>
            <div className="space-y-4">
              {generatedMenu.mains.map((main, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-900">{main.name}</h4>
                  <p className="text-sm text-gray-700 mt-1">{main.description}</p>
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

          {/* Desserts */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Desserts</h3>
            <div className="space-y-4">
              {generatedMenu.desserts.map((dessert, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-900">{dessert.name}</h4>
                  <p className="text-sm text-gray-700 mt-1">{dessert.description}</p>
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
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Générer un menu du jour</h1>
        <div className="flex space-x-4">
          <Link
            href="/dashboard/daily-menu"
            className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Menus enregistrés
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!showMenu ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Restaurant
              </label>
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                disabled={loading}
                className="block w-full px-4 py-3 text-base font-medium text-gray-900 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
              >
                <option value="">Sélectionnez un restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id} className="text-gray-900 font-medium">
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Date du menu
                  </label>
                  <input
                    type="date"
                    value={menuDate}
                    onChange={(e) => setMenuDate(e.target.value)}
                    disabled={loading}
                    className="block w-full px-4 py-3 text-base font-medium text-gray-900 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={loading}
                    placeholder="Ex: Paris,fr"
                    className="block w-full px-4 py-3 text-base font-medium text-gray-900 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: Ville,pays (ex: Lyon,fr ou Rome,it)</p>
                </div>

                {weather && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <div className="text-4xl mr-4">{weather.icon}</div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{weather.condition}</div>
                        <div className="text-base font-medium text-gray-800">{weather.temperature}°C</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {weather.condition === 'Données simulées' ? (
                            <span className="text-amber-600">Données simulées</span>
                          ) : new Date(menuDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? (
                            "Météo actuelle"
                          ) : (
                            "Prévision météo"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {renderIngredientsList()}

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleGenerateMenu}
              disabled={generating || !selectedRestaurant}
              className={`px-8 py-4 text-xl font-medium text-white rounded-md shadow-lg ${
                generating || !selectedRestaurant
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all`}
            >
              {generating ? (
                <>
                  <span className="inline-block mr-3">
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        </>
      ) : (
        <>
          <button
            onClick={() => setShowMenu(false)}
            className="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Revenir à la configuration
          </button>
          {renderGeneratedMenu()}
        </>
      )}
    </div>
  );
} 