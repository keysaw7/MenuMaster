'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  allergens: string[];
  imageUrl?: string;
}

export default function RestaurantMenuPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const [restaurant, setRestaurant] = useState<{ name: string } | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Form state for new menu item
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    ingredients: [],
    allergens: [],
  });

  // Temporary state for ingredients and allergens input
  const [ingredientInput, setIngredientInput] = useState('');
  const [allergenInput, setAllergenInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API calls when database is ready
        // For now, using mock data
        
        // Mock restaurant data
        const mockRestaurant = {
          id: restaurantId,
          name: restaurantId === '1' ? 'Chez Minnà' : 'L\'Atelier Gourmand',
        };
        
        // Mock menu items
        let mockMenuItems: MenuItem[] = [];
        if (restaurantId === '1') {
          mockMenuItems = [
            {
              id: '1',
              name: 'Assiette de Charcuterie',
              description: 'Une sélection raffinée des meilleures charcuteries corses traditionnelles.',
              price: 18,
              category: 'entrée',
              ingredients: ['Coppa', 'Lonzu', 'Prisuttu', 'Saucisson'],
              allergens: [],
              imageUrl: '/images/dishes/entrees/assiette-charcuterie.webp'
            },
            {
              id: '2',
              name: 'Burratina',
              description: 'Une burratina crémeuse accompagnée de tomates cerises confites.',
              price: 13,
              category: 'entrée',
              ingredients: ['Burrata', 'Tomates cerises', 'Nepita'],
              allergens: ['lait', 'gluten'],
              imageUrl: '/images/dishes/entrees/burratina.webp'
            },
            {
              id: '3',
              name: 'Risotto au vermentinu',
              description: 'Un risotto crémeux cuisiné au vermentinu, le célèbre vin blanc corse.',
              price: 18,
              category: 'plat',
              ingredients: ['Riz', 'Vermentinu', 'Fromage frais', 'Tomates cerises'],
              allergens: ['lait', 'œuf'],
              imageUrl: '/images/dishes/plats/risotto.webp'
            }
          ];
        } else {
          mockMenuItems = [
            {
              id: '1',
              name: 'Carpaccio de Saint-Jacques',
              description: 'Saint-Jacques fraîches, huile d\'olive citronnée, fleur de sel',
              price: 16,
              category: 'entrée',
              ingredients: ['Saint-Jacques', 'Huile d\'olive', 'Citron', 'Fleur de sel'],
              allergens: ['fruits de mer'],
              imageUrl: '/images/placeholder-dish.jpg'
            },
            {
              id: '2',
              name: 'Filet de bœuf Rossini',
              description: 'Filet de bœuf français, escalope de foie gras poêlée, sauce truffe',
              price: 32,
              category: 'plat',
              ingredients: ['Bœuf', 'Foie gras', 'Truffe', 'Échalotes'],
              allergens: [],
              imageUrl: '/images/placeholder-dish.jpg'
            }
          ];
        }
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(mockMenuItems.map(item => item.category))
        );
        
        setRestaurant(mockRestaurant);
        setMenuItems(mockMenuItems);
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données du restaurant');
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setNewItem(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()]
      }));
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleAddAllergen = () => {
    if (allergenInput.trim()) {
      setNewItem(prev => ({
        ...prev,
        allergens: [...prev.allergens, allergenInput.trim()]
      }));
      setAllergenInput('');
    }
  };

  const handleRemoveAllergen = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      allergens: prev.allergens.filter((_, i) => i !== index)
    }));
  };

  const handleAddMenuItem = () => {
    // Validation
    if (!newItem.name || !newItem.description || newItem.price <= 0 || !newItem.category) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Add the new item (in a real app, this would be an API call)
    const newId = String(menuItems.length + 1);
    const menuItem: MenuItem = {
      ...newItem,
      id: newId
    };

    setMenuItems(prev => [...prev, menuItem]);
    
    // Add new category if it doesn't exist
    if (!categories.includes(newItem.category)) {
      setCategories(prev => [...prev, newItem.category]);
    }
    
    // Reset form
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: '',
      ingredients: [],
      allergens: [],
    });
    
    // Close modal
    setShowAddItemModal(false);
  };

  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

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
                Menu de {restaurant?.name || 'chargement...'}
              </h1>
              <p className="text-sm text-gray-500">Gérez les plats et catégories de votre carte</p>
            </div>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter un plat
            </button>
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
            {/* Category filters */}
            <div className="mb-6">
              <div className="sm:hidden">
                <label htmlFor="category-select" className="sr-only">Sélectionner une catégorie</label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <nav className="flex space-x-4" aria-label="Tabs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`${
                      selectedCategory === 'all'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-500 hover:text-gray-700'
                    } px-3 py-2 font-medium text-sm rounded-md`}
                  >
                    Tout
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`${
                        selectedCategory === category
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:text-gray-700'
                      } px-3 py-2 font-medium text-sm rounded-md`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Menu items list */}
            {filteredMenuItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-gray-900">Aucun plat dans cette catégorie</h3>
                <p className="mt-1 text-gray-500">Commencez par ajouter un plat à cette catégorie.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Ajouter un plat
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMenuItems.map(item => (
                  <div key={item.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="flex">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <Image
                          src={item.imageUrl || '/images/placeholder-dish.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{item.price.toFixed(2)} €</p>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                        <div className="mt-3">
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
                        <div className="mt-4 flex justify-end space-x-3">
                          <button className="text-sm text-indigo-600 hover:text-indigo-800">
                            Modifier
                          </button>
                          <button className="text-sm text-red-600 hover:text-red-800">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Menu Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b">
              <h3 className="text-lg font-medium text-gray-900">Ajouter un plat</h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du plat *</label>
                  <input
                    type="text"
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    id="description"
                    rows={3}
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix *</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        id="price"
                        value={newItem.price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie *</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="category"
                        value={newItem.category}
                        onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        list="categories"
                        placeholder="entrée, plat, dessert..."
                        required
                      />
                      <datalist id="categories">
                        {categories.map(cat => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ingrédients</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      className="flex-1 min-w-0 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Ajouter un ingrédient"
                    />
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newItem.ingredients.map((ingredient, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                      >
                        {ingredient}
                        <button
                          type="button"
                          className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allergènes</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      value={allergenInput}
                      onChange={(e) => setAllergenInput(e.target.value)}
                      className="flex-1 min-w-0 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Ajouter un allergène"
                    />
                    <button
                      type="button"
                      onClick={handleAddAllergen}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newItem.allergens.map((allergen, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                      >
                        {allergen}
                        <button
                          type="button"
                          className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-red-400 hover:bg-red-200 hover:text-red-500 focus:outline-none"
                          onClick={() => handleRemoveAllergen(index)}
                        >
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowAddItemModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 