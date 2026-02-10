'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CenterModeCarousel } from '@/components/features/CenterModeCarousel';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Crown,
  Truck,
  ShieldCheck,
  Clock,
  Gift,
  Percent,
  Star,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Types
type BillingCycle = 'monthly' | 'yearly';

// Data
const BENEFITS = [
  {
    icon: <Percent className="w-8 h-8 text-upleex-blue" />,
    title: "Exclusive Discounts",
    description: "Get up to 15% extra discount on all rental products across categories."
  },
  {
    icon: <Truck className="w-8 h-8 text-blue-500" />,
    title: "Free Delivery",
    description: "Enjoy zero delivery charges on all your orders, no minimum value required."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
    title: "No Security Deposit",
    description: "Rent select high-value items without blocking your money in security deposits."
  },
  {
    icon: <Clock className="w-8 h-8 text-purple-500" />,
    title: "Priority Support",
    description: "Skip the queue with our dedicated priority customer support line."
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: "Early Access",
    description: "Get first dibs on new product launches and festive sale events."
  },
  {
    icon: <Gift className="w-8 h-8 text-red-500" />,
    title: "Birthday Rewards",
    description: "Receive special surprise gifts and bonus wallet credits on your birthday."
  }
];

const PLANS = {
  monthly: [
    {
      name: 'Gold Member',
      price: 199,
      duration: '/ month',
      features: [
        '10% Discount on all rentals',
        'Free Delivery up to 3 orders',
        'Standard Support',
        'Cancel anytime'
      ],
      tag: ''
    },
    {
      name: 'Platinum Member',
      price: 499,
      duration: '/ month',
      features: [
        '20% Discount on all rentals',
        'Unlimited Free Delivery',
        'Priority Support',
        'No Security Deposit (upto ₹10k)',
        'Exclusive Event Access'
      ],
      tag: 'Best Value'
    }
  ],
  yearly: [
    {
      name: 'Gold Member',
      price: 1999,
      duration: '/ year',
      features: [
        '10% Discount on all rentals',
        'Free Delivery up to 40 orders',
        'Standard Support',
        'Save ₹389 vs Monthly'
      ],
      tag: ''
    },
    {
      name: 'Platinum Member',
      price: 4999,
      duration: '/ year',
      features: [
        '20% Discount on all rentals',
        'Unlimited Free Delivery',
        'Priority Support',
        'No Security Deposit (upto ₹20k)',
        'Exclusive Event Access',
        'Save ₹989 vs Monthly'
      ],
      tag: 'Best Value'
    }
  ]
};

const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Create Account',
    description: 'Sign up on Upleex with your mobile number and basic details.'
  },
  {
    step: 2,
    title: 'Choose Membership',
    description: 'Select a Gold or Platinum plan based on your rental needs.'
  },
  {
    step: 3,
    title: 'Complete Payment',
    description: 'Pay securely using UPI, Card, or Net Banking.'
  },
  {
    step: 4,
    title: 'Instant Activation',
    description: 'Your membership benefits are activated immediately after payment.'
  }
];

const FAQS = [
  {
    question: 'What is Upleex?',
    answer: 'Upleex is an online platform that lets you rent out your unused products to others, helping you earn extra income effortlessly. Whether it\'s furniture, electronics, vehicles, or event supplies, you can list your items and start making money.'
  },
  {
    question: 'How do I list my products for rent?',
    answer: 'Listing your products is simple: Sign up on the Upleex website or mobile app. Click on "List Your Product". Fill in the product details, upload clear images, and set your rental price. Submit for approval, and your product will go live!'
  },
  {
    question: 'What types of products can I rent out?',
    answer: 'You can rent out a variety of products, such as: Furniture (sofas, tables, beds), Electronics (TVs, gaming consoles, laptops), Vehicles (bikes, cars, cycles), Event supplies (decor, audio-visual equipment), Home appliances (refrigerators, washing machines, air purifiers), And much more!'
  },
  {
    question: 'How do I decide the rental price?',
    answer: 'You can set the rental price based on factors like: The product\'s market value. Its condition (new or used). The demand for similar items in your area. Our team can also guide you in setting a competitive price to attract renters.'
  },
  {
    question: 'If I list my product for rent to another individual (C2C), does Upleex guarantee the transaction?',
    answer: 'For C2C listings, Upleex acts only as a listing platform to connect individuals. We do not manage, monitor, or guarantee the transaction, product quality, payment, or delivery.'
  },
  {
    question: 'Will Upleex be responsible if there is a payment or product dispute in a C2C transaction?',
    answer: 'No. In C2C rentals, all terms, conditions, and responsibilities lie between the two parties involved. Upleex is not liable for disputes, losses, or damages arising from such transactions.'
  },
  {
    question: 'How can I make my C2C transaction safe?',
    answer: 'We strongly encourage users to: Verify identity of the other party (ask for a valid government ID). Take a security deposit before handing over the item. Sign a simple rental agreement stating terms and conditions.'
  },
  {
    question: 'Does Upleex provide any tools for C2C security?',
    answer: 'Currently, we do not intervene in C2C transactions. However, we may introduce optional security features in the future for added safety.'
  },
  {
    question: 'Will Upleex manage the rental of my product for me?',
    answer: 'Currently, Upleex operates as a listing platform for C2C rentals. You manage your own listings and handovers, giving you full control over your products and earnings.'
  }
];

const MembershipPage = () => {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white pb-8 pt-4">
        <CenterModeCarousel />
      </section>

      

      {/* Pricing Section */}
      <section className="py-20 bg-[#0a1e4c] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute left-0 bottom-0 w-96 h-96 bg-upleex-purple rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Choose Your Plan</h2>
            
            {/* Toggle */}
            <div className="inline-flex rounded-full p-1 bg-white/10 backdrop-blur-sm border border-white/20">
                <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                        billingCycle === 'monthly' 
                        ? 'bg-gradient-primary text-white shadow-lg' 
                        : 'text-blue-100 hover:bg-white/10'
                    }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                        billingCycle === 'yearly' 
                        ? 'bg-gradient-primary text-white shadow-lg' 
                        : 'text-blue-100 hover:bg-white/10'
                    }`}
                >
                    Yearly (Save 20%)
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PLANS[billingCycle].map((plan, index) => (
                <div 
                    key={index} 
                    className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                        plan.tag ? 'ring-4 ring-upleex-blue/50 transform scale-105 z-10' : 'hover:scale-105'
                    }`}
                >
                    {plan.tag && (
                        <div className="absolute top-0 right-0 bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                            {plan.tag}
                        </div>
                    )}
                    
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-slate-900">₹{plan.price}</span>
                            <span className="text-slate-500 font-medium">{plan.duration}</span>
                        </div>
                        
                        <Button 
                            className={`w-full py-6 font-bold text-lg mb-8 rounded-xl shadow-lg ${
                                plan.tag 
                                ? 'bg-gradient-primary text-white hover:opacity-90' 
                                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                            }`}
                        >
                            Get Started
                        </Button>

                        <div className="space-y-4">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 rounded-full p-1 shrink-0">
                                        <Check className="w-3 h-3 text-green-600 stroke-[3]" />
                                    </div>
                                    <span className="text-slate-600 text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Phone Layout */}
      <section className="py-24 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="flex justify-center mb-24">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-50 rounded-full transform translate-y-2 translate-x-2"></div>
                    <div className="relative bg-white border-2 border-upleex-blue px-12 py-4 rounded-full shadow-lg">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Membership Process
                        </h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Left Steps (1 & 2) */}
                <div className="space-y-20 lg:text-right relative">
                    {PROCESS_STEPS.slice(0, 2).map((step) => (
                        <div key={step.step} className="flex gap-6 lg:flex-row-reverse group items-start relative">
                            <div className="shrink-0 relative">
                                <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 text-3xl font-bold border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                    {step.step}
                                </span>
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-600 text-base leading-relaxed max-w-xs ml-auto">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center Phone */}
                <div className="flex justify-center relative py-0 lg:-mt-12">
                    {/* Glow behind phone */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100 rounded-full blur-[60px]"></div>
                    
                    {/* CSS Phone Mockup */}
                    <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden z-10 transform hover:scale-105 transition-transform duration-500 ring-1 ring-black/5">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-800 rounded-b-2xl z-20"></div>
                        
                        {/* Screen */}
                        <div className="w-full h-full bg-gray-50 relative flex flex-col overflow-hidden">
                             {/* Header */}
                             <div className="bg-[#0a1e4c] p-6 pt-12 text-white pb-8 rounded-b-[2.5rem] shadow-lg relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/10"></div>
                                    <div className="w-24 h-5 rounded-full bg-white/20 backdrop-blur-sm"></div>
                                </div>
                                <h4 className="text-2xl font-bold mb-1">Welcome Club!</h4>
                                <p className="text-sm text-blue-200 font-medium">Premium Member</p>
                             </div>

                             {/* Card Preview */}
                             <div className="p-5 -mt-8 relative z-20">
                                <div className="bg-gradient-primary rounded-2xl p-5 text-white shadow-xl mb-6 transform rotate-1 border border-white/10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <div className="text-xl font-bold tracking-wide">Gold Member</div>
                                            <div className="text-xs text-blue-100 mt-1">Upleex Exclusive</div>
                                        </div>
                                        <Crown className="w-8 h-8 text-yellow-300 drop-shadow-md" />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-sm font-mono opacity-90">•••• •••• 4289</div>
                                        <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Valid 12/26</div>
                                    </div>
                                </div>

                                {/* Benefits List Mock */}
                                <div className="space-y-4 px-1">
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                            <Percent className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <div className="h-2.5 w-24 bg-gray-200 rounded-full"></div>
                                            <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                            <Truck className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <div className="h-2.5 w-28 bg-gray-200 rounded-full"></div>
                                            <div className="h-2 w-20 bg-gray-100 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                                            <Gift className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <div className="h-2.5 w-20 bg-gray-200 rounded-full"></div>
                                            <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                             </div>

                             {/* Bottom Navigation */}
                             <div className="mt-auto bg-white p-4 border-t border-gray-100 flex justify-around items-center pb-6">
                                <div className="w-6 h-6 rounded-full bg-blue-100"></div>
                                <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                                <div className="w-12 h-12 rounded-full bg-[#0a1e4c] -mt-8 border-4 border-gray-50 shadow-lg flex items-center justify-center">
                                    <div className="w-5 h-5 bg-white rounded-md"></div>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                                <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right Steps (3 & 4) */}
                <div className="space-y-20 relative">
                    {PROCESS_STEPS.slice(2, 4).map((step) => (
                        <div key={step.step} className="flex gap-6 group items-start relative">
                            <div className="shrink-0 relative">
                                <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 text-3xl font-bold border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                    {step.step}
                                </span>
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-600 text-base leading-relaxed max-w-xs">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
                {FAQS.map((faq, index) => (
                    <div key={index} className="group">
                        <button
                            onClick={() => toggleFaq(index)}
                            className="w-full flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 text-left"
                        >
                            <span className="font-bold text-slate-900 text-lg pr-8">{faq.question}</span>
                            <ArrowRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-90 text-upleex-blue' : ''}`} />
                        </button>
                        
                        <div 
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                openFaqIndex === index ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
                            }`}
                        >
                            <div className="bg-gray-100 p-6 rounded-xl text-slate-600 leading-relaxed border border-gray-200 shadow-inner">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </main>
  );
};

export default MembershipPage;
