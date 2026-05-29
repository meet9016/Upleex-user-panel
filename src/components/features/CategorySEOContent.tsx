import React from 'react';

export interface CategorySeoBullet {
  label: string;
  text: string;
  plain?: boolean;
}

export interface CategorySeoSection {
  heading: string;
  heading_level: 'h2' | 'h3';
  bullets: CategorySeoBullet[];
}

export interface CategorySeoContentData {
  hero_title?: string;
  hero_text?: string;
  intro_heading?: string;
  intro_paragraphs?: string[];
  intro_text?: string;
  sections?: CategorySeoSection[];
  main_text?: string;
  sub_text?: string;
}

interface CategorySEOContentProps {
  content?: CategorySeoContentData | null;
}

function getIntroParagraphs(content: CategorySeoContentData): string[] {
  if (Array.isArray(content.intro_paragraphs) && content.intro_paragraphs.length > 0) {
    return content.intro_paragraphs.filter((p) => p?.trim());
  }
  if (content.intro_text?.trim()) {
    return [content.intro_text.trim()];
  }
  return [];
}

function normalizeSections(content: CategorySeoContentData): CategorySeoSection[] {
  if (!Array.isArray(content.sections)) return [];

  return content.sections
    .map((section: any) => {
      const heading = section.heading || section.h2 || '';
      const heading_level: 'h2' | 'h3' = section.heading_level === 'h3' ? 'h3' : 'h2';
      let bullets: CategorySeoBullet[] = [];

      if (Array.isArray(section.bullets)) {
        bullets = section.bullets
          .map((b: any) => {
            const label = b.label || '';
            const text = b.text || '';
            const plain = Boolean(b.plain) || (!String(label).trim() && Boolean(String(text).trim()));
            return { label, text, plain };
          })
          .filter((b: CategorySeoBullet) => b.label?.trim() || b.text?.trim());
      }

      return { heading, heading_level, bullets };
    })
    .filter(
      (section) =>
        section.heading?.trim() || section.bullets.length > 0
    );
}

function BulletList({ bullets }: { bullets: CategorySeoBullet[] }) {
  if (!bullets.length) return null;

  return (
    <ul className="space-y-3">
      {bullets.map((bullet, index) => (
        <li key={index} className="flex gap-3 text-slate-600 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5 shrink-0" />
          <span>
            {bullet.plain || !bullet.label?.trim() ? (
              bullet.text?.trim()
            ) : (
              <>
                <strong className="text-slate-900 font-semibold">
                  {bullet.label.trim()}
                  {bullet.text?.trim() ? ': ' : ''}
                </strong>
                {bullet.text?.trim()}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export const CategorySEOContent = ({ content }: CategorySEOContentProps) => {
  if (!content) return null;

  const introParagraphs = getIntroParagraphs(content);
  const sections = normalizeSections(content);

  const hasHero =
    content.hero_title?.trim() ||
    content.hero_text?.trim() ||
    content.intro_heading?.trim() ||
    introParagraphs.length > 0;

  const hasFooter = content.main_text?.trim() || content.sub_text?.trim();

  if (!hasHero && sections.length === 0 && !hasFooter) {
    return null;
  }

  return (
    <div className="w-full mt-10">
      <div className="w-full space-y-8">
        {hasHero && (
          <section className="space-y-4">
            {content.hero_title?.trim() && (
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {content.hero_title}
              </h1>
            )}
            {content.hero_text?.trim() && (
              <p className="text-slate-600 leading-relaxed">{content.hero_text}</p>
            )}
            {content.intro_heading?.trim() && (
              <h3 className="text-xl font-bold text-slate-900 pt-2">
                {content.intro_heading}
              </h3>
            )}
            {introParagraphs.map((paragraph, index) => (
              <p key={index} className="text-slate-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        )}

        {sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="space-y-4">
            {section.heading?.trim() &&
              (section.heading_level === 'h3' ? (
                <h3 className="text-xl font-bold text-slate-900">
                  {section.heading}
                </h3>
              ) : (
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  {section.heading}
                </h2>
              ))}
            <BulletList bullets={section.bullets} />
          </section>
        ))}

        {hasFooter && (
          <section className="pt-4 border-t border-gray-100 space-y-2">
            {content.main_text?.trim() && (
              <h3 className="text-lg font-bold text-gradient-primary">
                {content.main_text}
              </h3>
            )}
            {content.sub_text?.trim() && (
              <p className="text-slate-600 leading-relaxed">{content.sub_text}</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
