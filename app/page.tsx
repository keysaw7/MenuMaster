'use client';

import Link from 'next/link';
import Image from 'next/image';
import ResponsiveNavigation from './components/ResponsiveNavigation';

export default function HomePage() {
  return (
    <>
      <ResponsiveNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                La plateforme ultime pour gérer votre<br className="hidden md:block" />
                <span className="text-indigo-600">carte de restaurant</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Créez, personnalisez et gérez votre menu avec notre solution tout-en-un, 
                enrichie par notre <span className="font-semibold">Ami</span> intelligent pour des suggestions contextuelles.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="px-8 py-3.5 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 text-base md:text-lg font-medium"
                >
                  Commencer gratuitement
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300 text-base md:text-lg font-medium"
                >
                  Se connecter
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/dashboard-preview.jpg"
                  alt="Aperçu du dashboard"
                  width={720}
                  height={480}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Fonctionnalités principales
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Notre plateforme offre tout ce dont vous avez besoin pour créer, gérer et optimiser votre carte de restaurant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu personnalisable</h3>
              <p className="text-gray-600">
                Créez votre carte avec des catégories personnalisées, des images attrayantes et des descriptions alléchantes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recommandations intelligentes</h3>
              <p className="text-gray-600">
                Générez des menus du jour basés sur la météo et vos ingrédients disponibles grâce à notre Ami intelligent.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Responsive & QR Code</h3>
              <p className="text-gray-600">
                Votre menu s'adapte à tous les appareils et peut être consulté via un QR code placé sur vos tables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à transformer votre expérience client ?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Rejoignez des centaines de restaurants qui utilisent déjà MenuMaster pour moderniser leur carte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3.5 bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300 text-lg font-medium"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-transparent border border-white text-white rounded-lg hover:bg-indigo-700 transition duration-300 text-lg font-medium"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4">MenuMaster</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                La solution complète pour la gestion de vos menus. Simplifiez votre processus de création et offrez une expérience moderne à vos clients.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-300 hover:text-white transition duration-300">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="text-gray-300 hover:text-white transition duration-300">Tarifs</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition duration-300">Contact</Link></li>
                <li><Link href="/register" className="text-gray-300 hover:text-white transition duration-300">Inscription</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition duration-300">Confidentialité</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition duration-300">Conditions d'utilisation</Link></li>
                <li><Link href="/accessibility" className="text-gray-300 hover:text-white transition duration-300">Accessibilité</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} MenuMaster. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
