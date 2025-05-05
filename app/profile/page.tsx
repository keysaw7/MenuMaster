'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResponsiveNavigation from '../components/ResponsiveNavigation';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Restaurant = {
  id: string;
  name: string;
  description: string;
  role: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setRestaurants(data.restaurants || []);
          setFormData({
            name: data.user.name,
            email: data.user.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        } else {
          // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
          router.push('/login');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        setMessage({
          type: 'error',
          content: 'Impossible de charger vos informations. Veuillez réessayer.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });

    // Validation des mots de passe si l'utilisateur tente de le changer
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({
          type: 'error',
          content: 'Les nouveaux mots de passe ne correspondent pas.'
        });
        return;
      }
      
      if (!formData.currentPassword) {
        setMessage({
          type: 'error',
          content: 'Veuillez entrer votre mot de passe actuel pour confirmer les modifications.'
        });
        return;
      }
    }

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(prev => prev ? { ...prev, name: formData.name, email: formData.email } : null);
        setMessage({
          type: 'success',
          content: 'Profil mis à jour avec succès'
        });
        setIsEditing(false);
        // Réinitialiser les champs de mot de passe
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setMessage({
          type: 'error',
          content: data.message || 'Une erreur est survenue lors de la mise à jour'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setMessage({
        type: 'error',
        content: 'Erreur de connexion, veuillez réessayer'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <ResponsiveNavigation
        restaurantId={restaurants.length > 0 ? restaurants[0].id : undefined}
        restaurantName={restaurants.length > 0 ? restaurants[0].name : undefined}
        userRole={user?.role}
      />
      
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  {isEditing ? 'Annuler' : 'Modifier'}
                </button>
              </div>
              
              {message.content && (
                <div className={`mb-6 p-4 rounded-md ${
                  message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  {message.content}
                </div>
              )}
              
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Changer de mot de passe</h3>
                      
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div className="mt-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div className="mt-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{user?.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{user?.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {user?.role === 'owner' ? 'Propriétaire' : 'Gestionnaire'}
                    </p>
                  </div>
                  
                  {restaurants.length > 0 && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Mes restaurants</h3>
                      
                      <ul className="divide-y divide-gray-200">
                        {restaurants.map((restaurant) => (
                          <li key={restaurant.id} className="py-4">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="text-base font-medium text-gray-900">{restaurant.name}</h4>
                                <p className="mt-1 text-sm text-gray-600">{restaurant.description}</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {restaurant.role === 'owner' ? 'Propriétaire' : 'Gestionnaire'}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 