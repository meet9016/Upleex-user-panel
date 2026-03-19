'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { serviceService, Service } from '@/services/serviceService';
import { MapPin, Clock, Star, ShieldCheck, CheckCircle2, ArrowLeft, Share2, Heart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      const data = await serviceService.getServiceDetails(id);
      setService(data);
      if (data?.image) {
        setActiveImage(data.image);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-upleex-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Loading Service Details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Service Not Found</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">The service you are looking for might have been removed or is temporarily unavailable.</p>
          <Button variant="primary" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/image/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';
    return `${baseUrl}${imagePath}`;
  };

  const allImages = [service.image, ...(service.sub_images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-full bg-white border border-gray-100 text-gray-500 hover:text-upleex-purple hover:shadow-md transition-all">
              <Share2 size={18} />
            </button>
            <button className="p-2.5 rounded-full bg-white border border-gray-100 text-gray-500 hover:text-red-500 hover:shadow-md transition-all">
              <Heart size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 aspect-[16/10] relative group">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={getImageUrl(activeImage)}
                alt={service.service_name}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-upleex-purple shadow-lg">
                  {service.category_name}
                </span>
              </div>
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${activeImage === img ? 'border-upleex-purple shadow-lg scale-105' : 'border-transparent hover:border-purple-200'}`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description Tab Style */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-upleex-purple rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-900">Service Description</h2>
              </div>
              <div
                className="prose prose-purple max-w-none text-slate-600 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                <div className="flex items-center gap-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-upleex-purple shadow-sm">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Verified Professional</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Service Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-[160px] space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl shadow-purple-500/5">
                <div className="space-y-4 mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                    {service.service_name}
                  </h1>
                </div>

                <div className="p-6 bg-gray-50/80 rounded-3xl border border-gray-100 space-y-6 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Standard Price</span>
                    <div className="text-right">
                      <div className="text-3xl font-black text-upleex-purple">
                        ₹{Number(service.price).toLocaleString()}
                        <span className="text-sm font-bold text-gray-400 ml-1.5 italic">/ {service.billing_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200"></div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-slate-700">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-upleex-purple shadow-sm">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available in</div>
                        <div className="font-bold">{service.location || 'Across India'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    fullWidth
                    variant="primary"
                    className="py-4 rounded-2xl text-lg font-bold shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/40 transition-all"
                  >
                    Check Availability
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    className="py-4 rounded-2xl text-lg font-bold border-2 border-gray-100 hover:border-upleex-purple hover:text-upleex-purple transition-all"
                  >
                    <MessageSquare size={20} className="mr-2" />
                    Chat with Expert
                  </Button>
                </div>

                <p className="text-center text-[11px] text-gray-400 mt-6 font-bold uppercase tracking-widest">
                  Secure booking powered by Upleex
                </p>
              </div>

              {/* Vendor Info Card */}
              <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-purple-200 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-50 rounded-2xl flex items-center justify-center text-upleex-purple font-black text-xl shadow-sm group-hover:scale-110 transition-transform">
                  {service.vendor_name?.charAt(0) || 'V'}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Expert Vendor</div>
                  <div className="font-black text-slate-900 group-hover:text-upleex-purple transition-colors">{service.vendor_name || 'Verified Vendor'}</div>
                </div>
                {/* <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-upleex-purple transition-all">
                  <ArrowLeft className="rotate-180" size={16} />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
