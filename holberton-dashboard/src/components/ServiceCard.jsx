import { useState } from 'react';

const ServiceCard = ({ service, isFavorite, onToggleFavorite, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`
        relative group cursor-pointer transform transition-all duration-200
        ${isHovered ? 'scale-105 shadow-xl' : 'shadow-md'}
        bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700
        hover:border-blue-300 dark:hover:border-blue-600
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Badge favori */}
      <button
        className={`
          absolute top-2 right-2 p-1 rounded-full transition-colors
          ${isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(service.id);
        }}
      >
        {isFavorite ? '⭐' : '☆'}
      </button>

      {/* Bouton suppression pour services personnalisés */}
      {service.custom && (
        <button
          className="absolute top-2 left-2 p-1 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(service.id);
          }}
        >
          ❌
        </button>
      )}

      {/* Icône du service */}
      <div className={`w-16 h-16 ${service.color} rounded-lg flex items-center justify-center text-2xl mb-4 mx-auto`}>
        {service.icon}
      </div>

      {/* Informations du service */}
      <div className="text-center">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
          {service.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {service.description}
        </p>
      </div>

      {/* Indicateur de catégorie */}
      <div className="mt-4 text-center">
        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
          {service.category}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
