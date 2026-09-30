import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Send Us Your Questions & Enquiries',
  description:
    'Contact us for help, support, customer questions, and information. Get in touch with our team if you need assistance with your request or service.',
  keywords: ['contact us', 'customer support', 'send enquiries'],
  openGraph: {
    title: 'Contact Us | Send Us Your Questions & Enquiries',
    description:
      'Contact us for help, support, customer questions, and information. Get in touch with our team if you need assistance with your request or service.',
    url: 'https://www.upleex.com/contact-us',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
