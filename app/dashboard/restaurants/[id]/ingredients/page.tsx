'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Ingredient = {
  id: string;
  name: string;
  category: string;
  isInStock: boolean;
};

export default function IngredientsPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  
  const [restaurant, setRestaurant] = useState<{ name: string, id: string } | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIngredient, setNewIngredient] = useState({ name: '', category: 'Légume' });
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les informations du restaurant
        const restaurantResponse = await fetch(`/api/restaurants/${restaurantId}`);
        if (!restaurantResponse.ok) {
          throw new Error('Impossible de récupérer les informations du restaurant');
        }
        const restaurantData = await restaurantResponse.json();
        setRestaurant(restaurantData);
        
        // Récupérer les ingrédients
        const ingredientsResponse = await fetch(`/api/restaurants/${restaurantId}/ingredients`);
        if (!ingredientsResponse.ok) {
          throw new Error('Impossible de récupérer les ingrédients');
        }
        const ingredientsData = await ingredientsResponse.json();
        setIngredients(ingredientsData.ingredients || []);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  const addIngredient = async () => {
    if (!newIngredient.name.trim()) {
      alert('Veuillez saisir un nom d\'ingrédient');
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newIngredient.name,
          category: newIngredient.category,
          isInStock: true
        }),
      });

      if (!response.ok) {
        throw new Error('Échec de l\'ajout de l\'ingrédient');
      }

      const data = await response.json();
      console.log('Réponse API après ajout d\'ingrédient:', data);
      
      // Vérifier la structure de la réponse et extraire l'ingrédient correctement
      let newIngredientData;
      
      if (data.ingredient && typeof data.ingredient === 'object') {
        // La réponse a la structure attendue { ingredient: {...} }
        newIngredientData = data.ingredient;
      } else if (data && typeof data === 'object' && data.name) {
        // La réponse contient directement l'ingrédient
        newIngredientData = data;
      } else {
        // Créer un objet ingrédient à partir des données soumises
        newIngredientData = {
          id: `temp_${Date.now()}`,
          name: newIngredient.name,
          category: newIngredient.category,
          isInStock: true
        };
        console.warn('Format de réponse inattendu, utilisation des données soumises');
      }
      
      // S'assurer que l'ingrédient a toutes les propriétés nécessaires
      if (!newIngredientData.id) {
        newIngredientData.id = `temp_${Date.now()}`;
      }
      
      setIngredients([...ingredients, newIngredientData]);
      setNewIngredient({ name: '', category: 'Légume' });
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible d\'ajouter l\'ingrédient. Veuillez réessayer.');
    }
  };

  const toggleIngredientStock = async (id: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/ingredients/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isInStock: !currentState }),
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour de l\'ingrédient');
      }

      setIngredients(ingredients.map(ingredient => 
        ingredient.id === id 
          ? { ...ingredient, isInStock: !currentState } 
          : ingredient
      ));
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de mettre à jour l\'ingrédient. Veuillez réessayer.');
    }
  };

  const deleteIngredient = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient?')) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/ingredients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression de l\'ingrédient');
      }

      setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de supprimer l\'ingrédient. Veuillez réessayer.');
    }
  };

  const deleteAllIngredients = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer TOUS les ingrédients? Cette action est irréversible.')) {
      return;
    }

    try {
      setIsBulkDeleting(true);
      
      const response = await fetch(`/api/restaurants/${restaurantId}/ingredients/bulk-delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression des ingrédients');
      }

      const data = await response.json();
      setIngredients([]);
      alert(`${data.count || 'Tous les'} ingrédients ont été supprimés avec succès`);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de supprimer tous les ingrédients. Veuillez réessayer.');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const categories = ['Légume', 'Fruit', 'Viande', 'Poisson', 'Produit laitier', 'Céréale', 'Épice', 'Autre'];
  
  const filteredIngredients = ingredients.filter(ingredient => {
    const nameMatch = ingredient.name.toLowerCase().includes(filter.toLowerCase());
    const categoryMatch = categoryFilter ? ingredient.category === categoryFilter : true;
    return nameMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retourner au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des ingrédients</h1>
          {restaurant && (
            <div>
              <p className="text-gray-600">Restaurant : {restaurant.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {ingredients.length} ingrédient(s) disponible(s)
              </p>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={deleteAllIngredients}
            disabled={isBulkDeleting || ingredients.length === 0}
            className={`inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium ${ingredients.length === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-700 hover:bg-red-50'} bg-white focus:outline-none`}
            title={ingredients.length === 0 ? "Aucun ingrédient à supprimer" : "Supprimer tous les ingrédients"}
          >
            {isBulkDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Suppression...
              </>
            ) : (
              <>
                <svg className={`mr-2 h-4 w-4 ${ingredients.length === 0 ? 'text-gray-400' : 'text-red-700'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer tous les ingrédients
              </>
            )}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {/* Formulaire d'ajout d'ingrédient */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ajouter un ingrédient</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="ingredient-name" className="block text-sm font-medium text-gray-700">
              Nom de l'ingrédient
            </label>
            <input
              type="text"
              id="ingredient-name"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
              placeholder="Ex: Tomate, Poulet, etc."
            />
          </div>
          <div>
            <label htmlFor="ingredient-category" className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              id="ingredient-category"
              value={newIngredient.category}
              onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={addIngredient}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none w-full"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Filtre des ingrédients */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtrer les ingrédients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Rechercher par nom
            </label>
            <input
              type="text"
              id="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
              placeholder="Rechercher un ingrédient..."
            />
          </div>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
              Filtrer par catégorie
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des ingrédients */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Liste des ingrédients</h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredIngredients.length} ingrédient(s) trouvé(s)
          </p>
        </div>
        {filteredIngredients.length > 0 ? (
          <div className="border-t border-gray-200 divide-y divide-gray-200">
            {filteredIngredients.map((ingredient) => (
              <div key={ingredient.id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ingredient.isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ingredient.isInStock ? 'En stock' : 'Rupture de stock'}
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {ingredient.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mt-1">{ingredient.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleIngredientStock(ingredient.id, ingredient.isInStock)}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${
                      ingredient.isInStock ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
                    } focus:outline-none`}
                  >
                    {ingredient.isInStock ? 'Marquer en rupture' : 'Marquer en stock'}
                  </button>
                  <button
                    onClick={() => deleteIngredient(ingredient.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-5 text-center text-gray-500 sm:px-6">
            Aucun ingrédient trouvé. Ajoutez-en un nouveau pour commencer.
          </div>
        )}
      </div>
    </div>
  );
} 