import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService } from '@/services/searchService';
import { Modal } from '../ui/Modal';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: any) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
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
      console.error('Error fetching cities:', error);
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
      onClose={onClose}
      hideHeader
      className="max-w-xl overflow-visible rounded-[2.5rem]"
      noPadding
    >
      <div className="p-10 relative">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 pr-8">
          Choose your location
        </h2>
        
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          Select a delivery location to see product availability and delivery options
        </p>

        <div className="relative mb-10">
          <div className="flex items-center border border-gray-200 rounded-2xl p-1.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all bg-white ">
            <input
              type="text"
              placeholder="Enter city"
              className="flex-1 bg-transparent border-none outline-none px-5 py-3.5 text-gray-700 placeholder:text-gray-400 text-lg"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button 
              className="bg-blue-400 hover:bg-blue-500 text-white p-3.5 rounded-xl transition-all  active:scale-95 flex items-center justify-center"
              onClick={() => cities.length > 0 && handleCitySelect(cities[0])}
            >
              <ArrowRight size={24} strokeWidth={3} />
            </button>
          </div>

          {/* Results Dropdown */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto"
              >
                {isLoading ? (
                  <div className="p-4 flex justify-center">
                    <Loader2 className="animate-spin text-orange-500" size={24} />
                  </div>
                ) : cities.length > 0 ? (
                  cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-6 py-4 hover:bg-orange-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                    >
                      <MapPin size={18} className="text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-800">{city.city_name}</div>
                        <div className="text-xs text-gray-400">{city.state_name}, India</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No cities found for "{searchTerm}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-gray-100 pt-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm">
               <img 
                src="https://flagcdn.com/in.svg" 
                alt="India" 
                className="w-full h-full object-cover"
               />
            </div>
            <span className="text-gray-600 font-medium">India</span>
          </div>
          {/* <button className="text-orange-500 font-semibold hover:underline underline-offset-4 decoration-2">
            Change
          </button> */}
        </div>
      </div>
    </Modal>
  );
};
