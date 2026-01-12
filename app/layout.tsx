import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Script from 'next/script';
import HeaderWrapper from '@/components/HeaderWrapper';
import FooterWrapper from '@/components/FooterWrapper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    default: '3A Softwares - Your One-Stop E-Commerce Destination',
    template: '%s | 3A Softwares',
  },
  description:
    'Shop quality products at competitive prices. Browse electronics, clothing, home goods, and more with fast shipping and easy returns.',
  keywords: [
    '3asoftwares',
    'online shopping',
    'products',
    'deals',
    'electronics',
    'fashion',
    'home goods',
  ],
  authors: [{ name: '3A Softwares Team' }],
  creator: '3A Softwares',
  publisher: '3A Softwares',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://e-storefront-web.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://e-storefront-web.vercel.app',
    title: '3A Softwares - Your One-Stop E-Commerce Destination',
    description: 'Shop quality products at competitive prices with fast shipping and easy returns.',
    siteName: '3A Softwares',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3A Softwares - Your One-Stop E-Commerce Destination',
    description: 'Shop quality products at competitive prices with fast shipping and easy returns.',
    creator: '@shophub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="bg-white dark:bg-slate-950">
        <Providers>
          <HeaderWrapper />
          <main className="min-h-screen">{children}</main>
          <FooterWrapper />
        </Providers>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(() => {})
                  .catch(() => {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
