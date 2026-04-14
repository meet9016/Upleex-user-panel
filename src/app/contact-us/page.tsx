'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Phone, Mail, MapPin, Send, MessageSquare, ArrowRight, Building, HelpCircle, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { contactService, type ContactFormData, type ContactFormErrors } from '@/services/contactService';
import { toast } from 'react-hot-toast';

export default function ContactUsPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dialCode: '+91',
    mobile: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    mobile: false,
    message: false,
  });

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};
    
    // First Name validation
    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (form.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (form.firstName.trim().length > 50) {
      newErrors.firstName = 'First name cannot exceed 50 characters';
    }

    // Last Name validation (optional but validate if provided)
    if (form.lastName.trim() && form.lastName.trim().length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
    if (form.mobile && !/^[0-9]{10}$/.test(form.mobile)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Message validation
    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (form.message.trim().length > 1000) {
      newErrors.message = 'Message cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle mobile number input - only allow numbers and limit to 10 digits
    if (name === 'mobile') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 10) {
        setForm(prev => ({ ...prev, [name]: numbersOnly }));
        // Clear error when user starts typing
        if (errors.phone) {
          setErrors(prev => ({ ...prev, phone: undefined }));
        }
      }
      return;
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (name === 'firstName' && errors.firstName) {
      setErrors(prev => ({ ...prev, firstName: undefined }));
    }
    if (name === 'lastName' && errors.lastName) {
      setErrors(prev => ({ ...prev, lastName: undefined }));
    }
    if (name === 'email' && errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
    if (name === 'message' && errors.message) {
      setErrors(prev => ({ ...prev, message: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Validate on blur
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      message: true,
    });

    // Validate form before submission
    const isValid = validateForm();
    
    // If validation fails, stop here - don't show toaster, don't call API
    if (!isValid) {
      return; // Exit early - no API call, no toaster
    }

    setLoading(true);
    try {
      const contactData: ContactFormData = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim(),
        phone: form.mobile ? `${form.dialCode}${form.mobile}` : undefined,
        message: form.message.trim(),
      };

      const response = await contactService.submitContact(contactData);
      
      if (response.success) {
        toast.success(response.message);
        setSubmitted(true);
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          dialCode: '+91',
          mobile: '',
          message: '',
        });
        setErrors({});
        setTouched({
          firstName: false,
          lastName: false,
          email: false,
          mobile: false,
          message: false,
        });
        
        // Reset submitted state after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error(response.message || 'Failed to send message. Please try again.');
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if field should show error
  const showError = (field: string) => {
    return touched[field as keyof typeof touched] && errors[field as keyof ContactFormErrors];
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-100 to-slate-50 pointer-events-none" />
      <div className="absolute -top-[300px] -right-[300px] w-[800px] h-[800px] rounded-full bg-upleex-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-upleex-purple/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 relative z-10">
        
        {/* Header Sections */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Contact Us
          </h1>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
          {/* Card 1 */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-2xl bg-upleex-purple/10 flex items-center justify-center mb-6 group-hover:bg-upleex-purple transition-colors duration-500">
              <MessageSquare className="w-5 h-5 text-upleex-purple group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Chat to support</h3>
            <p className="text-slate-500 mb-6 leading-relaxed text-sm md:text-base">We're here to help with any questions or support requests.</p>
            <a href="mailto:support@upleex.com" className="text-upleex-purple font-semibold hover:text-upleex-blue transition-colors flex items-center gap-2 group-hover:gap-3 duration-300 text-sm md:text-base">
              info@upleex.com <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-2xl bg-upleex-blue/10 flex items-center justify-center mb-6 group-hover:bg-upleex-blue transition-colors duration-500">
              <Building className="w-5 h-5 text-upleex-blue group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Visit us</h3>
            <p className="text-slate-500 mb-6 leading-relaxed text-sm md:text-base">Visit our headquarters for an in-person meeting.</p>
            <p className="text-upleex-blue font-semibold flex items-start gap-2 text-sm md:text-base">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Surat, Gujarat, India</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-900/5 flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors duration-500">
              <Phone className="w-5 h-5 text-slate-900 group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Call us</h3>
            <p className="text-slate-500 mb-6 leading-relaxed text-sm md:text-base">Mon-Fri from 9am to 6pm IST.</p>
            <a href="tel:+910000000000" className="text-slate-900 font-semibold hover:text-upleex-purple transition-colors flex items-center gap-2 group-hover:gap-3 duration-300 text-sm md:text-base">
              +91 7359595951 <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/70 border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          
          <div className="w-full lg:w-[45%] p-8 md:p-10 lg:p-12 bg-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
             {/* Abstract shapes for dark side */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-upleex-purple/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-upleex-blue/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
             
             <div className="relative z-10 mb-12">
               <h2 className="text-2xl lg:text-3xl font-extrabold mb-4 tracking-tight">Send us a message</h2>
               <p className="text-slate-300 text-base leading-relaxed max-w-md">
                 Fill out the form and our team will get back to you within 24 hours. We're excited to learn how we can help you with your rental needs.
               </p>
             </div>
             
             <div className="relative z-10 space-y-6">
               {/* Testimonial or trust badge */}
               <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md hover:bg-white/10 transition-colors duration-300">
                 <div className="flex gap-1 mb-4">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                 </div>
                 <p className="text-slate-200 italic mb-6 leading-relaxed text-sm md:text-base">"The Upleex support team is incredibly responsive and helpful. They resolved my query and delivered my product the very next day. Seamless experience!"</p>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-upleex-purple to-upleex-blue flex items-center justify-center font-bold text-white text-xs shadow-inner tracking-widest">
                     JD
                   </div>
                   <div>
                     <p className="font-semibold text-white text-sm">John Doe</p>
                     <p className="text-slate-400 text-xs">Verified Renter</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="w-full lg:w-[55%] p-8 md:p-10 lg:p-12 bg-white">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-slate-600 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" 
                    name="firstName" 
                    value={form.firstName} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('firstName')}
                    className={`w-full rounded-xl border px-4 py-2 text-slate-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                      showError('firstName')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                    placeholder="First name"
                    disabled={loading}
                  />
                  {showError('firstName') && errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Last Name</label>
                  <input
                    type="text" 
                    name="lastName" 
                    value={form.lastName} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('lastName')}
                    className={`w-full rounded-xl border px-4 py-2 text-slate-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                      showError('lastName')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300'
                    }`}
                    placeholder="Last name"
                    disabled={loading}
                  />
                  {showError('lastName') && errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full rounded-xl border px-4 py-2 text-slate-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                    showError('email')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                  placeholder="you@company.com"
                  disabled={loading}
                />
                {showError('email') && errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <div className="flex">
                  <div className="flex items-center bg-gray-50 border border-gray-300 border-r-0 rounded-l-xl px-4 py-2 text-sm md:text-base text-slate-600 font-medium">
                    <span>{form.dialCode}</span>
                  </div>
                  <input
                    type="tel" 
                    name="mobile" 
                    value={form.mobile} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('mobile')}
                    className={`flex-1 rounded-r-2xl border px-4 py-2 text-slate-900 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                      showError('mobile')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                    placeholder="98765 43210"
                    disabled={loading}
                    inputMode="numeric"
                    maxLength={10}
                  />
                </div>
                {showError('mobile') && errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6} 
                  name="message" 
                  value={form.message} 
                  onChange={handleChange}
                  onBlur={() => handleBlur('message')}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-slate-900 text-sm md:text-base resize-none focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                    showError('message')
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                  placeholder="Tell us how we can help you..."
                  disabled={loading}
                />
                {showError('message') && errors.message && (
                  <p className="text-red-600 text-sm mt-1">{errors.message}</p>
                )}
                <div className="text-right text-xs text-slate-400 mt-1">
                  {form.message.length}/1000 characters
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  className="h-12 md:h-14 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold text-base rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-xl shadow-slate-900/20 active:translate-y-0 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}