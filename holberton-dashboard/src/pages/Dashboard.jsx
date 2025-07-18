import { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import { categories } from '../data/services';

const Dashboard = () => {
  const {
    filteredServices,
    favorites,
    toggleFavorite,
    theme,
    setTheme,
    searchTerm,
    setSearchTerm,
    removeService
  } = useDashboard();

  // Appliquer le thème au document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Grouper les services par catégorie
  const servicesByCategory = categories.map(category => ({
    ...category,
    services: filteredServices.filter(service => service.category === category.id)
  })).filter(category => category.services.length > 0);

  // Services favoris
  const favoriteServices = filteredServices.filter(service => 
    favorites.includes(service.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎓 Dashboard Holberton
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Tous vos outils d'apprentissage en un seul endroit
          </p>
        </div>

        {/* Barre de recherche */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          theme={theme}
          onThemeToggle={toggleTheme}
        />

        {/* Section Favoris */}
        {favoriteServices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              ⭐ Favoris
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onRemove={removeService}
                />
              ))}
            </div>
          </section>
        )}

        {/* Services par catégorie */}
        {servicesByCategory.map(category => (
          <section key={category.id} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isFavorite={favorites.includes(service.id)}
                  onToggleFavorite={toggleFavorite}
                  onRemove={removeService}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Aucun résultat */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun service trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Essayez avec d'autres mots-clés
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Made with ❤️ for Holberton Students
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
