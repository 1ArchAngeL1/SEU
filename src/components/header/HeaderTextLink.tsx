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

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        `font-montserrat font-medium text-seu-caption lg:text-seu-body leading-5.5 tracking-[0.056rem] transition-colors px-4 ${colors} ${pathName === href ? 'underline underline-offset-8 decoration-primary-orange' : ''}`,
        className
      )}
    >
      {children}
    </Link>
  );
};
