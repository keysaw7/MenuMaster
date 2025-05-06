'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface ResponsiveNavigationProps {
  restaurantId?: string;
  restaurantName?: string;
  restaurantLogo?: string;
  userRole?: string;
}

export default function ResponsiveNavigation({ 
  restaurantId, 
  restaurantName = 'Mon Restaurant',
  restaurantLogo = '/images/default-logo.png',
  userRole = 'owner'
}: ResponsiveNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Effet pour gérer le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation principale
  const mainNavigation: NavigationItem[] = [
    {
      name: "Accueil",
      href: "/",
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: "Fonctionnalités",
      href: "/features",
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      name: "Tarifs",
      href: "/pricing",
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: "Contact",
      href: "/contact",
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];
  
  // Navigation du dashboard si un restaurant est sélectionné
  const dashboardNavigation: NavigationItem[] = restaurantId ? [
    {
      name: "Tableau de bord",
      href: `/dashboard`,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: "Gestion du Menu",
      href: `/menu`,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      name: "Menu du jour",
      href: `/daily-menu/new`,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ] : [];
  
  // Boutons d'action selon si l'utilisateur est connecté
  const renderAuthButtons = () => {
    if (restaurantId) {
      return (
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline-block text-sm font-medium text-gray-700">
            {restaurantName}
          </span>
          <Link 
            href="/profile" 
            className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-100 rounded-full"
          >
            <span className="font-medium text-indigo-800">
              {restaurantName ? restaurantName.charAt(0).toUpperCase() : 'R'}
            </span>
          </Link>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-3">
        <Link 
          href="/login" 
          className="px-4 py-2 text-sm font-medium text-indigo-700 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Connexion
        </Link>
        <Link 
          href="/register" 
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Inscription
        </Link>
      </div>
    );
  };
  
  return (
    <>
      {/* Header pour desktop et mobile */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-10 mr-2">
                {restaurantLogo && (
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-semibold">
                      {restaurantName ? restaurantName.charAt(0).toUpperCase() : 'R'}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xl font-bold text-gray-900">MenuMaster</span>
            </Link>
            
            {/* Navigation pour desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              {mainNavigation.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium ${
                    pathname === item.href 
                      ? 'text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {restaurantId && dashboardNavigation.slice(0, 2).map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium ${
                    pathname === item.href 
                      ? 'text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Boutons d'authentification pour desktop */}
            <div className="hidden md:block">
              {renderAuthButtons()}
            </div>
            
            {/* Bouton menu mobile */}
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Menu mobile */}
      <div 
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      <div
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">Menu</div>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <nav className="px-4 py-2">
          <ul className="space-y-2">
            {mainNavigation.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    pathname === item.href 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={`mr-3 ${pathname === item.href ? 'text-indigo-500' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              </li>
            ))}
            
            {restaurantId && (
              <>
                <li className="pt-5 pb-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Gestion Restaurant
                  </div>
                </li>
                
                {dashboardNavigation.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={`flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        pathname === item.href 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={`mr-3 ${pathname === item.href ? 'text-indigo-500' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </>
            )}
            <li>
              <Link
                href="/api/auth/logout"
                className="block py-2 px-4 text-sm text-center text-red-600 hover:bg-gray-100 rounded transition-colors"
              >
                Déconnexion
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          {!restaurantId ? (
            <div className="flex flex-col space-y-2">
              <Link 
                href="/login" 
                className="w-full px-4 py-2 text-center text-sm font-medium text-indigo-700 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                className="w-full px-4 py-2 text-center text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                onClick={() => setIsOpen(false)}
              >
                Inscription
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-100 rounded-full">
                <span className="font-medium text-indigo-800">
                  {restaurantName ? restaurantName.charAt(0).toUpperCase() : 'R'}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{restaurantName}</div>
                <div className="text-xs text-gray-500">{userRole === 'owner' ? 'Propriétaire' : 'Gestionnaire'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Espacement pour le contenu sous le header */}
      <div className={`pt-${scrolled ? '16' : '20'}`}></div>
    </>
  );
} 