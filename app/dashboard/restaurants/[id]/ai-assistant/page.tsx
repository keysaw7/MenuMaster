'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AIAssistantPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);

  // Exemples de suggestions
  const suggestions = [
    "Quels plats proposer par temps pluvieux ?",
    "Comment adapter mon menu pour l'été ?",
    "Suggérer des plats avec des produits de saison (automne)",
    "Créer un menu spécial pour la Saint-Valentin",
    "Comment réduire le gaspillage alimentaire dans mon restaurant ?"
  ];

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simuler l'appel à une API d'IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Réponses fictives pour démonstration
      let response = '';
      
      if (query.toLowerCase().includes('pluvieux')) {
        response = `Par temps pluvieux, je vous suggère de proposer des plats réconfortants et chauds :

1. Entrées :
   - Velouté de potimarron à la cannelle
   - Soupe à l'oignon gratinée
   
2. Plats :
   - Pot-au-feu traditionnel aux légumes de saison
   - Risotto aux champignons des bois
   - Bœuf bourguignon avec purée maison
   
3. Desserts :
   - Crumble aux pommes tiède
   - Fondant au chocolat cœur coulant
   
Ces plats correspondent bien à l'ambiance cosy recherchée par les clients lors des journées pluvieuses.`;
      }
      else if (query.toLowerCase().includes('été')) {
        response = `Pour adapter votre menu à l'été, privilégiez des plats légers, frais et colorés :

1. Entrées :
   - Gaspacho andalou
   - Salade de tomates anciennes et burrata
   - Tartare d'avocat et crevettes
   
2. Plats :
   - Pavé de saumon grillé aux herbes
   - Risotto aux asperges et petits pois
   - Plancha de légumes d'été
   
3. Desserts :
   - Soupe de fraises au basilic
   - Panna cotta aux fruits rouges
   - Salade de fruits frais
   
Pensez à proposer également des boissons rafraîchissantes comme des limonades maison ou des eaux infusées aux fruits.`;
      }
      else if (query.toLowerCase().includes('saison') && query.toLowerCase().includes('automne')) {
        response = `Voici des suggestions de plats avec des produits de saison pour l'automne :

1. Entrées :
   - Velouté de champignons des bois
   - Salade tiède de lentilles aux lardons
   - Tarte fine aux figues et chèvre
   
2. Plats :
   - Filet mignon aux châtaignes
   - Civet de gibier aux airelles
   - Risotto à la courge butternut et sauge
   
3. Desserts :
   - Tarte aux pommes caramélisées
   - Crumble aux poires et noix
   - Clafoutis aux raisins
   
L'automne est riche en saveurs : champignons, courges, gibier, châtaignes, pommes, poires, raisins, figues... Profitez-en pour créer des plats chaleureux et colorés.`;
      }
      else if (query.toLowerCase().includes('saint-valentin')) {
        response = `Pour un menu spécial Saint-Valentin, créez une ambiance romantique avec ces suggestions :

1. Entrées élégantes :
   - Carpaccio de Saint-Jacques aux agrumes
   - Foie gras maison et chutney de figues
   - Velouté de champignons aux truffes
   
2. Plats raffinés :
   - Tournedos Rossini et son jus au porto
   - Homard rôti au beurre d'agrumes
   - Risotto aux asperges et parmesan
   
3. Desserts sensuels :
   - Fondant au chocolat cœur coulant et sa crème anglaise
   - Soufflé aux fruits de la passion
   - Assiette gourmande à partager (macarons, chocolats, fruits rouges)
   
Pensez à proposer une sélection de champagnes et vins adaptés. Une petite attention comme un chocolat en forme de cœur en fin de repas sera très appréciée.`;
      }
      else if (query.toLowerCase().includes('gaspillage')) {
        response = `Voici des conseils pour réduire le gaspillage alimentaire dans votre restaurant :

1. Gestion des stocks :
   - Utilisez la méthode FIFO (First In, First Out)
   - Faites un inventaire régulier et précis
   - Établissez des prévisions basées sur l'historique des ventes
   
2. Menu et portions :
   - Proposez différentes tailles de portions
   - Créez un menu réduit avec des ingrédients communs
   - Pratiquez le "nose-to-tail" et "root-to-leaf" (utilisation complète des produits)
   
3. Conservation et transformation :
   - Utilisez des techniques comme la fermentation, le fumage, la conservation
   - Transformez les surplus en nouveaux plats (ex: pain rassis en croûtons)
   - Optimisez vos méthodes de conservation (sous-vide, congélation adaptée)
   
4. Formation et sensibilisation :
   - Formez votre équipe aux bonnes pratiques
   - Sensibilisez vos clients (proposez des doggy bags)
   - Suivez et analysez votre taux de gaspillage
   
5. Collaborations :
   - Établissez des partenariats avec des associations pour donner les invendus
   - Utilisez des applications comme Too Good To Go

Ces pratiques permettront non seulement de réduire vos déchets mais aussi d'optimiser vos coûts.`;
      }
      else {
        response = `Voici quelques éléments de réponse à votre question "${query}" :

Je vous conseille d'analyser les tendances actuelles dans la restauration et d'adapter votre offre en fonction des attentes de votre clientèle cible. Pensez à mettre en valeur les produits locaux et de saison, qui sont de plus en plus recherchés par les consommateurs.

N'hésitez pas à me poser des questions plus spécifiques sur la cuisine, la gestion de menu ou les tendances actuelles dans la restauration.`;
      }
      
      setResult(response);
      setHistory(prev => [...prev, { question: query, answer: response }]);
      setQuery('');
    } catch (err) {
      setError('Erreur lors de la communication avec l\'assistant IA');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link href={`/dashboard/restaurants/${restaurantId}`} className="text-indigo-600 hover:text-indigo-800 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Assistant IA
              </h1>
              <p className="text-sm text-gray-500">
                Obtenez des conseils et suggestions basés sur l'intelligence artificielle
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panneau latéral */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Comment puis-je vous aider ?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Posez-moi vos questions sur la gestion de menu, les tendances culinaires ou des conseils spécifiques pour votre restaurant.
              </p>
              
              <h3 className="text-md font-medium text-gray-700 mb-2">Suggestions :</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-indigo-50 rounded-md">
                <h3 className="text-md font-medium text-indigo-800 mb-2">Fonctionnalités IA disponibles :</h3>
                <ul className="space-y-2 text-sm text-indigo-700">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Génération de menu du jour
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Suggestions selon la météo
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Conseils culinaires personnalisés
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Analyse des tendances
                  </li>
                </ul>
                <div className="mt-4">
                  <Link
                    href={`/dashboard/restaurants/${restaurantId}/daily-menu`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Aller au menu du jour
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Panneau principal */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-6">
                <form onSubmit={handleQuery} className="flex space-x-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Posez votre question à l'IA..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(loading || !query.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Traitement...
                      </>
                    ) : (
                      'Demander'
                    )}
                  </button>
                </form>
              </div>
              
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
              
              {/* Zone de conversation */}
              <div className="space-y-6">
                {history.map((item, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3 bg-gray-100 px-4 py-2 rounded-lg">
                        <p className="text-sm text-gray-800">{item.question}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3 bg-indigo-50 px-4 py-2 rounded-lg">
                        <div className="text-sm text-gray-800 whitespace-pre-line">{item.answer}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 bg-indigo-50 px-4 py-2 rounded-lg">
                      <div className="flex space-x-2 items-center">
                        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {result && history.length === 0 && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 bg-indigo-50 px-4 py-2 rounded-lg">
                      <div className="text-sm text-gray-800 whitespace-pre-line">{result}</div>
                    </div>
                  </div>
                )}
                
                {history.length === 0 && !result && !loading && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Posez votre première question</h3>
                    <p className="mt-1 text-gray-500">L'assistant IA est prêt à vous aider dans la gestion de votre restaurant.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 