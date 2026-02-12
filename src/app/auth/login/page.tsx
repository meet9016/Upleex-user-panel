'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import endPointApi from '@/utils/endPointApi';
import { api } from '@/utils/axiosInstance';

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

  const handleSendNumber = async () => {
    try {
      const formData = new FormData();
      formData.append('number', number);
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
      } else {
        toast.error(result?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const formData = new FormData();
      formData.append('number', number);
      formData.append('otp', otp);
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
      console.log("🚀 ~ handleVerifyOtp ~ result:", result)

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

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="max-w-md w-full space-y-6">

          <h2 className="text-3xl font-extrabold text-slate-900">
            Sign In
          </h2>

          {/* STEP 1 */}
          {step === 'number' && (
            <>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Mobile Number"
                  className="w-full pl-10 py-3 border rounded-lg bg-gray-50"
                />
              </div>

              <Button fullWidth onClick={handleSendNumber} className="cursor-pointer">
                Continue <ArrowRight className="ml-2" size={18} />
              </Button>
            </>
          )}

          {/* STEP 2 */}
          {step === 'otp' && (
            <>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full py-3 px-3 border rounded-lg bg-gray-50"
              />

              {userType === 'new' && (
                <>
                  <input
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full py-3 px-3 border rounded-lg"
                  />

                  <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full py-3 px-3 border rounded-lg"
                  />
                </>
              )}

              <Button fullWidth onClick={handleVerifyOtp}>
                Verify & Continue
              </Button>
            </>
          )}

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
