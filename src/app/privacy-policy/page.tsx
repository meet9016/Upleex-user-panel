'use client';

import { ShieldCheck, Database, Eye, Lock, Cookie, UserCog } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: <Database className="w-6 h-6 text-upleex-purple" />,
      content: "We collect information to provide better services to all our users. Information we collect includes personal data such as your name, email address, phone number, and address that you provide when registering. We also collect transaction data when you rent products from us, including rental duration and payment method details."
    },
    {
      title: "2. How We Use Information",
      icon: <Eye className="w-6 h-6 text-upleex-blue" />,
      content: "We use the information we collect to provide, maintain, protect and improve our services, to develop new ones, and to protect Upleex and our users. This includes fulfilling your requests for products, keeping you informed about the status of your rentals, and sending you relevant promotional offers (which you can opt out of)."
    },
    {
      title: "3. Information Security",
      icon: <Lock className="w-6 h-6 text-emerald-500" />,
      content: "We work hard to protect Upleex and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. We use secure servers, industry-standard firewalls, and end-to-end encryption for payment processing to ensure the safety of your information."
    },
    {
      title: "4. Your Data Rights",
      icon: <UserCog className="w-6 h-6 text-orange-500" />,
      content: "Depending on your location, you may have rights under privacy laws regarding your personal information, including the right to request access, correction, deletion, or portability of your personal data. You can exercise these rights by contacting us through our support channels or managing your preferences in your account settings."
    },
    {
      title: "5. Cookies & Tracking",
      icon: <Cookie className="w-6 h-6 text-amber-600" />,
      content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service."
    },
    {
      title: "6. Changes to This Policy",
      icon: <ShieldCheck className="w-6 h-6 text-slate-500" />,
      content: "Our Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-upleex-blue/10 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-upleex-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Your privacy is critically important to us. This policy outlines how we collect, use, and protect your personal information on Upleex.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">
            {sections.map((section, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    {section.icon}
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                  <p className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-500">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-sm text-slate-500">
              Contact us at <a href="mailto:privacy@upleex.com" className="text-upleex-blue hover:underline">privacy@upleex.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
