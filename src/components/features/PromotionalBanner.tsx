import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Tag, Clock } from 'lucide-react';
import Link from 'next/link';

export const PromotionalBanner = () => {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-2xl shadow-indigo-200">
          {/* Background Patterns */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl mix-blend-screen"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium backdrop-blur-md border border-white/10 shadow-sm">
                <Sparkles size={14} className="text-yellow-300" />
                <span className="tracking-wide uppercase text-xs font-bold">Special Launch Offer</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Upgrade Your Lifestyle <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">
                  Without Breaking the Bank
                </span>
              </h2>
              
              <p className="text-blue-50 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 font-medium opacity-90 leading-relaxed">
                Get premium furniture, electronics, and appliances on rent. Enjoy free delivery and installation on your first order.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link href="/explore">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-blue-50 border-0 rounded-full font-bold h-14 px-8 text-base shadow-xl shadow-indigo-900/20 hover:scale-105 transition-transform duration-200">
                    Start Renting Now
                  </Button>
                </Link>
                <div className="flex items-center gap-4 justify-center sm:justify-start px-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-indigo-500 bg-gray-200 overflow-hidden relative z-[${5-i}]`}>
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-yellow-300">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-indigo-100 text-xs font-medium">Trusted by 10k+ users</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual Elements */}
            <div className="hidden lg:block relative w-1/2 max-w-md">
                 <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                                <Tag size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg">Flash Sale</h4>
                                <p className="text-indigo-100 text-sm">Ends in 24 hours</p>
                            </div>
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-lg text-white font-mono text-sm">
                            05 : 23 : 45
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1550226891-ef816aed4a98?q=80&w=2070&auto=format&fit=crop" alt="Sofa" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                                <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-bold">₹999</div>
                                <div className="text-indigo-200 text-xs line-through">₹1499</div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop" alt="Washer" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="h-4 w-2/3 bg-white/20 rounded mb-2"></div>
                                <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-bold">₹599</div>
                                <div className="text-indigo-200 text-xs line-through">₹899</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-indigo-100 text-sm">Total Savings</span>
                        <span className="text-yellow-300 font-bold text-xl">₹800/mo</span>
                    </div>
                 </div>
                 
                 {/* Floating elements */}
                 <div className="absolute -top-10 -right-10 bg-white p-4 rounded-xl shadow-xl animate-bounce duration-[3000ms]">
                    <div className="flex items-center gap-2">
                        <Clock size={20} className="text-blue-600" />
                        <span className="font-bold text-slate-800">Fast Delivery</span>
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
