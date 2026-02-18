import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import ProgressBar from '@/components/ui/ProgressBar';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Upleex - Rental Marketplace',
  description: 'Rent premium lifestyle products with ease.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <CartProvider>
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          <Navbar />
          <ScrollToTop />
          {children}
          <Toaster position="top-right" />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
