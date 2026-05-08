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
import { Providers } from '@/redux/Providers';
import { ReviewReminderPopup } from '@/components/features/ReviewReminderPopup';
import FCMHandler from '@/components/layout/FCMHandler';
import SocketHandler from '@/components/layout/SocketHandler';

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
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var ua = navigator.userAgent || '';
            var isInstagram = ua.indexOf('Instagram') > -1;
            var isIOS = /iPhone|iPad|iPod/.test(ua);
            if (isInstagram && isIOS) {
              var url = window.location.href;
              var div = document.createElement('div');
              div.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#fff;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;padding:24px;text-align:center;';
              div.innerHTML =
                '<img src="/image/upleex-logo-dark.jpg" style="width:160px;margin-bottom:24px;"/>' +
                '<p style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:8px;">Open in Safari</p>' +
                '<p style="font-size:14px;color:#64748b;margin-bottom:32px;">Instagram browser does not support this site.<br/>Please open in Safari for the best experience.</p>' +
                '<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="background:linear-gradient(to right,#6366f1,#0ea5e9);color:#fff;padding:14px 32px;border-radius:50px;font-size:16px;font-weight:700;text-decoration:none;margin-bottom:16px;display:block;">Open in Safari</a>' +
                '<p style="font-size:12px;color:#94a3b8;">Tap the button above or use the browser menu \u22ee to open in Safari</p>';
              document.body.appendChild(div);
            }
          })();
        `}} />
        <Providers>
          {/* <NotificationProvider> */}
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={null}>
              <ProgressBar />
            </Suspense>
            <FCMHandler />
             <SocketHandler />
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
          
          {/* </NotificationProvider> */}
        </Providers>
      </body>
    </html>
  );
}
