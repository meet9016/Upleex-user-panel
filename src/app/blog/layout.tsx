import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upleex Rental Blogs - Rental Tips, Guides, Ideas & More',
  description:
    'Get useful rental tips and insights through rental blogs covering property, short-term rentals, rental management, and key industry topics for 2026.',
  keywords: ['rental blogs', 'rental tips', 'guides', 'upleex blogs'],
  openGraph: {
    title: 'Upleex Rental Blogs - Rental Tips, Guides, Ideas & More',
    description:
      'Get useful rental tips and insights through rental blogs covering property, short-term rentals, rental management, and key industry topics for 2026.',
    url: 'https://www.upleex.com/blog',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
