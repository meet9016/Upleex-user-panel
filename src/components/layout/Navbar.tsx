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
  Smartphone, 
  ShoppingCart,
  LogOut
} from 'lucide-react';
import Image from 'next/image';
import { DownloadAppPopup } from '../features/DownloadAppPopup';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [currentLocations] = useState('Surat');
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
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
    readUserData();
    const handleStorageChange = () => {
      readUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Poll for changes (as a fallback)
    const intervalId = setInterval(readUserData, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
               <Link 
                href="/auth/login" 
                className="px-6 py-2.5 text-slate-700 font-semibold border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Start Renting
              </Link>
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
                    href="/auth/login" 
                    className="block w-full text-center py-3 border border-gray-300 rounded-lg text-slate-700 font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/register" 
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

          {/* Search & Location Bar */}
          <div className="hidden lg:flex flex-1 max-w-3xl">
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden hover:border-upleex-blue transition-colors group focus-within:ring-1 focus-within:ring-upleex-blue focus-within:border-upleex-blue">

              {/* Location Selector */}
              <div className="relative flex items-center bg-gray-50 border-r border-gray-300 min-w-[140px] px-3 cursor-pointer hover:bg-gray-100 transition-colors">
                <MapPin size={18} className="text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 truncate flex-1">{currentLocations}</span>
                <ChevronDown size={14} className="text-gray-400 ml-2" />
              </div>

              {/* Search Input */}
              <div className="flex-1 relative flex items-center bg-white">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full h-full px-4 py-2 text-sm text-gray-700 outline-none placeholder-gray-400"
                />
                <button className="p-3 text-gray-400 hover:text-upleex-blue transition-colors">
                  <Search size={20} />
                </button>
              </div>

            </div>
          </div>

          {/* Right Section Actions */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">

            <button 
              onClick={() => setIsDownloadPopupOpen(true)} 
              className="flex items-center gap-2 hover:text-upleex-blue transition-colors group"
            >
              <Smartphone size={18} className="text-gray-400 group-hover:text-upleex-blue" />
              <span>Download App</span>
            </button>

            <div className="h-4 w-px bg-gray-300"></div>

            <Link href="/partner" className="hover:text-upleex-blue transition-colors">
              Partner With Us
            </Link>

            <div className="h-4 w-px bg-gray-300"></div>
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 hover:text-upleex-blue transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user?.full_name?.charAt(0) || email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="capitalize font-semibold">
                    Hi, {user?.split(' ')[0] || 'User'}
                  </span>
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
                      className="flex items-center justify-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                    >
                      <LogOut size={18} className="group-hover:rotate-90 transition-transform" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/login" 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow"
              >
                Login / Sign Up
              </Link>
            )}

            <div className="h-4 w-px bg-gray-300"></div>

            <Link href="/cart" className="relative group">
              <ShoppingCart size={24} className="text-slate-700 group-hover:text-upleex-blue transition-colors" />
              <span className="absolute -top-2 -right-2 bg-upleex-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
            </Link>

          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart size={24} className="text-slate-700" />
              <span className="absolute -top-2 -right-2 bg-upleex-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-upleex-blue focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar - Secondary Navigation with Dropdowns */}
        <div className="hidden lg:flex items-center gap-1 py-1 text-sm font-medium text-slate-600 border-t border-gray-100 bg-gray-50/50 px-4">
          {[
            { name: 'Appliances', slug: 'home-appliance', subs: ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwaves'] },
            { name: 'Furniture', slug: 'furniture', subs: ['Sofas', 'Beds', 'Wardrobes', 'Dining Tables'] },
            { name: 'Computers', slug: 'electronics', subs: ['Laptops', 'Desktops', 'Monitors', 'Printers'] },
            { name: 'Cameras', slug: 'cameras', subs: ['DSLRs', 'Mirrorless', 'Lenses', 'Action Cameras'] },
            { name: 'Medical', slug: 'medical', subs: ['Hospital Beds', 'Wheelchairs', 'Oxygen Concentrators'] },
            { name: 'Fitness', slug: 'fitness', subs: ['Treadmills', 'Ellipticals', 'Home Gyms', 'Dumbbells'] },
            { name: 'Camping', slug: 'camping', subs: ['Tents', 'Sleeping Bags', 'Camping Stoves'] }
          ].map((item) => {
            const isActive = pathname?.includes(item.slug);
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={`/rent-category/${item.slug}`}
                  className={`flex items-center px-4 py-2.5 rounded-md transition-all duration-200 ${isActive
                    ? 'bg-upleex-purple text-white shadow-md shadow-purple-500/20'
                    : 'hover:bg-upleex-purple hover:text-white'
                    }`}
                >
                  {item.name}
                  <ChevronDown size={14} className={`ml-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} />
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg rounded-r-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">
                    {item.subs.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={`/rent-category/${item.slug}?sub=${sub.toLowerCase().replace(' ', '-')}`}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-purple-50 hover:text-upleex-purple transition-colors border-b border-gray-50 last:border-0"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {/* <Link href="/rent-category/all" className="ml-auto px-4 py-2 text-upleex-blue hover:text-upleex-purple transition-colors font-semibold flex items-center">
            All Categories <ChevronDown size={14} className="ml-1 rotate-[-90deg]" />
          </Link> */}
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
                />
                <button className="px-3 text-gray-400">
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
                    className="flex items-center justify-center gap-3 w-full py-2 px-3 text-red-600 hover:bg-red-50 rounded border border-red-100"
                  >
                    <LogOut size={18} />
                    <span className="font-semibold">Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/login" 
                  className="block w-full text-center py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}


              <Link href="/partner" className="block w-full text-center py-2 border border-gray-200 rounded text-slate-700 font-medium" onClick={() => setIsMenuOpen(false)}>
                Partner With Us
              </Link>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</div>
              <div className="grid grid-cols-2 gap-2">
                {['Appliances', 'Furniture', 'Computers', 'Cameras', 'Medical', 'Fitness'].map(item => (
                  <Link key={item} href={`/rent-category/${item.toLowerCase()}`} className="text-sm text-slate-700 py-1 hover:text-upleex-blue" onClick={() => setIsMenuOpen(false)}>
                    {item}
                  </Link>
                ))}
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
