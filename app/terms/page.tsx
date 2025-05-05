'use client';

import ResponsiveNavigation from '../components/ResponsiveNavigation';

export default function TermsPage() {
  return (
    <>
      <ResponsiveNavigation />
      
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Conditions d'Utilisation</h1>
              
              <div className="prose prose-indigo max-w-none">
                <p className="mb-4">
                  Dernière mise à jour : {new Date().toLocaleDateString()}
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptation des conditions</h2>
                <p>
                  En accédant à ou en utilisant MenuMaster, vous acceptez d'être lié par ces Conditions d'Utilisation. 
                  Si vous n'acceptez pas ces conditions, vous ne devez pas accéder à ou utiliser ce service.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">2. Description du service</h2>
                <p>
                  MenuMaster est une plateforme en ligne permettant aux restaurateurs de créer, gérer et partager leurs menus. 
                  Nous offrons des outils pour personnaliser les menus, générer des suggestions de plats et faciliter la gestion quotidienne des cartes.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">3. Comptes utilisateurs</h2>
                <p>
                  Pour utiliser certaines fonctionnalités du service, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de votre compte 
                  et mot de passe, ainsi que de toutes les activités qui se produisent sous votre compte.
                </p>
                <p className="mt-2">
                  Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte ou de toute autre violation de sécurité.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">4. Contenu utilisateur</h2>
                <p>
                  Vous conservez tous les droits sur le contenu que vous soumettez, publiez ou affichez sur MenuMaster. En soumettant du contenu, 
                  vous nous accordez une licence mondiale, non exclusive, libre de redevance pour utiliser, reproduire, traiter, adapter, et publier ce contenu 
                  afin de fournir et promouvoir le service.
                </p>
                <p className="mt-2">
                  Vous êtes seul responsable du contenu que vous publiez et des conséquences de son partage. Vous ne devez pas télécharger, publier ou partager 
                  du contenu qui enfreint les droits d'autrui, qui est illégal, obscène, diffamatoire, menaçant, ou abusif.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">5. Propriété intellectuelle</h2>
                <p>
                  Le service et son contenu original, ses fonctionnalités et sa fonctionnalité sont et resteront la propriété exclusive de MenuMaster et de ses concédants. 
                  Le service est protégé par le droit d'auteur, les marques de commerce et d'autres lois en France et à l'étranger.
                </p>
                <p className="mt-2">
                  Nos marques et notre habillage commercial ne peuvent pas être utilisés en relation avec un produit ou un service sans notre consentement écrit préalable.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">6. Limitations de responsabilité</h2>
                <p>
                  Dans toute la mesure permise par la loi applicable, MenuMaster ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, 
                  ou de toute perte de profits ou de revenus, qu'ils soient encourus directement ou indirectement, ou de toute perte de données, d'utilisation, de clientèle ou 
                  d'autres pertes intangibles, résultant de votre accès à ou de votre utilisation de (ou de votre incapacité à accéder à ou à utiliser) le service.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">7. Modifications des conditions</h2>
                <p>
                  Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces conditions à tout moment. 
                  Si une révision est importante, nous fournirons un préavis de 30 jours avant que les nouvelles conditions prennent effet. 
                  Ce qui constitue un changement important sera déterminé à notre seule discrétion.
                </p>
                <p className="mt-2">
                  En continuant à accéder à ou à utiliser notre service après que ces révisions deviennent effectives, vous acceptez d'être lié par les conditions révisées.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">8. Nous contacter</h2>
                <p>
                  Si vous avez des questions concernant ces Conditions d'Utilisation, veuillez nous contacter à terms@menumaster.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 