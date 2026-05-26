import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export const HeaderContactUs = () => {
  const t = useTranslations('header');

  return (
    <Link
      href="/contact"
      className="font-montserrat font-medium text-seu-body-sm leading-[1.1875rem] tracking-[0.15rem] rounded-[0.625rem] w-[8.875rem] h-[2.4375rem] flex items-center justify-center border transition-all duration-300 hover:scale-105 hover:shadow-[0_0_16px_rgba(var(--primary-green-rgb),0.25)] text-site-fg-dim bg-site-bg-hover border-site-border-soft hover:text-site-fg"
    >
      {t('contactUs')}
    </Link>
  );
};
