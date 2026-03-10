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
import { WishlistProvider } from '@/context/WishlistContext';

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
          <WishlistProvider>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={null}>
              <ProgressBar />
            </Suspense>
            <Navbar />
            <ScrollToTop />
            <main className="flex-1">{children}</main>
            <Toaster position="top-right" />
            <Footer />
          </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
