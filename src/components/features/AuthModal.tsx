import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Phone, Mail, Chrome, Eye, EyeOff, Check, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import endPointApi from '@/utils/endPointApi';
import { api } from '@/utils/axiosInstance';
import { Modal } from '@/components/ui/Modal';
import clsx from 'clsx';

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
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'number' | 'otp'>('number');
  const [userType, setUserType] = useState<'existing' | 'new' | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(120);

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

  const handleSendNumber = async () => {
    if (!number || number.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    if (!agreed) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('number', number);
      formData.append('country_id', '91');

      const res = await api.post(endPointApi.webLoginRegister, formData);
      const result = res.data;

      if (result?.status === 200 || result?.success === true) {
        toast.success('OTP sent successfully 📩');
        setUserType(result?.data?.user_type);
        setStep('otp');
        setTimer(120); // Reset timer
      } else {
        toast.error(result?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    if (userType === 'new' && (!form.name || !form.email)) {
      // If new user, we might need to show extra fields. 
      // Based on screenshot, the design only shows OTP input. 
      // If the API requires name/email for new users, we might need an intermediate step 
      // or show fields below OTP.
      // For now, assuming the provided design is complete and maybe registration happens later 
      // or we just default name/email if not provided in UI.
      // However, the original code had these fields.
      // I'll keep the logic but maybe render them if userType is 'new'.
      
      // Let's assume for now we just show name/email fields if it's a new user, 
      // matching the style of the inputs.
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('number', number);
      formData.append('otp', otp);
      formData.append('country_id', '91');

      if (userType === 'new') {
        // If we collected name/email
        if (form.name) formData.append('name', form.name);
        if (form.email) formData.append('email', form.email);
      }

      const res = await api.post(endPointApi.webLoginRegister, formData);
      const result = res.data;

      if (result?.status === 200 || result?.success === true) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user.full_name));
        localStorage.setItem('email', JSON.stringify(result.data.user.email));

        toast.success(result.message || 'Login successful');
        window.dispatchEvent(new Event('storage'));
        onLoginSuccess();
      } else {
        toast.error(result?.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setStep('number');
      setNumber('');
      setOtp('');
      setForm({ name: '', email: '' });
      setUserType(null);
      setAgreed(false);
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
      <div className="flex flex-col md:flex-row h-full min-h-[500px]">
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
                      onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter Mobile Number"
                      className="flex-1 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 placeholder:text-gray-400 font-semibold shadow-sm"
                      autoFocus
                    />
                  </div>
                </div>

                <Button 
                  fullWidth 
                  onClick={handleSendNumber} 
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] tracking-wide"
                >
                  {loading ? 'Sending...' : 'CONTINUE'}
                </Button>

                <div className="flex items-start gap-3">
                   <div className="relative flex items-start">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={() => setAgreed(!agreed)}
                        className="peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-none checked:bg-orange-600 checked:border-orange-600 transition-all mt-0.5"
                      />
                      <Check 
                        size={12} 
                        strokeWidth={3} 
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[40%] text-white opacity-0 peer-checked:opacity-100 transition-opacity mt-0.5" 
                      />
                   </div>
                  <p className="text-xs text-gray-500 leading-relaxed cursor-pointer" onClick={() => setAgreed(!agreed)}>
                    By continuing, I agree to the <span className="text-orange-600 font-semibold hover:underline">Terms of Use</span> & <span className="text-orange-600 font-semibold hover:underline">Privacy Policy</span>
                  </p>
                </div>
              </div>

              {/* <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="px-3 bg-white text-gray-400 font-semibold">Or login with</span>
                </div>
              </div> */}

              {/* <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all group shadow-sm">
                  <Chrome size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">Google</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all group shadow-sm">
                  <Mail size={20} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">Email</span>
                </button>
              </div> */}
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
                <div className="relative">
                  <input
                    type={showOtp ? "text" : "password"}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 placeholder:text-gray-400 font-bold tracking-[0.2em] text-lg shadow-sm"
                    autoFocus
                  />
                  <button 
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {userType === 'new' && (
                  <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                    <input
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                    />
                  </div>
                )}

                <Button 
                  fullWidth 
                  onClick={handleVerifyOtp} 
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] tracking-wide"
                >
                  {loading ? 'Verifying...' : 'VERIFY & LOGIN'}
                </Button>

                <div className="flex items-center justify-between text-sm font-medium pt-2">
                  <button 
                    onClick={() => setStep('number')}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    ← Change Number
                  </button>
                  
                  {timer > 0 ? (
                    <span className="text-gray-400">
                      Resend in <span className="text-gray-900 font-bold tabular-nums">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                    </span>
                  ) : (
                    <button 
                      onClick={handleSendNumber}
                      className="text-orange-600 font-bold hover:text-orange-700 hover:underline"
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
