'use client';

import { useState, useEffect } from 'react';
import { Dish } from '../types/dish';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    vegetarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  }>({
    vegetarian: false,
    glutenFree: false,
    dairyFree: false,
  });

  useEffect(() => {
    const mockDishes: Dish[] = [
      // À Partager
      {
        id: 'share1',
        name: 'Assiette de Charcuterie',
        description: "Une sélection raffinée des meilleures charcuteries corses traditionnelles. Notre plateau met à l&apos;honneur le savoir-faire des producteurs locaux avec une délicate association de Coppa affinée, Lonzu aux herbes de maquis, Prisuttu séché en montagne et saucisson artisanal.",
        price: 18,
        category: 'entrée',
        ingredients: ['Coppa', 'Lonzu', 'Prisuttu', 'Saucisson'],
        allergens: [],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin rouge Patrimonio', 'Vin rouge Figari'],
        imageUrl: '/images/dishes/entrees/assiette-charcuterie.webp'
      },
      {
        id: 'share2',
        name: 'Planche de Fromages corses affinés',
        description: "Un voyage gustatif à travers les meilleurs fromages de l'île. Affinés avec soin, nos fromages corses sont accompagnés d'une délicate confiture de figue maison qui sublime leurs saveurs uniques.",
        price: 14,
        category: 'entrée',
        ingredients: ['Fromages corses affinés', 'Confiture de figue'],
        allergens: ['lait'],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin blanc Vermentinu', 'Muscat du Cap Corse'],
        imageUrl: '/images/dishes/entrees/planche-fromage.webp'
      },
      // Entrées
      {
        id: 'starter1',
        name: 'Beignets de la Minnà',
        description: "Nos beignets de courgettes, légers et croustillants, sont sublimés par une sauce yaourt maison parfumée au miel de Corse et à la menthe fraîche. Une entrée végétarienne qui marie délicatement les saveurs du jardin aux notes sucrées-salées.",
        price: 9,
        category: 'entrée',
        ingredients: ['Courgettes', 'Yaourt', 'Miel', 'Menthe'],
        allergens: ['lait'],
        dietaryRestrictions: ['végétarien'],
        recommendedPairings: ['Vin blanc Clos Venturi', 'Vin rosé de Provence'],
        imageUrl: '/images/dishes/entrees/beignets-courgettes.webp'
      },
      {
        id: 'starter2',
        name: 'Capuccino champignons & Figatellu',
        description: "Une création originale qui réinvente la tradition : un velouté onctueux de champignons, couronné d'une émulsion aérienne au figatellu et parsemé de champignons frits. Une touche de cacao en poudre vient parfaire cette entrée aux saveurs intenses.",
        price: 11,
        category: 'entrée',
        ingredients: ['Champignons', 'Figatellu', 'Cacao', 'Crème'],
        allergens: ['lait'],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin rouge Niellucciu', 'Vin rouge Sciaccarellu'],
        imageUrl: '/images/dishes/entrees/cappuccino.webp'
      },
      {
        id: 'starter3',
        name: 'Bruschetta',
        description: "Sur une base de focaccia croustillante, nous disposons un délicat caviar de courgettes à la menthe, recouvert d'une fine chiffonnade de prisuttu et de copeaux de tomme corse. Un mariage parfait entre les saveurs méditerranéennes et montagnardes.",
        price: 10,
        category: 'entrée',
        ingredients: ['Focaccia', 'Courgettes', 'Menthe', 'Prisuttu', 'Tomme corse'],
        allergens: ['gluten', 'lait'],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin blanc Vermentinu', 'Vin rosé Corse'],
        imageUrl: '/images/dishes/entrees/bruschetta.webp'
      },
      {
        id: 'starter4',
        name: 'Arancini',
        description: "Notre interprétation corse des arancini siciliens : des boulettes de risotto aux tomates séchées et à la tomme corse, panées et frites jusqu'à obtenir une croûte dorée. Servies avec une mayonnaise maison au pesto rosso qui apporte une touche de fraîcheur.",
        price: 9.5,
        category: 'entrée',
        ingredients: ['Tomates séchées', 'Tomme corse', 'Mayonnaise', 'Pesto rosso'],
        allergens: ['gluten', 'lait', 'œuf'],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin blanc Calvi', 'Vin rosé Sartène'],
        imageUrl: '/images/dishes/entrees/arancini.webp'
      },
      {
        id: 'starter5',
        name: 'Raviole',
        description: "Une raviole généreuse garnie de brousse corse et de prisuttu, nappée d'une délicate crème à la tomme. La piperade de poivrons apporte couleur et fraîcheur à ce plat qui revisite la tradition insulaire.",
        price: 11,
        category: 'entrée',
        ingredients: ['Brousse', 'Prisuttu', 'Crème', 'Tome', 'Poivrons'],
        allergens: ['gluten', 'lait'],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin blanc Patrimonio', 'Vin rouge léger Ajaccio'],
        imageUrl: '/images/dishes/entrees/raviole.webp'
      },
      {
        id: 'starter6',
        name: 'Burratina',
        description: "Une burratina crémeuse accompagnée de tomates cerises confites qui apportent une touche de douceur. Le tout est relevé par un crumble parfumé à la nepita, cette menthe sauvage corse qui apporte une fraîcheur unique au plat.",
        price: 13,
        category: 'entrée',
        ingredients: ['Burrata', 'Tomates cerises', 'Nepita'],
        allergens: ['lait', 'gluten'],
        dietaryRestrictions: ['végétarien'],
        recommendedPairings: ['Vin blanc Vermentinu', 'Vin rosé Figari'],
        imageUrl: '/images/dishes/entrees/burratina.webp'
      },
      // Plats
      {
        id: 'main1',
        name: 'Risotto au vermentinu',
        description: "Un risotto crémeux cuisiné au vermentinu, le célèbre vin blanc corse, enrichi de fromage frais et de tomates cerises. Couronné de tomme de brebis corse et d'un crumble à la marjolaine, le tout est accompagné d'un aïoli maison qui apporte une touche provençale.",
        price: 18,
        category: 'plat',
        ingredients: ['Riz', 'Vermentinu', 'Fromage frais', 'Tomates cerises', 'Tomme de brebis', 'Marjolaine', 'Aïoli'],
        allergens: ['lait', 'œuf'],
        dietaryRestrictions: ['végétarien'],
        recommendedPairings: ['Vin blanc Vermentinu', 'Vin blanc Patrimonio'],
        imageUrl: '/images/dishes/plats/risotto.webp'
      },
      {
        id: 'main2',
        name: 'Cannelloni',
        description: "Nos cannelloni faits maison sont garnis d'un mélange délicat de fromage frais corse et d'épinards, le tout nappé d'une sauce tomate parfumée aux herbes du maquis et généreusement gratinés à la tomme corse.",
        price: 18.5,
        category: 'plat',
        ingredients: ['Pâtes', 'Fromage frais corse', 'Épinards', 'Sauce tomate', 'Tomme corse'],
        allergens: ['gluten', 'lait'],
        dietaryRestrictions: ['végétarien'],
        recommendedPairings: ['Vin rouge Patrimonio', 'Vin rouge Ajaccio'],
        imageUrl: '/images/dishes/plats/cannelloni.webp'
      },
      {
        id: 'main3',
        name: 'Filet de bar rôti',
        description: "Un filet de bar de ligne rôti à la perfection, accompagné d'une mousse légère au fromage frais et d'une sauce vierge aux herbes fraîches. Servi sur un lit de polenta crémeuse qui apporte réconfort et gourmandise.",
        price: 19.5,
        category: 'plat',
        ingredients: ['Bar', 'Fromage frais', 'Sauce vierge', 'Polenta'],
        allergens: ['poisson', 'lait'],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin blanc Vermentinu', 'Vin blanc Clos Culombu'],
        imageUrl: '/images/dishes/plats/filet-de-bar.webp'
      },
      {
        id: 'main4',
        name: 'Côte de cochon label rouge 500g',
        description: "Une côte de cochon label rouge généreuse, grillée à souhait, servie avec une mousseline de pomme de terre infusée à la panzetta. La crème parfumée à la charcuterie corse traditionnelle apporte une touche d'authenticité à ce plat réconfortant.",
        price: 27,
        category: 'plat',
        ingredients: ['Côte de cochon', 'Pomme de terre', 'Crème', 'Panzetta'],
        allergens: ['lait'],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin rouge Patrimonio', 'Vin rouge Ajaccio'],
        imageUrl: '/images/dishes/plats/cochon.webp'
      },
      {
        id: 'main5',
        name: 'Cœur de rumsteck snacké',
        description: "Un cœur de rumsteck tendre et juteux, snacké à la demande, accompagné de pommes paysannes dorées au four et d'une salade de sucrine fraîche. Le tout est sublimé par une sauce béarnaise maison parfumée à la marjolaine et des copeaux de tomme corse.",
        price: 27,
        category: 'plat',
        ingredients: ['Rumsteck', 'Pommes de terre', 'Sucrine', 'Tomme corse', 'Béarnaise', 'Marjolaine'],
        allergens: ['lait', 'œuf'],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin rouge Figari', 'Vin rouge Patrimonio'],
        imageUrl: '/images/dishes/plats/rumsteak.webp'
      },
      {
        id: 'main6',
        name: 'Noix de Veau',
        description: "Une noix de veau fondante marinée aux agrumes corses et aux olives, accompagnée d'une réduction onctueuse de tomates cerises confites. L'aubergine rôtie apporte une touche méditerranéenne à ce plat qui célèbre les saveurs de l'île.",
        price: 25,
        category: 'plat',
        ingredients: ['Veau', 'Agrumes', 'Olives', 'Tomates cerises', 'Aubergine'],
        allergens: [],
        dietaryRestrictions: [],
        recommendedPairings: ['Vin rouge Niellucciu', 'Vin rouge Sciaccarellu'],
        imageUrl: '/images/dishes/plats/noix-de-veau.webp'
      },
      // Desserts
      {
        id: 'dessert1',
        name: 'Mousse au chocolat & nuciola',
        description: "Une mousse au chocolat aérienne enrichie de nuciola, la pâte de noisette corse, parsemée d'éclats de fondant aux noisettes et de morceaux de canistrelli. Un dessert qui marie la richesse du chocolat aux saveurs des noisettes torréfiées.",
        price: 9,
        category: 'dessert',
        ingredients: ['Chocolat', 'Nuciola', 'Noisettes', 'Canistrelli'],
        allergens: ['lait', 'fruits à coque', 'gluten'],
        dietaryRestrictions: ['végétarien'],
        recommendedPairings: ['Muscat du Cap Corse', 'Café Corsu'],
        imageUrl: '/images/dishes/desserts/mousse-chocolat.webp'
      },
      {
        id: 'dessert2',
        name: 'Tiramisu à la pistache',
        description: "Notre version du tiramisu revisite le classique italien avec une crème à la pistache et des canistrelli émiettés en remplacement des biscuits traditionnels. Une création unique qui rend hommage aux saveurs méditerranéennes.",
        price: 10,
        category: 'dessert',
        ingredients: ['Mascarpone', 'Pistache', 'Canistrelli'],
        allergens: ['lait', 'œuf', 'fruits à coque', 'gluten'],
        dietaryRestrictions: ['végétarien'],
        recommendedPairings: ['Muscat du Cap Corse', 'Limoncello maison'],
        imageUrl: '/images/dishes/desserts/tiramisu-pistache.webp'
      },
      {
        id: 'dessert3',
        name: 'Fiadone',
        description: "Ce gâteau traditionnel corse au brocciu est revisité dans notre cuisine : une crème montée au fromage frais, accompagnée de noisettes caramélisées et d'éclats de nougatine. Un dessert qui allie tradition et modernité.",
        price: 9,
        category: 'dessert',
        ingredients: ['Fromage frais', 'Noisettes', 'Nougatine'],
        allergens: ['lait', 'œuf', 'fruits à coque'],
        dietaryRestrictions: ['végétarien'],
        recommendedPairings: ['Muscat du Cap Corse', 'Vin de paille'],
        imageUrl: '/images/dishes/desserts/fiadone.webp'
      },
      {
        id: 'dessert4',
        name: 'Moelleux chocolat',
        description: "Un moelleux au chocolat noir intense au cœur coulant de nuciola. La chaleur du gâteau libère le cœur fondant de noisettes corses, créant un moment de pure gourmandise.",
        price: 9,
        category: 'dessert',
        ingredients: ['Chocolat', 'Nuciola'],
        allergens: ['lait', 'œuf', 'gluten', 'fruits à coque'],
        dietaryRestrictions: ['végétarien'],
        recommendedPairings: ['Café Corsu', 'Muscat du Cap Corse'],
        imageUrl: '/images/dishes/desserts/moelleux-choco-caramel.webp'
      },
      {
        id: 'dessert5',
        name: 'Café gustosu',
        description: "Une expérience café gourmand qui met à l'honneur les douceurs corses : mini canistrelli, petit fiadone, truffe au chocolat et nuciola, et autres surprises du chef, accompagnés d'un café corsé de votre choix.",
        price: 9,
        category: 'dessert',
        ingredients: ['Café', 'Mignardises variées'],
        allergens: ['lait', 'œuf', 'gluten', 'fruits à coque'],
        dietaryRestrictions: ['végétarien'],
        recommendedPairings: ['Café Corsu', 'Grappa'],
        imageUrl: '/images/dishes/desserts/café-gustosu.webp'
      }
    ];
    setDishes(mockDishes);
    setLoading(false);
  }, []);

  // Fonction pour filtrer les plats selon les critères
  const filteredDishes = dishes.filter((dish) => {
    // Filtrer par catégorie
    if (selectedCategory !== 'tous' && dish.category !== selectedCategory) {
      return false;
    }
    
    // Filtrer par recherche
    if (
      searchQuery && 
      !dish.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !dish.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Filtrer par restrictions alimentaires
    if (activeFilters.vegetarian && !dish.dietaryRestrictions.includes('végétarien')) {
      return false;
    }
    
    if (activeFilters.glutenFree && dish.allergens.includes('gluten')) {
      return false;
    }
    
    if (activeFilters.dairyFree && dish.allergens.includes('lait')) {
      return false;
    }
    
    return true;
  });

  const categories = [
    { id: 'tous', name: 'Tous les plats' },
    { id: 'entrée', name: 'Entrées' },
    { id: 'plat', name: 'Plats' },
    { id: 'dessert', name: 'Desserts' },
  ];

  const handleMoreInfo = (dish: Dish) => {
    setSelectedDish(dish);
    // Remonter en haut pour les mobiles
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDetails = () => {
    setSelectedDish(null);
  };

  const toggleFilter = (filter: 'vegetarian' | 'glutenFree' | 'dairyFree') => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Affichage des détails d'un plat
  const renderDishDetails = () => {
    if (!selectedDish) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
          <button 
            onClick={handleCloseDetails}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              {selectedDish.imageUrl ? (
                <Image
                  src={selectedDish.imageUrl}
                  alt={selectedDish.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Image non disponible</span>
                </div>
              )}
            </div>
            
            <div className="p-6 md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900">{selectedDish.name}</h2>
              <p className="mt-2 text-gray-600">{selectedDish.description}</p>
              
              <div className="mt-4">
                <span className="font-semibold text-xl text-indigo-600">{selectedDish.price} €</span>
              </div>
              
              {selectedDish.ingredients.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900">Ingrédients</h3>
                  <ul className="mt-2 text-gray-600">
                    {selectedDish.ingredients.map((ingredient, index) => (
                      <li key={index} className="inline-block mr-2 mb-2 bg-gray-100 px-2 py-1 rounded-full text-sm">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedDish.allergens && selectedDish.allergens.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900">Allergènes</h3>
                  <ul className="mt-2">
                    {selectedDish.allergens.map((allergen, index) => (
                      <li key={index} className="inline-block mr-2 mb-2 bg-red-100 px-2 py-1 rounded-full text-sm text-red-800">
                        {allergen}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedDish.dietaryRestrictions && selectedDish.dietaryRestrictions.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900">Régimes alimentaires</h3>
                  <ul className="mt-2">
                    {selectedDish.dietaryRestrictions.map((restriction, index) => (
                      <li key={index} className="inline-block mr-2 mb-2 bg-green-100 px-2 py-1 rounded-full text-sm text-green-800">
                        {restriction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedDish.recommendedPairings && selectedDish.recommendedPairings.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900">Accords suggérés</h3>
                  <ul className="mt-2 text-gray-600">
                    {selectedDish.recommendedPairings.map((pairing, index) => (
                      <li key={index} className="inline-block mr-2 mb-2 bg-purple-100 px-2 py-1 rounded-full text-sm text-purple-800">
                        {pairing}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Notre Carte</h1>
        
        {/* Barre de recherche et filtres */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Rechercher un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleFilter('vegetarian')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeFilters.vegetarian
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Végétarien
              </button>
              
              <button
                onClick={() => toggleFilter('glutenFree')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeFilters.glutenFree
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sans gluten
              </button>
              
              <button
                onClick={() => toggleFilter('dairyFree')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeFilters.dairyFree
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sans lactose
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation par catégories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 md:justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm md:text-base font-medium rounded-md whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Liste des plats */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900">Aucun plat ne correspond à vos critères</h3>
            <p className="mt-2 text-sm text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
            <button
              onClick={() => {
                setSelectedCategory('tous');
                setSearchQuery('');
                setActiveFilters({ vegetarian: false, glutenFree: false, dairyFree: false });
              }}
              className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-md hover:bg-indigo-50"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  {dish.imageUrl ? (
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">Image non disponible</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
                    <span className="font-medium text-indigo-600">{dish.price} €</span>
                  </div>
                  
                  <p className="mt-2 text-gray-600 line-clamp-3">{dish.description}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {dish.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800"
                      >
                        {allergen}
                      </span>
                    ))}
                    
                    {dish.dietaryRestrictions.map((restriction, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800"
                      >
                        {restriction}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleMoreInfo(dish)}
                    className="mt-4 w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de détails du plat */}
      {selectedDish && renderDishDetails()}
    </>
  );
} 