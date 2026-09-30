import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rental Categories: Explore Rental Types on Upleex',
  description:
    'Explore Upleex rental categories with family homes, apartments, cars and rental properties. Find different types of rentals suited to your needs.',
  keywords: ['rental categories', 'explore rental types', 'upleex rental categories'],
  openGraph: {
    title: 'Rental Categories: Explore Rental Types on Upleex',
    description:
      'Explore Upleex rental categories with family homes, apartments, cars and rental properties. Find different types of rentals suited to your needs.',
    url: 'https://www.upleex.com/categories',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
