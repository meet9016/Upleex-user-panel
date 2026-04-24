import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { QuickActions } from '@/components/ui/QuickActions';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import ProgressBar from '@/components/ui/ProgressBar';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ReviewReminderPopup } from '@/components/features/ReviewReminderPopup';
import FCMHandler from '@/components/layout/FCMHandler';

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
          <NotificationProvider>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={null}>
              <ProgressBar />
            </Suspense>
            <FCMHandler />
            <Suspense fallback={<div className="h-20 bg-white border-b border-gray-100" />}>
              <Navbar />
            </Suspense>
            <ScrollToTop />
            <QuickActions />
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <Toaster position="bottom-right" />
            <ReviewReminderPopup />
            <Footer />
            <BottomNav />
          </div>
          </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
