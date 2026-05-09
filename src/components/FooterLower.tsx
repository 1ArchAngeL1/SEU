import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export default function FooterLower() {
  return (
    <div className="w-full bg-black py-12 lg:py-0 lg:h-82 flex flex-col lg:grid lg:grid-cols-3 items-center gap-8 lg:gap-0 px-5 lg:px-10">
      {/* Social Icons */}
      <div className="flex items-center gap-10 lg:gap-18 justify-self-start lg:order-none order-last">
        <Link href="#" className="hover:opacity-80 transition-opacity">
          <Image
            src="/common/svgs/facebook-icon.svg"
            alt="Facebook"
            width={48}
            height={48}
            className="w-8 h-8 lg:w-12 lg:h-12"
          />
        </Link>
        <Link href="#" className="hover:opacity-80 transition-opacity">
          <Image
            src="/common/svgs/linkedin-icon.svg"
            alt="LinkedIn"
            width={48}
            height={48}
            className="w-8 h-8 lg:w-12 lg:h-12"
          />
        </Link>
        <Link href="#" className="hover:opacity-80 transition-opacity">
          <Image
            src="/common/svgs/youtube-icon.svg"
            alt="YouTube"
            width={48}
            height={48}
            className="w-8 h-8 lg:w-12 lg:h-12"
          />
        </Link>
      </div>

      {/* Center Text — hidden on mobile */}
      <div className="hidden lg:block text-center justify-self-center">
        <p className="font-montserrat font-normal text-seu-heading-lg leading-12.25 tracking-[0.375rem] text-secondary-grey">
          SEU
        </p>
        <p className="font-montserrat font-normal text-seu-heading-lg leading-12.25 tracking-[0.375rem] text-secondary-grey">
          development
        </p>
      </div>

      {/* Logo — hidden on mobile */}
      <Image
        src="/common/svgs/seu-logo.svg"
        alt="SEU Development Logo"
        width={133}
        height={117}
        className="object-contain justify-self-end hidden lg:block"
      />
    </div>
  );
}
