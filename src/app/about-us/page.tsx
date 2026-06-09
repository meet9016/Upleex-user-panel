'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export default function AboutUsPage() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get(endPointApi.getDynamicPageBySlug.replace(':slug', 'about-us'));
        if (res.data?.data?.content) {
          try {
            setContent(JSON.parse(res.data.data.content));
          } catch(e) {
            console.error("Failed to parse about us JSON", e);
            // Fallback for raw HTML if needed, but not handled fully to enforce JSON structure
          }
        }
      } catch (error) {
        console.error('Failed to load about us content', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const gradients = [
    "from-upleex-purple to-upleex-blue",
    "from-upleex-blue to-upleex-purple",
    "from-upleex-dark to-upleex-blue",
  ];

  return (
    <div className="min-h-screen bg-upleex-dark/5 py-10 md:py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10 md:space-y-12">
        <section className="bg-white rounded-3xl shadow-md px-6 md:px-10 py-6 md:py-8">
          <div className="border-b border-upleex-dark pb-3 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
              {content?.about?.heading || 'About Upleex'}
            </h1>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
            </div>
          ) : content?.about ? (
            <div className="space-y-3 text-sm md:text-base leading-relaxed text-slate-700">
              {(content.about.paragraphs || (Array.isArray(content.about) ? content.about : [])).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
             <div className="text-sm md:text-base text-slate-500 italic">
               About us content is currently being updated.
             </div>
          )}
        </section>

        {(!isLoading && content?.offer) && (
          <section className="bg-white rounded-3xl shadow-md px-6 md:px-10 py-6 md:py-8">
            <div className="border-b border-upleex-dark pb-3 mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient-primary">
                {content.offer.heading || 'What Do We Offer'}
              </h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-slate-700 leading-relaxed">
              {content.offer.intro && <p>{content.offer.intro}</p>}
              
              {content.offer.items && content.offer.items.length > 0 && (
                <ul className="list-disc list-inside space-y-2">
                  {content.offer.items.map((item: any, i: number) => (
                    <li key={i}>
                      {item.title && <span className="font-semibold text-upleex-purple">{item.title}</span>} {item.description}
                    </li>
                  ))}
                </ul>
              )}
              
              {content.offer.outro && (
                <p className="font-semibold text-sm md:text-base text-upleex-purple mt-4">
                  {content.offer.outro}
                </p>
              )}
            </div>
          </section>
        )}

        {(!isLoading && content?.team && (content.team.members || (Array.isArray(content.team) && content.team.length > 0))) && (
          <section className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-center text-2xl md:text-3xl font-bold text-gradient-primary mb-2">
                {content.team.heading || 'Meet Our Team'}
              </h2>
              <div className="h-px bg-upleex-dark/30 max-w-sm mx-auto" />
            </div>

            <div className="space-y-5 md:space-y-6">
              {(content.team.members || (Array.isArray(content.team) ? content.team : [])).map((member: any, i: number) => {
                const gradient = gradients[i % gradients.length];
                const isEven = i % 2 !== 0; // for alternating layout
                return (
                  <div key={i} className="bg-white rounded-3xl shadow-md px-6 md:px-8 py-5 md:py-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                    <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-lg md:text-xl shrink-0 ${isEven ? 'md:order-2 order-1' : ''}`}>
                      {member.initials}
                    </div>
                    <div className={`space-y-2 flex-1 ${isEven ? 'md:order-1 order-2' : ''}`}>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900">{member.name}</h3>
                        <p className="text-sm text-slate-600">{member.role}</p>
                      </div>
                      {member.points && member.points.length > 0 && (
                        <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-1">
                          {member.points.map((point: string, j: number) => (
                            <li key={j}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
