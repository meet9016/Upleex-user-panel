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

export interface CategorySeoFaq {
  question: string;
  answer: string;
}

export interface CategorySeoContentData {
  meta_title?: string;
  meta_description?: string;
  core_keyword?: string;
  secondary_keywords?: string;
  image_alt?: string;
  image_title?: string;
  anchor_tags?: string[];
  keyword_tags?: string[];
  faqs?: CategorySeoFaq[];
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
  categoryImage?: string;
}

function getIntroParagraphs(content: CategorySeoContentData): string[] {
  if (Array.isArray(content.intro_paragraphs) && content.intro_paragraphs.length > 0) {
    return content.intro_paragraphs.filter((p) => p?.trim());
  }
  if (content.intro_text?.trim()) {
    return [content.intro_text.trim()];
  }
  if (content.meta_description?.trim()) {
    return [content.meta_description.trim()];
  }
  return [];
}

function normalizeSections(content: CategorySeoContentData): CategorySeoSection[] {
  if (!Array.isArray(content.sections)) return [];

  return content.sections
    .map((section: CategorySeoSection & { h2?: string }) => {
      const heading = section.heading || section.h2 || '';
      const heading_level: 'h2' | 'h3' = section.heading_level === 'h3' ? 'h3' : 'h2';
      let bullets: CategorySeoBullet[] = [];

      if (Array.isArray(section.bullets)) {
        bullets = section.bullets
          .map((b: CategorySeoBullet) => {
            const label = b.label || '';
            const text = b.text || '';
            const plain = Boolean(b.plain) || (!String(label).trim() && Boolean(String(text).trim()));
            return { label, text, plain };
          })
          .filter((b: CategorySeoBullet) => b.label?.trim() || b.text?.trim());
      }

      return { heading, heading_level, bullets };
    })
    .filter((section) => section.heading?.trim() || section.bullets.length > 0);
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

function KeywordTags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-upleex-purple border border-purple-100"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export const CategorySEOContent = ({ content, categoryImage }: CategorySEOContentProps) => {
  if (!content) return null;

  const introParagraphs = getIntroParagraphs(content);
  const sections = normalizeSections(content);
  const faqs = (content.faqs || []).filter((f) => f.question?.trim());
  const keywordTags = content.keyword_tags || [];
  const anchorTags = content.anchor_tags || [];
  const allTags = [...new Set([...keywordTags, ...anchorTags])].slice(0, 15);

  const hasHero =
    content.hero_title?.trim() ||
    content.hero_text?.trim() ||
    content.intro_heading?.trim() ||
    introParagraphs.length > 0 ||
    content.core_keyword?.trim();

  const hasFooter = content.main_text?.trim() || content.sub_text?.trim();
  const imageAlt = content.image_alt?.trim() || content.hero_title?.trim() || 'Category rental';
  const imageTitle = content.image_title?.trim() || content.core_keyword?.trim() || '';

  if (!hasHero && sections.length === 0 && !hasFooter && !faqs.length && !categoryImage) {
    return null;
  }

  return (
    <article className="w-full mt-10" itemScope itemType="https://schema.org/Product">
      {content.meta_title?.trim() && (
        <meta itemProp="name" content={content.meta_title} />
      )}
      {content.meta_description?.trim() && (
        <meta itemProp="description" content={content.meta_description} />
      )}

      <div className="w-full space-y-8">
        {categoryImage && (
          <figure className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <img
              src={categoryImage}
              alt={imageAlt}
              title={imageTitle}
              className="w-full max-h-72 object-cover"
              loading="lazy"
            />
            {imageTitle && (
              <figcaption className="px-4 py-2 text-xs text-slate-500 bg-slate-50">
                {imageTitle}
              </figcaption>
            )}
          </figure>
        )}

        {hasHero && (
          <section className="space-y-4">
            {content.core_keyword?.trim() && (
              <p className="text-sm font-semibold text-upleex-purple uppercase tracking-wide">
                {content.core_keyword}
              </p>
            )}
            {content.hero_title?.trim() && (
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {content.hero_title}
              </h1>
            )}
            {content.hero_text?.trim() && (
              <p className="text-slate-600 leading-relaxed">{content.hero_text}</p>
            )}
            <KeywordTags tags={allTags} />
            {content.intro_heading?.trim() && (
              <h2 className="text-xl font-bold text-slate-900 pt-2">
                {content.intro_heading}
              </h2>
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

        {faqs.length > 0 && (
          <section className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-100 bg-white p-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3
                    className="text-base font-semibold text-slate-900"
                    itemProp="name"
                  >
                    {faq.question}
                  </h3>
                  {faq.answer?.trim() && (
                    <div
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed" itemProp="text">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

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
    </article>
  );
};
