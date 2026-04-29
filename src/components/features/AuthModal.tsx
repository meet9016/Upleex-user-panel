import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Phone, Mail, Chrome, Eye, EyeOff, Check, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import clsx from 'clsx';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/redux/hooks';
import { setLoginData } from '@/redux/slices/authSlice';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'number' | 'otp'>('number');
  const [userType, setUserType] = useState<'existing' | 'new' | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [timer, setTimer] = useState(120);
  const [errors, setErrors] = useState<{ number?: string; otp?: string; name?: string; email?: string; agreed?: string }>({});
  
  // References for OTP inputs
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Enter key for number step
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
    if (!agreed) {
      setErrors(prev => ({ ...prev, agreed: 'Please agree to the terms' }));
      return;
    }

    setLoading(true);
    try {
      const result = await authService.sendOtp({
        number: clean,
        country_id: '91'
      });

      if (result?.status === 200 || result?.success === true) {
        toast.success('OTP sent successfully 📩');
        setUserType(result?.data?.user_type);
        setStep('otp');
        setTimer(120); // Reset timer
        setErrors(prev => ({ ...prev, number: '', agreed: '' }));
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
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    const e: { otp?: string; name?: string; email?: string } = {};

    if (otpString.length < 6) {
      e.otp = 'Enter the complete 6-digit OTP';
    }

    if (userType === 'new') {
      if (!form.name.trim()) e.name = 'Name is required';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email.trim())) e.email = 'Enter a valid email';
    }

    if (Object.keys(e).length > 0) {
      setErrors(prev => ({ ...prev, ...e }));
      return;
    }

    setLoading(true);
    try {
      const result = await authService.verifyOtp({
        number: number.replace(/\D/g, ''),
        otp: otpString,
        country_id: '91',
        name: userType === 'new' ? form.name : undefined,
        email: userType === 'new' ? form.email : undefined
      });

      if (result?.status === 200 || result?.success === true) {
        // Update Redux store without double API call
        dispatch(setLoginData({ token: result.data.token, user: result.data.user }));
        toast.success(result.message || 'Login successful');
        window.dispatchEvent(new Event('userLoggedIn'));
        onLoginSuccess();
      } else {
        toast.error(result?.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
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
      e.preventDefault();
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        otpInputs.current[index - 1]?.focus();
        // Clear previous input
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }

    // Handle delete key
    if (e.key === 'Delete') {
      e.preventDefault();
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

  // Reset state when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setStep('number');
      setNumber('');
      setOtp(['', '', '', '', '', '']);
      setForm({ name: '', email: '' });
      setUserType(null);
      setAgreed(false);
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideHeader
      noPadding
      className="min-w-[950px] overflow-hidden"
    >
      <div
        className="flex flex-col md:flex-row h-full min-h-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 bg-gray-100 relative">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Login"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">

          {step === 'number' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Login <span className="text-gray-400 font-light">or</span> Signup</h2>
                <p className="text-sm text-gray-500 font-medium">Please enter your mobile number to continue</p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex gap-3 h-12">
                    <div className="flex items-center justify-between px-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-semibold w-20 cursor-pointer hover:border-gray-400 transition-colors shadow-sm">
                      <span>+91</span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={number}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setNumber(val);
                        if (val.length === 10) setErrors(prev => ({ ...prev, number: '' }));
                      }}
                      onKeyDown={handleNumberKeyPress}
                      placeholder="Enter Mobile Number"
                      className={clsx(
                        'flex-1 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder:text-gray-400 font-semibold shadow-sm',
                        errors.number ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500/20 focus:border-blue-500'
                      )}
                      autoFocus
                    />
                  </div>
                  {errors.number ? <p className="text-red-600 text-sm mt-1 ml-23">{errors.number}</p> : null}
                </div>
                <div className="flex items-start gap-3">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={() => {
                        setAgreed(!agreed);
                        if (!agreed) setErrors(prev => ({ ...prev, agreed: '' }));
                      }}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md 
                  border border-gray-300 bg-white 
                  checked:bg-blue-600 checked:border-blue-600 
                  transition-all duration-200"
                    />
                    <Check
                      size={12}
                      strokeWidth={3}
                      className="pointer-events-none absolute text-white 
                 opacity-0 peer-checked:opacity-100 
                 transition-opacity duration-200"

                    />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed cursor-pointer" onClick={() => setAgreed(!agreed)}>
                    By continuing, I agree to the <span className="text-blue-600 font-semibold hover:underline">Terms of Use</span> & <span className="text-blue-600 font-semibold hover:underline">Privacy Policy</span>
                  </p>
                </div>
                {errors.agreed ? <p className="text-red-600 text-xs -mt-2">{errors.agreed}</p> : null}
                <Button
                  fullWidth
                  onClick={handleSendNumber}
                  disabled={loading}
                  className="bg-gradient-primary hover:from-blue-600 hover:to-blue-700 text-white h-12 text-base font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] tracking-wide"
                >
                  {loading ? 'Sending...' : 'Continue'}
                </Button>


              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                <p className="text-sm text-gray-500">
                  Enter the code sent to <span className="font-bold text-gray-900">+91 {number}</span>
                </p>
              </div>

              <div className="space-y-6">
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
                      className={clsx(
                        'w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-1 text-center text-lg font-semibold',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all',
                        errors.otp
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                        digit ? 'border-indigo-500 bg-indigo-50' : 'bg-white'
                      )}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {errors.otp ? (
                  <p className="text-red-600 text-sm text-center">{errors.otp}</p>
                ) : (
                  <p className="text-gray-500 text-sm text-center">
                    Enter the 6-digit OTP sent to your mobile
                  </p>
                )}

                {userType === 'new' && (
                  <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
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
                      className={clsx(
                        'w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all font-medium',
                        errors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500/20 focus:border-blue-500'
                      )}
                    />
                    {errors.name ? <p className="text-red-600 text-sm -mt-2">{errors.name}</p> : null}
                    <input
                      type="email"
                      placeholder="Email Address"
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
                      className={clsx(
                        'w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all font-medium',
                        errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500/20 focus:border-blue-500'
                      )}
                    />
                    {errors.email ? <p className="text-red-600 text-sm -mt-2">{errors.email}</p> : null}
                  </div>
                )}

                <Button
                  fullWidth
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length !== 6}
                  className={clsx(
                    'bg-gradient-primary hover:from-blue-600 hover:to-blue-700 text-white h-12 text-base font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] tracking-wide',
                    (loading || otp.join('').length !== 6) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </Button>

                <div className="flex items-center justify-between text-sm font-medium pt-2">
                  {/* <button 
                    onClick={() => setStep('number')}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    ← Change Number
                  </button> */}

                  {timer > 0 ? (
                    <span className="text-gray-400">
                      Resend in <span className="text-gray-900 font-bold tabular-nums">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleSendNumber}
                      className="text-blue-600 font-bold hover:text-blue-700 hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};