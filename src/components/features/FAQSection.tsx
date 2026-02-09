"use client";
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: "1. Why Upleex?",
    answer: "Upleex offers a wide range of premium products at affordable rental rates. We ensure quality checks, free maintenance, and flexible tenure options to suit your needs."
  },
  {
    question: "2. How does Upleex work?",
    answer: "Simply browse our catalog, select the products you need, choose your rental tenure, and place an order. We'll deliver and install the products at your doorstep."
  },
  {
    question: "3. How to Take a Product on rent (Take On Rent) from Upleex?",
    answer: "You can rent products by visiting our website or app, selecting the desired category, choosing the product, completing the KYC process, and making the payment."
  },
  {
    question: "4. What things can I Rent from Upleex?",
    answer: "You can rent furniture, home appliances, electronics, fitness equipment, laptops, and more."
  },
  {
    question: "5. Can I cancel my rental order?",
    answer: "Yes, you can cancel your rental order before delivery. Cancellation policies may apply based on the timing of your request."
  },
  {
    question: "6. What happens if I return the product early?",
    answer: "Early returns are possible. However, the rental charges may be recalculated based on the actual tenure of usage."
  },
  {
    question: "7. What if my KYC verification fails?",
    answer: "If KYC verification fails, our team will contact you to request additional documents or clarify the issue. Your order will be processed once KYC is approved."
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-gray-100 last:border-0 bg-gray-50 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
      >
        <span className="text-slate-700 font-medium text-lg">{question}</span>
        <span className="text-slate-400">
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-slate-500 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-12">
          <span className="text-gradient-primary">Got Questions?</span> We've Got Answers!
        </h2>
        
        <div className="space-y-2">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
