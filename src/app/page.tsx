"use client";
import { Button } from '@/components/ui/Button';
import { CategoryCard } from '@/components/features/CategoryCard';
import { ProductCard } from '@/components/features/ProductCard';
import { categories, featuredProducts } from '@/data/mockData';
import { ArrowRight, CheckCircle, Shield, Clock, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import endPointApi from '@/utils/endPointApi';
import { api } from '@/utils/axiosInstance';

interface Category {
  id: number;
  categories_name: string;
  image: string;
  categories_id: string;
  product_count?: number;
}

interface CategoryResponse {
  all_categories: Category[];
}

export default function Home() {
 const [categoryList, setCategoryList] = useState<CategoryResponse | null>(null);
  
     useEffect(() => {
      const fetchCategories = async () => {
            try {
                const res = await api.post(endPointApi.home, {});
                // if (res?.data?.data) {
                    setCategoryList(res.data.data);
                // }
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };

        fetchCategories();
    }, []);

  return (
  <div className="min-h-screen flex flex-col bg-gray-50">
        {/* <Navbar /> */}
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50/50 -z-10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
              <div className="text-center md:text-left md:flex md:items-center md:justify-between">
                <div className="md:w-1/2 space-y-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-upleex-blue text-sm font-semibold mb-2">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    #1 Rental Marketplace in India
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Don't Buy. <span className="text-transparent bg-clip-text bg-gradient-to-r from-upleex-purple to-upleex-blue">Just Rent It.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0">
                    Access premium lifestyle products without the commitment. From furniture to fitness, rent everything you need at a fraction of the cost.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                    <Button size="lg" className="rounded-full px-8 shadow-blue-500/20 shadow-xl">
                      Explore Products
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/50">
                      Become a Seller
                    </Button>
                  </div>
                  
                  <div className="pt-8 flex items-center justify-center md:justify-start gap-8 text-slate-500 text-sm font-medium">
                    <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Verified Products</div>
                    <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Free Delivery</div>
                  </div>
                </div>
                
                <div className="mt-12 md:mt-0 md:w-1/2 relative">
                  <div className="relative z-10 w-full rounded-2xl bg-white shadow-2xl p-4 md:p-6 transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                    <img 
                     src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop" 
                     alt="Modern Living Room" 
                     className="rounded-xl w-full h-64 md:h-80 object-cover"
                    />
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">Modern Living Setup</h3>
                        <p className="text-gray-500 text-sm">Full Room Package</p>
                      </div>
                      <Button size="sm">Rent @ ₹2499/mo</Button>
                    </div>
                  </div>
                  {/* Decorative blobs */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Categories Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Find exactly what you are looking for from our wide range of rental categories.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {categoryList?.all_categories?.map((cat) => (
                  <CategoryCard key={cat.id} {...cat} />
                ))}
              </div>
              </div>
          </section>
  
          {/* Featured Products */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Trending Rentals</h2>
                  <p className="text-slate-500">Popular items being rented right now.</p>
                </div>
                <Button variant="ghost" className="hidden md:flex items-center gap-1 text-upleex-blue">
                  View All <ArrowRight size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="mt-8 text-center md:hidden">
                <Button variant="outline" fullWidth>View All Products</Button>
              </div>
            </div>
          </section>
  
          {/* Value Props / Why Choose Us */}
          <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-upleex-blue flex items-center justify-center mb-6">
                    <Shield size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Assured</h3>
                  <p className="text-slate-500 leading-relaxed">Every product is quality checked, sanitized, and maintained to ensure you get the best experience.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 text-upleex-purple flex items-center justify-center mb-6">
                    <Clock size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Flexible Tenure</h3>
                  <p className="text-slate-500 leading-relaxed">Rent for a month or a year. Upgrade or return anytime. You choose what works for you.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                    <Activity size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Free Maintenance</h3>
                  <p className="text-slate-500 leading-relaxed">We take care of repairs and maintenance throughout your rental period at no extra cost.</p>
                </div>
              </div>
            </div>
          </section>
  
          {/* CTA Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-upleex-dark to-slate-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                  <h2 className="text-3xl md:text-5xl font-bold">Ready to upgrade your lifestyle?</h2>
                  <p className="text-blue-100 text-lg">Join thousands of happy customers renting their favorite products on Upleex.</p>
                  <div className="pt-4">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 shadow-xl border-none">
                      Start Renting Now
                    </Button>
                  </div>
                </div>
                
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-upleex-blue opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-upleex-purple opacity-20 blur-3xl"></div>
              </div>
            </div>
          </section>
        </main>
      </div>
  );
}
