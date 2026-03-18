'use client';

import { FileText, ShieldAlert, ShoppingBag, UserCheck, Globe, Scale } from 'lucide-react';

export default function TermsOfUsePage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <FileText className="w-6 h-6 text-upleex-purple" />,
      content: "By accessing and using Upleex, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. If you do not agree to these terms, please do not use our platform."
    },
    {
      title: "2. Description of Service",
      icon: <Globe className="w-6 h-6 text-upleex-blue" />,
      content: "Upleex provides users with access to a rich collection of resources, including various rental products. You understand and agree that the Service is provided \"AS-IS\" and that Upleex assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings."
    },
    {
      title: "3. User Conduct",
      icon: <UserCheck className="w-6 h-6 text-emerald-500" />,
      content: "You agree to use our platform only for lawful purposes. You agree not to take any action that might compromise the security of the site, render the site inaccessible to others or otherwise cause damage to the site or the content. Harassment in any manner or form on the site is strictly forbidden."
    },
    {
      title: "4. Rental Agreement",
      icon: <ShoppingBag className="w-6 h-6 text-orange-500" />,
      content: "When renting products through Upleex, you enter into a binding agreement regarding the specific product, duration, and conditions defined during the checkout process. Failure to return products on time or returning damaged goods may result in additional charges, penalty fees, or suspension of your account."
    },
    {
      title: "5. Limitation of Liability",
      icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
      content: "Upleex shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if Upleex has been advised of the possibility of such damages."
    },
    {
      title: "6. Governing Law",
      icon: <Scale className="w-6 h-6 text-slate-500" />,
      content: "Your use of this site shall be governed in all respects by the laws of the jurisdiction in which Upleex is established, without regard to choice of law provisions."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-upleex-purple/10 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-upleex-purple" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Terms of Use</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform. Your access to and use of Upleex is conditioned on your acceptance of and compliance with these terms.
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
              Contact us at <a href="mailto:legal@upleex.com" className="text-upleex-blue hover:underline">legal@upleex.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
