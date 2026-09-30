import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy and Cancellation Terms | Upleex Rental',
  description:
    'Upleex refund policy explained. Learn how to request a refund, when a return qualifies, and how many days refunds take to reach your bank account.',
  keywords: ['refund policy', 'cancellation terms', 'upleex refund policy'],
  openGraph: {
    title: 'Refund Policy and Cancellation Terms | Upleex Rental',
    description:
      'Upleex refund policy explained. Learn how to request a refund, when a return qualifies, and how many days refunds take to reach your bank account.',
    url: 'https://www.upleex.com/refund-policy',
    siteName: 'Upleex',
    type: 'website',
  },
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
