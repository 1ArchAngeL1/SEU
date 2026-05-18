'use client';

import { ChevronLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type BackButtonProps = {
  href?: string;
  className?: string;
  variant?: 'default' | 'gray';
};

export default function BackButton({ href, className, variant = 'default' }: BackButtonProps) {
  const router = useRouter();
  const t = useTranslations('common');

  const isGray = variant === 'gray';

  const inner = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-5 py-2 border',
        isGray
          ? 'bg-secondary-black border-secondary-black/80'
          : 'bg-dark-green border-pale-gray/10',
      )}
    >
      <ChevronLeft className={cn('size-4', isGray ? 'text-pale-gray/80' : 'text-pale-gray')} />
      <span className={cn('font-montserrat font-normal text-seu-caption', isGray ? 'text-pale-gray/80' : 'text-pale-gray')}>
        {t('back')}
      </span>
    </span>
  );

  const outerClass = cn(
    'inline-flex rounded-full border p-[3px] transition-colors',
    isGray
      ? 'border-secondary-black/60 hover:border-secondary-grey/50'
      : 'border-pale-gray/20 hover:border-pale-gray/40',
    className,
  );

  if (href) {
    return (
      <Link href={href as any} className={outerClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => router.back()} className={outerClass}>
      {inner}
    </button>
  );
}
