"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Shield,
  Truck,
  Star,
  Calendar,
  Minus,
  Plus,
  ArrowRight,
} from "lucide-react";
import endPointApi from "@/utils/endPointApi";
import { api } from "@/utils/axiosInstance";
import clsx from "clsx";

export default function ProductDetailsPage() {
  const params = useParams();
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

  useEffect(() => {
    if (productDetails?.month_arrr?.length) {
      setSelectedMonthId(productDetails.month_arrr[0].product_months_id);
    }
  }, [productDetails]);

  // Calculated values from API data
  const monthlyPrice =
    productDetails?.month_arrr?.[
      selectedDuration === 3
        ? 0
        : selectedDuration === 6
          ? 1
          : selectedDuration === 9
            ? 2
            : 3
    ]?.price || 0;
  const dayPrice = productDetails?.price;
  // const dailyPrice = Math.round(dayPrice / 30 * 1.5);
  const totalPrice = activeTab === "monthly" ? monthlyPrice : dayPrice * days;

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

  const getQuote = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("product_id", String(id));
    formData.append("delivery_date", String(deliveryDate));
    formData.append("number_of_days", String(days));
    formData.append("months_id", selectedMonthId ?? "");
    formData.append("qty", String(quantity));

    try {
      const res = await api.post(endPointApi.webGetQuote, formData, {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzAxMjI3NDksImV4cCI6MTA0MTAxMjI3NDksImRhdGEiOnsidXNlcl9pZCI6IjEiLCJmdWxsX25hbWUiOiJiYWh1dGlrIiwiZW1haWwiOiJiaGF1dGlrLnNob3Bub0BnbWFpbC5jb20iLCJudW1iZXIiOiI3NjAwNjcwNzQ0IiwiaWF0IjoxNzcwMTIyNzQ5LCJleHAiOjE3NzAyMDkxNDl9fQ.YDQJLqiNCjU-wkiATURsFSOEbPkEmLFG18aO_Vqct7I`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("res00.....", res.data);
    } catch (err) {
      console.error("Error fetching product details", err);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
            {/* ─── Left: Gallery ──────────────────────────────────────── */}
            <div className="bg-gray-50/70 p-5 lg:p-10 flex items-center justify-center border-r border-gray-100">
              <div className="w-full max-w-[520px]">
                <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 aspect-[4/3.2]">
                  <img
                    src={
                      selectedImage ||
                      "https://via.placeholder.com/720x540?text=Product"
                    }
                    alt={productDetails?.product_name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {allImages.length > 1 && (
                  <div className="mt-5 grid grid-cols-5 gap-3">
                    {allImages.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={clsx(
                          "aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200",
                          selectedImage === img
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
                )}
              </div>
            </div>

            {/* ─── Right: Content ─────────────────────────────────────── */}
            <div className="p-6 lg:p-10 xl:p-12 flex flex-col">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    {productDetails?.product_name || "Loading product..."}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
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
                  <div className="space-y-7">
                    {productDetails?.month_arrr?.length > 0 ? (
                      <>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
                            Select Duration
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                            {productDetails.month_arrr.map((monthData: any) => {
                              const active =
                                selectedMonthId === monthData.product_months_id;

                              return (
                                <button
                                  key={monthData.product_months_id}
                                  onClick={() =>
                                    setSelectedMonthId(
                                      monthData.product_months_id,
                                    )
                                  }
                                  className={clsx(
                                    "group relative rounded-xl border p-4 text-center transition-all duration-200",
                                    active
                                      ? "border-red-200 bg-red-50/60 shadow-sm"
                                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm",
                                  )}
                                >
                                  <div className="text-base font-bold text-gray-900">
                                    {monthData.month_name}
                                  </div>

                                  {monthData.cancel_price && (
                                    <div className="text-xs text-gray-400 line-through mt-0.5">
                                      ₹{monthData.cancel_price}
                                    </div>
                                  )}

                                  <div className="text-xl font-extrabold text-gray-900 mt-1">
                                    ₹{monthData.price}
                                  </div>

                                  <div className="text-xs text-gray-500 mt-0.5">
                                    per month
                                  </div>

                                  {active && (
                                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                      Selected
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-10 text-center text-gray-500">
                        Monthly plans not available
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {productDetails?.product_listing_type_name?.toLowerCase() ===
                    "daily" ? (
                      <div className="p-6 border border-gray-200 rounded-xl bg-gray-50/40">
                        <div className="flex items-center justify-between mb-5">
                          <span className="font-semibold text-gray-700">
                            Rental Days
                          </span>
                          <div className="flex items-center bg-white border rounded-lg shadow-sm">
                            <button
                              onClick={() => setDays(Math.max(1, days - 1))}
                              className="px-3 py-2.5 text-gray-600 hover:bg-gray-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">
                              {days}
                            </span>
                            <button
                              onClick={() => setDays(days + 1)}
                              className="px-3 py-2.5 text-gray-600 hover:bg-gray-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <div className="text-sm text-gray-600">Per Day</div>
                            <div className="text-xl font-bold">
                              ₹{dayPrice.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Total</div>
                            <div className="text-2xl font-extrabold text-blue-700">
                              ₹{totalPrice.toLocaleString()}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center justify-between bg-white border rounded-lg px-4 h-12 shadow-sm">
                    <span className="font-medium text-gray-700">Quantity</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1.5"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition"
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white shadow-lg h-12 text-base font-semibold flex-1"
                    onClick={() => getQuote()}
                  >
                    Get Quote →
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-semibold flex items-center gap-2 flex-1"
                  >
                    <MapPin size={18} className="text-orange-600" />
                    Enter City
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-gray-100">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-upleex-blue">
                      <Shield size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 uppercase">
                      KYC Verified
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Shield size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 uppercase">
                      Secure Payment
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                      <Truck size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 uppercase">
                      Verified Product
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                      <ArrowRight size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 uppercase">
                      100% Refundable
                    </span>
                  </div>
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
                    // Debug logging
                    console.log(
                      "Product Details Data:",
                      productDetails?.product_details,
                    );
                    console.log(
                      "Is Array?",
                      Array.isArray(productDetails?.product_details),
                    );
                    console.log(
                      "Length:",
                      productDetails?.product_details?.length,
                    );

                    if (
                      productDetails?.product_details &&
                      Array.isArray(productDetails.product_details) &&
                      productDetails.product_details.length > 0
                    ) {
                      return (
                        <div className="space-y-4">
                          {productDetails.product_details.map(
                            (spec: any, idx: number) => {
                              // Get label from multiple possible fields
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
      </div>
    </div>
  );
}
