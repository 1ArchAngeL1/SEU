import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export const HeaderContactUs = () => {
  const t = useTranslations('header');

  return (
    <Link
      href="/contact"
      className="font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] text-pale-gray/60 bg-pale-gray/[0.18] border border-secondary-grey/60 rounded-[0.625rem] w-[8.875rem] h-[2.4375rem] flex items-center justify-center hover:text-pale-gray/80 hover:bg-pale-gray/25 transition-colors"
    >
      {t('contactUs')}
    </Link>
  );
};
