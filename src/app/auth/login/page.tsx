'use client';
import { setSecureToken } from '@/utils/cryptoUtils';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { AnimatePresence, motion } from 'framer-motion';

const LoginPage = () => {
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'number' | 'otp'>('number');
  const [userType, setUserType] = useState<'existing' | 'new' | null>(null);
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ number?: string; otp?: string; name?: string; email?: string }>({});
  
  // References for OTP inputs
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle Enter key press for number step
  const handleNumberKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendNumber();
    }
  };

  const handleSendNumber = async () => {
    const clean = number.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrors(prev => ({ ...prev, number: 'Enter a valid 10-digit mobile number' }));
      return;
    }
    setIsLoading(true);
    try {
      const result = await authService.sendOtp({
        number: clean,
        country_id: '91'
      });

      if (result?.status === 200 || result?.success === true) {
        toast.success(result?.message || 'OTP sent successfully');
        setUserType(result?.data?.user_type);
        setStep('otp');
        setErrors(prev => ({ ...prev, number: '' }));
        // Reset OTP when moving to OTP step
        setOtp(['', '', '', '', '', '']);
        // Focus first OTP input after step change
        setTimeout(() => {
          otpInputs.current[0]?.focus();
        }, 100);
      } else {
        toast.error(result?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    const newErrors: { otp?: string; name?: string; email?: string } = {};
    
    if (otpString.length < 6) {
      newErrors.otp = 'Enter the complete 6-digit OTP';
    }
    
    if (userType === 'new') {
      if (!form.name.trim()) newErrors.name = 'Name is required';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email.trim())) newErrors.email = 'Enter a valid email';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    setIsLoading(true);
    try {
      const result = await authService.verifyOtp({
        number: number.replace(/\D/g, ''),
        otp: otpString,
        country_id: '91',
        name: userType === 'new' ? form.name : undefined,
        email: userType === 'new' ? form.email : undefined
      });

      if (result?.status === 200 || result?.success === true) {
        setSecureToken(result.data.token);
        localStorage.setItem(
          'user',
          JSON.stringify(result.data.user.name)
        );
        localStorage.setItem(
          'email',
          JSON.stringify(result.data.user.email)
        );

        toast.success(result.message || 'Login successful');
        window.dispatchEvent(new Event('storage'));
        router.push('/');
      } else {
        toast.error(result?.message || 'Login failed');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    // Take only the last character if multiple characters are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Clear error when user starts typing
    if (value) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
    
    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  // Handle key down events for OTP inputs
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        otpInputs.current[index - 1]?.focus();
      }
      // Clear current input
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
    
    // Handle left arrow key
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      otpInputs.current[index - 1]?.focus();
    }
    
    // Handle right arrow key
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      otpInputs.current[index + 1]?.focus();
    }
    
    // Handle delete key
    if (e.key === 'Delete') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
    
    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      const otpString = otp.join('');
      if (otpString.length === 6) {
        handleVerifyOtp();
      }
    }
  };

  // Handle paste event for OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    const pastedArray = pastedData.split('');
    const newOtp = [...otp];
    
    pastedArray.forEach((digit, idx) => {
      if (idx < 6) {
        newOtp[idx] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const lastFilledIndex = newOtp.findIndex(digit => !digit);
    if (lastFilledIndex === -1) {
      otpInputs.current[5]?.focus();
    } else {
      otpInputs.current[lastFilledIndex]?.focus();
    }
  };

  return (
    <div className="flex-grow flex">
      {/* Left Side - Hero Image with 55.1vh height */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden" style={{ height: '55.1vh' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-upleex-purple/90 to-upleex-blue/90 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=2064&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Login Hero"
        />
        <div className="relative z-20 flex flex-col justify-center px-12 text-white h-full">
          <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-lg text-purple-100 max-w-md leading-relaxed">
            Log in to access your dashboard, track your rentals, and discover more amazing products.
          </p>
        </div>
      </div>

      {/* Right Side - Form with same height */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white" style={{ height: '55.1vh' }}>
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Sign In
          </h2>

          <AnimatePresence mode="wait">
            {step === 'number' ? (
              <motion.div
                key="step-number"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Mobile Number */}
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={number}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setNumber(val);
                      if (val.length === 10) {
                        setErrors(prev => ({ ...prev, number: '' }));
                      }
                    }}
                    onKeyDown={handleNumberKeyPress}
                    placeholder="Mobile Number"
                    className={`w-full pl-10 py-3 border rounded-lg bg-gray-50
                      focus:outline-none focus:ring-0 focus:ring-indigo-500/20 focus:border-indigo-500
                      ${errors.number
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300'
                      }`}
                    autoFocus
                  />
                  {errors.number && (
                    <p className="text-red-600 text-sm mt-1">{errors.number}</p>
                  )}
                </div>
                <Button
                  fullWidth
                  onClick={handleSendNumber}
                  className="cursor-pointer"
                >
                  {isLoading ? 'Please wait...' : 'Send OTP'} <ArrowRight className="ml-2" size={18} />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="mt-2">
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpInputs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className={`otp-input w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-1 text-center text-lg font-semibold
                          focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all
                          ${errors.otp
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                          }
                          ${digit ? 'border-indigo-500 bg-indigo-50' : 'bg-gray-50'}`}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  {errors.otp ? (
                    <p className="text-red-600 text-sm mt-3 text-center">{errors.otp}</p>
                  ) : (
                    <p className="text-gray-500 text-sm mt-3 text-center">
                      Enter the 6-digit OTP sent to your mobile
                    </p>
                  )}
                </div>

                {userType === 'new' && (
                  <div className="space-y-3 mt-4">
                    <input
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (e.target.value.trim()) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleVerifyOtp();
                        }
                      }}
                      className={`w-full py-3 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name ? (
                      <p className="text-red-600 text-sm -mt-2">{errors.name}</p>
                    ) : null}

                    <input
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailPattern.test(e.target.value.trim())) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleVerifyOtp();
                        }
                      }}
                      className={`w-full py-3 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email ? (
                      <p className="text-red-600 text-sm -mt-2">{errors.email}</p>
                    ) : null}
                  </div>
                )}

                <Button 
                  fullWidth 
                  onClick={handleVerifyOtp}
                  disabled={otp.join('').length !== 6}
                  className={`cursor-pointer ${otp.join('').length !== 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Please wait...' : 'Login'}
                </Button>
                
                {/* Resend OTP button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSendNumber}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    disabled={isLoading}
                  >
                    Didn't receive OTP? Resend
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;