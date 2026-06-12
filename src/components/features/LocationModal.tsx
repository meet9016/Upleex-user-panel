import React, { useState, useRef } from 'react';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService } from '@/services/searchService';
import { Modal } from '../ui/Modal';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: any) => void;
  isCompulsory?: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  isCompulsory = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCities = async (query: string) => {
    if (!query.trim()) {
      setCities([]);
      setShowResults(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await searchService.getCities(1, query);
      setCities(res.items || []);
      setShowResults(true);
    } catch (error) {
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchCities(value);
    }, 300);
  };

  const handleCitySelect = (city: any) => {
    onSelectCity(city);
    onClose();
    setSearchTerm('');
    setCities([]);
    setShowResults(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isCompulsory ? () => {} : onClose}
      hideHeader
      hideCloseButton={isCompulsory}
      className="max-w-md overflow-visible rounded-2xl"
      noPadding
    >
      <div className="p-6 relative">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 pr-6">
          Choose your location
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mb-6">
          Select a delivery location to see availability
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <div className="flex items-center border border-gray-200 rounded-xl p-1 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 bg-white">
            <input
              type="text"
              placeholder="Enter city"
              className="flex-1 bg-transparent outline-none px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button
              className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg active:scale-95 flex items-center justify-center"
              onClick={() => cities.length > 0 && handleCitySelect(cities[0])}
            >
              <ArrowRight size={18} strokeWidth={3} />
            </button>
          </div>

          {/* Results Dropdown */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-52 overflow-y-auto"
              >
                {isLoading ? (
                  <div className="p-4 flex justify-center">
                    <Loader2 className="animate-spin text-orange-500" size={20} />
                  </div>
                ) : cities.length > 0 ? (
                  cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-center gap-2 border-b border-gray-50 last:border-0"
                    >
                      <MapPin size={16} className="text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {city.city_name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {city.state_name}, India
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-xs">
                    No cities found for "{searchTerm}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-3 overflow-hidden rounded-sm shadow-sm">
              <img
                src="https://flagcdn.com/in.svg"
                alt="India"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gray-600 text-sm font-medium">India</span>
          </div>
          {/* <button className="text-orange-500 font-semibold hover:underline underline-offset-4 decoration-2">
            Change
          </button> */}
        </div>
      </div>
    </Modal>
  );
};
