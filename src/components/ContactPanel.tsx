'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export type ContactPanelProps = {
  className?: string;
  /** Use on pale-gray backgrounds so headings are dark */
  lightBg?: boolean;
  /** Hide the built-in heading (dash + title) */
  hideHeader?: boolean;
};

export default function ContactPanel({
  className,
  lightBg = false,
  hideHeader = false,
}: ContactPanelProps) {
  const t = useTranslations('contact');
  return (
    <div className={cn('w-full', className)}>
      {/* Heading */}
      {!hideHeader && (
        <div className="mb-10">
          <h2
            className={cn(
              'font-[--font-bodoni] font-normal text-seu-title lg:text-seu-title-lg leading-none animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.4s_both]',
              lightBg ? 'text-dark-green' : 'text-site-fg-strong'
            )}
          >
            {t('title')}
          </h2>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border border-site-border bg-site-bg-card site-card-glow animate-[fadeInUp_0.7s_cubic-bezier(0.16,1,0.3,1)_0.5s_both]">
        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-site-border">
          {/* Email */}
          <a
            href={`mailto:${t('email')}`}
            className="group flex items-center gap-4 p-5 hover:bg-site-bg-hover transition-colors"
          >
            <span className="size-10 shrink-0 rounded-xl bg-primary-green grid place-items-center shadow-sm shadow-primary-green/30 group-hover:scale-110 transition-transform">
              <Mail className="size-5 text-white" />
            </span>
            <div className="min-w-0">
              <p className="font-montserrat text-seu-caption-sm text-site-fg-muted mb-0.5">
                Email
              </p>
              <p className="font-montserrat font-medium text-seu-caption text-site-fg truncate">
                {t('email')}
              </p>
            </div>
          </a>

          {/* Phone */}
          <a
            href={`tel:${t('phone').replace(/\s/g, '')}`}
            className="group flex items-center gap-4 p-5 hover:bg-site-bg-hover transition-colors"
          >
            <span className="size-10 shrink-0 rounded-xl bg-primary-green grid place-items-center shadow-sm shadow-primary-green/30 group-hover:scale-110 transition-transform">
              <Phone className="size-5 text-white" />
            </span>
            <div className="min-w-0">
              <p className="font-montserrat text-seu-caption-sm text-site-fg-muted mb-0.5">
                Phone
              </p>
              <p className="font-montserrat font-medium text-seu-caption text-site-fg">
                {t('phone')}
              </p>
            </div>
          </a>

          {/* Address */}
          <div className="flex items-center gap-4 p-5">
            <span className="size-10 shrink-0 rounded-xl bg-primary-green grid place-items-center shadow-sm shadow-primary-green/30">
              <MapPin className="size-5 text-white" />
            </span>
            <div className="min-w-0">
              <p className="font-montserrat text-seu-caption-sm text-site-fg-muted mb-0.5">
                Address
              </p>
              <p className="font-montserrat font-medium text-seu-caption text-site-fg">
                {t('address')}
              </p>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="border-t border-site-border">
          <iframe
            title="SEU Development Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.0132234790544!2d44.70223969070919!3d41.72023350118791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4044739d4971ed9f%3A0x2f6c473c5bc487b8!2sSEU%20Development!5e0!3m2!1sen!2sge!4v1778605383057!5m2!1sen!2sge"
            width="100%"
            height="280"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-56 md:h-72 grayscale hover:grayscale-0 transition-[filter] duration-500"
          />
        </div>
      </div>
    </div>
  );
}
