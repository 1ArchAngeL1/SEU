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
          ? 'w-full h-[7.5rem] bg-pale-gray flex items-center'
          : 'w-full h-[7.5rem] border border-secondary-black flex items-center'
      }
    >
      <div className="flex flex-wrap items-center justify-evenly w-full">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={
              isLight
                ? 'font-montserrat font-medium text-seu-body leading-[1.375rem] tracking-[0.169rem] text-dark-green hover:text-dark-green/70 transition-colors'
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
