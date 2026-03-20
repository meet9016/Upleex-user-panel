'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { serviceService, Service } from '@/services/serviceService';
import { MapPin, Clock, Star, ShieldCheck, CheckCircle2, ArrowLeft, Share2, Heart, MessageSquare, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import clsx from 'clsx';

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      const data = await serviceService.getServiceDetails(id);
      setService(data);
      if (data?.image) {
        setSelectedImage(data.image);
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
    <div className=" bg-gray-50/30 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <BackButton />
          {/* <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-full bg-white border border-gray-100 text-gray-500 hover:text-upleex-purple hover:shadow-md transition-all">
              <Share2 size={18} />
            </button>
            <button className="p-2.5 rounded-full bg-white border border-gray-100 text-gray-500 hover:text-red-500 hover:shadow-md transition-all">
              <Heart size={18} />
            </button>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image Container - Fixed dimensions */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 relative group flex items-center justify-center p-6" style={{ height: '400px' }}>
              <div className="w-full  max-w-[520px]">
                {/* Main image - No changes to size */}
                <div className=" p-10 relative rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 bg-white border border-gray-100 aspect-[4/2.8]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={getImageUrl(selectedImage)}
                  alt={service.service_name}
                  className="w-full h-full object-contain"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </AnimatePresence>
              </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-upleex-purple shadow-lg border border-purple-50">
                  {service.category_name}
                </span>
              </div>
            </div>

            {/* Image Thumbnails - Smaller boxes with gap */}
            {allImages.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {allImages.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedImage(img);
                      setIsHovering(false);
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={clsx(
                      "w-25 h-25 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-white p-1",
                      selectedImage === img || (!selectedImage && i === 0)
                        ? "border-upleex-purple shadow-md"
                        : "border-gray-200 hover:border-upleex-purple hover:shadow-sm",
                    )}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${service.service_name} thumbnail ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex gap-3 invisible" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-20 h-20"></div>
                ))}
              </div>
            )}
           
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-[160px] space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl shadow-purple-500/5">
                <div className="space-y-2 mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                    {service.service_name}
                  </h1>
                </div>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Standard Price</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-upleex-purple">
                      ₹{Number(service.price).toLocaleString()}
                      <span className="text-sm font-bold text-gray-400 ml-1.5 italic">/ {service.billing_type}</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-2"></div>

                {/* Location Section */}
                <div className="space-y-4 py-1">
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

                {/* Booking Button */}
                <div className="space-y-4 mt-3">
                  <Button
                    fullWidth
                    variant="primary"
                    className="py-4 rounded-2xl text-lg font-bold btn-primary"
                  >
                    Check Availability
                  </Button>
                </div>

                <p className="text-center text-[11px] text-gray-400 mt-2  font-bold uppercase tracking-widest">
                  Secure booking powered by Upleex
                </p>
              </div>

              {/* Vendor Info Card */}
              <div className="mt-3">
                <div className="bg-white rounded-2xl border border-gray-100/80 px-4 py-3.5 flex items-center justify-between gap-4 min-h-[80px]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center">
                      <Store size={22} className="text-upleex-blue" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.12em]">
                        Sold By
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {service.vendor_name || 'Verified Vendor'}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-upleex-purple transition-all">
                  <ArrowLeft className="rotate-180" size={16} />
                </div> */}
              </div>
               {/* Description Section */}
            <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-upleex-purple rounded-full"></div>
                <h2 className="text-lg font-bold text-slate-900">Service Description</h2>
              </div>
              <div
                className="prose prose-purple max-w-none text-slate-600 leading-relaxed font-medium text-sm"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
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
          </div>
        </div>
      </div>
    </div>
  );
}