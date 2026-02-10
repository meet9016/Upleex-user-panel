"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Building2, 
  Mail, 
  Smartphone, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Zap,
  Shield,
  TrendingUp,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

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

  const handleSendOtp = () => {
    if (formData.mobileNumber.length < 10) return;
    setOtpSent(true);
    setTimer(120);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
    } else {
      console.log("Registering:", formData);
      router.push('/partner');
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-upleex-purple focus:ring-2 focus:ring-upleex-purple/20 outline-none transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-upleex-purple focus:ring-2 focus:ring-upleex-purple/20 outline-none transition-all"
                        placeholder="My Business Ltd"
                        required
                      />
                    </div>
                 </div>
               </div>

               {/* Row 2: Contact */}
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-upleex-purple focus:ring-2 focus:ring-upleex-purple/20 outline-none transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-upleex-purple/20 focus-within:border-upleex-purple transition-all">
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
                        }}
                        className="flex-1 px-4 py-3 outline-none text-gray-900 placeholder-gray-400 w-full"
                        placeholder="9876543210"
                        required
                      />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alternative Number</label>
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
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City / County</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-upleex-purple focus:ring-2 focus:ring-upleex-purple/20 outline-none transition-all"
                      placeholder="Ahmedabad, Gujarat"
                      required
                    />
                  </div>
               </div>

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
                  <div className="relative">
                    <input 
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 6) setFormData(prev => ({ ...prev, otp: val }));
                      }}
                      disabled={!otpSent}
                      className="w-full py-3 px-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-upleex-purple/20 focus:border-upleex-purple disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter OTP"
                      required={otpSent}
                    />
                  </div>
               </div>

               {/* Buttons */}
               <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 py-6 text-lg"
                    disabled={!formData.mobileNumber || formData.mobileNumber.length < 10}
                  >
                    {otpSent ? "Register Now" : "Send OTP"}
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