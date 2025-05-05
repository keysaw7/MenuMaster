'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Types
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Charger les données utilisateur et restaurant
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          // Si des restaurants sont retournés, prendre le premier comme actif par défaut
          if (data.restaurants && data.restaurants.length > 0) {
            setActiveRestaurant(data.restaurants[0]);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-4">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} MenuMaster. Tous droits réservés.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="/terms" className="text-sm text-gray-500 hover:text-indigo-600">
                Conditions d'utilisation
              </a>
              <a href="/privacy" className="text-sm text-gray-500 hover:text-indigo-600">
                Politique de confidentialité
              </a>
              <a href="/contact" className="text-sm text-gray-500 hover:text-indigo-600">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 