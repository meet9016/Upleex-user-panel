'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  MapPin,
  ChevronDown,
  ChevronRight,
  Smartphone,
  ShoppingCart,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { DownloadAppPopup } from '../features/DownloadAppPopup';
import { Button } from '@/components/ui/Button';
import { categoryService, Category } from '@/services/categoryService';
import { useCart } from '@/context/CartContext';
import { searchService } from '@/services/searchService';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Select city');
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { cartCount } = useCart();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null); // New ref for suggestion dropdown
  const [cities, setCities] = useState<any[]>([]);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [cityPage, setCityPage] = useState(1);
  const [cityHasMore, setCityHasMore] = useState(true);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [hasLoadedInitialCities, setHasLoadedInitialCities] = useState(false);
  const cityListRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const suggestionTimeoutRef = useRef<number | null>(null);
  const citySearchTimeoutRef = useRef<number | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  // Function to read and parse user data from localStorage
  const readUserData = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedEmail = localStorage.getItem('email');

      if (storedUser && storedUser !== 'undefined') {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }

      if (storedEmail && storedEmail !== 'undefined') {
        try {
          const parsedEmail = JSON.parse(storedEmail);
          setEmail(parsedEmail);
        } catch {
          // If it's not JSON, use it as a plain string
          setEmail(storedEmail);
        }
      } else {
        setEmail(null);
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
      setUser(null);
      setEmail(null);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await categoryService.getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    readUserData();
    const handleStorageChange = () => {
      readUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);

    // setSelectedCityId(null);
    // setCurrentLocation('select city');
    // setCitySearchTerm('');
    // setCities([]);
    // setHasLoadedInitialCities(false);
    // setCityPage(1);
    // setCityHasMore(true);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
      // Check if click is outside both search input and suggestion dropdown
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node) &&
        suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadCities = async (page = 1, append = false, searchText?: string) => {
    try {
      setIsCityLoading(true);
      const query = searchText !== undefined ? searchText : citySearchTerm;
      const data = await searchService.getCities(page, query);

      setCities(prev => (append ? [...prev, ...data] : data));
      setCityPage(page);
      setCityHasMore(data.length >= 10);

      if (searchText !== undefined) {
        setCitySearchTerm(searchText);
      }
    } catch (error) {
      console.error('Error fetching cities', error);
      if (!append) {
        setCities([]);
      }
      setCityHasMore(false);
    } finally {
      setIsCityLoading(false);
    }
  };

  const handleCitySelect = (city: any) => {
    setSelectedCityId(String(city.id));
    setCurrentLocation(city.city_name);
    setIsCityDropdownOpen(false);
  };

  const handleClearCity = () => {
    setSelectedCityId(null);
    setCurrentLocation('select city');
    setCitySearchTerm('');
    setCities([]);
    setHasLoadedInitialCities(false);
    setCityPage(1);
    setCityHasMore(true);
  };

  const handleCityToggle = () => {
    const nextOpen = !isCityDropdownOpen;
    setIsCityDropdownOpen(nextOpen);
    if (nextOpen && !hasLoadedInitialCities) {
      loadCities(1, false);
      setHasLoadedInitialCities(true);
    }
  };

  const handleCityScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!cityHasMore || isCityLoading) return;
    const target = event.currentTarget;
    const threshold = 40;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
      loadCities(cityPage + 1, true);
    }
  };

  const handleCitySearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCitySearchTerm(value);

    // Clear previous timeout
    if (citySearchTimeoutRef.current) {
      window.clearTimeout(citySearchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    citySearchTimeoutRef.current = window.setTimeout(() => {
      loadCities(1, false, value);
    }, 300);
  };

  const handleCitySearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Clear any pending timeout
      if (citySearchTimeoutRef.current) {
        window.clearTimeout(citySearchTimeoutRef.current);
      }
      // Search immediately with current value
      loadCities(1, false, event.currentTarget.value);
    }
  };

  const handleCitySearchButtonClick = () => {
    // Clear any pending timeout
    if (citySearchTimeoutRef.current) {
      window.clearTimeout(citySearchTimeoutRef.current);
    }
    // Search immediately with current search term
    loadCities(1, false, citySearchTerm);
  };

  const fetchSuggestions = async (query: string) => {
    try {
      setIsSuggestionLoading(true);
      const data = await searchService.getProductSuggestions(query, selectedCityId);
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions', error);
      setSuggestions([]);
      setShowSuggestions(true);
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
    setEmail(null);
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    router.push('/auth/login');
    window.dispatchEvent(new Event('storage'));
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
                src="/image/upleex-logo-dark.png"
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
                onClick={() => router.push('/partner/login')}
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
                <Link
                  href="/partner/login"
                  className="block w-full text-center py-3 border border-gray-300 rounded-lg text-slate-700 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Image
              src="/image/upleex-logo-dark.png"
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
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClearCity();
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
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
                    >
                      {cities.length > 0 ? (
                        cities.map((city) => (
                          <button
                            key={city.id}
                            type="button"
                            onClick={() => handleCitySelect(city)}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                              selectedCityId === String(city.id)
                                ? 'bg-purple-50 text-upleex-purple'
                                : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900 cursor-pointer'
                            }`}
                          >
                            {city.city_name}
                          </button>
                        ))
                      ) : (
                        !isCityLoading && citySearchTerm.trim() !== '' && (
                          <div className="px-4 py-4 text-sm text-slate-500 text-center">
                            No cities found for "{citySearchTerm}"
                          </div>
                        )
                      )}
                      {isCityLoading && (
                        <div className="px-4 py-2 text-sm text-slate-500 text-center">
                          Loading...
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
                  placeholder="Search for products, brands and more"
                  className="w-full h-full px-4 py-2 text-sm text-gray-700 outline-none placeholder-gray-400"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSearchSubmit();
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
                        suggestions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSuggestionClick(item)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-gray-700 cursor-pointer"
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
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">

            <button
              onClick={() => setIsDownloadPopupOpen(true)}
              className="flex items-center gap-2 hover:text-upleex-blue transition-colors group cursor-pointer"
            >
              <Smartphone size={18} className="text-gray-400 group-hover:text-upleex-blue" />
              <span>Download App</span>
            </button>

            <div className="h-4 w-px bg-gray-300"></div>

            <Link href="/partner" className="hover:text-upleex-blue transition-colors cursor-pointer">
              Partner With Us
            </Link>

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

                {/* Profile Dropdown Menu - Only Email and Logout */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                    {/* Email Display */}
                    <div className="p-4 bg-gray-50 border-b">
                      <p className="text-sm text-gray-500 mb-1">Logged in as</p>
                      <p className="font-medium text-gray-900 truncate">{email}</p>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group cursor-pointer"
                    >
                      <LogOut size={18} className="group-hover:rotate-90 transition-transform" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
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

            <Link href="/cart" className="relative group cursor-pointer">
              <ShoppingCart size={24} className="text-slate-700 group-hover:text-upleex-blue transition-colors" />
              <span className="absolute -top-2 -right-2 bg-upleex-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount || 0}
              </span>
            </Link>

          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4">
            <Link href="/cart" className="relative cursor-pointer">
              <ShoppingCart size={24} className="text-slate-700" />
              <span className="absolute -top-2 -right-2 bg-upleex-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount || 0}
              </span>
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-upleex-blue focus:outline-none cursor-pointer"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar - Secondary Navigation with Dropdowns */}
        <div className="hidden lg:flex items-center justify-between gap-1 py-1 text-sm font-medium text-slate-600 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-1">
            {categories.slice(0, 7).map((item) => {
              const isActive = pathname === `/rent-category/${item.categories_id}`;
              return (
                <div key={item.categories_id} className="relative group">
                  <Link
                    href={`/rent-category/${item.categories_id}`}
                    className={`flex items-center px-4 py-2.5 rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer 
                    bg-gray-100 
                    ${isActive
                    ? 'bg-upleex-purple text-white shadow-md shadow-purple-500/20'
                   :  'hover:bg-upleex-purple hover:text-white'
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
                        {item.subcategories.map((sub) => (
                          <Link
                            key={sub.subcategory_id}
                            href={`/rent-category/${item.categories_id}?sub=${sub.subcategory_id}`}
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
            })}
          </div>

          {/* View All Categories Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <Button
              variant="outline"
              className={`
                rounded-full px-5 py-2 group h-auto text-xs font-bold transition-all duration-200
                border-upleex-purple focus:outline-none focus:ring-0 cursor-pointer
                ${pathname === '/categories'
                  ? 'bg-upleex-purple text-white border-upleex-purple hover:bg-upleex-purple hover:text-white'
                  : 'text-upleex-purple hover:bg-upleex-purple hover:text-white'
                }
              `}
              onClick={() => router.push('/categories')}
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
        <div className="lg:hidden bg-white border-b border-gray-100 absolute w-full shadow-lg z-50">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Mobile Search */}
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
              <div className="flex-1 relative flex items-center bg-white h-10">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-full px-4 text-sm outline-none"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSearchSubmit();
                      setIsMenuOpen(false);
                    }
                  }}
                />
                <button
                  className="px-3 text-gray-400 cursor-pointer"
                  onClick={() => {
                    handleSearchSubmit();
                    setIsMenuOpen(false);
                  }}
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Mobile User Menu */}
            <div className="space-y-3">
              {user ? (
                <>
                  {/* Email Display */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Logged in as</p>
                    <p className="font-medium text-gray-900 truncate">{email}</p>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 w-full py-2 px-3 text-red-600 hover:bg-red-50 rounded border border-red-100 cursor-pointer"
                  >
                    <LogOut size={18} />
                    <span className="font-semibold">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block w-full text-center py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}

              <Link
                href="/partner"
                className="block w-full text-center py-2 border border-gray-200 rounded text-slate-700 font-medium cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Partner With Us
              </Link>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 6).map(item => {
                  const isActive = pathname === `/rent-category/${item.categories_id}`;
                  return (
                    <Link
                      key={item.categories_id}
                      href={`/rent-category/${item.categories_id}`}
                      className={`text-sm py-1 transition-colors cursor-pointer ${isActive ? 'text-upleex-purple font-bold' : 'text-slate-700 hover:text-upleex-blue'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.categories_name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <DownloadAppPopup
        isOpen={isDownloadPopupOpen}
        onClose={() => setIsDownloadPopupOpen(false)}
      />
    </nav>
  );
};
