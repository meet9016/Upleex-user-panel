'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    dialCode: '+91',
    mobile: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-slate-900/80"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[3fr,2.2fr] gap-6 lg:gap-8">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 backdrop-blur-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.35)]">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-upleex-dark uppercase">
              Contact Us
            </h1>
            <div className="mt-2 h-1 w-24 bg-gradient-primary rounded-full" />
            <p className="mt-4 text-sm md:text-base text-slate-600 max-w-md">
              Fill in the form and our team will reach out to you within a few working hours.
            </p>
          </div>

          <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-upleex-purple/30 focus:border-upleex-purple bg-gray-50 transition-shadow"
                placeholder="Enter your full name"
              />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-upleex-purple/30 focus:border-upleex-purple bg-gray-50 transition-shadow"
                placeholder="you@example.com"
              />
              </div>

            <div className="grid grid-cols-[110px,1fr] gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Dial Code</label>
                <select
                  name="dialCode"
                  value={form.dialCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-upleex-purple/30 focus:border-upleex-purple"
                >
                  <option value="+91">+91</option>
                  {/* <option value="+1">+1</option>
                  <option value="+971">+971</option> */}
                </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Mobile No</label>
                  <input
                    type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-upleex-purple/30 focus:border-upleex-purple bg-gray-50"
                  placeholder="9876543210"
                />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea
                  rows={4}
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-upleex-purple/30 focus:border-upleex-purple bg-gray-50"
                placeholder="Write your message here..."
              />
              </div>

            <Button
              type="submit"
              fullWidth
              className="mt-2 bg-gradient-primary hover:opacity-95 text-white font-semibold tracking-wide rounded-full py-2.5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              Submit
            </Button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-upleex-purple to-upleex-blue text-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.45)]">
          <div>
            <h2 className="text-lg md:text-xl font-semibold tracking-wide">Get In Touch With Us</h2>
            <p className="mt-3 text-xs md:text-sm text-white/85 leading-relaxed">
              Do you have any questions? Please do not hesitate to contact us directly. Our team will get back
              to you within a short time.
            </p>

            <div className="mt-6 space-y-5 text-sm md:text-base">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white/80 text-[11px] uppercase tracking-[0.12em]">Phone</p>
                  <p className="font-semibold text-sm md:text-base">+91-0000000000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white/80 text-[11px] uppercase tracking-[0.12em]">Address</p>
                  <p className="font-semibold text-sm md:text-base leading-snug">
                    Upleex Headquarters
                    <br />
                    Surat, Gujarat, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white/80 text-[11px] uppercase tracking-[0.12em]">Email</p>
                  <p className="font-semibold text-sm md:text-base">support@upleex.com</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[11px] md:text-xs text-white/80 leading-relaxed">
            Prefer WhatsApp or a different channel? Share it in the message and we will reach out on your
            preferred mode of contact.
          </p>
        </div>
      </div>
    </div>
  );
}
