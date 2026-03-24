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
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-16 min-h-screen">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <BackButton />
        </div>

        {/* 🔥 IMPORTANT: items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* LEFT SIDE */}
          <div className="lg:col-span-7 flex flex-col h-full">

            {/* 🔥 FULL LEFT WHITE BOX */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col flex-1">

              {/* Image Card */}
              <div className="relative flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      src={getImageUrl(selectedImage)}
                      alt={service.service_name}
                      className="max-h-full object-contain"
                    />
                  </AnimatePresence>
                </div>

                {/* Category Tag */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-upleex-purple shadow border border-purple-100">
                    {service.category_name}
                  </span>
                </div>
              </div>

              {/* Thumbnails INSIDE SAME BOX */}
              <div className="mt-6 flex gap-3 flex-wrap">
                {allImages.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={clsx(
                      "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-gray-50 p-1",
                      selectedImage === img
                        ? "border-upleex-purple shadow-md scale-105"
                        : "border-gray-200 hover:border-upleex-purple hover:shadow-sm"
                    )}
                  >
                    <img
                      src={getImageUrl(img)}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>

            </div>

          </div>
          {/* RIGHT SIDE */}
          <div className="lg:col-span-5 flex">

            <div className="w-full flex flex-col h-full">

              {/* Remove sticky for equal height */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-purple-500/10 p-7 flex flex-col h-full">

                {/* Title */}
                <h1 className="text-2xl font-bold text-slate-900 text-center leading-snug">
                  {service.service_name}
                </h1>

                {/* Price */}
                <div className="flex justify-center mt-3">
                  <span className="bg-upleex-purple/10 text-upleex-purple font-bold px-5 py-2 rounded-lg text-sm shadow-sm">
                    Service Fee: ₹ {Number(service.price).toLocaleString()}/{service.billing_type}
                  </span>
                </div>

                {/* Location */}
                <div className="flex justify-center items-center gap-2 text-sm text-slate-600 mt-3">
                  <MapPin size={16} className="text-upleex-purple" />
                  <span>
                    Available in{' '}
                    <span className="font-semibold text-upleex-purple">
                      {service.location || 'Across India'}
                    </span>
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 my-4"></div>

                {/* Description */}
                <div>
                  <h2 className="text-center font-semibold text-slate-800 mb-2">
                    Description
                  </h2>

                  <div className="border border-gray-300 rounded-lg p-4 text-sm text-slate-600 leading-relaxed bg-gray-50">
                    <div
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                  </div>
                </div>

                {/* 🔥 PUSH CONTENT UP */}
                <div className="flex-1"></div>

                {/* Buttons (ALWAYS BOTTOM) */}
                <div className="flex gap-3 justify-center pt-4">
                  <button className="bg-upleex-purple hover:bg-upleex-purple/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                    Show Contact
                  </button>
                  <button className="bg-upleex-purple hover:bg-upleex-purple/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                    Chat Now
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}