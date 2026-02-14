'use client';

import React, { memo, useCallback, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FAQ = {
  question: string;
  answer: string;
};

interface FAQItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const FAQItem = memo(
  ({ id, question, answer, isOpen, onToggle }: FAQItemProps) => {
    return (
      <div className="border-b border-gray-100 last:border-0 bg-gray-50 rounded-lg mb-4 overflow-hidden">
        <button
          onClick={() => onToggle(id)}
          aria-expanded={isOpen}
          aria-controls={`faq-content-${id}`}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
        >
          <span className="text-slate-700 font-medium text-lg">
            {question}
          </span>
          <span className="text-slate-400">
            {isOpen ? <Minus size={20} /> : <Plus size={20} />}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`faq-content-${id}`}
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="px-6 pb-6 text-slate-500 leading-relaxed border-t border-gray-100/50">
                {answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FAQItem.displayName = 'FAQItem';

interface FAQSectionProps {
  data?: FAQ[];
  title?: string;
}

export const FAQSection = ({ data, title }: FAQSectionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-12">
          {title ? (
            <span className="text-gradient-primary">{title}</span>
          ) : (
            <>
              <span className="text-gradient-primary">Got Questions?</span>{' '}
              We've Got Answers!
            </>
          )}
        </h2>

        <div className="space-y-2">
          {data?.map((faq, index) => {
            const id = `${index}-${faq.question}`;
            return (
              <FAQItem
                key={id}
                id={id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === id}
                onToggle={handleToggle}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
