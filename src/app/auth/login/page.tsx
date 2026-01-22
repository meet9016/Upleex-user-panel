import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
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

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
            <p className="mt-2 text-sm text-gray-500">
              New to Upleex? <Link href="/auth/register" className="font-semibold text-upleex-purple hover:text-upleex-blue transition-colors">Create an account</Link>
            </p>
          </div>

          <form className="mt-8 space-y-5">
            
            <div className="space-y-5">
              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  required 
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-upleex-purple/20 focus:border-upleex-purple transition-all sm:text-sm bg-gray-50/50" 
                  placeholder="Email Address" 
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  required 
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-upleex-purple/20 focus:border-upleex-purple transition-all sm:text-sm bg-gray-50/50" 
                  placeholder="Password" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-upleex-purple focus:ring-upleex-purple border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-upleex-purple hover:text-upleex-blue">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Button fullWidth variant="primary" className="shadow-lg shadow-purple-500/30 h-12 text-base">
                Sign In <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex items-center justify-center w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" /> Google
               </button>
               <button type="button" className="flex items-center justify-center w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                 <img src="https://www.svgrepo.com/show/448234/apple.svg" className="h-5 w-5 mr-2" alt="Apple" /> Apple
               </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
