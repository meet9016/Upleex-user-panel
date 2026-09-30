import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Membership Plans | Find the Best Membership Plan',
  description:
    'A membership plan with subscription flexibility. Upleex membership plans give premium access, rental benefits and simple options for many months of use.',
  keywords: ['membership plan', 'upleex membership', 'subscription flexibility'],
  openGraph: {
    title: 'Membership Plans | Find the Best Membership Plan',
    description:
      'A membership plan with subscription flexibility. Upleex membership plans give premium access, rental benefits and simple options for many months of use.',
    url: 'https://www.upleex.com/membership',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
