'use client';

import Image from 'next/image';
import { usePathname } from '@/i18n/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const SeuLogo = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLight = mounted && theme === 'light';
  const isLanding = pathname === '/';

  return (
    <div className="relative w-32 h-32 mr-20 group group-hover:h-14.5 transition-all duration-500 ease-in-out cursor-pointer">
      <Image
        src="/common/svgs/Group 169.svg"
        alt="SEU Development Logo"
        fill
        className={`object-contain absolute top-0 left-0 transition-all duration-500 ease-in-out group-hover:opacity-0 ${isLight ? 'invert' : ''}`}
      />
      <Image
        src="/common/svgs/Group 169-streched.svg"
        alt="SEU Development Logo"
        fill
        className={`object-contain absolute top-0 left-0 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 ${isLight ? 'invert' : ''}`}
      />
    </div>
  );
};
