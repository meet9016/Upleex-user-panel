'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { faqService, type FAQ } from '@/services/faqService';
import Link from 'next/link';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
      // Auto-expand search results
      setOpenItems(new Set(filtered.map(faq => faq.id)));
    } else {
      setFilteredFaqs(faqs);
      setOpenItems(new Set());
    }
  }, [searchTerm, faqs]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await faqService.getFAQList();
      setFaqs(data);
      setFilteredFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="animate-pulse space-y-8">
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded-lg mb-4 mx-auto w-64"></div>
              <div className="h-6 bg-gray-200 rounded mb-8 mx-auto w-96"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[1400px] bg-slate-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-slate-100 to-slate-50 pointer-events-none" />
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-upleex-blue/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-[300px] -left-[200px] w-[500px] h-[500px] rounded-full bg-upleex-purple/5 blur-[80px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-upleex-purple/10 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-upleex-purple" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find clear answers about renting, listing, booking, and support on Upleex.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-upleex-purple/10 focus:border-upleex-purple transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* FAQ List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No FAQs Found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm ? `No results found for "${searchTerm}"` : 'No FAQs available at the moment.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-upleex-purple hover:text-upleex-blue font-medium transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openItems.has(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-8 h-8 bg-upleex-purple/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                        <span className="text-upleex-purple font-semibold text-sm">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 leading-relaxed pr-4">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="shrink-0 ml-4">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <div className="ml-12 pt-2 border-t border-slate-100">
                        <div className="pt-4">
                          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
             Could you not find the answer you need? Our team is ready to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Us */}
            <Link
              href="/contact-us"
              className="group bg-slate-50 hover:bg-upleex-purple/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-upleex-purple/20"
            >
              <div className="w-12 h-12 bg-upleex-purple/10 group-hover:bg-upleex-purple rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
                <MessageCircle className="w-6 h-6 text-upleex-purple group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Contact Us</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
               Send us a message and we will reply soon.
              </p>
            </Link>

            {/* Call Us */}
            <a
              href="tel:+91 73591 55961"
              className="group bg-slate-50 hover:bg-upleex-blue/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-upleex-blue/20"
            >
              <div className="w-12 h-12 bg-upleex-blue/10 group-hover:bg-upleex-blue rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
                <Phone className="w-6 h-6 text-upleex-blue group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Call Us</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Mon-Fri from 9am to 6pm IST. +91 73591 55961
              </p>
            </a>

            {/* Email Us */}
            <a
              href="mailto:support@upleex.com"
              className="group bg-slate-50 hover:bg-slate-900/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-slate-900/20"
            >
              <div className="w-12 h-12 bg-slate-900/10 group-hover:bg-slate-900 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
                <Mail className="w-6 h-6 text-slate-900 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Drop us an email at support@upleex.com
              </p>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}