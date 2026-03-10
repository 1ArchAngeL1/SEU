import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type HeaderTextLinkProps = {
  pathName: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
};

export const HeaderTextLink = ({
  className,
  href,
  pathName,
  children,
}: HeaderTextLinkProps) => {
  return (
    <Link
      key={href}
      href={href}
      className={cn(
        `font-montserrat font-medium text-seu-caption lg:text-seu-body leading-5.5 tracking-[0.056rem] text-pale-gray hover:text-white transition-colors px-4 ${pathName === href ? 'underline underline-offset-4' : ''}`,
        className
      )}
    >
      {children}
    </Link>
  );
};
