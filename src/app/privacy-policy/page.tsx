'use client';
 
import { ShieldCheck, Database, Lock, Cookie, UserCog, Cpu, Users, History, Baby, RefreshCcw } from 'lucide-react';
 
export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: <Database className="w-6 h-6 text-upleex-purple" />,
      content: "We collect various types of information to provide and improve our services: Personal Information (Name, Phone, Email), KYC Documents (Aadhaar, PAN, etc.), Transaction Details, and Device & Usage data."
    },
    {
      title: "2. Purpose of Data",
      icon: <Cpu className="w-6 h-6 text-upleex-blue" />,
      content: "We use the collected data for several purposes: To provide and maintain our services, to process your orders and rentals, to improve user experience through personalization, and to detect and prevent fraudulent activities."
    },
    {
      title: "3. Data Sharing",
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      content: "We may share your information with trusted third parties to facilitate our services. This includes sharing necessary details with vendors for product fulfillment, payment gateways for secure transactions, and logistics partners for delivery."
    },
    {
      title: "4. Cookies",
      icon: <Cookie className="w-6 h-6 text-amber-600" />,
      content: "We use cookies and similar tracking technologies to enhance your experience. These are used for personalization, analyzing platform traffic and usage patterns, and tracking the performance of our features."
    },
    {
      title: "5. Data Security",
      icon: <Lock className="w-6 h-6 text-blue-500" />,
      content: "We prioritize your data security. Our platform implements industry-standard encryption, secure server environments, and restricted access protocols to protect your personal information from unauthorized access."
    },
    {
      title: "6. Data Retention",
      icon: <History className="w-6 h-6 text-indigo-500" />,
      content: "We retain your personal data only for as long as necessary. This includes retention for legal compliance, resolution of disputes, and for legitimate business and operational purposes."
    },
    {
      title: "7. User Rights",
      icon: <UserCog className="w-6 h-6 text-orange-500" />,
      content: "You have certain rights regarding your personal data. You can access your stored information, request corrections to inaccurate data, or request the deletion of your personal data under certain conditions."
    },
    {
      title: "8. Children Policy",
      icon: <Baby className="w-6 h-6 text-rose-500" />,
      content: "The Upleex platform is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children."
    },
    {
      title: "9. Updates",
      icon: <RefreshCcw className="w-6 h-6 text-slate-500" />,
      content: "Our Privacy Policy may be updated from time to time. Any changes will be posted on this page, and we encourage you to review it periodically to stay informed about how we protect your data."
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
            At Upleex, we value your privacy and are committed to protecting your data.
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
