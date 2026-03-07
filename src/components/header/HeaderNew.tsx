'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

export default function HeaderNew() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('header');

  const leftLinks = [
    { label: t('searchApartment'), href: '/search' as const },
    { label: t('visualSearch'), href: '/visual-search' as const },
    { label: t('seuCard'), href: '/card' as const },
  ];

  const rightLinks = [
    { label: t('news'), href: '/news' as const },
    { label: t('about'), href: '/about' as const },
  ];

  function switchLocale(newLocale: 'en' | 'ka') {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <header className="w-full grid grid-cols-[1fr_auto_1fr] items-center px-20 py-4 h-40 bg-dark-green">
      {/* Left Links */}
      <nav className="flex items-center justify-between">
        {leftLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-montserrat font-medium text-seu-body leading-5.5 tracking-[0.056rem] text-pale-gray hover:text-white transition-colors ${pathname === link.href ? 'underline underline-offset-4' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Center Logo */}
      <Link
        href="/"
        className="group flex flex-col items-center justify-self-center px-48 overflow-visible"
      >
        <div className="relative w-[53px] h-[47px] group-hover:h-[58px] transition-all duration-500 ease-in-out">
          <Image
            src="/common/svgs/Group 169.svg"
            alt="SEU Development Logo"
            width={53}
            height={47}
            className="object-contain absolute top-0 left-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          <Image
            src="/common/svgs/Group 169-streched.svg"
            alt="SEU Development Logo"
            width={53}
            height={58}
            className="object-contain absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
          />
        </div>
        <p className="font-montserrat font-normal text-seu-caption tracking-[0.169rem] text-pale-gray mt-1 group-hover:mt-3 transition-all duration-500 ease-in-out">
          S E U
        </p>
        <p className="font-montserrat font-normal text-seu-caption-sm tracking-wide text-pale-gray">
          Development
        </p>
      </Link>

      {/* Right Links + Contact + Language */}
      <div className="flex items-center justify-between">
        {rightLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-montserrat font-medium text-seu-body leading-5.5 tracking-[0.056rem] text-pale-gray hover:text-white transition-colors ${pathname === link.href ? 'underline underline-offset-4' : ''}`}
          >
            {link.label}
          </Link>
        ))}

        <Link
          href="/contact"
          className="font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] text-pale-gray/60 bg-pale-gray/[0.18] border border-secondary-grey/60 rounded-[0.625rem] w-[8.875rem] h-[2.4375rem] flex items-center justify-center hover:text-pale-gray/80 hover:bg-pale-gray/25 transition-colors"
        >
          {t('contactUs')}
        </Link>

        {/* Language Switcher */}
        <div className="flex items-center gap-0.5 h-10 border border-secondary-grey bg-pale-gray/10 rounded-[10px] px-[0.175rem]">
          <button
            onClick={() => switchLocale('en')}
            className={`flex-1 h-8 w-16 font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] rounded-[8px] transition-colors ${
              locale === 'en'
                ? 'text-pale-gray bg-pale-gray/30 border border-secondary-grey'
                : 'text-pale-gray/50 hover:bg-pale-gray/15'
            }`}
          >
            {t('en')}
          </button>
          <button
            onClick={() => switchLocale('ka')}
            className={`flex-1 h-8 w-16 font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] rounded-[8px] transition-colors ${
              locale === 'ka'
                ? 'text-pale-gray bg-pale-gray/30 border border-secondary-grey'
                : 'text-pale-gray/50 hover:bg-pale-gray/15'
            }`}
          >
            {t('ge')}
          </button>
        </div>
      </div>
    </header>
  );
}
