'use client';
 
import { 
  FileText, ShieldAlert, ShoppingBag, UserCheck, Globe, Scale, 
  Info, ShieldCheck, CreditCard, Lock, Truck, Box, AlertTriangle, 
  XCircle, Store, Ban, UserMinus 
} from 'lucide-react';
 
export default function TermsOfUsePage() {
  const sections = [
    {
      title: "1. Platform Overview",
      icon: <Info className="w-6 h-6 text-upleex-purple" />,
      content: "Upleex is a marketplace that connects customers with vendors for renting and selling products. Upleex acts only as an intermediary."
    },
    {
      title: "2. User Eligibility",
      icon: <UserCheck className="w-6 h-6 text-upleex-blue" />,
      content: "You must be at least 18 years old. All information provided during registration or use must be accurate, current, and complete."
    },
    {
      title: "3. Account & KYC",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      content: "Users may be required to complete KYC verification (Aadhaar, PAN, etc.) as per platform requirements. Upleex reserves the right to suspend or terminate accounts that fail to provide or maintain verified information."
    },
    {
      title: "4. Orders & Rental Agreement",
      icon: <ShoppingBag className="w-6 h-6 text-orange-500" />,
      content: "Each order placed on the platform constitutes a direct agreement between the customer and vendor. Upleex facilitates the transaction but is not a party to the rental agreement."
    },
    {
      title: "5. Pricing & Payments",
      icon: <CreditCard className="w-6 h-6 text-blue-500" />,
      content: "Product prices are set by vendors. Upleex may charge service fees or commissions. All payments must be completed through approved payment methods provided on the platform."
    },
    {
      title: "6. Security Deposit",
      icon: <Lock className="w-6 h-6 text-indigo-500" />,
      content: "Security deposits are refundable after successful product return and inspection. Deductions may apply for damages, delays in return, or product misuse."
    },
    {
      title: "7. Delivery & Returns",
      icon: <Truck className="w-6 h-6 text-amber-500" />,
      content: "Delivery timelines are estimated and subject to vendor availability and logistics. Users are responsible for returning rented products on time as per the agreed duration."
    },
    {
      title: "8. Product Usage",
      icon: <Box className="w-6 h-6 text-teal-500" />,
      content: "Users must use products responsibly and only for their intended purposes. Misuse or involvement in any illegal activities using rented products is strictly prohibited."
    },
    {
      title: "9. Damage & Liability",
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      content: "Users are fully responsible for any damage, loss, or theft of the product during the rental period. This includes repair or full replacement costs as determined by the vendor/Upleex."
    },
    {
      title: "10. Cancellation",
      icon: <XCircle className="w-6 h-6 text-rose-500" />,
      content: "Cancellations are allowed based on the platform's timing policies. Specific charges or non-refundable fees may apply once a product has been dispatched."
    },
    {
      title: "11. Vendor Responsibility",
      icon: <Store className="w-6 h-6 text-gray-700" />,
      content: "Vendors are responsible for providing accurate product details and ensuring the quality and availability of products listed on the platform."
    },
    {
      title: "12. Prohibited Activities",
      icon: <Ban className="w-6 h-6 text-red-600" />,
      content: "Fraudulent behavior, providing fake KYC documents, or any attempt to misuse the platform tools and services will result in immediate legal action and account termination."
    },
    {
      title: "13. Suspension & Termination",
      icon: <UserMinus className="w-6 h-6 text-slate-600" />,
      content: "Upleex reserves the right to suspend or terminate user accounts for violations of these terms, platform policies, or any suspicious activity."
    },
    {
      title: "14. Limitation of Liability",
      icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
      content: "Upleex acts as a facilitator and is not liable for any indirect, incidental, or third-party damages arising from vendor-customer interactions or product usage."
    },
    {
      title: "15. Governing Law",
      icon: <Scale className="w-6 h-6 text-slate-800" />,
      content: "These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the Indian courts."
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
            Welcome to Upleex. By accessing or using our platform, you agree to comply with and be bound by the following terms.
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
