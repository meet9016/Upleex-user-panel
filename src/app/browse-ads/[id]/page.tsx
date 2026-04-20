"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
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
  ShoppingCart,
  Store,
  X,
  Clock,
} from "lucide-react";
import { productService } from "@/services/productService";
import clsx from "clsx";
import { AuthModal } from "@/components/features/AuthModal";
import { QuoteModal } from "@/components/features/QuoteModal";
import { Modal } from "@/components/ui/Modal";
import { RelatedProducts } from "@/components/features/RelatedProducts";
import { ProductReviews } from "@/components/features/ProductReviews";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "react-hot-toast";
import { Heart } from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [activeTab, setActiveTab] = useState<"monthly" | "daily">("monthly");
  const [activeDetailTab, setActiveDetailTab] = useState<
    "description" | "details" | "reviews"
  >("details");
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:00");
  const [selectedDuration, setSelectedDuration] = useState(); // Months
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string>(""); // For image gallery
  const [productDetails, setProductDetails] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [localLiked, setLocalLiked] = useState<boolean | null>(null);

  // State for magnifier
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

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
    if (productDetails?.month_arr?.length) {
      setSelectedMonthId(productDetails.month_arr[0].product_months_id);
    }
  }, [productDetails]);

  const monthlyPrice = (() => {
    if (!productDetails?.month_arr?.length || !selectedMonthId) return 0;
    const selectedMonth =
      productDetails.month_arr.find(
        (m: any) => m.product_months_id === selectedMonthId
      ) || productDetails.month_arr[0];
    return Number(selectedMonth.price || 0) * quantity;
  })();

  const unitPrice = productDetails?.price || 0;
  const totalPrice = activeTab === "monthly" ? monthlyPrice : unitPrice * days * quantity;

  const allImages = productDetails
    ? [
      productDetails.product_main_image,
      ...(productDetails.images || []).map((img: any) => img.image || img),
    ].filter(Boolean)
    : [];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await productService.getSingleProduct(id);
        const data = res?.data || res?.product || res;
        setProductDetails(data);

        if (data?.product_main_image) {
          setSelectedImage(data.product_main_image);
        }
        const listingType = data?.product_listing_type_name?.toLowerCase();
        if (listingType === "daily" || listingType === "hourly") setActiveTab("daily");
        else if (listingType === "monthly") setActiveTab("monthly");
      } catch (err) {
        console.error("Error fetching product details", err);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  // Handle mouse move for magnifier
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !imageRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain values between 0 and 100
    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));

    setMousePosition({ x: constrainedX, y: constrainedY });
  };

  // Handle image load to get dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  const handleGetQuoteClick = () => {
    const token = localStorage.getItem("token");

    // Check stock availability for rent products
    if (!isSell && productDetails) {
      const availableQty = productDetails.available_quantity || 0;
      if (availableQty <= 0) {
        toast.error(`Product "${productDetails.product_name}" is out of stock`);
        return;
      }
    }

    if (!token) {
      setIsAuthModalOpen(true);
    } else {
      setIsQuoteModalOpen(true);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    // Check stock availability for sell products
    if (isSell && productDetails) {
      const availableStock = productDetails.available_quantity || 0;
      const isOutOfStock = productDetails.is_out_of_stock;
      const existingCartItem = cartItems?.find((item) => item.id === id);
      const existingQty = existingCartItem ? parseInt(existingCartItem.qty || '0', 10) : 0;
      const totalRequested = quantity + existingQty;

      if (isOutOfStock || availableStock < totalRequested) {
        toast.error(`Product "${productDetails.product_name}" is out of stock or insufficient quantity available. Available: ${availableStock}, In Cart: ${existingQty}, Requested: ${quantity}`);
        return;
      }
    }

    // Check quantity availability for rent products
    if (!isSell && productDetails) {
      const availableQty = productDetails.available_quantity || 0;
      if (availableQty < quantity) {
        toast.error(`Only ${availableQty} units available for rent. Requested: ${quantity}`);
        return;
      }
    }

    try {
      setIsAddingToCart(true);
      await addToCart(id, quantity);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const submitQuote = async (note: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSubmitting(true);
    try {
      let monthsId = "";
      if (activeTab === "monthly" && selectedMonthId && productDetails?.month_arr?.length) {
        const selectedMonth = productDetails.month_arr.find(
          (m: any) => m.product_months_id === selectedMonthId
        );
        if (selectedMonth) {
          monthsId = selectedMonth.months_id || selectedMonth.product_months_id || "";
        }
      }

      const res = await productService.getQuote({
        product_id: String(id),
        number_of_days: days,
        months_id: monthsId,
        qty: quantity,
        note,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime
      });

      if (res?.status === 200 || res?.success === true) {
        setIsQuoteModalOpen(false);
        setIsSuccessModalOpen(true);
        // Reset form fields after successful submission
        setQuantity(1);
        setDays(1);
        setStartDate(minDate);
        setStartTime("09:00");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to submit quote. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    if (isSell) {
      handleAddToCart();
    } else {
      setIsQuoteModalOpen(true);
    }
  };

  // Helper function to strip HTML tags
  const stripHtmlTags = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const handleWishlistToggle = async () => {
    if (!id) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    const currentStatus = localLiked !== null ? localLiked : (isInWishlist(id) || !!productDetails?.is_wishlist);
    const newStatus = !currentStatus;
    setLocalLiked(newStatus);

    setIsWishlistLoading(true);
    try {
      const success = await toggleWishlist(id, () => {
        setIsAuthModalOpen(true);
        setLocalLiked(null);
      });
      if (!success) {
        setLocalLiked(null);
      }
    } catch (err) {
      setLocalLiked(null);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayFormatted = `${yyyy}-${mm}-${dd}`;

    setMinDate(todayFormatted);
    setStartDate(todayFormatted);
  }, []);

  const isWishlisted = localLiked !== null ? localLiked : (isInWishlist(id) || !!productDetails?.is_wishlist);


  const listingType = productDetails?.product_listing_type_name?.toLowerCase();
  const baseType = productDetails?.product_type_name?.toLowerCase();
  const isSell = baseType === "sell";
  const isDaily = listingType === "daily";
  const isHourly = listingType === "hourly";

  // Auto-calculate end date based on product type (for daily and monthly only)
  useEffect(() => {
    if (!startDate || isSell || isHourly) return;

    let calculatedEndDate = new Date(startDate);

    if (activeTab === 'monthly' && selectedMonthId && productDetails?.month_arr?.length) {
      // For monthly: add months to start date
      const selectedMonth = productDetails.month_arr.find(
        (m: any) => m.product_months_id === selectedMonthId
      );
      if (selectedMonth) {
        let monthCount = 1;
        const parsed = parseInt(String(selectedMonth.month_name).replace(/[^0-9]/g, ''));
        if (!isNaN(parsed) && parsed > 0) {
          monthCount = parsed;
        }

        const startDay = calculatedEndDate.getDate();
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + monthCount);

        // Handle end of month rollover
        if (calculatedEndDate.getDate() !== startDay) {
          calculatedEndDate.setDate(0);
        }
      }
    } else if (isDaily) {
      // For daily: add days to start date
      calculatedEndDate.setDate(calculatedEndDate.getDate() + days);
    }

    const yyyy = calculatedEndDate.getFullYear();
    const mm = String(calculatedEndDate.getMonth() + 1).padStart(2, "0");
    const dd = String(calculatedEndDate.getDate()).padStart(2, "0");
    setEndDate(`${yyyy}-${mm}-${dd}`);
  }, [startDate, days, activeTab, selectedMonthId, isSell, productDetails, isDaily, isHourly]);

  // Calculate min end date for daily/monthly
  const getMinEndDate = () => {
    if (!startDate) return startDate;
    let minEnd = new Date(startDate);
    if (activeTab === 'monthly' && selectedMonthId && productDetails?.month_arr?.length) {
      const selectedMonth = productDetails.month_arr.find(
        (m: any) => m.product_months_id === selectedMonthId
      );
      if (selectedMonth) {
        const monthCount = parseInt(selectedMonth.month_name) || 1;
        minEnd.setMonth(minEnd.getMonth() + monthCount);
        minEnd.setDate(new Date(startDate).getDate());
      }
    } else if (isDaily) {
      minEnd.setDate(minEnd.getDate() + days);
    }
    const yyyy = minEnd.getFullYear();
    const mm = String(minEnd.getMonth() + 1).padStart(2, "0");
    const dd = String(minEnd.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Auto-calculate end date and time for hourly products
  useEffect(() => {
    if (!isHourly || !startTime || !startDate) return;

    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours + days;
    let endMinutes = minutes;
    let daysToAdd = 0;

    // Handle day overflow
    if (endHours >= 24) {
      daysToAdd = Math.floor(endHours / 24);
      endHours = endHours % 24;
    }

    // Calculate end date with day overflow
    let calculatedEndDate = new Date(startDate);
    calculatedEndDate.setDate(calculatedEndDate.getDate() + daysToAdd);

    const yyyy = calculatedEndDate.getFullYear();
    const mm = String(calculatedEndDate.getMonth() + 1).padStart(2, "0");
    const dd = String(calculatedEndDate.getDate()).padStart(2, "0");
    setEndDate(`${yyyy}-${mm}-${dd}`);

    const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    setEndTime(formattedEndTime);
  }, [startTime, days, isHourly, startDate]);

  // Validate end date based on product type
  const validateEndDate = (newEndDate: string) => {
    if (!startDate || !newEndDate) return true;

    const start = new Date(startDate);
    const end = new Date(newEndDate);

    if (activeTab === 'monthly' && productDetails?.month_arr?.length) {
      // For monthly: end date must be in correct month
      const selectedMonth = productDetails.month_arr.find(
        (m: any) => m.product_months_id === selectedMonthId
      );
      if (selectedMonth) {
        const monthCount = parseInt(selectedMonth.month_name) || 1;
        const expectedEnd = new Date(start);
        expectedEnd.setMonth(expectedEnd.getMonth() + monthCount);
        expectedEnd.setDate(new Date(startDate).getDate());
        return end.getTime() === expectedEnd.getTime();
      }
    } else if (isDaily || isHourly) {
      // For daily/hourly: end date must be >= start date + days
      const minEnd = new Date(start);
      minEnd.setDate(minEnd.getDate() + days);
      return end >= minEnd;
    }
    return true;
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
            {/* ─── Left: Gallery (Bilkul same) ────────────────── */}
            <div className="bg-white p-6 lg:p-8 xl:p-10 flex flex-col items-center justify-center border-r border-gray-100 min-h-full">
              <div className="w-full max-w-[520px]">
                {/* Main image - No changes to size */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 bg-white border border-gray-100 aspect-[4/2.8]">
                  {allImages.length > 0 ? (
                    <div
                      ref={imageContainerRef}
                      className="relative w-full h-full cursor-crosshair"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      onMouseMove={handleMouseMove}
                    >
                      <img
                        ref={imageRef}
                        src={selectedImage || allImages[0]}
                        alt={productDetails?.product_name}
                        className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                        onLoad={handleImageLoad}
                      />

                      {/* Magnifier lens overlay - shows which area is being zoomed */}
                      {isHovering && (
                        <div
                          className="absolute border-2 border-blue-500 bg-white/20 pointer-events-none"
                          style={{
                            width: '80px',
                            height: '80px',
                            left: `${mousePosition.x}%`,
                            top: `${mousePosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '4px',
                            boxShadow: '0 0 0 1px rgba(255,255,255,0.5)',
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                      <ImageOff size={48} strokeWidth={1.5} className="mb-2 opacity-50" />
                      <span className="text-sm font-medium">No Image Available</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail gallery */}
                {allImages.length > 0 ? (
                  <div className="mt-5 grid grid-cols-5 gap-3">
                    {allImages.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedImage(img);
                          setIsHovering(false);
                        }}
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
                          className="w-full h-full object-contain"
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
                {!isSell && (
                  <div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t border-gray-200">
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-upleex-blue border border-blue-100">
                        <Shield size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700  leading-tight">
                        KYC<br />Verified
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                        <Shield size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700  leading-tight">
                        Secure<br />Payment
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                        <Truck size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700  leading-tight">
                        Verified<br />Product
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                        <ArrowRight size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700  leading-tight">
                        100%<br />Refund
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── Right: Content with Floating Zoom Image ────────── */}
            <div className="p-6 lg:p-6 xl:p-6 flex flex-col relative min-h-full">
              {/* Floating Zoomed Image - Pen on book effect */}
              {isHovering && imageDimensions.width > 0 && (
                <div
                  ref={zoomContainerRef}
                  className="absolute z-50 rounded-xl overflow-hidden shadow-2xl border-2 border-white bg-white animate-in fade-in zoom-in duration-200"
                  style={{
                    width: '650px',
                    height: '531px',
                    top: '20px',
                    right: '10px',
                    transform: 'translateX(0)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  }}
                >
                  <div className="relative w-full h-full">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${selectedImage || allImages[0]})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: `${imageDimensions.width * 2}px ${imageDimensions.height * 2}px`,
                        backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                        backgroundColor: '#f8fafc',
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      Zoom
                    </div>
                  </div>
                </div>
              )}

              {/* Product Details Section - Zoom image floats above this */}
              <div className="flex flex-col h-full relative">

                <div className="mb-4 flex items-start justify-between gap-4">
                  <h1
                    className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight truncate leading-tight flex-1"
                    title={productDetails?.product_name}
                  >
                    {productDetails?.product_name || "Loading product..."}
                  </h1>
                  
                  {/* Wishlist Heart Button */}
                  <button
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className={clsx(
                      "flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 border-2",
                      isWishlisted
                        ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                        : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-red-400"
                    )}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      size={22}
                      className={clsx(
                        "transition-all duration-200",
                        isWishlisted && "fill-current"
                      )}
                    />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
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
                  <div className={clsx(isSell && "hidden")}>
                    {productDetails?.month_arr?.length > 0 ? (
                      <>
                        <div>
                          <label className="text-xs font-bold text-gray-500  block">
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
                              {productDetails.month_arr.map((monthData: any) => {
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
                          const selectedMonthData = productDetails.month_arr.find(
                            (m: any) => m.product_months_id === selectedMonthId
                          );
                          if (!selectedMonthData) return null;

                          return (
                            <div className="p-3 border border-gray-200 rounded-xl bg-gray-50/50">
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Plan Duration</span>
                                  <span className="font-medium text-gray-900">{selectedMonthData.month_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Monthly Price</span>
                                  <span className="font-medium text-gray-900">₹{selectedMonthData.price.toLocaleString()}</span>
                                </div>
                                {/* {productDetails?.deposit_amount && Number(productDetails.deposit_amount) > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Security Deposit</span>
                                    <span className="font-medium text-orange-600">₹{Number(productDetails.deposit_amount).toLocaleString()}</span>
                                  </div>
                                )} */}
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
                                {productDetails?.deposit_amount && Number(productDetails.deposit_amount) > 0 && (
                                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mt-2">
                                    <div className="text-xs text-orange-700 font-medium">
                                      + Security Deposit: ₹{Number(productDetails.deposit_amount).toLocaleString()} (Refundable)
                                    </div>
                                  </div>
                                )}
                                {/* {productDetails?.vendor_address && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Vendor Address</span>
                                    <span className="font-medium text-slate-700 text-right max-w-[200px] truncate" title={productDetails.vendor_address}>
                                      {productDetails.vendor_address}
                                    </span>
                                  </div>
                              )} */}
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
                  <div className={clsx("space-y-5", isSell && "hidden")}>
                    {isDaily || isHourly ? (
                      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/40">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-semibold text-gray-700">
                            {isHourly ? "Rental Hours" : "Rental Days"}
                          </span>
                          <div className="flex items-center bg-white border rounded-lg shadow-sm overflow-hidden">
                            <button
                              onClick={() => setDays(Math.max(1, days - 1))}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-r"
                              disabled={days <= 1}
                            >
                              <Minus size={14} />
                            </button>

                            <input
                              type="number"
                              min={1}
                              // remove 31 day max restriction
                              value={days}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  setDays(1);
                                  return;
                                }
                                if (value.length > 3) return;
                                const parsed = Number(value);
                                if (Number.isNaN(parsed)) return;
                                const clamped = Math.max(1, parsed);
                                setDays(clamped);
                              }}
                              className="w-12 text-center font-bold text-base focus:outline-none focus:ring-0"
                            />

                            <button
                              onClick={() => setDays(Math.min(999, days + 1))}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-l"
                              disabled={days >= 999}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center bg-blue-50/80 p-2.5 rounded-lg border border-blue-100">
                            <span className="text-sm font-semibold text-blue-900">
                              {isHourly ? "Per Hour Price" : "Per Day Price"}
                            </span>
                            <span className="font-bold text-lg text-blue-900">
                              ₹{unitPrice.toLocaleString()}
                            </span>
                          </div>
                          {/* {productDetails?.deposit_amount && Number(productDetails.deposit_amount) > 0 && (
                            <div className="flex justify-between items-center bg-orange-50/80 p-2.5 rounded-lg border border-orange-100">
                              <span className="text-sm font-semibold text-orange-900">
                                Security Deposit
                              </span>
                              <span className="font-bold text-lg text-orange-900">
                                ₹{Number(productDetails.deposit_amount).toLocaleString()}
                              </span>
                            </div>
                          )} */}
                          <div className="flex justify-between text-sm text-gray-600 px-1">
                            <span>Rental Duration</span>
                            <span className="font-medium">
                              {days} {isHourly ? "Hours" : "Days"}
                            </span>
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
                                {isHourly ? "(Price × Hours × Qty)" : "(Price × Days × Qty)"}
                              </span>
                            </div>
                            <div className="text-2xl font-extrabold text-blue-700">
                              ₹{(unitPrice * days * quantity).toLocaleString()}
                            </div>
                          </div>
                          {productDetails?.deposit_amount && Number(productDetails.deposit_amount) > 0 && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mt-2">
                              <div className="text-xs text-orange-700 font-medium">
                                + Security Deposit: ₹{Number(productDetails.deposit_amount).toLocaleString()} (Refundable)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-500">
                        Daily rental not available
                      </div>
                    )}
                  </div>
                )}

                {/* Sell Price Display */}
                {isSell && (
                  <div className="mb-6 p-6 border-2 border-blue-100 rounded-2xl bg-gradient-to-br from-blue-50/50 to-white shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-4 bg-upleex-blue rounded-full" />
                        <label className="text-xs font-bold text-upleex-blue  block">
                          Selling Price
                        </label>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-extrabold text-slate-900">
                          ₹{Number(productDetails?.price || 0).toLocaleString()}
                        </div>
                        {productDetails?.cancel_price && (
                          <div className="text-lg text-gray-400 line-through font-medium">
                            ₹{Number(productDetails.cancel_price).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-500" />
                        Inclusive of all taxes
                      </div>
                    </div>
                  </div>
                )}

                <div className={clsx(
                  "grid gap-4 pt-4",
                  isSell ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"
                )}>
                  <div className={clsx(
                    "relative z-[20] flex items-center justify-between bg-white border rounded-xl px-4 shadow-sm transition-all hover:border-blue-200 focus-within:z-[40]",
                    isSell ? "h-14" : "h-12"
                  )}>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">Quantity</span>
                      {isSell && <span className="text-[10px] text-gray-500">Select units</span>}
                      {productDetails && (!productDetails.is_out_of_stock && productDetails.available_quantity > 0) && (
                        <span className="text-[9px] text-orange-600 font-medium">
                          {productDetails.available_quantity} available
                        </span>
                      )}
                    </div>
                    {productDetails && (productDetails.is_out_of_stock || productDetails.available_quantity <= 0) ? (
                      <div className="font-bold text-red-500 text-sm">
                        Out of stock
                      </div>
                    ) : (
                      <div className="flex items-center bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-0.5 rounded-md hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={quantity <= 1}
                        >
                          <Minus size={16} className="text-gray-600" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={productDetails?.available_quantity || 9999}
                          value={quantity}
                          onFocus={(e) => e.currentTarget.select()}
                          onChange={(e) => {
                            const value = e.target.value;

                            // allow empty
                            if (value === "") {
                              setQuantity(1);
                              return;
                            }

                            // limit to 4 digits
                            if (value.length > 4) return;

                            const parsed = Number(value);
                            if (Number.isNaN(parsed)) return;

                            let clamped = Math.max(1, parsed);

                            // Apply stock validation for both sell and non-sell products
                            if (productDetails?.available_quantity) {
                              clamped = Math.min(clamped, productDetails.available_quantity);
                            }

                            // Apply maximum limit of 9999
                            clamped = Math.min(clamped, 9999);

                            setQuantity(clamped);
                          }}
                          onBlur={(e) => {
                            // Additional validation on blur
                            const value = Number(e.target.value);
                            if (value < 1) {
                              setQuantity(1);
                            } else if (productDetails?.available_quantity && value > productDetails.available_quantity) {
                              setQuantity(productDetails.available_quantity);
                              toast.error(`Maximum available quantity is ${productDetails.available_quantity}`);
                            } else if (value > 9999) {
                              setQuantity(9999);
                              toast.error("Maximum quantity limit is 9999");
                            }
                          }}
                          className="w-14 text-center font-extrabold text-lg text-slate-900 bg-transparent focus:outline-none focus:ring-0"
                        />
                        <button
                          onClick={() => {
                            let newQuantity = quantity + 1;
                            newQuantity = Math.min(9999, newQuantity);
                            if (productDetails?.available_quantity) {
                              newQuantity = Math.min(newQuantity, productDetails.available_quantity);
                            }
                            setQuantity(newQuantity);
                          }}
                          className="rounded-md hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={
                            quantity >= 9999 ||
                            (productDetails?.available_quantity ? quantity >= productDetails.available_quantity : false)
                          }
                        >
                          <Plus size={16} className="text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {!isSell && (
                    <>
                      {/* Start Date - Green Theme */}
                      <div className="relative z-[20] group bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200 rounded-2xl p-2.5 shadow-sm transition-all focus-within:shadow-md focus-within:border-green-400 focus-within:z-[40] h-full min-h-[70px]">
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                          <div className="absolute -right-4 -top-4 opacity-5 group-focus-within:opacity-10 transition-opacity">
                            <Calendar size={80} className="text-green-600" />
                          </div>
                        </div>
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <label className="text-[9px] text-green-800 font-semibold ">
                              Start Date
                            </label>
                          </div>
                          <div className="text-xs font-medium text-gray-900 flex-1">
                            <DatePicker
                              value={startDate}
                              onChange={setStartDate}
                              min={minDate}
                              disabled={false}
                              textSize={"xs"}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Start Time - Green Theme */}
                      {isHourly && activeTab !== 'monthly' && (
                        <div className="relative z-[20] group bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200 rounded-2xl p-2.5 shadow-sm transition-all focus-within:shadow-md focus-within:border-green-400 focus-within:z-[40] h-full min-h-[70px]">
                          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            <div className="absolute -right-4 -top-4 opacity-5 group-focus-within:opacity-10 transition-opacity">
                              <Clock size={80} className="text-green-600" />
                            </div>
                          </div>
                          <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                              <label className="text-[9px] text-green-800 font-semibold ">
                                Start Time
                              </label>
                            </div>
                            <input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-full bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl px-3 py-3 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {/* Spacer for hourly view */}
                      {isHourly && activeTab !== 'monthly' && (
                        <div className="hidden sm:block" aria-hidden="true" />
                      )}

                      {/* Return Date - Orange Theme (Monthly View) */}
                      {!isHourly && (
                        <div className="relative z-[10] group bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl p-2.5 shadow-sm transition-all focus-within:shadow-md focus-within:border-amber-400 focus-within:z-[40] h-full min-h-[70px]">
                          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            <div className="absolute -right-4 -top-4 opacity-5 group-focus-within:opacity-10 transition-opacity">
                              <Calendar size={80} className="text-amber-600" />
                            </div>
                          </div>
                          <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                              <label className="text-[9px] text-amber-800 font-semibold ">
                                Return Date
                              </label>
                            </div>
                            <div className="text-xs font-medium text-gray-900 flex-1">
                              <DatePicker
                                value={endDate}
                                onChange={setEndDate}
                                min={getMinEndDate()}
                                disabled={true}
                                textSize={"xs"}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Return Date & Return Time - Orange Theme (Hourly View) */}
                      {isHourly && activeTab !== 'monthly' && (
                        <>
                          {/* Return Date - Orange */}
                          <div className="relative z-[10] group bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl p-2.5 shadow-sm transition-all focus-within:shadow-md focus-within:border-amber-400 focus-within:z-[40] h-full min-h-[70px]">
                            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                              <div className="absolute -right-4 -top-4 opacity-5 group-focus-within:opacity-10 transition-opacity">
                                <Calendar size={80} className="text-amber-600" />
                              </div>
                            </div>
                            <div className="relative z-10 h-full flex flex-col">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                <label className="text-[9px] text-amber-800 font-semibold ">
                                  Return Date
                                </label>
                              </div>
                              <div className="text-xs font-medium text-gray-900 flex-1">
                                <DatePicker
                                  value={endDate}
                                  onChange={setEndDate}
                                  min={minDate}
                                  disabled={true}
                                  textSize={"xs"}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Return Time - Orange (Read-only, no popup) */}
                          <div className="relative z-[10] group bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl p-2.5 shadow-sm transition-all focus-within:z-[40] h-full min-h-[70px]">
                            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                              <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Clock size={64} className="text-amber-600" />
                              </div>
                            </div>
                            <div className="relative z-10 h-full flex flex-col">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-[9px] text-amber-800 font-semibold ">
                                  Return Time
                                </span>
                              </div>
                              <div className="text-xs font-semibold text-slate-800 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl px-3 py-3">
                                {endTime ? endTime : "--:--"}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* CTAs */}
                <div
                  className={clsx(
                    "flex flex-col sm:flex-row gap-4 mt-5",
                    isSell && "items-stretch"
                  )}
                >
                  {!isSell && (
                    <Button
                      size="lg"
                      className={clsx(
                        "h-14 text-base font-bold w-full sm:flex-1 rounded-xl px-8 transition-all active:scale-[0.98] group",
                        productDetails?.available_quantity && productDetails.available_quantity <= 0
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white"
                      )}
                      onClick={handleGetQuoteClick}
                      disabled={productDetails?.available_quantity && productDetails.available_quantity <= 0}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {productDetails?.available_quantity && productDetails.available_quantity <= 0
                          ? "Out of Stock"
                          : "Get Quote"
                        }
                        {!(productDetails?.available_quantity && productDetails.available_quantity <= 0) && (
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        )}
                      </span>
                    </Button>
                  )}

                  {isSell && (
                    <Button
                      size="lg"
                      className={clsx(
                        "shadow-xl shadow-blue-500/20 h-14 text-base font-bold w-full sm:flex-1 rounded-xl px-8 transition-all active:scale-[0.98] group",
                        productDetails?.is_out_of_stock || (productDetails?.available_quantity && productDetails.available_quantity <= 0)
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "text-white border-none"
                      )}
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || productDetails?.is_out_of_stock || (productDetails?.available_quantity && productDetails.available_quantity <= 0)}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart size={20} />
                        {productDetails?.is_out_of_stock || (productDetails?.available_quantity && productDetails.available_quantity <= 0)
                          ? "Out of Stock"
                          : isAddingToCart ? "Adding..." : "Add to Cart"
                        }
                        {!(productDetails?.is_out_of_stock || (productDetails?.available_quantity && productDetails.available_quantity <= 0)) && (
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        )}
                      </span>
                    </Button>
                  )}
                </div>

                <div className={clsx("mt-3", isSell ? "mb-0" : "mb-2")}>
                  <div
                    className={clsx(
                      "bg-white rounded-2xl border border-gray-100/80 px-4 py-3.5 flex items-center justify-between gap-4",
                      !isSell && (isDaily || isHourly) && "py-4 min-h-[96px]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center">
                        <Store size={22} className="text-upleex-blue" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-gray-500  tracking-[0.12em]">
                          Sold By
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {productDetails?.vendor_name || 'Vendor'}
                        </div>
                        {/* Add vendor address here */}
                        {productDetails?.vendor_address && (
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={productDetails.vendor_address}>
                            📍 {productDetails.vendor_address} , {productDetails.vendor_city_name}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="h-9 px-4 rounded-full border-upleex-purple text-upleex-purple text-xs font-semibold whitespace-nowrap"
                      onClick={() => {
                        if (!productDetails?.vendor_id) return;
                        router.push(
                          `/seller?vendor_id=${encodeURIComponent(
                            productDetails.vendor_id
                          )}&vendor_name=${encodeURIComponent(
                            productDetails.vendor_name || ''
                          )}`
                        );
                      }}
                    >
                      View Shop
                    </Button>
                  </div>
                </div>

                {isSell && (
                  <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-100">
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-upleex-blue border border-blue-100">
                        <Shield size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700  leading-tight">
                        KYC<br />Verified
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                        <Shield size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700  leading-tight">
                        Secure<br />Payment
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                        <Truck size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700  leading-tight">
                        Verified<br />Product
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700  leading-tight">
                        100%<br />Refund
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description & Details Tabs Section */}
          <div className="border-t border-gray-100">
            <div className="flex gap-8 border-b border-gray-200 mb-6 px-6 lg:px-10 pt-6">
              <button
                onClick={() => setActiveDetailTab("description")}
                className={`pb-3 text-sm font-bold  transition-colors border-b-2 ${activeDetailTab === "description" ? "border-upleex-blue text-upleex-blue" : "border-transparent text-gray-500 hover:text-slate-800"
                  }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveDetailTab("details")}
                className={`pb-3 text-sm font-bold  transition-colors border-b-2 ${activeDetailTab === "details" ? "border-upleex-blue text-upleex-blue" : "border-transparent text-gray-500 hover:text-slate-800"
                  }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveDetailTab("reviews")}
                className={`pb-3 text-sm font-bold  transition-colors border-b-2 ${activeDetailTab === "reviews" ? "border-upleex-blue text-upleex-blue" : "border-transparent text-gray-500 hover:text-slate-800"
                  }`}
              >
                Reviews & Ratings
              </button>
            </div>

            <div className="px-6 lg:px-10 pb-6 lg:pb-10">
              {activeDetailTab === "reviews" ? (
                <ProductReviews
                  productId={id}
                  onAuthRequired={() => setIsAuthModalOpen(true)}
                />
              ) : activeDetailTab === "description" ? (
                productDetails?.description ? (
                  <div
                    className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: productDetails.description }}
                  />
                ) : (
                  <div className="py-8">
                    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center mx-auto">
                      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-50 flex items-center justify-center">
                        <ImageOff size={28} className="text-gray-400" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">
                        No Description Available
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Product description has not been added yet.
                        <br />
                        Please check the product details or contact the seller for more information.
                      </p>
                    </div>
                  </div>
                )
              ) : productDetails?.description &&
                Array.isArray(productDetails.product_details) &&
                productDetails.product_details.length > 0 ? (

                <div className="space-y-4">
                  {productDetails.product_details.map((spec: any, idx: number) => {
                    const label =
                      spec.specification ||
                      spec.label ||
                      spec.key ||
                      spec.name ||
                      spec.title ||
                      `Specification ${idx + 1}`;

                    const value =
                      spec.detail ||
                      spec.value ||
                      spec.description ||
                      "—";

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="font-semibold text-slate-900">{label}</div>
                        <div className="sm:col-span-2 text-slate-600">{value}</div>
                      </div>
                    );
                  })}
                </div>

              ) : (
                <div className="py-8">
                  <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center mx-auto">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-50 flex items-center justify-center">
                      <ImageOff size={28} className="text-gray-400" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3">
                      No Product Details Available
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Detailed specifications for this product have not been added yet.
                      <br />
                      Please check back later or contact the seller for more information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <RelatedProducts
          categoryId={productDetails?.category_id}
          subCategoryId={productDetails?.sub_category_id}
          vendorId={productDetails?.vendor_id || productDetails?.vendor_india_id}
          currentProductId={productDetails?.id || id}
        />
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
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        isHourly={isHourly}
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