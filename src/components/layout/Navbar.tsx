'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, MapPin, ChevronDown, Smartphone, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLocations] = useState('Surat');
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  console.log("🚀 ~ Navbar ~ user:", user)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser || storedUser === 'undefined') return;

    try {
      const parsedUser = JSON.parse(storedUser); // 👈 object
      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem('user');
    }
  }, []);


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

            <a href="#" className="flex items-center gap-2 hover:text-upleex-blue transition-colors group">
              <Smartphone size={18} className="text-gray-400 group-hover:text-upleex-blue" />
              <span>Download App</span>
            </a>

            <div className="h-4 w-px bg-gray-300"></div>

            <Link href="/partner" className="hover:text-upleex-blue transition-colors">
              Partner With Us
            </Link>

            <div className="h-4 w-px bg-gray-300"></div>
            {user ? (
              <span className="capitalize font-semibold">
                Hi, {user.full_name}
              </span>
            ) : (
              <Link href="/auth/login">Login / Sign Up</Link>
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
          <Link href="/rent-category/all" className="ml-auto px-4 py-2 text-upleex-blue hover:text-upleex-purple transition-colors font-semibold flex items-center">
            All Categories <ChevronDown size={14} className="ml-1 rotate-[-90deg]" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 absolute w-full shadow-lg">
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

            <div className="space-y-2">
              {user ? (
                <span className="capitalize font-semibold">
                  Hi, {user.full_name}
                </span>
              ) : (
                <Link href="/auth/login">Login / Sign Up</Link>
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
    </nav>
  );
};
