'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { SeuLogoLink } from '@/components/header/SeuLogoLink';
import { LanguageSwitcher } from '@/components/header/LanguageSwitcher';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';

interface MobileMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: Array<{ label: string; href: string }>;
  contactLabel: string;
}

export function MobileMenuSheet({
  open,
  onOpenChange,
  links,
  contactLabel,
}: MobileMenuSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="lg:hidden">
        <button
          type="button"
          className="flex items-center justify-center p-2"
          aria-label="Open menu"
        >
          <Image
            src="/common/svgs/menu-hamburger_broken.svg"
            alt="Menu"
            width={24}
            height={18}
          />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        aria-describedby={undefined}
        className="w-full bg-site-bg border-none flex flex-col justify-between p-0 overflow-hidden"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>

        {/* Decorative accent line */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-primary-green via-primary-green/40 to-transparent" />

        {/* Close button — top right */}
        <SheetClose className="absolute top-6 right-6 size-10 rounded-full border border-site-border-soft flex items-center justify-center text-site-fg-dim hover:text-primary-green hover:border-primary-green/50 transition-colors">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </SheetClose>

        {/* Top section: Logo + Nav */}
        <div className="flex flex-col pt-8 px-8">
          {/* Logo area */}
          <div className="flex items-center gap-3 mb-12">
            <Image
              src="/common/svgs/header-logo-mobile.svg"
              alt="SEU Development"
              width={40}
              height={36}
            />
            <div className="flex flex-col">
              <p className="font-[--font-bodoni] font-normal text-seu-body leading-5 tracking-[0.169rem] text-site-fg">
                SEU
              </p>
              <p className="font-montserrat font-normal text-seu-caption-sm leading-[0.875rem] text-site-fg-muted">
                Development
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-0">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onOpenChange(false)}
                className="group flex items-center justify-between py-4 border-b border-site-border-soft last:border-b-0"
              >
                <span className="font-[--font-bodoni] text-seu-subheading text-site-fg uppercase tracking-[0.15rem] group-hover:text-primary-green transition-colors">
                  {link.label}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className="text-site-fg-muted group-hover:text-primary-green group-hover:translate-x-1 transition-all"
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="px-8 pb-10 flex flex-col gap-6">
          {/* Divider */}
          <div className="h-px bg-site-border-soft" />

          {/* Contact info */}
          <div className="flex flex-col gap-2">
            <p className="font-montserrat font-medium text-seu-caption text-site-fg-muted tracking-wide uppercase">
              {contactLabel}
            </p>
            <a
              href="tel:+995555000000"
              className="font-montserrat text-seu-body-sm text-site-fg hover:text-primary-green transition-colors"
            >
              +995 555 000 000
            </a>
          </div>

          {/* Lang switcher + logo */}
          <div className="flex items-end justify-between pt-2">
            <LanguageSwitcher />
            <SeuLogoLink />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
