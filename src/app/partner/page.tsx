'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  ShieldCheck, 
  TrendingUp, 
  Gauge, 
  CheckCircle2, 
  Play,
  Mail,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

interface StatItem {
  number: string;
  label: string;
}

interface BenefitCard {
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

interface HowItWorksStep {
  title: string;
  desc: string;
  items: string[];
}

interface PartnerData {
  hero: {
    heading: string;
    subheading: string;
    buttonText: string;
  };
  stats: StatItem[];
  benefits: {
    heading: string;
    subheading: string;
    cards: BenefitCard[];
  };
  testimonials: {
    heading: string;
    items: Testimonial[];
  };
  howItWorks: {
    heading: string;
    steps: HowItWorksStep[];
  };
  categories: {
    heading: string;
    items: string[];
  };
  support: {
    heading: string;
    description: string;
    email: string;
  };
}

const PartnerPage = () => {
  const [content, setContent] = useState<PartnerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get(endPointApi.getDynamicPageBySlug.replace(':slug', 'partner'));
        if (res.data?.data?.content) {
          try {
            setContent(JSON.parse(res.data.data.content));
          } catch(e) {
            console.error("Failed to parse partner JSON", e);
          }
        }
      } catch (error) {
        console.error('Failed to load partner content', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Use dynamic content or fallback to default
  const hero = content?.hero || {
    heading: "More Bookings, Less Work, Better Growth.",
    subheading: "Become an Upleex partner and grow your rental business across India with direct local demand and simple tools.",
    buttonText: "Start Renting",
  };

  const stats = content?.stats && content.stats.length > 0 ? content.stats : [
    { number: '2,500+', label: 'Active Partners' },
    { number: '6,500+', label: 'Listings Live' },
    { number: '12,000+', label: 'Orders Completed' },
    { number: '120+', label: 'Cities Covered' },
  ];

  const benefits = content?.benefits || {
    heading: "Why Partners Choose Upleex",
    subheading: "Built to help you earn more, manage less, and grow with confidence.",
    cards: [
      { title: 'Competitive Pricing', description: 'Set your own rental price and earn better on every booking.' },
      { title: 'Secure Transactions', description: 'Track every order clearly and get paid with confidence.' },
      { title: 'Growth for Every Partner', description: 'Reach more local customers who need products in your city.' },
      { title: 'Ease of Doing Business', description: 'List items, manage orders, and handle payouts in one simple flow.' },
    ]
  };

  const testimonials = content?.testimonials || {
    heading: "Experiences Partners Love to Talk About",
    items: [
      { name: 'Rajesh Kumar', role: 'Furniture Rental, Mumbai', text: 'Upleex helped us get more local orders without extra selling effort. It made our rental business feel simple and active.' },
      { name: 'Priya Sharma', role: 'Electronics Rental, Delhi', text: 'We started getting steady bookings soon after listing. The process is easy, and the platform brings real customers.' },
      { name: 'Amit Patel', role: 'Event Equipment, Bangalore', text: 'We manage orders faster now and spend less time on follow-up. Upleex gave our business a better local reach.' }
    ]
  };

  const howItWorks = content?.howItWorks || {
    heading: "How it works",
    steps: [
      { title: 'Create Account', desc: 'Sign up and complete your business profile.', items: ['Business Details', 'Bank Account'] },
      { title: 'List Products', desc: 'List the products you want to rent in your partner panel.', items: [] },
      { title: 'Get Orders', desc: 'Start getting orders from thousands of customers.', items: [] },
      { title: 'Manage Orders', desc: 'Accept orders and manage deliveries through our dashboard.', items: [] },
      { title: 'Receive Payments', desc: 'Payments are deposited directly to your bank account.', items: [] }
    ]
  };

  const categoriesData = content?.categories || {
    heading: "Popular Categories to Rent Online",
    items: [
      'Furniture', 'Electronics & Gadgets', 'Home Appliances', 'Property', 'Fashion',
      'Services', 'Education & Classes', 'Kids & Baby Products', 'Sports & Fitness', 'Vehicles'
    ]
  };

  const support = content?.support || {
    heading: "Upleex Partner Support Is Always Ready",
    description: "Need help with listing, pricing, KYC, or order flow? Our support team is here to guide you before and after you go live.",
    email: "partnerships@upleex.com",
  };

  const benefitIcons = [
    <Wallet size={32} key="wallet" />,
    <ShieldCheck size={32} key="shield" />,
    <TrendingUp size={32} key="trending" />,
    <Gauge size={32} key="gauge" />
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-5 whitespace-pre-line">
                {hero.heading}
              </h1>
              <p className="text-lg text-slate-600 mb-5 max-w-lg">
                {hero.subheading}
              </p>
              <Link 
                href="/partner/signup" 
                className="inline-flex items-center gap-2 bg-gradient-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all shadow-lg shadow-blue-500/20"
              >
                {hero.buttonText} <ArrowRight size={20} />
              </Link>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-slate-200 relative">
                  <Image 
                     src="/image/upleex-logo-dark.png" 
                     alt="Partner with Upleex"
                     width={800}
                     height={600}
                     className="object-cover w-full h-full opacity-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center">
                     <span className="text-blue-200 opacity-50 text-9xl font-bold">Partner</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-4 py-1 pr-1">{benefits.heading}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {benefits.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.cards.map((card, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  {benefitIcons[index % benefitIcons.length]}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-4 leading-tight">
              {testimonials.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative group"
              >
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-slate-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {testimonial.role}
                    </p>
                  </div>
                  <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 
                    group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#0ea5e9] 
                    group-hover:text-white transition-all">
                    <Play size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
                  </button>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary">
              {howItWorks.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gray-200 -z-10 translate-y-1/2 mx-16"></div>

            {howItWorks.steps.map((item, index) => {
              const isActive = index === 1; // Highlight the second step as in original design
              return (
                <div
                  key={index}
                  className={`bg-white p-5 sm:p-6 rounded-xl border text-center h-full flex flex-col items-center transition-all duration-300
                    ${isActive
                      ? 'border-blue-200 shadow-md ring-1 ring-blue-100 scale-[1.02]'
                      : 'border-gray-100 shadow-sm hover:shadow-md'
                    }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold mb-5 sm:mb-6
                      ${isActive
                        ? 'bg-gradient-primary text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gradient-primary text-white'
                      }`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-4 flex-grow">
                    {item.desc}
                  </p>
                  {item.items && item.items.length > 0 && (
                    <div className="text-left w-full pt-4 border-t border-gray-100 mt-auto">
                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        All you need is:
                      </p>
                      <ul className="space-y-1">
                        {item.items.map((sub, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary py-1 pr-1">{categoriesData.heading}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesData.items.map((cat, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg py-4 px-2 text-center hover:border-transparent hover:text-white hover:bg-gradient-to-r hover:from-[#6366f1] hover:to-[#0ea5e9] transition-all cursor-pointer font-medium text-slate-700 text-sm md:text-base hover:shadow-lg hover:shadow-blue-500/20">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{support.heading}</h2>
          <p className="text-slate-600 mb-8">
            {support.description}
          </p>
          <a href={`mailto:${support.email}`} className="inline-flex items-center gap-2 text-gradient-primary hover:opacity-80 font-bold text-xl transition-opacity">
            <Mail size={24} className="text-blue-600" />
            {support.email}
          </a>
        </div>
      </section>
    </main>
  );
};

export default PartnerPage;
