import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import type { HeaderVariant } from './SeuHeader';

type HeaderTextLinkProps = {
  pathName: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
  variant?: HeaderVariant;
};

export const HeaderTextLink = ({
  className,
  href,
  pathName,
  children,
  variant = 'dark',
}: HeaderTextLinkProps) => {
  const colors =
    variant === 'light'
      ? 'text-black hover:text-black/70'
      : 'text-pale-gray hover:text-white';

  const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        'group relative font-montserrat font-medium text-seu-caption lg:text-seu-body leading-5.5 tracking-[0.056rem] transition-colors duration-300 px-4',
        colors,
        className
      )}
    >
      {children}
      {/* Animated underline */}
      <span
        className={cn(
          'absolute left-4 right-4 -bottom-1.5 h-[2px] bg-primary-orange transition-transform duration-300 ease-out origin-left',
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        )}
      />
    </Link>
  );
};
