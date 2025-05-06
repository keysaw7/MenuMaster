'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  allergens?: string[];
  available: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuCardProps {
  id: string;
  name: string;
  description?: string;
  categories: MenuCategory[];
  restaurantId: string;
  isActive: boolean;
  onToggleActive?: (id: string, active: boolean) => void;
}

export default function ResponsiveMenuCard({
  id,
  name,
  description,
  categories,
  restaurantId,
  isActive,
  onToggleActive
}: MenuCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Fonction pour basculer l'état d'expansion d'une catégorie
  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };
  
  // Fonction pour gérer le changement d'état actif/inactif du menu
  const handleToggleActive = () => {
    if (onToggleActive) {
      onToggleActive(id, !isActive);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 transition-all duration-300 ${
      isActive ? 'border-l-green-500' : 'border-l-gray-300'
    }`}>
      {/* En-tête de la carte */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {name}
            {isActive && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Actif
              </span>
            )}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none"
          >
            {isExpanded ? 'Réduire' : 'Voir le menu'}
            <svg 
              className={`ml-1.5 h-4 w-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="relative">
            <button 
              onClick={handleToggleActive}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                isActive 
                  ? 'text-red-700 bg-red-50 hover:bg-red-100'
                  : 'text-green-700 bg-green-50 hover:bg-green-100'
              } focus:outline-none`}
            >
              {isActive ? 'Désactiver' : 'Activer'}
            </button>
          </div>
          
          <Link 
            href={`/menu`}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
          >
            Modifier
            <svg 
              className="ml-1.5 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Contenu du menu (conditionnel) */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 md:p-6 space-y-6">
          {categories.length === 0 ? (
            <p className="text-center text-gray-500 my-8">Aucune catégorie dans ce menu</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="bg-gray-50 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-4 py-3 flex justify-between items-center text-left font-medium text-gray-900 focus:outline-none"
                >
                  {category.name}
                  <svg 
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      expandedCategory === category.id ? 'transform rotate-180' : ''
                    }`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedCategory === category.id && (
                  <div className="px-4 pb-3">
                    <div className="divide-y divide-gray-200">
                      {category.items.length === 0 ? (
                        <p className="py-3 text-sm text-gray-500">Aucun plat dans cette catégorie</p>
                      ) : (
                        category.items.map((item) => (
                          <div 
                            key={item.id} 
                            className={`py-3 ${!item.available ? 'opacity-60' : ''}`}
                          >
                            <div className="flex justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                                  {item.name}
                                  {!item.available && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      Indisponible
                                    </span>
                                  )}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                {item.allergens && item.allergens.length > 0 && (
                                  <div className="mt-1 flex flex-wrap">
                                    {item.allergens.map((allergen) => (
                                      <span 
                                        key={allergen} 
                                        className="mr-1 mb-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800"
                                      >
                                        {allergen}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="pl-3 flex items-center">
                                <span className="font-medium text-gray-900">{item.price.toFixed(2)} €</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 