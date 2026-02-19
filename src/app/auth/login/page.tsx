'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import endPointApi from '@/utils/endPointApi';
import { api } from '@/utils/axiosInstance';
import { AnimatePresence, motion } from 'framer-motion';

const LoginPage = () => {
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'number' | 'otp'>('number');
  const [userType, setUserType] = useState<'existing' | 'new' | null>(null);
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<{ number?: string; otp?: string; name?: string; email?: string }>({});

  const handleSendNumber = async () => {
    const clean = number.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrors(prev => ({ ...prev, number: 'Enter a valid 10-digit mobile number' }));
      return;
    }
    try {
      const formData = new FormData();
      formData.append('number', clean);
      formData.append('country_id', '91');

      const res = await api.post(
        endPointApi.webLoginRegister,
        formData
      );

      const result = res.data;

      if (result?.status === 200 || result?.success === true) {
        toast.success('OTP sent successfully 📩');
        setUserType(result?.data?.user_type);
        setStep('otp');
        setErrors(prev => ({ ...prev, number: '' }));
      } else {
        toast.error(result?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.replace(/\D/g, '');
    const newErrors: { otp?: string; name?: string; email?: string } = {};
    if (cleanOtp.length < 4) newErrors.otp = 'Enter the OTP';
    if (userType === 'new') {
      if (!form.name.trim()) newErrors.name = 'Name is required';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email.trim())) newErrors.email = 'Enter a valid email';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    try {
      const formData = new FormData();
      formData.append('number', number.replace(/\D/g, ''));
      formData.append('otp', cleanOtp);
      formData.append('country_id', '91');

      if (userType === 'new') {
        formData.append('name', form.name);
        formData.append('email', form.email);
      }

      const res = await api.post(
        endPointApi.webLoginRegister,
        formData
      );

      const result = res.data;

      if (result?.status === 200 || result?.success === true) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem(
          'user',
          JSON.stringify(result.data.user.full_name)
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


    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="flex-grow flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
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
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" />
                      <input
                        value={number}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 10) setNumber(val);
                          if (val.length === 10) setErrors(prev => ({ ...prev, number: '' }));
                        }}
                        placeholder="Mobile Number"
                        className={`w-full pl-10 py-3 border rounded-lg bg-gray-50 ${errors.number ? 'border-red-500' : ''}`}
                      />
                      {errors.number ? (
                        <p className="text-red-600 text-sm mt-1">{errors.number}</p>
                      ) : null}
                    </div>
                    <Button
                      fullWidth
                      onClick={handleSendNumber}
                      className="cursor-pointer"
                    >
                      Continue <ArrowRight className="ml-2" size={18} />
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
                    <input
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 6) setOtp(val);
                        if (val.length >= 4) setErrors(prev => ({ ...prev, otp: '' }));
                      }}
                      placeholder="Enter OTP"
                      className={`w-full py-3 px-3 border rounded-lg bg-gray-50 ${errors.otp ? 'border-red-500' : ''}`}
                    />
                    {errors.otp ? (
                      <p className="text-red-600 text-sm -mt-3">{errors.otp}</p>
                    ) : null}
                    {userType === 'new' && (
                      <>
                        <input
                          placeholder="Full Name"
                          value={form.name}
                          onChange={(e) => {
                            setForm({ ...form, name: e.target.value });
                            if (e.target.value.trim()) setErrors(prev => ({ ...prev, name: '' }));
                          }}
                          className={`w-full py-3 px-3 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name ? (
                          <p className="text-red-600 text-sm -mt-3">{errors.name}</p>
                        ) : null}
                        <input
                          placeholder="Email"
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (emailPattern.test(e.target.value.trim())) setErrors(prev => ({ ...prev, email: '' }));
                          }}
                          className={`w-full py-3 px-3 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email ? (
                          <p className="text-red-600 text-sm -mt-3">{errors.email}</p>
                        ) : null}
                      </>
                    )}
                    <Button fullWidth onClick={handleVerifyOtp}>
                      Verify & Continue
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

          <p className="text-sm text-gray-500">
            New to Upleex?{' '}
            <Link href="/auth/register" className="text-upleex-purple font-semibold">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};
export default LoginPage;
