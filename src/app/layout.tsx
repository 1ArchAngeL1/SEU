import type { Metadata } from 'next';
import { Geist, Geist_Mono, Montserrat, Noto_Sans_Georgian } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';
import React from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

const notoSansGeorgian = Noto_Sans_Georgian({
  variable: '--font-noto-georgian',
  subsets: ['georgian'],
});

export const metadata: Metadata = {
  title: 'SEU Development | Premium Real Estate in Georgia',
  description:
    'SEU Development - Building dreams into reality since 2016. Premium residential and commercial properties in prime locations across Georgia.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} data-locale={locale} suppressHydrationWarning={true} data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${notoSansGeorgian.variable} antialiased min-h-dvh bg-site-bg transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
