import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Rental Partner on Upleex: Rent Out Any Product',
  description:
    'Become a rental partner with Upleex. Join our network, sign up, list your cars, gadgets or furniture for rent and earn from your rental business today.',
  keywords: ['become a rental partner', 'rent out any product', 'upleex partner'],
  openGraph: {
    title: 'Become a Rental Partner on Upleex: Rent Out Any Product',
    description:
      'Become a rental partner with Upleex. Join our network, sign up, list your cars, gadgets or furniture for rent and earn from your rental business today.',
    url: 'https://www.upleex.com/partner',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
