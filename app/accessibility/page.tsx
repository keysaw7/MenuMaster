'use client';

import ResponsiveNavigation from '../components/ResponsiveNavigation';

export default function AccessibilityPage() {
  return (
    <>
      <ResponsiveNavigation />
      
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Accessibilité</h1>
              
              <div className="prose prose-indigo max-w-none">
                <p className="mb-4">
                  Dernière mise à jour : {new Date().toLocaleDateString()}
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Notre engagement envers l'accessibilité</h2>
                <p>
                  Chez MenuMaster, nous nous engageons à rendre notre service accessible à tous les utilisateurs, 
                  quelles que soient leurs capacités ou leurs limitations. Nous nous efforçons de respecter les 
                  normes d'accessibilité reconnues et d'améliorer continuellement l'expérience utilisateur pour tous.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Conformité aux normes</h2>
                <p>
                  Nous travaillons activement pour nous conformer aux Règles pour l'Accessibilité des Contenus Web (WCAG) 2.1, 
                  niveau AA. Ces directives couvrent un large éventail de recommandations visant à rendre le contenu web plus accessible.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Fonctionnalités d'accessibilité</h2>
                <p>Notre plateforme inclut les fonctionnalités d'accessibilité suivantes :</p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    <strong>Navigation au clavier</strong> : Toutes les fonctionnalités sont accessibles via le clavier, sans nécessiter de souris.
                  </li>
                  <li className="mb-2">
                    <strong>Texte alternatif</strong> : Toutes les images disposent d'un texte alternatif approprié pour les lecteurs d'écran.
                  </li>
                  <li className="mb-2">
                    <strong>Contraste de couleur</strong> : Notre interface utilise des contrastes de couleur appropriés pour faciliter la lecture.
                  </li>
                  <li className="mb-2">
                    <strong>Mise à l'échelle du texte</strong> : L'interface prend en charge l'agrandissement du texte sans perte de fonctionnalité.
                  </li>
                  <li className="mb-2">
                    <strong>Conception responsive</strong> : Notre service s'adapte à différentes tailles d'écran et orientations.
                  </li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Compatibilité avec les technologies d'assistance</h2>
                <p>
                  MenuMaster est conçu pour être compatible avec diverses technologies d'assistance, notamment :
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">Lecteurs d'écran (comme NVDA, JAWS, VoiceOver)</li>
                  <li className="mb-2">Logiciels de reconnaissance vocale</li>
                  <li className="mb-2">Logiciels d'agrandissement d'écran</li>
                  <li className="mb-2">Outils de navigation au clavier</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Limitations connues</h2>
                <p>
                  Bien que nous nous efforcions de rendre notre service aussi accessible que possible, 
                  certaines parties de notre plateforme peuvent présenter des limitations d'accessibilité. 
                  Nous travaillons activement à identifier et résoudre ces problèmes.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Feedback et assistance</h2>
                <p>
                  Nous accueillons favorablement vos commentaires sur l'accessibilité de MenuMaster. 
                  Si vous rencontrez des obstacles d'accessibilité, veuillez nous contacter à accessibility@menumaster.com.
                </p>
                <p className="mt-2">
                  Nous ferons de notre mieux pour résoudre les problèmes d'accessibilité et fournir l'information dans un format alternatif si nécessaire.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Plan d'amélioration continue</h2>
                <p>
                  Notre équipe travaille constamment à améliorer l'accessibilité de notre service. 
                  Nous menons régulièrement des audits d'accessibilité et mettons en œuvre des améliorations 
                  sur la base de ces évaluations et des retours de nos utilisateurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 