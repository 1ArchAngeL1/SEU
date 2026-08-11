'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export default function FooterUpper() {
  const t = useTranslations('footer');
  const pathname = usePathname();

  const links = [
    { label: t('projects'), href: '#' },
    { label: t('seuCard'), href: '/card' },
    // Longest label by far — stacked last on mobile so it doesn't split the list.
    { label: t('privacyPolicy'), href: '/policy', mobileLast: true },
    { label: t('news'), href: '/news' },
    { label: t('about'), href: '/about' },
  ];

  return (
    <nav className="relative w-full py-10 lg:py-0 lg:h-30 bg-site-footer-bg lg:bg-site-bg lg:border-b lg:border-site-border flex items-center">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 site-divider" />
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0 justify-evenly w-full">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={(e) => {
              // Already on this page → scroll to top instead of a no-op navigation.
              if (link.href !== '#' && pathname === link.href) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={cn(
              'font-montserrat font-medium text-seu-body-sm lg:text-seu-body leading-[1.375rem] tracking-[0.1rem] lg:tracking-[0.169rem] text-site-fg hover:text-site-fg-muted transition-colors',
              link.mobileLast && 'order-last lg:order-none'
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
