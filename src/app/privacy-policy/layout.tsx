import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upleex Privacy and Policy: Data Security & Your Rights',
  description:
    'Privacy and policy legal document for Upleex. See how we collect personal data, use your information, and protect it under our privacy policy statement.',
  keywords: ['privacy and policy', 'upleex privacy policy', 'data security'],
  openGraph: {
    title: 'Upleex Privacy and Policy: Data Security & Your Rights',
    description:
      'Privacy and policy legal document for Upleex. See how we collect personal data, use your information, and protect it under our privacy policy statement.',
    url: 'https://www.upleex.com/privacy-policy',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
