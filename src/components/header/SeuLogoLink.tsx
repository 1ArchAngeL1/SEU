import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export const SeuLogoLink = () => {
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
          className="object-contain absolute top-0 left-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0"
        />
        <Image
          src="/common/svgs/Group 169-streched.svg"
          alt="SEU Development Logo"
          width={53}
          height={58}
          className="object-contain absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
        />
      </div>
      <p className="font-montserrat font-normal text-seu-caption tracking-[0.169rem] text-pale-gray mt-1 group-hover:mt-3 transition-all duration-500 ease-in-out">
        S E U
      </p>
      <p className="font-montserrat font-normal text-seu-caption-sm tracking-wide text-pale-gray">
        Development
      </p>
    </Link>
  );
};
