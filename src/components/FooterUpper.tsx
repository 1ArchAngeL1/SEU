import { Link } from '@/i18n/navigation';

const links = [
  { label: 'PROJECTS', href: '#' },
  { label: 'SEU CARD', href: '/card' },
  { label: 'PRIVACY POLICY', href: '/policy' },
  { label: 'NEWS', href: '#' },
  { label: 'ABOUT', href: '#' },
];

export default function FooterUpper({
  variant = 'dark',
}: {
  variant?: 'dark' | 'light';
}) {
  const isLight = variant === 'light';

  return (
    <nav
      className={
        isLight
          ? 'w-full py-10 lg:py-0 lg:h-30 bg-black lg:bg-pale-gray flex items-center'
          : 'w-full py-10 lg:py-0 lg:h-30 bg-black lg:bg-transparent lg:border-t lg:border-b lg:border-secondary-black flex items-center'
      }
    >
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0 justify-evenly w-full">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={
              isLight
                ? 'font-montserrat font-medium text-seu-body leading-5.5 tracking-[0.169rem] text-dark-green hover:text-dark-green/70 transition-colors'
                : 'font-montserrat font-medium text-seu-body leading-[1.375rem] tracking-[0.169rem] text-pale-gray hover:text-white transition-colors'
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
