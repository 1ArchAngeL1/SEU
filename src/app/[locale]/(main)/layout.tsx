import HeaderNew from '@/components/header/HeaderNew';
import FooterUpperWrapper from '@/components/FooterUpperWrapper';
import FooterLower from '@/components/FooterLower';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderNew />
      {children}
      <FooterUpperWrapper />
      <FooterLower />
    </>
  );
}
