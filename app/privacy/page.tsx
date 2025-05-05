'use client';

import ResponsiveNavigation from '../components/ResponsiveNavigation';

export default function PrivacyPage() {
  return (
    <>
      <ResponsiveNavigation />
      
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Politique de Confidentialité</h1>
              
              <div className="prose prose-indigo max-w-none">
                <p className="mb-4">
                  Dernière mise à jour : {new Date().toLocaleDateString()}
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
                <p>
                  Bienvenue sur MenuMaster. La protection de vos données personnelles est une priorité pour nous. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">2. Informations que nous collectons</h2>
                <p>Nous collectons les types d'informations suivants :</p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    <strong>Informations de compte</strong> : Lorsque vous vous inscrivez, nous collectons votre nom, adresse e-mail, et mot de passe.
                  </li>
                  <li className="mb-2">
                    <strong>Informations sur votre restaurant</strong> : Nom, description, type de cuisine, et autres détails pertinents que vous choisissez de nous fournir.
                  </li>
                  <li className="mb-2">
                    <strong>Données de menu</strong> : Les informations que vous saisissez sur vos menus, plats, prix, et autres détails culinaires.
                  </li>
                  <li className="mb-2">
                    <strong>Données d'utilisation</strong> : Informations sur la façon dont vous utilisez notre service, y compris les journaux d'accès, l'activité de l'utilisateur et les données de performance.
                  </li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">3. Comment nous utilisons vos informations</h2>
                <p>Nous utilisons vos informations pour :</p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">Fournir, maintenir et améliorer nos services</li>
                  <li className="mb-2">Personnaliser votre expérience utilisateur</li>
                  <li className="mb-2">Communiquer avec vous concernant votre compte ou nos services</li>
                  <li className="mb-2">Détecter, prévenir et résoudre les problèmes techniques ou de sécurité</li>
                  <li className="mb-2">Se conformer aux obligations légales applicables</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">4. Partage d'informations</h2>
                <p>
                  Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations dans les circonstances suivantes :
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">Avec des prestataires de services qui nous aident à exploiter notre service</li>
                  <li className="mb-2">Pour se conformer à la loi ou à une procédure judiciaire</li>
                  <li className="mb-2">Pour protéger nos droits, notre propriété ou notre sécurité, ou ceux de nos utilisateurs</li>
                  <li className="mb-2">Dans le cadre d'une fusion, acquisition ou vente d'actifs</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">5. Sécurité des données</h2>
                <p>
                  Nous prenons des mesures raisonnables pour protéger vos informations contre l'accès, l'utilisation, la modification ou la divulgation non autorisés. 
                  Cependant, aucun système de sécurité n'est impénétrable et nous ne pouvons garantir la sécurité absolue de vos informations.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">6. Vos droits</h2>
                <p>Selon votre juridiction, vous pouvez avoir certains droits concernant vos données personnelles, notamment :</p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">Le droit d'accéder à vos données</li>
                  <li className="mb-2">Le droit de rectifier ou de mettre à jour vos données</li>
                  <li className="mb-2">Le droit de demander la suppression de vos données</li>
                  <li className="mb-2">Le droit de restreindre ou de s'opposer au traitement de vos données</li>
                  <li className="mb-2">Le droit à la portabilité des données</li>
                </ul>
                <p>Pour exercer ces droits, veuillez nous contacter à l'adresse indiquée ci-dessous.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">7. Modifications de cette politique</h2>
                <p>
                  Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La version la plus récente sera toujours disponible sur cette page.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">8. Nous contacter</h2>
                <p>
                  Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à privacy@menumaster.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 