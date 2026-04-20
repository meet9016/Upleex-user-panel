'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Store, PackageOpen, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceCard } from '@/components/features/ServiceCard';
import { serviceService, Service } from '@/services/serviceService';
import { BackButton } from '@/components/ui/BackButton';
import { useCity } from '@/hooks/useCity';

export default function SellerServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-upleex-purple border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <SellerServicesContent />
    </Suspense>
  );
}

function SellerServicesContent() {
  const searchParams = useSearchParams();
  const vendorId = searchParams?.get('vendor_id') ?? '';
  const vendorNameFromQuery = searchParams?.get('vendor_name') ?? '';
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedCity = useCity();

  useEffect(() => {
    const fetchVendorServices = async () => {
      if (!vendorId) return;
      setLoading(true);
      try {
        const data = await serviceService.getServices({
          vendor_id: vendorId,
          city: selectedCity
        });
        setServices(data);
      } catch (error) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorServices();
  }, [vendorId, selectedCity]);

  // Derived vendor info from the first service if available
  const vendorAddress = services.length > 0 ? services[0].vendor_address : null;
  const vendorName = services.length > 0 ? services[0].vendor_name : vendorNameFromQuery;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[80px] z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <BackButton />
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-upleex-blue/10 to-purple-500/10 flex items-center justify-center border border-upleex-blue/20">
                  <Store size={32} className="text-upleex-blue" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-upleex-blue  mb-1">Service Provider</div>
                  <h1 className="text-2xl font-bold text-slate-900">{vendorName || 'Vendor'}</h1>
                  {vendorAddress && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1 font-medium">
                      <MapPin size={14} className="text-upleex-purple" />
                      <span>{vendorAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="text-sm font-bold text-upleex-purple">{services.length} Premium Services</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Portfolio <span className="text-slate-400 font-medium">({services.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {services.map((service, index) => (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <PackageOpen size={48} className="text-gray-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No services found</h3>
            <p className="text-slate-500 max-w-sm text-center font-medium">
              This vendor hasn't listed any services in {selectedCity} yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
