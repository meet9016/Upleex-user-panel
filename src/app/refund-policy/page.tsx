'use client';
 
import { 
  BadgeDollarSign, RefreshCcw, CheckCircle2, Clock, 
  CreditCard, ShieldAlert, XCircle, Ban, Search, 
  ShieldCheck, PieChart, AlertTriangle, Gavel 
} from 'lucide-react';
 
export default function RefundPolicyPage() {
  const sections = [
    {
      title: "1. Cancellation",
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      content: "Cancellations made before the product is dispatched are eligible for a full refund. For cancellations after dispatch, shipping and handling charges will be deducted from the refund amount."
    },
    {
      title: "2. Refund Eligibility",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
      highlight: true,
      content: "A refund is applicable if: (a) The product is delivered in a damaged condition, (b) An incorrect item was delivered, or (c) The product is not functioning according to its specifications upon arrival."
    },
    {
      title: "3. Non-Refundable Cases",
      icon: <Ban className="w-6 h-6 text-slate-500" />,
      content: "Refunds will not be issued in cases of: Misuse of the product, damages caused by customer negligence, or a simple change of mind after the product has been utilized or the rental period has commenced."
    },
    {
      title: "4. Inspection Process",
      icon: <Search className="w-6 h-6 text-upleex-blue" />,
      content: "All returned products undergo a mandatory inspection process. Refunds are processed only after our technical team approves the return based on the product's condition and the reason for the refund request."
    },
    {
      title: "5. Security Deposit Refund",
      icon: <ShieldCheck className="w-6 h-6 text-orange-500" />,
      content: "The security deposit is generally refunded within 5 to 7 working days after the product is successfully returned and passes the quality inspection."
    },
    {
      title: "6. Partial Refund",
      icon: <PieChart className="w-6 h-6 text-purple-500" />,
      content: "In cases where minor damages are found that do not render the product unusable but were caused during your possession, a partial refund of the security deposit may be issued."
    },
    {
      title: "7. Refund Timeline",
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      content: "Approved refunds are usually credited within 5 to 10 business days. The exact timeline depends on your bank and the original payment method used."
    },
    {
      title: "8. Disputes",
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      content: "Any discrepancies or disputes regarding the order or the refund process must be reported to our support team within 48 hours of the incident or delivery."
    },
    {
      title: "9. Chargebacks",
      icon: <Gavel className="w-6 h-6 text-slate-800" />,
      content: "Fraudulent chargebacks or disputes will be dealt with strictly and may result in permanent account suspension and potential legal action to recover costs."
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            We aim to provide a transparent and seamless experience. Below are the terms governing our refund and cancellation processes.
          </p>
        </div>
 
        {/* Highlighted Notice */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4">
          <BadgeDollarSign className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-emerald-800">Your protection is our priority</h3>
            <p className="text-emerald-700/80 mt-1">
              All eligible refund requests are processed according to our transparent policy guidelines to ensure fairness for both users and vendors.
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
