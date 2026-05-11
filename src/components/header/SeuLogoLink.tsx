'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const SeuLogoLink = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLight = mounted && theme === 'light';

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
          className={`object-contain absolute top-0 left-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0 ${isLight ? 'invert' : ''}`}
        />
        <Image
          src="/common/svgs/Group 169-streched.svg"
          alt="SEU Development Logo"
          width={53}
          height={58}
          className={`object-contain absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 ${isLight ? 'invert' : ''}`}
        />
      </div>
      <p
        className="font-montserrat font-normal text-seu-caption tracking-[0.169rem] text-site-fg mt-1 group-hover:mt-3 transition-all duration-500 ease-in-out"
      >
        S E U
      </p>
      <p
        className="font-montserrat font-normal text-seu-caption-sm tracking-wide text-site-fg"
      >
        Development
      </p>
    </Link>
  );
};
