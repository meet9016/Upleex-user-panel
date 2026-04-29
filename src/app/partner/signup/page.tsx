"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { 
  User, 
  Building2, 
  Mail, 
  MapPin, 
  Zap,
  Shield,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { partnerService } from "@/services/partnerService";
import { searchService } from "@/services/searchService";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";

export default function PartnerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    mobileNumber: "",
    altMobileNumber: "",
    city: "",
    otp: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState<{ fullName?: string; businessName?: string; email?: string; mobileNumber?: string; city?: string; otp?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [showCityResults, setShowCityResults] = useState(false);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [cityDropdownPos, setCityDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const citySearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);

  const fetchCities = async (query: string) => {
    if (!query.trim() || query.trim().length < 3) {
      setCityResults([]);
      setShowCityResults(false);
      return;
    }

    if (cityInputRef.current) {
      const rect = cityInputRef.current.getBoundingClientRect();
      setCityDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }

    try {
      setIsSearchingCity(true);
      const res = await searchService.getCities(1, query);
      setCityResults(res.items || []);
      setShowCityResults(true);
    } catch (error) {
      setCityResults([]);
    } finally {
      setIsSearchingCity(false);
    }
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, city: value }));
    setCitySearchTerm(value);

    if (citySearchTimeoutRef.current) {
      clearTimeout(citySearchTimeoutRef.current);
    }

    citySearchTimeoutRef.current = setTimeout(() => {
      fetchCities(value);
    }, 300);
  };

  const handleCitySelect = (city: any) => {
    setFormData(prev => ({ ...prev, city: city.city_name }));
    setCitySearchTerm(city.city_name);
    setShowCityResults(false);
    setErrors(prev => ({ ...prev, city: '' }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    const e: { mobileNumber?: string } = {};
    if (formData.mobileNumber.length < 10) e.mobileNumber = "Enter a valid 10-digit mobile number";
    if (Object.keys(e).length > 0) {
      setErrors(prev => ({ ...prev, ...e }));
      return;
    }
    setErrors(prev => ({ ...prev, mobileNumber: "" }));
    try {
      const res = await partnerService.businessRegister({
        full_name: formData.fullName.trim(),
        business_name: formData.businessName.trim(),
        email: formData.email.trim(),
        number: formData.mobileNumber,
        alternate_number: formData.altMobileNumber || "",
        country: "97"
      });
      const status = res?.status;
      const message = res?.message || "OTP sent successfully";
      if (status === 200) {
        toast.success(message);
        setOtpSent(true);
        setTimer(120);
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      const e: { fullName?: string; businessName?: string; email?: string; mobileNumber?: string; city?: string } = {};
      if (!formData.fullName.trim()) e.fullName = "Full name is required";
      if (!formData.businessName.trim()) e.businessName = "Business name is required";
      const emailPattern = /^[^\s@]+@[^\s@]+\.(com|in|org)$/;
      if (!emailPattern.test(formData.email.trim())) e.email = "Enter a valid email";
      if (formData.mobileNumber.length < 10) e.mobileNumber = "Enter a valid 10-digit mobile number";
      if (!formData.city.trim()) e.city = "City is required";
      if (Object.keys(e).length > 0) {
        setErrors(prev => ({ ...prev, ...e }));
        return;
      }
      await handleSendOtp();
    } else {
      const e: { otp?: string } = {};
      if ((formData.otp || "").replace(/\D/g, "").length < 4) e.otp = "Enter the OTP";
      if (Object.keys(e).length > 0) {
        setErrors(prev => ({ ...prev, ...e }));
        return;
      }
      try {
        setIsSubmitting(true);
        const res = await partnerService.businessRegister({
          full_name: formData.fullName.trim(),
          business_name: formData.businessName.trim(),
          email: formData.email.trim(),
          number: formData.mobileNumber,
          alternate_number: formData.altMobileNumber || "",
          country: "97",
          otp: formData.otp
        });
        const status = res?.status;
        const message = res?.message || "Registered successfully";

        if (status === 200) {
          toast.success(message);
          
          const token = res?.data?.token || res?.data?.auth_token;
          const vendorInfo = res?.data?.vendor;
          const vendorPanelUrl = process.env.NEXT_PUBLIC_VENDOR_PANEL_URL;
          
          if (token && vendorInfo) {
            const userInfoStr = encodeURIComponent(JSON.stringify(vendorInfo));
            window.location.href = `${vendorPanelUrl}?token=${token}&user_info=${userInfoStr}`;
          } else {
            window.location.href = `${vendorPanelUrl}`;
          }
        } else {
          toast.error(message);
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Something went wrong while registering";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Panel - Dark Navy */}
        <div className="w-full md:w-5/12 bg-[#1e293b] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Background Gradient/Pattern overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

          <div className="z-10">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
                 <span className="text-gradient-primary">Partner</span>Hub
              </h1>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join PartnerHub</h2>
            <p className="text-gray-300 text-lg mb-12">
              Start your journey with us and expand your business reach.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700/50 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Instant Activation</h3>
                  <p className="text-gray-400">Get your account approved quickly</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700/50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Zero Commission</h3>
                  <p className="text-gray-400">Keep 100% of your earnings for first month</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700/50 rounded-xl">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Verified Partners</h3>
                  <p className="text-gray-400">Join a trusted community</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white overflow-y-auto max-h-[90vh]">
          <div className="max-w-xl mx-auto w-full">
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-gray-900">Register as Partner</h2>
               <p className="text-gray-500 mt-2">Fill in the details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
               {/* Row 1: Names */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) => {
                          handleChange(e);
                          if (e.target.value.trim()) setErrors(prev => ({ ...prev, fullName: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all ${errors.fullName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-upleex-purple focus:ring-upleex-purple/20'}`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName ? <p className="text-red-600 text-sm mt-1">{errors.fullName}</p> : null}
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={(e) => {
                          handleChange(e);
                          if (e.target.value.trim()) setErrors(prev => ({ ...prev, businessName: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all ${errors.businessName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-upleex-purple focus:ring-upleex-purple/20'}`}
                        placeholder="My Business Ltd"
                      />
                    </div>
                    {errors.businessName ? <p className="text-red-600 text-sm mt-1">{errors.businessName}</p> : null}
                 </div>
               </div>

               {/* Row 2: Contact */}
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text"
                      name="email"
                      value={formData.email}
                      inputMode="email"
                      autoComplete="email"
                      onChange={(e) => {
                        handleChange(e);
                        setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-upleex-purple focus:ring-upleex-purple/20'}`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email ? <p className="text-red-600 text-sm mt-1">{errors.email}</p> : null}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                    <div className={`flex rounded-lg border overflow-hidden focus-within:ring-2 transition-all ${errors.mobileNumber ? 'border-red-500 focus-within:ring-red-500/20' : 'border-gray-200 focus-within:ring-upleex-purple/20 focus-within:border-upleex-purple'}`}>
                      <div className="bg-gray-50 px-3 py-3 border-r border-gray-200 text-gray-600 font-medium text-sm flex items-center">
                        +91
                      </div>
                      <input 
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setFormData(prev => ({ ...prev, mobileNumber: val }));
                          if (val.length === 10) setErrors(prev => ({ ...prev, mobileNumber: '' }));
                        }}
                        className="flex-1 px-4 py-3 outline-none text-gray-900 placeholder-gray-400 w-full"
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.mobileNumber ? <p className="text-red-600 text-sm mt-1">{errors.mobileNumber}</p> : null}
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alternative Number <span className="text-red-500">*</span></label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-upleex-purple/20 focus-within:border-upleex-purple transition-all">
                      <div className="bg-gray-50 px-3 py-3 border-r border-gray-200 text-gray-600 font-medium text-sm flex items-center">
                        +91
                      </div>
                      <input 
                        type="tel"
                        name="altMobileNumber"
                        value={formData.altMobileNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setFormData(prev => ({ ...prev, altMobileNumber: val }));
                        }}
                        className="flex-1 px-4 py-3 outline-none text-gray-900 placeholder-gray-400 w-full"
                        placeholder="Optional"
                      />
                    </div>
                 </div>
               </div>

               {/* City */}
               <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City / County <span className="text-red-500">*</span> </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      ref={cityInputRef}
                      type="text"
                      name="city"
                      value={citySearchTerm}
                      onChange={handleCityInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all ${errors.city ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-upleex-purple focus:ring-upleex-purple/20'}`}
                      placeholder="Ahmedabad, Gujarat"
                    />
                  </div>
                  {errors.city ? <p className="text-red-600 text-sm mt-1">{errors.city}</p> : null}
               </div>

               {showCityResults && typeof window !== 'undefined' && createPortal(
                 <div
                   className="fixed z-[9999]"
                   style={{
                     top: cityDropdownPos.top,
                     left: cityDropdownPos.left,
                     width: cityDropdownPos.width
                   }}
                 >
                   <div className="bg-white border border-gray-100 rounded-xl shadow-2xl max-h-52 overflow-y-auto">
                     {isSearchingCity ? (
                       <div className="p-4 flex justify-center">
                         <Loader2 className="animate-spin text-blue-500" size={20} />
                       </div>
                     ) : cityResults.length > 0 ? (
                       cityResults.map((city) => (
                         <button
                           key={city.id}
                           type="button"
                           onClick={() => handleCitySelect(city)}
                           className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-2 border-b border-gray-50 last:border-0"
                         >
                           <MapPin size={16} className="text-gray-400" />
                           <div>
                             <div className="font-medium text-gray-800 text-sm">
                               {city.city_name}
                             </div>
                           </div>
                         </button>
                       ))
                     ) : (
                       <div className="p-4 text-center text-gray-500 text-xs">
                         No cities found for "{citySearchTerm}"
                       </div>
                     )}
                   </div>
                 </div>,
                 document.body
               )}

               {/* OTP Section */}
               <div className={`transition-all duration-300 overflow-hidden ${otpSent ? 'opacity-100 max-h-40' : 'opacity-50 max-h-0'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">OTP Verification</label>
                    {otpSent && timer > 0 && (
                      <span className="text-xs text-blue-600 font-medium">Resend in {timer}s</span>
                    )}
                    {otpSent && timer === 0 && (
                      <button 
                        type="button" 
                        onClick={handleSendOtp}
                        className="text-xs text-blue-600 font-medium hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <OtpInput
                      value={formData.otp}
                      onChange={(val) => {
                        const clean = val.replace(/\D/g, "").slice(0, 6);
                        setFormData(prev => ({ ...prev, otp: clean }));
                        if (clean.length >= 4) setErrors(prev => ({ ...prev, otp: '' }));
                      }}
                      numInputs={6}
                      shouldAutoFocus={otpSent}
                      renderSeparator={<span className="mx-2 text-gray-300">•</span>}
                      renderInput={(props) => (
                        <input
                          {...props}
                          disabled={!otpSent}
                          className={`h-11 !w-11 rounded-lg border ${errors.otp ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-upleex-purple focus:ring-upleex-purple/20'} ${!otpSent ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'} text-center text-base font-medium text-gray-900 outline-none transition-all`}
                        />
                      )}
                    />
                  </div>
                  {errors.otp ? <p className="text-red-600 text-sm mt-1 text-center">{errors.otp}</p> : null}
               </div>

               {/* Buttons */}
               <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 py-6 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={
                      isSubmitting ||
                      !formData.mobileNumber ||
                      formData.mobileNumber.length < 10
                    }
                  >
                    {otpSent ? (isSubmitting ? "Registering..." : "Register Now") : "Send OTP"}
                  </Button>
               </div>

               <div className="text-center mt-6">
                  <p className="text-gray-500 text-sm">
                    Already have an account?{" "}
                    <Link href="/partner/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                      Login here
                    </Link>
                  </p>
               </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
