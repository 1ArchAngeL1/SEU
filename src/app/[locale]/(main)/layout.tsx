import SeuHeader from '@/components/header/SeuHeader';
import FooterUpperWrapper from '@/components/FooterUpperWrapper';
import FooterLower from '@/components/FooterLower';
import { LocaleTransitionProvider } from '@/components/header/LocaleTransitionContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleTransitionProvider>
      <SeuHeader />
      {children}
      <FooterUpperWrapper />
      <FooterLower />
    </LocaleTransitionProvider>
  );
}
