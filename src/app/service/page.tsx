'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Touchpad,
  Handshake,
  Coins,
  Search,
  BookOpen,
  CalendarCheck,
  Star,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Activity,
  Laptop,
  Home,
  User,
  Heart,
  Hammer,
  Stethoscope,
  Video,
  Camera,
  ChefHat,
  Music,
  Truck,
  Wifi,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CenterModeCarousel } from '@/components/features/CenterModeCarousel';

// --- Data Constants ---

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Choose a Plan',
    description: 'Select a plan that suits your service needs.'
  },
  {
    step: 2,
    title: 'List Your Services',
    description: 'Fill in details about your skills and expertise.'
  },
  {
    step: 3,
    title: 'Go Live',
    description: 'Your service is verified and listed on the platform.'
  },
  {
    step: 4,
    title: 'Get Bookings',
    description: 'Customers view and book your services instantly.'
  },
  {
    step: 5,
    title: 'Start Earning',
    description: 'Complete the job and receive payments securely.'
  }
];

const TRENDING_SERVICES = [
  {
    id: 1,
    title: 'Male Spa Therapist',
    category: 'Wellness',
    price: '1500 / Day',
    image: '/images/services/spa.jpg', // Placeholder path
    rating: 4.8
  },
  {
    id: 2,
    title: 'Economics Online Tutor',
    category: 'Education',
    price: '1500 / Month',
    image: '/images/services/tutor.jpg',
    rating: 4.9
  },
  {
    id: 3,
    title: 'Psychologist Counselor',
    category: 'Health',
    price: '1000 / Day',
    image: '/images/services/psychologist.jpg',
    rating: 5.0
  },
  {
    id: 4,
    title: 'Photography & Cinema',
    category: 'Media',
    price: '3000 / Day',
    image: '/images/services/camera.jpg',
    rating: 4.7
  }
];
const ShirtIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
  </svg>
);

const SERVICE_CATEGORIES = [
  { name: 'Education Field', icon: <GraduationCap size={32} /> },
  { name: 'Consultants', icon: <Briefcase size={32} /> },
  { name: 'Pandits & Priests', icon: <Star size={32} /> },
  { name: 'Automotive Professionals', icon: <Hammer size={32} /> },
  { name: 'Civil & Construction', icon: <Truck size={32} /> },
  { name: 'Engineering Industries', icon: <Wifi size={32} /> },
  { name: 'Farming & Agriculture', icon: <Users size={32} /> },
  { name: 'Food & Hospitality', icon: <ChefHat size={32} /> },
  { name: 'Handicrafts & Artisans', icon: <Handshake size={32} /> },
  { name: 'IT & ITES Services', icon: <Touchpad size={32} /> },
  { name: 'Media & Events', icon: <Video size={32} /> },
  { name: 'Medical & Health', icon: <Stethoscope size={32} /> },
  { name: 'Office Professionals', icon: <Briefcase size={32} /> },
  { name: 'Home & Wellness', icon: <Music size={32} /> },
  { name: 'Security & Bouncers', icon: <ShieldCheck size={32} /> },
  { name: 'Sports & Fitness', icon: <CalendarCheck size={32} /> },
  { name: 'Textile & Clothing', icon: <ShirtIcon size={32} /> },
  { name: 'Other Freelance', icon: <Search size={32} /> },
];

const FAQS = [
  {
    question: 'How does Upleex work for professionals/experts who want to list services?',
    answer: 'Upleex simplifies the process of listing your services. Create an account, choose your service category, provide a detailed description, set your pricing, and submit for approval. Once approved (usually within 24 hours), your listing goes live.'
  },
  {
    question: 'Why should I list my services on Upleex?',
    answer: 'Listing on Upleex offers numerous benefits: Earn passive income by turning your expertise into earnings, enjoy a hassle-free listing process, and reach a wider audience in your local area and beyond.'
  },
  {
    question: 'How can I contact Upleex customer care?',
    answer: 'For any questions or assistance, you can reach our customer care team through Website Chat, Phone (9319866277), or Email (info@upleex.com).'
  },
  {
    question: 'What type of services can we list?',
    answer: 'Our platform supports listings for up to 18 service types, including education, consultants, pandits, automotive professionals, engineering, media, health, and more.'
  },
  {
    question: 'How do I decide my service price?',
    answer: 'Explore similar services listed on Upleex. Observe the pricing of comparable offerings in your category to establish a competitive baseline. You have full control to set your own rates.'
  }
];

// Helper Icon for one missing in lucide import


const ServicePage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToCategories = () => {
    const element = document.getElementById('service-categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">List Your Service</span> & <br />
                <span className="text-white">Start Earning</span> with Upleex!
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-lg leading-relaxed cursor-pointer">
                List your skills, connect with customers, and grow your income effortlessly. Join thousands of professionals today.
              </p>
              <div className="pt-4">
                <Button  onClick={scrollToCategories} className=" text-lg font-bold px-10 py-6 rounded-lg shadow-lg shadow-blue-500/30 border-none">
                  List Your Service Now
                </Button>
              </div>
            </div>
            
            {/* Hero Image / Illustration */}
            <div className="relative lg:h-[500px] flex items-end justify-center">
               {/* Placeholder for the diverse group of professionals image */}
               <div className="relative w-full h-full min-h-[400px] bg-white/5 backdrop-blur-sm rounded-t-full border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <Users className="w-32 h-32 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 font-bold text-xl">Community of Professionals</p>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        </div>
      </section>

      {/* Why List Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4">
              Why List Your Services with Upleex?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-sm">
                <Touchpad size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hassle-Free Listing</h3>
              <p className="text-slate-500 max-w-xs">Simple steps to get your service online in minutes.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-sm">
                <Handshake size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Turn Your Expertise into Earnings</h3>
              <p className="text-slate-500 max-w-xs">Monetize your skills and grow your business.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-sm">
                <Coins size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reach More Customers</h3>
              <p className="text-slate-500 max-w-xs">Connect with thousands of potential clients daily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0a1e4c] rounded-3xl p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold italic">How it works:</h2>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <div key={index} className="relative group">
                  <div className="flex flex-col h-full">
                    <div className="text-6xl font-bold text-white/20 mb-4 group-hover:text-white/40 transition-colors">
                      {step.step}
                    </div>
                    <div className="border-l-2 border-blue-400 pl-4 h-full">
                      <h3 className="text-lg font-bold mb-2 text-white">{step.title}</h3>
                      <p className="text-blue-100/70 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>
      </section>

      {/* Promotional Banner (Replaced with CenterModeCarousel) */}
      <section className="bg-white">
        <CenterModeCarousel />
      </section>

      {/* Trending Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-10">
            <span className="text-gradient-primary  text-2xl">↗</span>
            <h2 className="text-3xl font-bold text-gradient-primary">Trending Services</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRENDING_SERVICES.map((service) => (
              <div key={service.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
                <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                    {/* Placeholder Image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                        <Camera size={32} />
                    </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                  <div className="text-gradient-primary font-bold mb-4">{service.price}</div>
                  <Button className="w-full  text-white font-semibold rounded-lg ">
                    Book Service
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="service-categories" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-blue-600 text-2xl">↗</span>
            <h2 className="text-3xl font-bold text-gradient-primary">Choose Service Category</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {SERVICE_CATEGORIES.map((cat, index) => (
              <div key={index} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center mb-3 group-hover:border-blue-400 group-hover:shadow-md transition-all duration-300">
                  <div className="text-slate-700 group-hover:text-gradient-primary transition-colors">
                    {cat.icon}
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-gradient-primary">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gradient-primary">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-left"
                >
                  <span className="font-bold text-slate-800 text-base md:text-lg pr-8">{faq.question}</span>
                  <ArrowRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-90 text-blue-600' : ''}`} />
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaqIndex === index ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
                  }`}
                >
                  <div className="bg-gray-50 p-6 rounded-lg text-slate-600 leading-relaxed border border-gray-100">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-10 lg:py-28 overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100/20 skew-x-12 transform origin-top"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                
                {/* Phone Mockups (Left) */}
                <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[600px] flex items-center justify-center lg:justify-end">
                    {/* Circle Background behind phones */}
                    <div className="absolute w-[400px] h-[400px] bg-white rounded-full shadow-2xl shadow-blue-100/50 z-0"></div>

                    {/* Phone 1 (Back/Left - Rotated) */}
                    <div className="absolute left-4 lg:left-10 top-10 lg:top-8 w-[260px] h-[520px] bg-slate-900 rounded-[3rem] border-8 border-slate-900 shadow-2xl transform -rotate-6 z-10 transition-transform hover:-rotate-3 duration-500">
                        {/* Screen */}
                        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative border border-slate-800">
                             {/* Status Bar Mock */}
                             <div className="h-6 w-full bg-slate-900 flex justify-between px-6 items-center">
                                <div className="text-[10px] text-white font-medium">9:41</div>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                                    <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                                </div>
                             </div>
                             
                             {/* App UI - Dark Mode / Splash */}
                             <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-6">
                                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <span className="text-4xl font-bold text-white">U</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Upleex</h3>
                                    <p className="text-slate-400 text-sm">Rent Smarter, Live Better</p>
                                </div>
                                <div className="w-full h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
                                    <div className="w-1/2 h-full bg-blue-500"></div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Phone 2 (Front/Right - Main) */}
                    <div className="absolute right-4 lg:right-10 bottom-0 lg:bottom-8 w-[280px] h-[560px] bg-white rounded-[3.5rem] shadow-2xl z-20 ring-8 ring-slate-900 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
                        {/* Dynamic Island / Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-30"></div>
                        
                        {/* Screen Content */}
                        <div className="w-full h-full bg-gray-50 flex flex-col pt-10">
                            {/* App Header */}
                            <div className="px-6 mb-6 flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-slate-500 font-medium">Good Morning</div>
                                    <div className="text-lg font-bold text-slate-800">John Doe</div>
                                </div>
                                <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white shadow-sm"></div>
                            </div>

                            {/* Search Bar */}
                            <div className="px-6 mb-6">
                                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                                    <Search className="w-5 h-5 text-slate-400" />
                                    <div className="text-sm text-slate-400">Find equipment...</div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="px-6 mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-slate-800">Categories</h4>
                                    <span className="text-xs text-blue-600 font-medium">See All</span>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {['Medical', 'Home', 'Tech'].map((cat, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-600 border border-gray-100'}`}>
                                                {i === 0 ? <Activity size={20} /> : i === 1 ? <Home size={20} /> : <Laptop size={20} />}
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-600">{cat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Featured Card */}
                            <div className="px-6 flex-1">
                                <h4 className="font-bold text-slate-800 mb-3">Popular Near You</h4>
                                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                                    <div className="h-32 bg-slate-100 rounded-2xl w-full relative overflow-hidden">
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-800">$25/day</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">Wheelchair Standard</div>
                                        <div className="text-xs text-slate-500 mt-1">Available • 2.5km away</div>
                                    </div>
                                    <div className="pt-2 flex gap-2">
                                        <div className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-xl text-xs font-bold text-center">Details</div>
                                        <div className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-xs font-bold text-center">Rent Now</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Nav */}
                            <div className="h-20 bg-white border-t border-gray-100 flex justify-around items-center px-6 pb-2">
                                <div className="text-blue-600"><Home size={24} /></div>
                                <div className="text-slate-300"><Search size={24} /></div>
                                <div className="text-slate-300"><Heart size={24} /></div>
                                <div className="text-slate-300"><User size={24} /></div>
                            </div>
                            
                            {/* Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Content Area (Right) */}
                <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
                    <div className="space-y-4">
                        <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold tracking-wide uppercase mb-2">
                            Mobile App
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                            Rent smarter <br />
                            <span className="text-gradient-primary">on the go.</span>
                        </h2>
                        <p className="text-slate-600 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Download the Upleex app to browse thousands of items, chat with lenders, and manage your rentals anytime, anywhere.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                        {[
                            "Real-time availability updates",
                            "Secure in-app payments",
                            "Instant chat with lenders",
                            "Track your rentals easily"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                <span className="text-slate-700 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        {/* App Store Button */}
                        <button className="group bg-slate-900 text-white px-6 py-3.5 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition-all duration-300 hover:scale-105 shadow-xl shadow-slate-900/20">
                            <svg className="w-8 h-8 text-white group-hover:text-gray-200 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.74-3.03 1.59-.67.79-1.25 1.95-1.12 3.09 1.17.09 2.35-.73 3.08-1.57" />
                            </svg>
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Download on the</div>
                                <div className="text-lg font-bold leading-none font-sans">App Store</div>
                            </div>
                        </button>

                        {/* Google Play Button */}
                        <button className="group bg-slate-900 text-white px-6 py-3.5 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition-all duration-300 hover:scale-105 shadow-xl shadow-slate-900/20">
                            <svg className="w-7 h-7 text-white group-hover:text-gray-200 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Get it on</div>
                                <div className="text-lg font-bold leading-none font-sans">Google Play</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </main>
  );
};

export default ServicePage;
