import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

type HeaderTextLinkProps = {
  pathName: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
};

export const HeaderTextLink = ({
  className,
  href,
  pathName,
  children,
}: HeaderTextLinkProps) => {
  const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        'group relative font-montserrat font-medium text-seu-caption lg:text-seu-body leading-5.5 tracking-[0.056rem] transition-colors duration-300 px-4',
        'text-site-fg hover:text-site-fg-strong',
        className
      )}
    >
      {children}
      {/* Animated underline */}
      <span
        className={cn(
          'absolute left-4 right-4 -bottom-1.5 h-[2px] bg-primary-green transition-transform duration-300 ease-out origin-left',
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        )}
      />
    </Link>
  );
};
