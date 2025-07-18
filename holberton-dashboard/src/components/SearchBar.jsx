const SearchBar = ({ searchTerm, onSearchChange, theme, onThemeToggle }) => {
  return (
    <div className="flex items-center justify-between mb-8 gap-4">
      {/* Barre de recherche */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <input
          type="text"
          placeholder="Rechercher un service..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
      </div>

      {/* Bouton thème */}
      <button
        onClick={onThemeToggle}
        className="
          p-3 rounded-lg border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
          focus:ring-2 focus:ring-blue-500
        "
        title={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default SearchBar;
