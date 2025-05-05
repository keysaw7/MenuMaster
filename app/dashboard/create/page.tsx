'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateRestaurantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    },
    contact: {
      phone: '',
      email: '',
      website: '',
    },
    settings: {
      primaryColor: '#4f46e5', // Default indigo
      secondaryColor: '#ffffff',
      fontFamily: 'Inter',
      currency: '€',
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const newFormData = { ...prev };
        if (parent === 'address') {
          newFormData.address = { ...prev.address, [child]: value };
        } else if (parent === 'contact') {
          newFormData.contact = { ...prev.contact, [child]: value };
        } else if (parent === 'settings') {
          newFormData.settings = { ...prev.settings, [child]: value };
        }
        return newFormData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/restaurants', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   throw new Error('Erreur lors de la création du restaurant');
      // }

      // Simulons un délai pour l'exemple
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirection vers le dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Une erreur est survenue lors de la création du restaurant');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau restaurant</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="bg-white shadow rounded-md">
          <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Informations générales</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ces informations seront affichées publiquement dans la présentation de votre restaurant.
                </p>
              </div>

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
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                    Type de cuisine *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="cuisine"
                      id="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                      required
                      placeholder="Française, Italienne, Japonaise..."
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Décrivez votre restaurant en quelques phrases"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Adresse</h3>
                <p className="mt-1 text-sm text-gray-500">
                  L'adresse complète de votre restaurant.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                    Rue et numéro *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address.street"
                      id="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                    Ville *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address.city"
                      id="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">
                    Code postal *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address.postalCode"
                      id="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                    Pays *
                  </label>
                  <div className="mt-1">
                    <select
                      id="address.country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Canada">Canada</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Contact</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Les informations de contact de votre restaurant.
                </p>
              </div>

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
                      value={formData.contact.phone}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="contact.email"
                      id="contact.email"
                      value={formData.contact.email}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="contact.website" className="block text-sm font-medium text-gray-700">
                    Site web
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      name="contact.website"
                      id="contact.website"
                      value={formData.contact.website}
                      onChange={handleChange}
                      placeholder="https://"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Apparence</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Personnalisez l'apparence de votre menu.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="settings.primaryColor" className="block text-sm font-medium text-gray-700">
                    Couleur principale
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      name="settings.primaryColor"
                      id="settings.primaryColor"
                      value={formData.settings.primaryColor}
                      onChange={handleChange}
                      className="h-8 w-8 border border-gray-300 rounded-md"
                    />
                    <span className="ml-2 text-sm text-gray-500">{formData.settings.primaryColor}</span>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="settings.currency" className="block text-sm font-medium text-gray-700">
                    Devise
                  </label>
                  <div className="mt-1">
                    <select
                      id="settings.currency"
                      name="settings.currency"
                      value={formData.settings.currency}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="€">Euro (€)</option>
                      <option value="$">Dollar ($)</option>
                      <option value="£">Livre (£)</option>
                      <option value="CHF">Franc Suisse (CHF)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Link
                  href="/dashboard"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
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
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 