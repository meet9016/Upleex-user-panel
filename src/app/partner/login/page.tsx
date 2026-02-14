"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Mail, 
  Smartphone, 
  ArrowLeft, 
  Zap, 
  TrendingUp, 
  Shield, 
  Check 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"email" | "mobile">("mobile");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(119);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [errors, setErrors] = useState<{ mobile?: string; otp?: string }>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setErrors(prev => ({ ...prev, mobile: "Enter a valid 10-digit mobile number" }));
      return;
    }
    setErrors(prev => ({ ...prev, mobile: "" }));
    setStep("otp");
    setIsTimerActive(true);
    setTimer(119);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.replace(/\D/g, "").length < 4) {
      setErrors(prev => ({ ...prev, otp: "Enter the OTP" }));
      return;
    }
    setErrors(prev => ({ ...prev, otp: "" }));
    router.push('/partner');
  };

  const handleResendOtp = () => {
    setTimer(119);
    setIsTimerActive(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Panel - Dark Navy */}
        <div className="w-full md:w-5/12 bg-[#1e293b] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Background Gradient/Pattern overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

          <div className="z-10">
            {/* Logo Placeholder */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
                 <span className="text-gradient-primary">Partner</span>Hub
              </h1>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">PartnerHub</h2>
            <p className="text-gray-300 text-lg mb-12">
              Your gateway to successful online business
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700/50 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Quick Setup</h3>
                  <p className="text-gray-400">Start renting in minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700/50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Grow Your Business</h3>
                  <p className="text-gray-400">Reach more customers</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700/50 rounded-xl">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Secure & Reliable</h3>
                  <p className="text-gray-400">Your data is safe with us</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - White Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-500">Sign in to access your Partner dashboard</p>
            </div>

            {/* Auth Method Tabs */}
            <div className="flex gap-4 mb-8">
              {/* <button
                onClick={() => setAuthMethod("email")}
                className={`flex-1 py-2.5 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  authMethod === "email"
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button> */}
              {/* <Button
                onClick={() => setAuthMethod("mobile")}
                className={`flex-1 py-2.5 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all cursor-pointer${
                  authMethod === "mobile"
                    ? " text-white shadow-md"
                    : " hover:bg-gray-50"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile OTP
              </Button> */}
            </div>

            <AnimatePresence mode="wait">
              {step === "input" ? (
                <motion.div
                  key="input-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <form onSubmit={handleSendOtp}>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <div className={`flex rounded-lg border overflow-hidden focus-within:ring-2 transition-all ${errors.mobile ? 'border-red-500 focus-within:ring-red-500/20' : 'border-gray-200 focus-within:ring-upleex-purple/20 focus-within:border-upleex-purple'}`}>
                        <div className="bg-gray-50 px-4 py-3 border-r border-gray-200 text-gray-600 font-medium">
                          +91
                        </div>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 10) setMobileNumber(val);
                            if (val.length === 10) setErrors(prev => ({ ...prev, mobile: "" }));
                          }}
                          placeholder="1234567890"
                          className="flex-1 px-4 py-3 outline-none text-gray-900 placeholder-gray-400"
                          required
                        />
                      </div>
                      {errors.mobile ? <p className="text-red-600 text-sm mt-1">{errors.mobile}</p> : null}
                    </div>

                    <Button
                      type="submit"
                      disabled={mobileNumber.length < 10}
                      className="w-full  text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span className="transform -rotate-45">➤</span> Send OTP
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleVerify}>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <div className="flex items-center justify-between p-3 border border-green-500 rounded-lg bg-green-50 text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-500">+91</span>
                          <span className="font-medium">{mobileNumber}</span>
                        </div>
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter OTP
                      </label>
                      <input
                        value={otp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 6) setOtp(val);
                          if (val.length >= 4) setErrors(prev => ({ ...prev, otp: "" }));
                        }}
                        placeholder="Enter OTP"
                        className={`w-full py-3 px-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${errors.otp ? 'border-red-500 focus:ring-red-500/20' : 'focus:ring-upleex-purple/20 focus:border-upleex-purple'}`}
                      />
                      {errors.otp ? (
                        <p className="text-red-600 text-sm mt-1">{errors.otp}</p>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">OTP sent to your mobile number</p>
                      )}
                    </div>

                    <div className="text-center mb-6">
                        <button 
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isTimerActive}
                            className={`text-sm flex items-center justify-center gap-1 mx-auto ${isTimerActive ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700 font-medium'}`}
                        >
                            <span className="transform -rotate-45">➤</span> Resend OTP
                        </button>
                        {isTimerActive && (
                            <p className="text-xs text-gray-400 mt-1">Resend OTP in {timer} seconds</p>
                        )}
                    </div>

                    <button
                      type="submit"
                      disabled={otp.length < 4}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Check className="w-5 h-5" /> Verify & Sign In
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center space-y-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-gray-800 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
              </Link>

              <div className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/partner/signup"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
