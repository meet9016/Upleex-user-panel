import { useState, useEffect } from 'react';

export const useCity = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      // Return city NAME instead of ID for backend filtering
      return sessionStorage.getItem('currentLocation');
    }
    return null;
  });

  useEffect(() => {
    const handleCityChange = () => {
      setSelectedCity(sessionStorage.getItem('currentLocation'));
    };

    window.addEventListener('cityChange', handleCityChange);
    // Keep storage listener for multi-tab sync (though sessionStorage is per-tab)
    window.addEventListener('storage', handleCityChange);
    
    return () => {
      window.removeEventListener('cityChange', handleCityChange);
      window.removeEventListener('storage', handleCityChange);
    };
  }, []);

  return selectedCity;
};
