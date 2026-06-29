import SeuHeader from '@/components/header/SeuHeader';
import FooterUpperWrapper from '@/components/FooterUpperWrapper';
import FooterLower from '@/components/FooterLower';
import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <SeuHeader />
      <div className="flex-1 flex flex-col">{children}</div>
      <FooterUpperWrapper />
      <FooterLower />
    </div>
  );
}
