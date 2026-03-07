'use client';

import { usePathname } from '@/i18n/navigation';
import FooterUpper from './FooterUpper';

const variantOverrides: Record<string, 'light' | 'dark'> = {
  '/card': 'light',
};

export default function FooterUpperWrapper() {
  const pathname = usePathname();
  return <FooterUpper variant={variantOverrides[pathname] ?? 'dark'} />;
}
