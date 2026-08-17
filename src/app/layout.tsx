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

const SITE_NAME = 'SEU Development';
const SITE_TITLE = 'SEU Development | Premium Real Estate in Georgia';
const SITE_DESCRIPTION =
  'SEU Development - Building dreams into reality since 2016. Premium residential and commercial properties in prime locations across Georgia.';

// Absolute base for og:image and friends — crawlers reject relative URLs.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seudevelopment.grena.ge';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // Tab icon, iOS home-screen tile and the link-preview card all come from the
  // `icon` / `apple-icon` / `opengraph-image` / `twitter-image` files sitting
  // next to this layout — Next emits the tags and hashed URLs for them.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    alternateLocale: ['ka_GE'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
