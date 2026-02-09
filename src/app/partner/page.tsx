'use client';

import React from 'react';
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

const PartnerPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                More Orders.<br />
                Less Effort.<br />
                <span className="text-blue-600">Real Growth.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Become an Upleex partner and grow your rental business across India.
              </p>
              <Link 
                href="/auth/register" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Renting <ArrowRight size={20} />
              </Link>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Placeholder for Hero Image - utilizing a generic office/meeting image if available or a placeholder */}
                <div className="aspect-[4/3] bg-slate-200 relative">
                  <Image 
                     src="/image/upleex-logo-dark.png" 
                     alt="Partner with Upleex"
                     width={800}
                     height={600}
                     className="object-cover w-full h-full opacity-0" // Hidden if no real image, but using div bg
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center">
                     <span className="text-blue-200 opacity-50 text-9xl font-bold">Partner</span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
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
            {[
              { number: '2,000+', label: 'Active Partners' },
              { number: '5,000+', label: 'Products Listed' },
              { number: '10,000+', label: 'Orders Completed' },
              { number: '100+', label: 'Cities Covered' },
            ].map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Partners Love Upleex</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              All the benefits designed to help you rent more and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <Wallet size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Competitive Pricing</h3>
              <p className="text-slate-500 leading-relaxed">
                Set your own rental prices and maximize your revenue.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Transactions</h3>
              <p className="text-slate-500 leading-relaxed">
                All transactions are secure and protected. Get paid on time.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Growth for Every Partner</h3>
              <p className="text-slate-500 leading-relaxed">
                From small to large businesses, Upleex fuels growth for all partners.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <Gauge size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ease of Doing Business</h3>
              <ul className="space-y-3 mt-4">
                {[
                  'Easy Product Listing',
                  'Real-time Order Management',
                  'Fast Payment Processing'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-500">
                    <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Experiences Partners Love to Talk About</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Furniture Rental, Mumbai',
                text: 'Our business has grown beyond our imagination, getting up to multiple orders consistently during peak seasons. We are now constantly bringing new products thanks to Upleex\'s insights.'
              },
              {
                name: 'Priya Sharma',
                role: 'Electronics Rental, Delhi',
                text: 'I started renting on Upleex with 2-3 orders on the very first day. In no time I was getting over multiple orders a day, like a dream come true.'
              },
              {
                name: 'Amit Patel',
                role: 'Event Equipment, Bangalore',
                text: 'Upleex made it extremely simple to transition to online business. Suddenly we were all over India to our surprise, seeing up to 5X growth on peak days.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#0ea5e9] group-hover:text-white transition-all">
                    <Play size={18} fill="currentColor" />
                  </button>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gray-200 -z-10 transform translate-y-1/2 mx-16"></div>

            {[
              { step: 1, title: 'Create Account', desc: 'Sign up and complete your business profile.', items: ['Business Details', 'Bank Account'] },
              { step: 2, title: 'List Products', desc: 'List the products you want to rent in your partner panel.', active: true },
              { step: 3, title: 'Get Orders', desc: 'Start getting orders from thousands of customers.' },
              { step: 4, title: 'Manage Orders', desc: 'Accept orders and manage deliveries through our dashboard.' },
              { step: 5, title: 'Receive Payments', desc: 'Payments are deposited directly to your bank account.' }
            ].map((item, index) => (
              <div key={index} className={`bg-white p-6 rounded-xl border ${item.active ? 'border-blue-200 shadow-md ring-1 ring-blue-100' : 'border-gray-100 shadow-sm'} text-center h-full flex flex-col items-center`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 ${item.active ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-grow">{item.desc}</p>
                {item.items && (
                  <div className="text-left w-full pt-4 border-t border-gray-100 mt-auto">
                    <p className="text-xs font-semibold text-slate-700 mb-2">All you need is:</p>
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
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Popular Categories to Rent Online</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              'Furniture', 'Electronics', 'Home Appliances', 'Event Equipment', 'Medical Equipment',
              'Automobile', 'Musical Instruments', 'Tools & Machinery', 'Generator', 'And More'
            ].map((cat, index) => (
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
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Upleex Partner Support Available 24/7</h2>
          <p className="text-slate-600 mb-8">
            Upleex partner support is available to solve all your doubts and issues before and after you start your rental business.
          </p>
          <a href="mailto:partnerships@upleex.com" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg">
            <Mail size={20} />
            partnerships@upleex.com
          </a>
        </div>
      </section>
    </main>
  );
};

export default PartnerPage;
