'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const cuisineTypes = [
  // Cuisines européennes
  'Française', 'Italienne', 'Espagnole', 'Portugaise', 'Grecque', 
  'Méditerranéenne', 'Corse', 'Russe', 
  
  // Cuisines asiatiques
  'Japonaise', 'Chinoise', 'Indienne', 'Thaïlandaise', 'Coréenne',
  'Vietnamienne', 'Indonésienne', 'Libanaise', 'Turque',
  
  // Cuisines africaines et maghrébines
  'Marocaine', 'Algérienne', 'Tunisienne', 'Égyptienne',
  'Sénégalaise', 'Éthiopienne', 'Ivoirienne', 'Camerounaise', 'Nigériane',
  
  // Cuisines américaines
  'Américaine', 'Mexicaine', 'Brésilienne', 'Péruvienne', 'Caribéenne',
  
  // Autres styles
  'Végétarienne', 'Vegan', 'Fusion', 'Autre'
];

export default function NewRestaurantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisineTypes: [] as string[],
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof typeof prev];
        if (parentObj && typeof parentObj === 'object') {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCuisineChange = (cuisine: string) => {
    setFormData(prev => {
      const cuisineList = [...prev.cuisineTypes];
      if (cuisineList.includes(cuisine)) {
        return {
          ...prev,
          cuisineTypes: cuisineList.filter(type => type !== cuisine)
        };
      } else {
        return {
          ...prev,
          cuisineTypes: [...cuisineList, cuisine]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validation: au moins un type de cuisine doit être sélectionné
    if (formData.cuisineTypes.length === 0) {
      setError('Veuillez sélectionner au moins un type de cuisine');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du restaurant');
      }

      const data = await response.json();
      setSuccess(true);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la création du restaurant');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/dashboard" className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Ajouter un nouveau restaurant</h1>
        </div>
        <p className="text-gray-600">
          Les champs marqués d'un * sont obligatoires.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-green-700 mb-2">Restaurant créé avec succès !</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Aller au dashboard
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="bg-white shadow rounded-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du restaurant *
                </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm text-black py-2 px-3"
                placeholder="Nom de votre restaurant"
                  />
              </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm text-black py-2 px-3"
                placeholder="Description de votre restaurant"
                  />
                </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Types de cuisine *
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Cette information est essentielle pour générer des menus du jour authentiques via l'assistant "Ami Chef Cuistot".
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1 border border-indigo-200 p-3 rounded-lg bg-indigo-50">
                  {cuisineTypes.map((cuisine) => (
                    <div key={cuisine} className="flex items-center">
                      <input
                        id={`cuisine-${cuisine}`}
                        name={`cuisine-${cuisine}`}
                        type="checkbox"
                        checked={formData.cuisineTypes.includes(cuisine)}
                        onChange={() => handleCuisineChange(cuisine)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`cuisine-${cuisine}`} className="ml-2 text-sm text-gray-700">
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              {formData.cuisineTypes.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Veuillez sélectionner au moins un type de cuisine.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-white shadow rounded-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                  Rue *
                </label>
                  <input
                    type="text"
                    name="address.street"
                    id="address.street"
                    required
                    value={formData.address.street}
                    onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm text-black py-2 px-3"
                placeholder="Rue et numéro"
                  />
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                  <input
                    type="text"
                    name="address.city"
                    id="address.city"
                    required
                    value={formData.address.city}
                    onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-black py-2 px-3"
                  placeholder="Ville"
                  />
              </div>

              <div>
                <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal *
                </label>
                  <input
                    type="text"
                  name="address.postalCode"
                  id="address.postalCode"
                    required
                  value={formData.address.postalCode}
                    onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-black py-2 px-3"
                  placeholder="Code postal"
                  />
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white shadow rounded-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                  <input
                    type="tel"
                    name="contact.phone"
                    id="contact.phone"
                    required
                    value={formData.contact.phone}
                    onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-black py-2 px-3"
                  placeholder="Téléphone"
                  />
              </div>

              <div>
                <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                  <input
                    type="email"
                    name="contact.email"
                    id="contact.email"
                  required
                    value={formData.contact.email}
                    onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm text-black py-2 px-3"
                  placeholder="Email"
                  />
                </div>
              </div>

            <div>
              <label htmlFor="contact.website" className="block text-sm font-medium text-gray-700 mb-1">
                Site web
                </label>
                  <input
                    type="url"
                    name="contact.website"
                    id="contact.website"
                    value={formData.contact.website}
                    onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm text-black py-2 px-3"
                placeholder="https://www.example.com"
                  />
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Création en cours...' : 'Créer le restaurant'}
          </button>
        </div>
      </form>
    </div>
  );
} 