import { useState, useEffect } from 'react';

export const useCity = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      // Return city NAME instead of ID for backend filtering
      return localStorage.getItem('selectedCityId');
    }
    return null;
  });

  useEffect(() => {
    const handleCityChange = () => {
      setSelectedCity(localStorage.getItem('selectedCityId'));
    };

    window.addEventListener('cityChange', handleCityChange);
    // Keep storage listener for multi-tab sync
    window.addEventListener('storage', handleCityChange);
    
    return () => {
      window.removeEventListener('cityChange', handleCityChange);
      window.removeEventListener('storage', handleCityChange);
    };
  }, []);

  return selectedCity;
};
