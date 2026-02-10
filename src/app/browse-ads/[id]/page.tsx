"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  MapPin,
  Shield,
  Truck,
  Star,
  Calendar,
  Minus,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ImageOff,
} from "lucide-react";
import endPointApi from "@/utils/endPointApi";
import { api } from "@/utils/axiosInstance";
import clsx from "clsx";
import { AuthModal } from "@/components/features/AuthModal";
import { QuoteModal } from "@/components/features/QuoteModal";
import { Modal } from "@/components/ui/Modal";
import { RelatedProducts } from "@/components/features/RelatedProducts";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [activeTab, setActiveTab] = useState<"monthly" | "daily">("monthly");
  const [activeDetailTab, setActiveDetailTab] = useState<
    "description" | "details"
  >("description");
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(); // Months
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string>(""); // For image gallery
  const [productDetails, setProductDetails] = useState<any>(null);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 200;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (productDetails?.month_arrr?.length) {
      setSelectedMonthId(productDetails.month_arrr[0].product_months_id);
    }
  }, [productDetails]);

  // Calculated values from API data
  const monthlyPrice = (
    productDetails?.month_arrr?.[
      selectedDuration === 3
        ? 0
        : selectedDuration === 6
          ? 1
          : selectedDuration === 9
            ? 2
            : 3
    ]?.price || 0
  ) * quantity; // Multiply by quantity
  
  const dayPrice = productDetails?.price || 0;
  const totalPrice = activeTab === "monthly" ? monthlyPrice : dayPrice * days * quantity; // Include quantity in daily total

  const allImages = productDetails
    ? [
        productDetails.product_main_image,
        ...(productDetails.images || []).map((img: any) => img.image || img),
      ].filter(Boolean)
    : [];

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
        const listingType =
          res.data.data?.product_listing_type_name?.toLowerCase();
        if (listingType === "daily") setActiveTab("daily");
        else if (listingType === "monthly") setActiveTab("monthly");
      } catch (err) {
        console.error("Error fetching product details", err);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const handleGetQuoteClick = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setIsAuthModalOpen(true);
    } else {
      setIsQuoteModalOpen(true);
    }
  };

  const submitQuote = async (note: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("product_id", String(id));
    formData.append("delivery_date", String(deliveryDate));
    formData.append("number_of_days", String(days));
    formData.append("months_id", selectedMonthId ?? "");
    formData.append("qty", String(quantity));
    
    if (note.trim()) {
      formData.append("note", note.trim());
    }

    try {
      const res = await api.post(endPointApi.webGetQuote, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.status === 200 || res.data?.success === true) {
        setIsQuoteModalOpen(false);
        setIsSuccessModalOpen(true);
      }
      
      console.log("res00.....", res.data);
    } catch (err) {
      console.error("Error fetching product details", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    setIsQuoteModalOpen(true);
  };

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    // Set default delivery date to 2 days from today
    const today = new Date();
    today.setDate(today.getDate() + 2); // add 2 days
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    setDeliveryDate(formattedDate);
    setMinDate(formattedDate);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
            {/* ─── Left: Gallery ──────────────────────────────────────── */}
            <div className="bg-white p-4 lg:p-6 lg:pb-2 flex items-start justify-center border-r border-gray-100">
              <div className="w-full max-w-[520px]">
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 bg-white border border-gray-100 aspect-[4/2.8]">
                  {allImages.length > 0 ? (
                    <img
                      src={selectedImage || allImages[0]}
                      alt={productDetails?.product_name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                      <ImageOff size={48} strokeWidth={1.5} className="mb-2 opacity-50" />
                      <span className="text-sm font-medium">No Image Available</span>
                    </div>
                  )}
                </div>

                {allImages.length > 0 ? (
                  <div className="mt-5 grid grid-cols-5 gap-3">
                    {allImages.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={clsx(
                          "aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200",
                          selectedImage === img || (!selectedImage && i === 0)
                            ? "border-blue-600 shadow-md scale-105"
                            : "border-gray-200 hover:border-blue-400 hover:shadow-sm",
                        )}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-5 gap-3 invisible" aria-hidden="true">
                    <div className="aspect-square"></div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-200">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-upleex-blue border border-blue-100">
                      <Shield size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 uppercase leading-tight">
                      KYC<br/>Verified
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                      <Shield size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 uppercase leading-tight">
                      Secure<br/>Payment
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                      <Truck size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 uppercase leading-tight">
                      Verified<br/>Product
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 uppercase leading-tight">
                      100%<br/>Refund
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Right: Content ─────────────────────────────────────── */}
            <div className="p-4 lg:p-5 xl:p-4 lg:pb-2 xl:pb-2 flex flex-col">
              <div className="flex flex-col h-full">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    {productDetails?.product_name || "Loading product..."}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-1 text-sm mb-4">
                  {productDetails?.sub_category_name && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-xs">
                      {productDetails.sub_category_name}
                    </span>
                  )}
                  {productDetails?.product_listing_type_name && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet-50 text-violet-700 font-medium text-xs">
                      {productDetails.product_listing_type_name}
                    </span>
                  )}
                </div>

                {/* Rental Type Tabs */}
                {/* <div className="mb-7">
                  <label className="text-sm font-semibold text-slate-900  mb-2.5 block">
                    Select Rental Type
                  </label>
                  <div className="bg-slate-100 p-1 rounded-lg inline-flex w-full sm:w-auto">
                    <button
                      onClick={() => setActiveTab("monthly")}
                      className={`flex-1 sm:w-40 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === "monthly" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      <Dot
                        className={`inline-block mr-1 ${activeTab === "monthly" ? "text-upleex-blue" : "text-transparent"}`}
                        size={24}
                      />
                      Monthly
                    </button>
                    <button
                      onClick={() => setActiveTab("daily")}
                      className={`flex-1 sm:w-40 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === "daily" ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      <Dot
                        className={`inline-block mr-1 ${activeTab === "daily" ? "text-white" : "text-transparent"}`}
                        size={24}
                      />
                      Daily
                    </button>
                  </div>
                </div> */}

                {activeTab === "monthly" ? (
                  <div className="">
                    {productDetails?.month_arrr?.length > 0 ? (
                      <>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                            Select Duration
                          </label>
                          
                          <div className="relative group/scroll">
                            {/* Left Scroll Button */}
                            <button 
                              onClick={() => scroll("left")}
                              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10 p-1.5 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-all opacity-0 group-hover/scroll:opacity-100 hidden sm:flex items-center justify-center"
                              aria-label="Scroll left"
                            >
                              <ChevronLeft size={18} />
                            </button>

                            <div 
                              ref={scrollContainerRef}
                              className="flex overflow-x-auto gap-3.5 pb-4 pt-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
                            >
                              {productDetails.month_arrr.map((monthData: any) => {
                                const active =
                                  selectedMonthId === monthData.product_months_id;
                                // Show unit price, not multiplied by quantity
                                const unitPrice = monthData.price;

                                return (
                                  <button
                                    key={monthData.product_months_id}
                                    onClick={() =>
                                      setSelectedMonthId(
                                        monthData.product_months_id,
                                      )
                                    }
                                    className={clsx(
                                      "group relative min-w-[140px] flex-shrink-0 rounded-xl border-2 p-4 text-center transition-all duration-200",
                                      active
                                        ? "border-blue-600 bg-blue-50/60"
                                        : "border-gray-100 hover:border-gray-200 bg-white",
                                    )}
                                  >
                                    <div className="text-base font-bold text-gray-900">
                                      {monthData.month_name}
                                    </div>

                                    {monthData.cancel_price && (
                                      <div className="text-xs text-gray-400 line-through mt-0.5">
                                        ₹{(monthData.cancel_price).toLocaleString()}
                                      </div>
                                    )}

                                    <div className="text-xl font-extrabold text-gray-900 mt-1">
                                      ₹{unitPrice.toLocaleString()}
                                    </div>

                                    <div className="text-xs text-gray-500 mt-0.5">
                                      per month
                                    </div>

                                    {active && (
                                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        Selected
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Right Scroll Button */}
                            <button 
                              onClick={() => scroll("right")}
                              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 p-1.5 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-all opacity-0 group-hover/scroll:opacity-100 hidden sm:flex items-center justify-center"
                              aria-label="Scroll right"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Summary Section for Monthly */}
                        {selectedMonthId && (() => {
                          const selectedMonthData = productDetails.month_arrr.find(
                            (m: any) => m.product_months_id === selectedMonthId
                          );
                          if (!selectedMonthData) return null;
                          
                          return (
                            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                Payment Breakdown
                              </h3>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Plan Duration</span>
                                  <span className="font-medium text-gray-900">{selectedMonthData.month_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Monthly Price</span>
                                  <span className="font-medium text-gray-900">₹{selectedMonthData.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Quantity</span>
                                  <span className="font-medium text-gray-900">{quantity} Units</span>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-3 flex justify-between items-center mt-2">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-900">Total Amount</span>
                                    <span className="text-[10px] text-gray-500 font-normal">(Price × Qty)</span>
                                  </div>
                                  <span className="text-2xl font-extrabold text-blue-700">
                                    ₹{(selectedMonthData.price * quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    ) : (
                      <div className="py-10 text-center text-gray-500">
                        Monthly plans not available
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {productDetails?.product_listing_type_name?.toLowerCase() ===
                    "daily" ? (
                      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/40">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-semibold text-gray-700">
                            Rental Days
                          </span>
                          <div className="flex items-center bg-white border rounded-lg shadow-sm">
                            <button
                              onClick={() => setDays(Math.max(1, days - 1))}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={days <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-bold text-base">
                              {days}
                            </span>
                            <button
                              onClick={() => setDays(Math.min(31, days + 1))}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={days >= 31}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center bg-blue-50/80 p-2.5 rounded-lg border border-blue-100">
                            <span className="text-sm font-semibold text-blue-900">
                              Per Day Price
                            </span>
                            <span className="font-bold text-lg text-blue-900">
                              ₹{dayPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 px-1">
                            <span>Rental Duration</span>
                            <span className="font-medium">{days} Days</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 px-1">
                            <span>Quantity</span>
                            <span className="font-medium">{quantity} Units</span>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2 px-1">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-600">
                                Total Amount
                              </span>
                              <span className="text-[10px] text-gray-400 font-normal">
                                (Price × Days × Qty)
                              </span>
                            </div>
                            <div className="text-2xl font-extrabold text-blue-700">
                              ₹{(dayPrice * days * quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-500">
                        Daily rental not available
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity + Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4  pt-4">
                  <div className="flex items-center justify-between bg-white border rounded-lg px-4 h-12 shadow-sm">
                    <span className="font-medium text-gray-700">Quantity</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity >= 10}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <DatePicker
                    label="Delivery Date"
                    value={deliveryDate}
                    onChange={setDeliveryDate}
                    min={minDate}
                  />
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white shadow-lg h-12 text-base font-semibold flex-1"
                    onClick={handleGetQuoteClick}
                  >
                    Get Quote →
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 border-2 border-gray-200 hover:border-gray-800 text-gray-700 hover:text-gray-900 font-bold flex items-center gap-2 flex-1 rounded-xl bg-white"
                    onClick={() => router.push('/cart')}
                  >
                    <MapPin size={18} className="text-orange-600" />
                    Enter City
                  </Button>
                </div>


              </div>
            </div>
          </div>

          {/* Description & Details Tabs Section */}
          <div className="border-t border-gray-100 p-6 lg:p-10">
            <div className="flex gap-8 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveDetailTab("description")}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeDetailTab === "description" ? "border-upleex-blue text-upleex-blue" : "border-transparent text-gray-500 hover:text-slate-800"}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveDetailTab("details")}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeDetailTab === "details" ? "border-upleex-blue text-upleex-blue" : "border-transparent text-gray-500 hover:text-slate-800"}`}
              >
                Product Details
              </button>
            </div>

            <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activeDetailTab === "description" ? (
                <div className="prose prose-slate max-w-none animate-fadeIn">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {productDetails?.product_name}
                  </h3>
                  {productDetails?.description &&
                  productDetails.description.trim() !== "" ? (
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {productDetails.description}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 italic">
                        No description available for this product.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-3xl h-full">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Specifications
                  </h3>
                  {(() => {
                    if (
                      productDetails?.product_details &&
                      Array.isArray(productDetails.product_details) &&
                      productDetails.product_details.length > 0
                    ) {
                      return (
                        <div className="space-y-4">
                          {productDetails.product_details.map(
                            (spec: any, idx: number) => {
                              const label =
                                spec.label ||
                                spec.key ||
                                spec.name ||
                                spec.title ||
                                `Specification ${idx + 1}`;
                              const value =
                                spec.value ||
                                spec.description ||
                                spec.detail ||
                                "N/A";

                              return (
                                <div
                                  key={idx}
                                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-3 border-b border-gray-100 last:border-0"
                                >
                                  <div className="font-semibold text-slate-900">
                                    {label}
                                  </div>
                                  <div className="sm:col-span-2 text-slate-600">
                                    {value}
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <p className="text-gray-400 italic mb-2">
                              No detailed specifications available for this
                              product.
                            </p>
                            <p className="text-gray-400 text-xs">
                              {productDetails?.product_details
                                ? `(Data type: ${typeof productDetails.product_details}, Array: ${Array.isArray(productDetails.product_details)})`
                                : "(No data received from API)"}
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

        {/* Related Products Section */}
        <RelatedProducts />
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onSubmit={submitQuote}
        loading={isSubmitting}
        productName={productDetails?.product_name}
      />

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        className="max-w-md"
        hideHeader
        noPadding
      >
        <div className="flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50 animate-in zoom-in duration-300">
            <CheckCircle size={40} strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Quote Requested!</h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for your interest. Our team will contact you shortly with the best price.
          </p>
          <Button 
            fullWidth 
            onClick={() => setIsSuccessModalOpen(false)}
            className="text-white font-bold py-3.5 rounded-xl shadow-lg shadow-gray-900/10"
          >
            Okay, Got it
          </Button>
        </div>
      </Modal>
    </div>
  );
}