import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Information About Company—Upleex Online Rental Platform',
  description:
    'Know more about company Upleex, its rental marketplace, online platform, services, and how it helps users find and rent products for different needs.',
  keywords: ['about company', 'upleex online rental platform', 'rental marketplace services'],
  openGraph: {
    title: 'Information About Company—Upleex Online Rental Platform',
    description:
      'Know more about company Upleex, its rental marketplace, online platform, services, and how it helps users find and rent products for different needs.',
    url: 'https://www.upleex.com/about-us',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
