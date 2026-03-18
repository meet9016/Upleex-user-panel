'use client';

import { BadgeDollarSign, RefreshCcw, CheckCircle, Clock, CreditCard, ShieldAlert } from 'lucide-react';

export default function RefundPolicyPage() {
  const sections = [
    {
      title: "1. 100% Refund Guarantee",
      icon: <BadgeDollarSign className="w-6 h-6 text-emerald-500" />,
      highlight: true,
      content: "We stand by our service quality! A full 100% refund is available if you are not satisfied with the product upon delivery or if you cancel your order within the eligible cancellation window. No questions asked."
    },
    {
      title: "2. Cancellation Window",
      icon: <Clock className="w-6 h-6 text-upleex-blue" />,
      content: "To be eligible for a full refund before delivery, cancellations must be made at least 24 hours prior to your scheduled delivery slot. Late cancellations may be subject to a nominal logistical fee deducted from the refund amount."
    },
    {
      title: "3. Condition of the Product",
      icon: <CheckCircle className="w-6 h-6 text-upleex-purple" />,
      content: "If the delivered product is defective, damaged during transit, or significantly different from its description, you are entitled to an immediate replacement or a full refund. Please report any issues to our delivery executive immediately upon receipt."
    },
    {
      title: "4. Return of Security Deposit",
      icon: <RefreshCcw className="w-6 h-6 text-orange-500" />,
      content: "Your security deposit will be fully refunded to your original payment method within 3-5 business days after the product is returned, subject to a brief quality check ensuring no permanent damages have occurred during your rental period."
    },
    {
      title: "5. Refund Processing Time",
      icon: <CreditCard className="w-6 h-6 text-slate-600" />,
      content: "Once a refund is approved, it will be processed immediately from our end. Depending on your bank or payment gateway, it usually takes 5 to 7 working days for the amount to reflect securely in your account."
    },
    {
      title: "6. Exceptions",
      icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
      content: "Refunds cannot be processed for products that suffer deliberate physical damage, unauthorized modifications, or severe negligence while in your possession. Standard wear and tear is always covered and exempt from penalties."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4">
            <RefreshCcw className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Refund Policy</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Your satisfaction is our priority. We offer a transparent and hassle-free refund process for all our rental services.
          </p>
        </div>

        {/* Highlighted Notice */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4">
          <BadgeDollarSign className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-emerald-800">Refunds are currently available!</h3>
            <p className="text-emerald-700/80 mt-1">
              You are completely protected by our hassle-free money-back guarantee. Eligible requests are processed instantly without any hidden fees.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">
            {sections.map((section, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 md:group-hover:scale-110 md:group-hover:shadow-md ${section.highlight ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                    {section.icon}
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className={`text-xl font-bold ${section.highlight ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-light">
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
              Contact us at <a href="mailto:support@upleex.com" className="text-upleex-blue hover:underline">support@upleex.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
