import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { HeaderVariant } from './SeuHeader';

export const HeaderContactUs = ({ variant = 'dark' }: { variant?: HeaderVariant }) => {
  const t = useTranslations('header');

  const colors =
    variant === 'light'
      ? 'text-black/60 bg-pale-gray/[0.18] border-black/30 hover:text-black/80 hover:bg-pale-gray/25'
      : 'text-pale-gray/60 bg-pale-gray/[0.18] border-secondary-grey/60 hover:text-pale-gray/80 hover:bg-pale-gray/25';

  return (
    <Link
      href="/contact"
      className={`font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] rounded-[0.625rem] w-[8.875rem] h-[2.4375rem] flex items-center justify-center border transition-all duration-300 hover:scale-105 hover:shadow-[0_0_16px_rgba(255,107,53,0.25)] ${colors}`}
    >
      {t('contactUs')}
    </Link>
  );
};
