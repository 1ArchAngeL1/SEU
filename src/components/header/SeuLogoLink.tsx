'use client';

import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const SeuLogoLink = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLight = mounted && theme === 'light';
  const isLanding = pathname === '/';

  const orangeFilter =
    'brightness-0 saturate-100 invert-48 sepia-79 saturate-2476 hue-rotate-343 brightness-104 contrast-97';

  return (
    <Link
      href="/"
      className="group flex flex-col items-center justify-self-center px-2 lg:px-16 overflow-visible"
    >
      <div className="relative w-13.25 h-11.75 group-hover:h-14.5 transition-all duration-500 ease-in-out">
        <Image
          src="/common/svgs/Group 169.svg"
          alt="SEU Development Logo"
          width={53}
          height={47}
          className={`object-contain absolute top-0 left-0 transition-all duration-500 ease-in-out group-hover:opacity-0 ${isLight ? 'invert' : ''}`}
          style={isLanding ? { filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(343deg) brightness(104%) contrast(97%)' } : undefined}
        />
        <Image
          src="/common/svgs/Group 169-streched.svg"
          alt="SEU Development Logo"
          width={53}
          height={58}
          className={`object-contain absolute top-0 left-0 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 ${isLight ? 'invert' : ''}`}
          style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(343deg) brightness(104%) contrast(97%)' }}
        />
      </div>
      <p
        className={`font-montserrat font-normal text-seu-caption tracking-[0.169rem] mt-1 group-hover:mt-3 transition-all duration-500 ease-in-out group-hover:text-primary-orange ${isLanding ? 'text-primary-orange' : 'text-site-fg'}`}
      >
        S E U
      </p>
      <p
        className={`font-montserrat font-normal text-seu-caption-sm tracking-wide transition-colors duration-500 group-hover:text-primary-orange ${isLanding ? 'text-primary-orange' : 'text-site-fg'}`}
      >
        Development
      </p>
    </Link>
  );
};
