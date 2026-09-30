import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions for Upleex Rental Services',
  description:
    'Rental agreement terms and conditions guide covering rent, security deposit, lease period, tenancy rules, and rent agreement details for tenants.',
  keywords: ['terms and conditions', 'upleex rental agreement terms', 'tenancy rules'],
  openGraph: {
    title: 'Terms and Conditions for Upleex Rental Services',
    description:
      'Rental agreement terms and conditions guide covering rent, security deposit, lease period, tenancy rules, and rent agreement details for tenants.',
    url: 'https://www.upleex.com/terms-of-use',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
