'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { featuredProducts } from '@/data/mockData';
import { MapPin, Shield, Truck, Star, Calendar, Minus, Plus, ArrowRight, Dot } from 'lucide-react';
import endPointApi from '@/utils/endPointApi';
import { api } from '@/utils/axiosInstance';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [activeTab, setActiveTab] = useState<'monthly' | 'daily'>('monthly');
  const [activeDetailTab, setActiveDetailTab] = useState<'description' | 'details'>('description');
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(3); // Months
  const [selectedImage, setSelectedImage] = useState<string>(''); // For image gallery

  const [productDetails, setProductDetails] = useState<any>(null);

  // Calculated values from API data
  const monthlyPrice = productDetails?.month_arrr?.[selectedDuration === 3 ? 0 : selectedDuration === 6 ? 1 : selectedDuration === 9 ? 2 : 3]?.price || 0;
  const dailyPrice = Math.round(monthlyPrice / 30 * 1.5); // Mock daily formula
  const totalLimit = activeTab === 'monthly' ? monthlyPrice : dailyPrice * days;
  
  // All images including main image
  const allImages = productDetails ? [
    productDetails.product_main_image,
    ...(productDetails.images || []).map((img: any) => img.image || img)
  ].filter(Boolean) : [];

  useEffect(() => {
    const fetchProductDetails = async () => {
      const formData = new FormData();
      formData.append("product_id", id);
      try {
        const res = await api.post(endPointApi.webSingleProductList, formData);
        setProductDetails(res.data.data);
        
        // Set initial selected image
        if (res.data.data?.product_main_image) {
          setSelectedImage(res.data.data.product_main_image);
        }
        
        // Auto-select tab based on product listing type
        if (res.data.data?.product_listing_type_name) {
          const listingType = res.data.data.product_listing_type_name.toLowerCase();
          if (listingType === 'daily') {
            setActiveTab('daily');
          } else if (listingType === 'monthly') {
            setActiveTab('monthly');
          }
        }
      } catch (err) {
        console.error("Error fetching product details", err);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Section */}
            <div className="p-4 lg:p-8 bg-gray-50 flex items-center justify-center">
               <div className="grid gap-4 w-full">
                 <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100">
                   <img 
                     src={selectedImage || productDetails?.product_main_image || 'https://via.placeholder.com/600x450'} 
                     alt={productDetails?.product_name || 'Product'} 
                     className="w-full h-full object-cover"
                   />
                 </div>
                 {/* Thumbnails */}
                 {allImages.length > 0 && (
                   <div className="grid grid-cols-4 gap-4">
                     {allImages.slice(0, 4).map((img, i) => (
                       <div 
                         key={i} 
                         onClick={() => setSelectedImage(img)}
                         className={`aspect-square rounded-lg border-2 bg-white overflow-hidden cursor-pointer transition-all ${selectedImage === img ? 'border-upleex-blue ring-2 ring-upleex-blue/30' : 'border-gray-200 hover:border-upleex-blue/50'}`}
                       >
                         <img src={img} className="w-full h-full object-cover" alt="" />
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>

            {/* Info Section */}
            <div className="p-6 lg:p-10 flex flex-col">
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">{productDetails?.product_name || 'Loading...'}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded text-blue-700 font-medium">
                        {productDetails?.sub_category_name}
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="inline-flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded text-purple-700 font-medium">
                        {productDetails?.product_listing_type_name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-sm font-bold text-slate-900 block mb-2">Select Rental Type</span>
                  <div className="bg-slate-100 p-1 rounded-lg inline-flex w-full sm:w-auto">
                    <button 
                      onClick={() => setActiveTab('monthly')}
                      className={`flex-1 sm:w-40 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'monthly' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Dot className={`inline-block mr-1 ${activeTab === 'monthly' ? 'text-upleex-blue' : 'text-transparent'}`} size={24} />
                      Monthly
                    </button>
                    <button 
                      onClick={() => setActiveTab('daily')}
                      className={`flex-1 sm:w-40 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'daily' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Dot className={`inline-block mr-1 ${activeTab === 'daily' ? 'text-white' : 'text-transparent'}`} size={24} />
                      Daily
                    </button>
                  </div>
                </div>


                {activeTab === 'monthly' ? (
                  /* MONTHLY LAYOUT */
                  <div className="space-y-6 animate-fadeIn min-h-[200px] flex flex-col">
                    {productDetails?.month_arrr && productDetails.month_arrr.length > 0 ? (
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Select Duration</span>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                           {productDetails.month_arrr.map((monthData: any, idx: number) => {
                             const months = [3, 6, 9, 12][idx];
                             return (
                               <div 
                                 key={idx}
                                 onClick={() => setSelectedDuration(months)}
                                 className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${selectedDuration === months ? 'border-red-100 bg-red-50 ring-1 ring-red-200' : 'border-gray-200 hover:border-gray-300'}`}
                               >
                                 <div className="text-sm font-semibold text-slate-900 mb-1">{months} Months</div>
                                 {monthData.cancel_price && monthData.cancel_price !== "" && (
                                   <div className="text-xs text-gray-400 line-through">₹{monthData.cancel_price}</div>
                                 )}
                                 <div className="text-lg font-bold text-slate-900">₹{monthData.price || 0}</div>
                                 <div className="text-[10px] text-gray-500 font-medium mt-1">Per Month</div>
                               </div>
                             );
                           })}
                         </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="text-gray-400" size={32} />
                          </div>
                          <p className="text-gray-500 font-semibold mb-1">Monthly Rental Not Available</p>
                          <p className="text-gray-400 text-sm">This product doesn't have monthly rental options at the moment.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* DAILY LAYOUT */
                  <div className="space-y-6 animate-fadeIn min-h-[200px] flex flex-col">
                    {productDetails?.product_listing_type_name?.toLowerCase() === 'daily' ? (
                      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                         <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold text-slate-700">Number Of Days</span>
                            <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                               <button onClick={() => setDays(Math.max(1, days - 1))} className="p-2 hover:bg-gray-50 text-gray-600"><Minus size={16}/></button>
                               <span className="w-10 text-center font-semibold text-sm">{days}</span>
                               <button onClick={() => setDays(days + 1)} className="p-2 hover:bg-gray-50 text-gray-600"><Plus size={16}/></button>
                            </div>
                         </div>
                         <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                            <span className="text-gray-600">Total Rent :</span>
                            <span className="font-bold text-upleex-blue text-lg">₹{totalLimit.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm pt-1">
                            <span className="text-gray-600">Per Day :</span>
                            <span className="font-medium text-slate-900">₹{dailyPrice.toLocaleString()}</span>
                         </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="text-gray-400" size={32} />
                          </div>
                          <p className="text-gray-500 font-semibold mb-1">Daily Rental Not Available</p>
                          <p className="text-gray-400 text-sm">This product is only available for monthly rental.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Common Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg h-12 px-3">
                    <span className="text-sm font-semibold text-gray-600 mr-3">Quantity :</span>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:bg-gray-100 rounded"><Minus size={16}/></button>
                    <span className="flex-1 text-center font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:bg-gray-100 rounded"><Plus size={16}/></button>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="date" 
                      className="w-full h-12 pl-4 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-upleex-blue uppercase text-gray-600 font-medium"
                      placeholder="Delivery Date"
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                    <Calendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button 
                    size="lg" 
                    className="bg-black text-white hover:bg-gray-900 flex-1 h-12 rounded-lg font-bold"
                    onClick={() => console.log({ id, activeTab, quantity, days: activeTab === 'daily' ? days : undefined, selectedDuration: activeTab === 'monthly' ? selectedDuration : undefined, deliveryDate })}
                  >
                    Get Quote
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1 h-12 rounded-lg font-semibold border-gray-300 text-slate-700 flex items-center justify-center gap-2">
                    <MapPin size={18} className="text-orange-500" /> Enter City
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-gray-100">
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-upleex-blue"><Shield size={20}/></div>
                      <span className="text-[10px] font-bold text-slate-900 uppercase">KYC Verified</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><Shield size={20}/></div>
                      <span className="text-[10px] font-bold text-slate-900 uppercase">Secure Payment</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><Truck size={20}/></div>
                      <span className="text-[10px] font-bold text-slate-900 uppercase">Verified Product</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><ArrowRight size={20}/></div>
                      <span className="text-[10px] font-bold text-slate-900 uppercase">100% Refundable</span>
                   </div>
                </div>

              </div>
            </div>
            
          </div>

          {/* Description & Details Tabs Section */}
          <div className="border-t border-gray-100 p-6 lg:p-10">
            <div className="flex gap-8 border-b border-gray-200 mb-6">
              <button 
                onClick={() => setActiveDetailTab('description')}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeDetailTab === 'description' ? 'border-upleex-blue text-upleex-blue' : 'border-transparent text-gray-500 hover:text-slate-800'}`}
              >
                Description
              </button>
              <button 
                onClick={() => setActiveDetailTab('details')}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeDetailTab === 'details' ? 'border-upleex-blue text-upleex-blue' : 'border-transparent text-gray-500 hover:text-slate-800'}`}
              >
                Product Details
              </button>
            </div>

             <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {activeDetailTab === 'description' ? (
                 <div className="prose prose-slate max-w-none animate-fadeIn">
                   <h3 className="text-lg font-bold text-slate-900 mb-3">{productDetails?.product_name}</h3>
                   {productDetails?.description && productDetails.description.trim() !== '' ? (
                     <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                       {productDetails.description}
                     </p>
                   ) : (
                     <div className="flex items-center justify-center h-full">
                       <p className="text-gray-400 italic">No description available for this product.</p>
                     </div>
                   )}
                 </div>
               ) : (
                 <div className="max-w-3xl h-full">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Specifications</h3>
                    {(() => {
                      // Debug logging
                      console.log('Product Details Data:', productDetails?.product_details);
                      console.log('Is Array?', Array.isArray(productDetails?.product_details));
                      console.log('Length:', productDetails?.product_details?.length);
                      
                      if (productDetails?.product_details && Array.isArray(productDetails.product_details) && productDetails.product_details.length > 0) {
                        return (
                          <div className="space-y-4">
                            {productDetails.product_details.map((spec: any, idx: number) => {
                              // Get label from multiple possible fields
                              const label = spec.label || spec.key || spec.name || spec.title || `Specification ${idx + 1}`;
                              const value = spec.value || spec.description || spec.detail || 'N/A';
                              
                              return (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-3 border-b border-gray-100 last:border-0">
                                  <div className="font-semibold text-slate-900">{label}</div>
                                  <div className="sm:col-span-2 text-slate-600">{value}</div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <p className="text-gray-400 italic mb-2">No detailed specifications available for this product.</p>
                              <p className="text-gray-400 text-xs">
                                {productDetails?.product_details ? 
                                  `(Data type: ${typeof productDetails.product_details}, Array: ${Array.isArray(productDetails.product_details)})` : 
                                  '(No data received from API)'}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    })()}
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
