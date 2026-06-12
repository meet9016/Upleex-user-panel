'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  MapPin,
  ChevronDown,
  ChevronRight,
  Smartphone,
  ShoppingCart,
  LogOut,
  User,
  Package,
  Heart,
  Settings,
  FileText,
  Briefcase,
  LayoutGrid,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { DownloadAppPopup } from '../features/DownloadAppPopup';
import { LocationModal } from '../features/LocationModal';
import { Button } from '@/components/ui/Button';
import { categoryService, Category } from '@/services/categoryService';
import { serviceService, ServiceCategory } from '@/services/serviceService';
import { useCartRedux } from '@/redux/useCartRedux';
import { useWishlistRedux } from '@/redux/useWishlistRedux';
import { useAuthRedux } from '@/redux/useAuthRedux';
// import { useNotifications } from '@/context/NotificationContext';
import { searchService } from '@/services/searchService';
import { authService } from '@/services/authService';
import NotificationDropdown from '@/components/layout/NotificationDropdown';
import { createSlug } from '@/utils/helper';
const placeholders = ["TV", "Medical", "Kurta", "Furniture", "Electronics"]

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Select City');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const { count: cartCount, refreshCart } = useCartRedux();
  const { count: wishlistCount } = useWishlistRedux();
  const { user, logout } = useAuthRedux();
  // const { unreadCount, notifications, markAllAsRead, markAsRead, isOpen, setIsOpen } = useNotifications();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Fix hydration: only render client-specific counts after mount
  // useEffect(() => { setMounted(true); }, []);


  const prevUserRef = useRef(user);

  // Sync city with localStorage on mount and user change
  useEffect(() => {
    const isLoginEvent = !prevUserRef.current && user;
    prevUserRef.current = user;

    const userId = user?.id || user?._id || user?.email || 'guest';
    const cityIdKey = `selectedCityId_${userId}`;
    const cityNameKey = `currentLocation_${userId}`;

    // If user just logged in and does not have a city from backend, 
    // force popup immediately and ignore any global cached city
    if (isLoginEvent && user && !user.city_id) {
      localStorage.removeItem(cityIdKey);
      localStorage.removeItem(cityNameKey);
      localStorage.removeItem('selectedCityId');
      localStorage.removeItem('currentLocation');
      setSelectedCityId(null);
      setCurrentLocation('Select City');
      setIsLocationModalOpen(true);
      return;
    }

    let savedCityId = localStorage.getItem(cityIdKey) || localStorage.getItem('selectedCityId');
    let savedCityName = localStorage.getItem(cityNameKey) || localStorage.getItem('currentLocation');

    if (savedCityId && savedCityName) {
      setSelectedCityId(savedCityId);
      setCurrentLocation(savedCityName);
      setIsLocationModalOpen(false);
      // Ensure user-specific key is populated
      localStorage.setItem(cityIdKey, savedCityId);
      localStorage.setItem(cityNameKey, savedCityName);
    } else {
      // If no city stored, wait for auto-detection or show modal
      const timer = setTimeout(() => {
        if (!localStorage.getItem(cityIdKey)) {
          setIsLocationModalOpen(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Update suggestions when city changes if searchTerm exists
  useEffect(() => {
    if (searchTerm.trim().length >= 2 && showSuggestions) {
      fetchSuggestions(searchTerm.trim());
    }
  }, [selectedCityId]);
  const [cityPage, setCityPage] = useState(1);
  const [cityHasMore, setCityHasMore] = useState(true);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [hasLoadedInitialCities, setHasLoadedInitialCities] = useState(false);
  const cityListRef = useRef<HTMLDivElement>(null);
  const cityScrollLockRef = useRef(false);
  const currentCityQueryRef = useRef<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionTimeoutRef = useRef<number | null>(null);
  const citySearchTimeoutRef = useRef<number | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  // Handle cart click - refresh cart data
  const handleCartClick = async () => {
    if (user) {
      await refreshCart();
    }
  };

  useEffect(() => {
    if (searchTerm) return; // typing ho raha ho to stop

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [searchTerm]);

  useEffect(() => {
    // Email is now available from Redux user state
    if (user?.email) {
      setEmail(user.email);
    } else {
      setEmail(null);
    }
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await categoryService.getCategories(selectedCityId);
      setCategories(data);
    };
    const fetchServiceCategories = async () => {
      const data = await serviceService.getServiceCategories(selectedCityId);
      setServiceCategories(data);
    };

    fetchCategories();
    fetchServiceCategories();
  }, [selectedCityId, currentLocation]);



  useEffect(() => {
    const handleStorageChange = () => {
      // Storage change handling - Redux will handle state updates
    };

    window.addEventListener('storage', handleStorageChange);

    // Auto-detect user's city
    const detectUserCity = async () => {
      // If we already have a city stored globally, don't auto-detect
      if (localStorage.getItem('selectedCityId')) return;

      try {
        // Use ip-api.com for more city-level accuracy
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();

        // Use the city name from ip-api.com
        let detectedCity = data.city || '';

        if (detectedCity) {
          const cityRes = await searchService.getCities(1, detectedCity);
          if (cityRes.items && cityRes.items.length > 0) {
            // Find the best match:
            // 1. Exact match for the detected city name
            // 2. Pick the item with the shortest name (likely the main city, e.g. "Surat" instead of "Suratgarh")
            const exactMatch = cityRes.items.find(c => c.city_name.toLowerCase() === detectedCity.toLowerCase());

            // If multiple results, prefer the one with the shortest name
            const sortedItems = [...cityRes.items].sort((a, b) => a.city_name.length - b.city_name.length);
            const city = exactMatch || sortedItems[0];

            setCurrentLocation(city.city_name);
            setSelectedCityId(String(city.id));
            localStorage.setItem('selectedCityId', String(city.id));
            localStorage.setItem('currentLocation', city.city_name);
            setIsLocationModalOpen(false); // Close the modal if auto-detected
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('cityChange'));
          }
        }
      } catch (error) {
        console.error('Error detecting city:', error);
      }
    };

    detectUserCity();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (pathname === '/search') {
      const query = searchParams?.get('search') || '';
      setSearchTerm(query);
    } else {
      setSearchTerm('');
    }
    setSuggestions([]);
    setShowSuggestions(false);

  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node) &&
        suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsCityDropdownOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const loadCities = async (page = 1, append = false, searchText?: string) => {
    if (isCityLoading || (append && !cityHasMore)) return;

    try {
      setIsCityLoading(true);
      const query = searchText !== undefined ? searchText : citySearchTerm;
      currentCityQueryRef.current = query;

      const res = await searchService.getCities(page, query);
      const data = res.items || [];

      setCities(prev => {
        if (append) {
          const existingIds = new Set(prev.map(c => c.id));
          const newCities = data.filter(c => !existingIds.has(c.id));
          return [...prev, ...newCities];
        }
        return data;
      });

      setCityPage(page);
      setCityHasMore(page < res.totalPages);

      if (searchText !== undefined) {
        setCitySearchTerm(searchText);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      if (!append) {
        setCities([]);
      }
      setCityHasMore(false);
    } finally {
      setIsCityLoading(false);
      cityScrollLockRef.current = false;
    }
  };

  const handleCitySelect = async (city: any) => {
    const cityId = String(city.id);
    const userId = user?.id || user?._id || user?.email || 'guest';
    const cityIdKey = `selectedCityId_${userId}`;
    const cityNameKey = `currentLocation_${userId}`;

    setSelectedCityId(cityId);
    setCurrentLocation(city.city_name);
    localStorage.setItem(cityIdKey, cityId);
    localStorage.setItem(cityNameKey, city.city_name);
    localStorage.setItem('selectedCityId', cityId);
    localStorage.setItem('currentLocation', city.city_name);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cityChange'));
    setIsCityDropdownOpen(false);
    setIsLocationModalOpen(false); // Close modal when a city is selected manually

    // Sync with backend if user is logged in
    if (user && (user._id || user.id)) {
      try {
        await authService.updateProfile({ city_id: cityId, city_name: city.city_name });
      } catch (err) {
        console.error('Failed to sync city to profile:', err);
      }
    }

    // If we are on search page, update the city param
    if (pathname === '/search') {
      const params = new URLSearchParams(searchParams?.toString());
      params.set('city', cityId);
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleClearCity = () => {
    const userId = user?.id || user?._id || user?.email || 'guest';
    const cityIdKey = `selectedCityId_${userId}`;
    const cityNameKey = `currentLocation_${userId}`;

    setSelectedCityId(null);
    setCurrentLocation('Select City');
    localStorage.removeItem(cityIdKey);
    localStorage.removeItem(cityNameKey);
    localStorage.removeItem('selectedCityId');
    localStorage.removeItem('currentLocation');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cityChange'));
    setCitySearchTerm('');
    setCities([]);
    setHasLoadedInitialCities(false);
    setCityPage(1);
    setCityHasMore(true);

    // If we are on search page, remove the city param
    if (pathname === '/search') {
      const params = new URLSearchParams(searchParams?.toString());
      params.delete('city');
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleCityToggle = () => {
    const nextOpen = !isCityDropdownOpen;
    setIsCityDropdownOpen(nextOpen);
    if (nextOpen) {
      if (!hasLoadedInitialCities || cities.length === 0) {
        loadCities(1, false, citySearchTerm);
        setHasLoadedInitialCities(true);
      }
    }
  };

  const handleCityScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    const threshold = 50;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;

    if (
      isNearBottom &&
      cityHasMore &&
      !isCityLoading &&
      !cityScrollLockRef.current &&
      currentCityQueryRef.current === citySearchTerm
    ) {
      cityScrollLockRef.current = true;
      loadCities(cityPage + 1, true, citySearchTerm);
    }
  };

  const handleCitySearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCitySearchTerm(value);

    if (citySearchTimeoutRef.current) {
      window.clearTimeout(citySearchTimeoutRef.current);
    }

    citySearchTimeoutRef.current = window.setTimeout(() => {
      const trimmedValue = value.trim();
      // Only call API if value is empty (to reset) or at least 3 characters
      if (trimmedValue.length === 0 || trimmedValue.length >= 3) {
        setCityPage(1);
        setCityHasMore(true);
        loadCities(1, false, value);
      }
    }, 300);
  };

  const handleCitySearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = event.currentTarget.value.trim();
      if (value.length === 0 || value.length >= 3) {
        if (citySearchTimeoutRef.current) {
          window.clearTimeout(citySearchTimeoutRef.current);
        }
        setCityPage(1);
        setCityHasMore(true);
        loadCities(1, false, event.currentTarget.value);
      }
    }
  };

  const handleCitySearchButtonClick = () => {
    const value = citySearchTerm.trim();
    if (value.length === 0 || value.length >= 3) {
      if (citySearchTimeoutRef.current) {
        window.clearTimeout(citySearchTimeoutRef.current);
      }
      setCityPage(1);
      setCityHasMore(true);
      loadCities(1, false, citySearchTerm);
    }
  };

  const fetchSuggestions = async (query: string) => {
    try {
      setIsSuggestionLoading(true);
      const data = await searchService.getProductSuggestions(query, selectedCityId);
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(true);
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setActiveSuggestionIndex(-1);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      if (suggestionTimeoutRef.current) {
        window.clearTimeout(suggestionTimeoutRef.current);
      }
      return;
    }

    setShowSuggestions(true);

    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
    }

    suggestionTimeoutRef.current = window.setTimeout(() => {
      fetchSuggestions(value.trim());
    }, 300);
  };

  const handleSuggestionClick = (item: any) => {
    setSearchTerm(item.product_name);
    setShowSuggestions(false);

    const query = item.product_name.trim();
    if (!query && !selectedCityId) return;

    const params = new URLSearchParams();
    if (query) {
      params.set('search', query);
    }
    if (selectedCityId) {
      params.set('city', selectedCityId);
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    const query = searchTerm.trim();
    if (!query && !selectedCityId) {
      return;
    }
    const params = new URLSearchParams();
    if (query) {
      params.set('search', query);
    }
    if (selectedCityId) {
      params.set('city', selectedCityId);
    }
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    setEmail(null);
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    router.push('/auth/login');
  };

  // Hide Navbar on Partner Auth pages
  if (pathname === '/partner/login' || pathname === '/partner/signup') {
    return null;
  }

  // Partner Page Navbar
  if (pathname === '/partner') {
    return (
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Image
                src="/image/upleex-logo-dark.jpg"
                alt="Upleex Logo"
                width={150}
                height={40}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#how-it-works" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">
                How it works
              </Link>
              <Link href="#benefits" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">
                Benefits
              </Link>
              <Link href="#categories" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">
                Categories
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  const vendorPanelUrl = process.env.NEXT_PUBLIC_VENDOR_PANEL_URL;
                  window.location.href = `${vendorPanelUrl}`;
                }}
                className="px-6 border border-gray-300 text-slate-700 font-semibold hover:bg-transparent hover:border-blue-600 hover:text-blue-600 cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0 active:outline-none"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push('/partner/signup')}
                className="px-6 shadow-md hover:shadow-lg cursor-pointer"
              >
                Start Renting
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-blue-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu for Partner Page */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 absolute w-full shadow-lg z-50">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <Link href="#how-it-works" className="block text-slate-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>How it works</Link>
              <Link href="#benefits" className="block text-slate-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Benefits</Link>
              <Link href="#categories" className="block text-slate-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Categories</Link>
              <div className="pt-4 flex flex-col gap-3">
                <a
                  href={`${process.env.NEXT_PUBLIC_VENDOR_PANEL_URL}`}
                  className="block w-full text-center py-3 border border-gray-300 rounded-lg text-slate-700 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
                <Link
                  href="/partner/signup"
                  className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Renting
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-2 lg:gap-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Image
              src="/image/upleex-logo-dark.jpg"
              alt="Upleex Logo"
              width={150}
              height={40}
              priority
            />
          </Link>

          <div className="hidden lg:flex flex-1 max-w-3xl overflow-visible">
            <div
              ref={searchWrapperRef}
              className="flex w-full border border-gray-300 hover:border-upleex-blue transition-colors group focus-within:ring-1 focus-within:ring-upleex-blue focus-within:border-upleex-blue relative"
            >
              <div
                ref={cityDropdownRef}
                className="relative flex items-stretch bg-white border-r border-gray-300 min-w-[170px]"
              >
                <button
                  type="button"
                  onClick={handleCityToggle}
                  className="flex items-center gap-2 px-2 cursor-pointer transition-colors w-full"
                >
                  <div className="flex items-center justify-between flex-1  transition-all duration-300 border-gray-100 text-slate-700">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-upleex-purple" />
                      <span className="truncate">
                        {currentLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedCityId && (
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClearCity();
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </div>
                      )}
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                  </div>
                </button>
                {isCityDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 z-40 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Search city"
                          className="flex-1 px-2 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-upleex-purple"
                          value={citySearchTerm}
                          onChange={handleCitySearchChange}
                          onKeyDown={handleCitySearchKeyDown}
                        />
                        <button
                          type="button"
                          className="px-2 py-2 text-xs bg-upleex-purple text-white rounded-lg hover:bg-upleex-blue cursor-pointer"
                          onClick={handleCitySearchButtonClick}
                        >
                          <Search size={14} />
                        </button>
                      </div>
                    </div>
                    <div
                      className="max-h-64 overflow-y-auto"
                      ref={cityListRef}
                      onScroll={handleCityScroll}
                      style={{ maxHeight: '16rem' }} // Ensure fixed height for scrolling
                    >
                      {cities.length > 0 ? (
                        <>
                          {cities.map((city, index) => (
                            <button
                              key={`${city.id}-${index}`}
                              type="button"
                              onClick={() => handleCitySelect(city)}
                              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${selectedCityId === String(city.id)
                                ? 'bg-purple-50 text-upleex-purple'
                                : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900 cursor-pointer'
                                }`}
                            >
                              {city.city_name}
                            </button>
                          ))}

                          {/* Show loading indicator at bottom */}
                          {isCityLoading && (
                            <div className="px-4 py-3 text-sm text-slate-500 text-center border-t border-gray-100">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-upleex-purple border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading more cities...</span>
                              </div>
                            </div>
                          )}

                          {/* Show "No more cities" message when reached end */}
                          {!isCityLoading && !cityHasMore && cities.length > 0 && (
                            <div className="px-4 py-3 text-sm text-slate-400 text-center border-t border-gray-100">
                              No more cities to load
                            </div>
                          )}
                        </>
                      ) : (
                        !isCityLoading && citySearchTerm.trim() !== '' && (
                          <div className="px-4 py-4 text-sm text-slate-500 text-center">
                            No cities found for "{citySearchTerm}"
                          </div>
                        )
                      )}

                      {isCityLoading && cities.length === 0 && (
                        <div className="px-4 py-4 text-sm text-slate-500 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-upleex-purple border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading cities...</span>
                          </div>
                        </div>
                      )}

                      {!isCityLoading && cities.length === 0 && citySearchTerm.trim() === '' && (
                        <div className="px-4 py-4 text-sm text-slate-500 text-center">
                          Type to search cities
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 relative flex items-center bg-white">
                <input
                  type="text"
                  placeholder={`Search for ${placeholders[index]}`}
                  className="w-full h-full px-4 py-2 text-sm text-gray-700 outline-none placeholder-gray-400"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      if (showSuggestions && suggestions.length > 0) {
                        setActiveSuggestionIndex(prev =>
                          prev < suggestions.length - 1 ? prev + 1 : prev
                        );
                      }
                    } else if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      if (showSuggestions && suggestions.length > 0) {
                        setActiveSuggestionIndex(prev => prev > -1 ? prev - 1 : -1);
                      }
                    } else if (event.key === 'Enter') {
                      event.preventDefault();
                      if (showSuggestions && activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
                        handleSuggestionClick(suggestions[activeSuggestionIndex]);
                      } else {
                        handleSearchSubmit();
                      }
                    }
                  }}
                  onFocus={() => {
                    if (searchTerm.trim().length >= 2) {
                      setShowSuggestions(true);
                    }
                  }}
                />
                <button
                  type="button"
                  className="p-3 text-gray-400 hover:text-upleex-blue transition-colors cursor-pointer"
                  onClick={handleSearchSubmit}
                >
                  <Search size={20} />
                </button>

                {/* Suggestion Dropdown - Now with its own ref */}
                {(showSuggestions) && (
                  <div
                    ref={suggestionRef}
                    className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-40"
                  >
                    <div className="max-h-64 overflow-y-auto">
                      {isSuggestionLoading ? (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                          Loading...
                        </div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((item, index) => (
                          <button
                            key={item.id || `suggest-${index}`}
                            type="button"
                            onClick={() => handleSuggestionClick(item)}
                            className={`w-full text-left px-3 py-2 text-sm text-gray-700 cursor-pointer ${index === activeSuggestionIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
                              }`}
                          >
                            {item.product_name}
                          </button>
                        ))
                      ) : (
                        searchTerm.trim().length >= 2 && (
                          <div className="px-3 py-4 text-sm text-gray-500 text-center">
                            No products found for "{searchTerm}"
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section Actions */}
          <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-700">

            <button
              onClick={() => setIsDownloadPopupOpen(true)}
              className="flex items-center gap-2 hover:text-upleex-blue transition-colors group cursor-pointer"
            >
              <Smartphone size={18} className="text-gray-400 group-hover:text-upleex-blue" />
              <span>Download App</span>
            </button>


            <div className="h-4 w-px bg-gray-300"></div>

            <Link
              href="/membership"
              className="hover:text-upleex-blue transition-colors cursor-pointer"
            >
              Plan
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>

            <Link href="/partner" className="hover:text-upleex-blue transition-colors cursor-pointer">
              Partner With Us
            </Link>

            {/* <div className="h-4 w-px bg-gray-300"></div>

            <Link
              href="/services-list"
              className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-bold whitespace-nowrap
            ${pathname === '/services-list'
                  ? 'bg-upleex-purple text-white shadow-lg shadow-purple-200'
                  : 'bg-purple-50 text-upleex-purple hover:bg-upleex-purple hover:text-white border border-purple-100 hover:border-upleex-purple shadow-sm hover:shadow-md'
                }`}
            >
              <Briefcase
                size={18}
                className={`transition-colors duration-300 ${pathname === '/services-list'
                  ? 'text-white'
                  : 'text-upleex-purple group-hover:text-white'
                  }`}
              />
              <span>Services</span>
            </Link> */}

            <div className="h-4 w-px bg-gray-300"></div>
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 hover:text-upleex-blue transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user?.full_name?.charAt(0) || email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Profile Dropdown Menu - Fixed */}
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden z-50"
                  >
                    {/* Header */}
                    <div className="px-6 py-5 bg-gradient-to-br  from-gray-50/80 via-white to-gray-50/40 border-b border-gray-100/80">
                      <div className="flex items-center gap-4">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="relative"
                        >
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-2 ring-purple-300/40 ring-offset-2 ring-offset-white">
                            {user?.full_name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                        </motion.div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-lg leading-tight">
                            {user?.name || ""}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <motion.div
                      className="py-2"
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.07 } }
                      }}
                    >
                      {[
                        { icon: User, label: "My Profile", href: "/profile" },
                        { icon: Heart, label: "Wishlist", href: "/wishlist" },
                      ].map((item, i) => (
                        <motion.button
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0 }
                          }}
                          whileHover={{ x: 4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="group flex cursor-pointer items-center gap-3.5 w-full px-6 py-3.5 text-left text-gray-700 hover:bg-gradient-to-r hover:from-purple-50/70 hover:to-indigo-50/40 transition-all duration-200"
                          onClick={() => {
                            setIsProfileMenuOpen(false);   // ← FIXED: Close dropdown
                            if (item.href) {
                              router.push(item.href);
                            }
                          }}
                        >
                          <item.icon size={18} className="text-gray-500 group-hover:text-purple-600 transition-colors" />
                          <span className="font-medium flex-1">{item.label}</span>
                          <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </motion.button>
                      ))}

                      <div className="h-px bg-gray-100 my-2 mx-6" />

                      <motion.button
                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsProfileMenuOpen(false);   // ← Also close on logout
                          handleLogout();
                        }}
                        className="group flex items-center gap-3.5 w-full px-6 py-3.5 text-left text-red-600 hover:bg-red-50/80 transition-all duration-200"
                      >
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-semibold flex-1">Logout</span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => router.push('/auth/login')}
                className="px-4 py-2 cursor-pointer"
              >
                Login / Sign Up
              </Button>
            )}

            <div className="h-4 w-px bg-gray-300"></div>

            {/* Notification Bell - only when logged in */}
            {user && <NotificationDropdown />}

            {user && <div className="h-4 w-px bg-gray-300"></div>}
              {user && 
            <Link
              href="/cart"
              className="relative group cursor-pointer"
              onClick={handleCartClick}
            >
              <ShoppingCart size={24} className="text-slate-700 group-hover:text-upleex-blue transition-colors" />
              <span className="absolute -top-2 -right-2 bg-upleex-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount || 0}
              </span>
            </Link>
              }
                {user && 
            <Link href="/wishlist" className="relative group cursor-pointer">
              <Heart size={24} className="text-slate-700 group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
                }
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* City Selector */}
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1 text-slate-700 hover:text-upleex-blue transition-colors px-2 py-1 rounded-md bg-gray-50 border border-gray-100 max-w-[90px]"
            >
              <MapPin size={14} className="text-upleex-purple shrink-0" />
              <span className="text-xs truncate font-medium">{currentLocation}</span>
            </button>

            {/* <Link href="/wishlist" className="relative cursor-pointer p-1">
              <Heart size={22} className="text-slate-700" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative cursor-pointer p-1"
              onClick={handleCartClick}
            >
              <ShoppingCart size={22} className="text-slate-700" />
              <span className="absolute top-0 right-0 bg-upleex-blue text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount || 0}
              </span>
            </Link> */}
            {user && <NotificationDropdown />}

            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-700 hover:text-upleex-blue focus:outline-none cursor-pointer bg-gray-50 border border-gray-100"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile City Dropdown - Separate from Menu */}
        {isCityDropdownOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white z-[60] shadow-xl border-b border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search city"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-upleex-purple"
                    value={citySearchTerm}
                    onChange={handleCitySearchChange}
                    onKeyDown={handleCitySearchKeyDown}
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {selectedCityId && (
                  <button
                    onClick={handleClearCity}
                    className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div
                className="max-h-[60vh] overflow-y-auto space-y-1 scrollbar-hide"
                onScroll={handleCityScroll}
              >
                {cities.map((city, index) => (
                  <button
                    key={`${city.id}-${index}`}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedCityId === String(city.id)
                      ? 'bg-purple-50 text-upleex-purple ring-1 ring-purple-100'
                      : 'text-slate-600 hover:bg-gray-50 active:scale-[0.98]'
                      }`}
                  >
                    {city.city_name}
                  </button>
                ))}
                {isCityLoading && (
                  <div className="py-4 flex justify-center">
                    <div className="w-5 h-5 border-2 border-upleex-purple border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search Bar - Visible below Navbar on mobile */}
        <div className="lg:hidden px-4 pb-3 pt-1">
          <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-1 focus-within:ring-upleex-blue focus-within:border-upleex-blue transition-all">
            <Search size={18} className="ml-3 text-gray-400" />
            <input
              type="text"
              placeholder={`Search for ${placeholders[index]}`}
              className="flex-1 h-11 px-3 text-sm bg-transparent outline-none text-slate-700"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="p-2 text-gray-400">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar - Secondary Navigation with Dropdowns */}
        <div className="hidden lg:flex items-center justify-between gap-1 py-1 text-sm font-medium text-slate-600 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-1">
              {pathname?.startsWith('/services-list') || pathname?.includes('/service/') || (pathname === '/categories' && searchParams?.get('type') === 'service') ? (
              // Service Categories
              <>
                {(() => {
                  const activeCatId = searchParams?.get('category');
                  const isAllActive = !activeCatId || activeCatId === 'all';
                  return (
                    <div className="relative group">
                      <Link
                        href="/services-list"
                        className={`flex items-center px-4 py-2.5 rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer 
                        bg-gray-100 
                        ${isAllActive
                            ? 'bg-upleex-purple text-white shadow-md shadow-purple-500/20'
                            : 'hover:bg-upleex-purple hover:text-white'
                          }`}
                      >
                        <LayoutGrid size={18} className="mr-2" />
                        All Services
                      </Link>
                    </div>
                  );
                })()}
                {serviceCategories.slice(0, 5).map((item, index) => {
                  const activeCatId = searchParams?.get('category');
                  const isActive = activeCatId === item.categories_id;
                  const displayClass = index > 2 ? "hidden xl:block" : "block";

                  return (
                    <div key={item.categories_id || index} className={`relative group ${displayClass}`}>
                      <Link
                        href={`/services-list?category=${item.categories_id}`}
                        className={`flex items-center px-4 py-2.5 rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer
                      bg-gray-100
                      ${isActive
                            ? 'bg-upleex-purple text-white shadow-md shadow-purple-500/20'
                            : 'hover:bg-upleex-purple hover:text-white'
                          }`}
                      >
                        {item.categories_name}
                      </Link>
                    </div>
                  );
                })}
              </>
            ) : (
              // Product Categories
              categories.slice(0, 6).map((item, index) => {
                const catSlug = createSlug(item.slug || item.categories_name || 'category');
                const isActive = pathname?.includes(catSlug);
                const key = item.categories_id || `cat-${index}`;
                const displayClass = index > 3 ? "hidden xl:block" : "block";

                return (
                  <div key={key} className={`relative group ${displayClass}`}>
                    <Link
                      href={`/rent/${createSlug(currentLocation === 'Select City' ? 'surat' : currentLocation)}/${catSlug}`}
                      className={`flex items-center px-4 py-2.5 rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer
                      bg-gray-100
                      ${isActive
                          ? 'bg-upleex-purple text-white shadow-md shadow-purple-500/20'
                          : 'hover:bg-upleex-purple hover:text-white'
                        }`}
                    >
                      {item.categories_name}
                      {item.subcategories.length > 0 && (
                        <ChevronDown size={14} className={`ml-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                          }`} />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {item.subcategories.length > 0 && (
                      <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg rounded-r-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
                        <div className="py-2">
                          {item.subcategories.map((sub, subIndex) => (
                            <Link
                              key={sub.subcategory_id || `sub-${subIndex}`}
                              href={`/rent/${createSlug(currentLocation === 'Select City' ? 'surat' : currentLocation)}/${catSlug}?sub=${createSlug(sub.slug || sub.subcategory_name || 'subcategory')}`}
                              className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-purple-50 hover:text-upleex-purple transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                            >
                              {sub.subcategory_name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* View All Categories Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center px-3"
          >
            <Button
              variant="outline"
              className={`
                rounded-full px-5 py-2 group h-auto text-xs font-semibold transition-all duration-200
                border-upleex-purple focus:outline-none focus:ring-0 cursor-pointer
              `}
              onClick={() =>
                router.push(
                  pathname?.startsWith('/services-list') || pathname?.includes('/service/') || (pathname === '/categories' && searchParams?.get('type') === 'service')
                    ? '/categories?type=service'
                    : '/categories'
                )
              }
            >
              <span className="flex items-center gap-2">
                View All Categories
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white animate-in slide-in-from-right duration-300">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Image src="/image/upleex-logo-dark.jpg" alt="Logo" width={120} height={32} />
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* User Section */}
              <div className="p-4 bg-gray-50/50">
                {user ? (
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {user?.full_name?.charAt(0) || email?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate">{user?.full_name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="shrink-0 p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 font-medium px-1">Welcome to Upleex</p>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full py-3.5 text-center bg-upleex-blue text-white rounded-xl font-bold shadow-lg shadow-blue-200"
                    >
                      Login / Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Links Grid */}
              <div className="p-4 grid grid-cols-2 gap-3">
                {[
                  { icon: User, label: 'My Profile', href: '/profile' },
                  { icon: Package, label: 'My Orders', href: '/orders' },
                  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
                  { icon: Briefcase, label: 'Services', href: '/services-list' },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl gap-2 hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    <item.icon size={20} className="text-upleex-purple" />
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Categories Section */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-sm font-extrabold text-slate-900">Top Categories</h3>
                  <Link href="/categories" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold text-upleex-blue">View All</Link>
                </div>
                <div className="space-y-1">
                  {categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.categories_id}
                      href={`/rent/${createSlug(currentLocation === 'Select City' ? 'surat' : currentLocation)}/${createSlug(cat.slug || cat.categories_name || 'category')}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl group transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700">{cat.categories_name}</span>
                      <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other Links */}
              <div className="p-4 space-y-2 border-t border-gray-100">
                <Link
                  href="/partner"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3.5 text-slate-700 font-medium hover:bg-gray-50 rounded-xl"
                >
                  <Briefcase size={18} className="text-gray-400" />
                  Partner With Us
                </Link>
                <button
                  onClick={() => {
                    setIsDownloadPopupOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3.5 text-left text-slate-700 font-medium hover:bg-gray-50 rounded-xl"
                >
                  <Smartphone size={18} className="text-gray-400" />
                  Download App
                </button>
              </div>
            </div>

            {/* Footer */}
            {user && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <DownloadAppPopup
        isOpen={isDownloadPopupOpen}
        onClose={() => setIsDownloadPopupOpen(false)}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={handleCitySelect}
        isCompulsory={!selectedCityId}
      />
    </nav>
  );
};
