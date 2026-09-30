import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions About Upleex',
  description:
    'Get answers to frequently asked questions about Upleex, including common FAQs about rentals, accounts, listings, payments, and services.',
  keywords: ['frequently asked questions', 'upleex faqs', 'rental queries'],
  openGraph: {
    title: 'Frequently Asked Questions About Upleex',
    description:
      'Get answers to frequently asked questions about Upleex, including common FAQs about rentals, accounts, listings, payments, and services.',
    url: 'https://www.upleex.com/faq',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
