import { useState, useEffect } from 'react';
import { defaultServices } from '../data/services';

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
};

// Hook personnalisé pour gérer les services du dashboard
export const useDashboard = () => {
  const [services, setServices] = useLocalStorage('holberton-dashboard-services', defaultServices);
  const [favorites, setFavorites] = useLocalStorage('holberton-dashboard-favorites', []);
  const [theme, setTheme] = useLocalStorage('holberton-dashboard-theme', 'light');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les services selon la recherche
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ajouter un service personnalisé
  const addCustomService = (newService) => {
    const service = {
      ...newService,
      id: `custom-${Date.now()}`,
      custom: true
    };
    setServices([...services, service]);
  };

  // Supprimer un service
  const removeService = (serviceId) => {
    setServices(services.filter(s => s.id !== serviceId));
    setFavorites(favorites.filter(id => id !== serviceId));
  };

  // Gérer les favoris
  const toggleFavorite = (serviceId) => {
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter(id => id !== serviceId));
    } else {
      setFavorites([...favorites, serviceId]);
    }
  };

  return {
    services,
    setServices,
    filteredServices,
    favorites,
    toggleFavorite,
    theme,
    setTheme,
    searchTerm,
    setSearchTerm,
    addCustomService,
    removeService
  };
};
