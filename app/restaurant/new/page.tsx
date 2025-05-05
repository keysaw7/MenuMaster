'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const cuisineTypes = [
  'Française', 'Italienne', 'Japonaise', 'Chinoise', 'Indienne', 
  'Mexicaine', 'Thaïlandaise', 'Méditerranéenne', 'Américaine', 
  'Libanaise', 'Végétarienne', 'Vegan', 'Fusion', 'Corse', 'Autre'
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
    },
    hours: {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false }
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

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day as keyof typeof prev.hours],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
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
      
      // Rediriger vers la page du restaurant après 2 secondes
      setTimeout(() => {
        router.push(`/restaurant/${data.id}`);
      }, 2000);
      
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

  const days = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Ajouter un nouveau restaurant</h1>
        <p className="mt-1 text-sm text-gray-600">
          Remplissez ce formulaire pour créer un nouveau restaurant sur la plateforme.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
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
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Restaurant créé avec succès ! Redirection en cours...</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Informations générales</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Détails de base du restaurant</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom du restaurant *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brève description de votre restaurant, spécialités, ambiance...
                </p>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Type de cuisine</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {cuisineTypes.map((cuisine) => (
                    <div key={cuisine} className="flex items-center">
                      <input
                        id={`cuisine-${cuisine}`}
                        name={`cuisine-${cuisine}`}
                        type="checkbox"
                        checked={formData.cuisineTypes.includes(cuisine)}
                        onChange={() => handleCuisineChange(cuisine)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`cuisine-${cuisine}`} className="ml-2 text-sm text-gray-700">
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Adresse</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Localisation du restaurant</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                  Rue *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address.street"
                    id="address.street"
                    required
                    value={formData.address.street}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">
                  Code postal *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address.postalCode"
                    id="address.postalCode"
                    required
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                  Ville *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address.city"
                    id="address.city"
                    required
                    value={formData.address.city}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                  Pays *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address.country"
                    id="address.country"
                    required
                    value={formData.address.country}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Contact</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Coordonnées du restaurant</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">
                  Téléphone *
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="contact.phone"
                    id="contact.phone"
                    required
                    value={formData.contact.phone}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="contact.email"
                    id="contact.email"
                    value={formData.contact.email}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="contact.website" className="block text-sm font-medium text-gray-700">
                  Site Web
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="contact.website"
                    id="contact.website"
                    value={formData.contact.website}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://www.exemple.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horaires */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Horaires d'ouverture</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Indiquez vos horaires d'ouverture pour chaque jour</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-7">
              {Object.entries(days).map(([dayKey, dayLabel]) => (
                <div key={dayKey} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-700">{dayLabel}</span>
                    <div className="flex items-center">
                      <input
                        id={`${dayKey}-closed`}
                        name={`${dayKey}-closed`}
                        type="checkbox"
                        checked={formData.hours[dayKey as keyof typeof formData.hours].closed}
                        onChange={(e) => handleHoursChange(dayKey, 'closed', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`${dayKey}-closed`} className="ml-2 text-xs text-gray-700">
                        Fermé
                      </label>
                    </div>
                  </div>

                  {!formData.hours[dayKey as keyof typeof formData.hours].closed && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor={`${dayKey}-open`} className="sr-only">
                          Heure d'ouverture
                        </label>
                        <input
                          type="time"
                          id={`${dayKey}-open`}
                          name={`${dayKey}-open`}
                          value={formData.hours[dayKey as keyof typeof formData.hours].open}
                          onChange={(e) => handleHoursChange(dayKey, 'open', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor={`${dayKey}-close`} className="sr-only">
                          Heure de fermeture
                        </label>
                        <input
                          type="time"
                          id={`${dayKey}-close`}
                          name={`${dayKey}-close`}
                          value={formData.hours[dayKey as keyof typeof formData.hours].close}
                          onChange={(e) => handleHoursChange(dayKey, 'close', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href="/dashboard"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading || success}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              (loading || success) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              </>
            ) : 'Créer le restaurant'}
          </button>
        </div>
      </form>
    </div>
  );
} 