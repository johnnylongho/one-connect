import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter, Be_Vietnam_Pro } from 'next/font/google';
import { ClientAppShell } from '@/components/layout/ClientAppShell';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0066FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://oneconnect.id.vn'),
  title: 'One Connect - Nền Tảng Định Danh Số Doanh Nhân & Thẻ Thông Minh NFC',
  description:
    'One Connect - Nền tảng định danh số doanh nhân, thẻ thông minh NFC và trạm check-in MICE hội nghị. Kết nối giao thương B2B, chia sẻ danh thiếp không chạm và mở rộng quan hệ đối tác.',
  alternates: {
    canonical: 'https://oneconnect.id.vn',
  },
  manifest: '/manifest.json',
  other: {
    'zalo-platform-site-verification': 'QFsG8gZ97ozZr9CBk-S0DKcNXm-buLrPCpKm',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://oneconnect.id.vn',
    siteName: 'One Connect',
    title: 'One Connect - Nền Tảng Định Danh Số Doanh Nhân & Thẻ Thông Minh NFC',
    description:
      'Kết nối doanh nhân. Mở lối hợp tác. Định danh số thông minh NFC, check-in hội nghị MICE siêu tốc và mở rộng quan hệ đối tác B2B an toàn.',
    images: [
      {
        url: '/og-image.jpg',
        secureUrl: 'https://oneconnect.id.vn/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'One Connect - Nền Tảng Định Danh Số Doanh Nhân & Thẻ Thông Minh NFC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@oneconnect',
    creator: '@oneconnect',
    title: 'One Connect - Nền Tảng Định Danh Số Doanh Nhân & Thẻ Thông Minh NFC',
    description:
      'Kết nối doanh nhân. Mở lối hợp tác. Định danh số thông minh NFC, check-in hội nghị MICE siêu tốc và mở rộng quan hệ đối tác B2B an toàn.',
    images: ['https://oneconnect.id.vn/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${beVietnamPro.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="bg-[#F8FAFC] antialiased selection:bg-blue-600 selection:text-white">
        <ClientAppShell>{children}</ClientAppShell>
      </body>
    </html>
  );
}
