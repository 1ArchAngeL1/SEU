import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { HeaderVariant } from './SeuHeader';

export const SeuLogoLink = ({
  variant = 'dark',
}: {
  variant?: HeaderVariant;
}) => {
  const textColor = variant === 'light' ? 'text-black' : 'text-pale-gray';

  return (
    <Link
      href="/"
      className="group flex flex-col items-center justify-self-center px-10 lg:px-16 overflow-visible"
    >
      <div className="relative w-13.25 h-11.75 group-hover:h-14.5 transition-all duration-500 ease-in-out">
        <Image
          src="/common/svgs/Group 169.svg"
          alt="SEU Development Logo"
          width={53}
          height={47}
          className={`object-contain absolute top-0 left-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0 ${variant === 'light' ? 'invert' : ''}`}
        />
        <Image
          src="/common/svgs/Group 169-streched.svg"
          alt="SEU Development Logo"
          width={53}
          height={58}
          className={`object-contain absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 ${variant === 'light' ? 'invert' : ''}`}
        />
      </div>
      <p
        className={`font-montserrat font-normal text-seu-caption tracking-[0.169rem] ${textColor} mt-1 group-hover:mt-3 transition-all duration-500 ease-in-out`}
      >
        S E U
      </p>
      <p
        className={`font-montserrat font-normal text-seu-caption-sm tracking-wide ${textColor}`}
      >
        Development
      </p>
    </Link>
  );
};
