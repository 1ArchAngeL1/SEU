import Link from "next/link";
import Image from "next/image";

export default function FooterLower() {
  return (
    <div className="w-full h-82 bg-black grid grid-cols-3 items-center px-40">
      {/* Social Icons */}
      <div className="flex items-center gap-18 justify-self-start">
        <Link href="#" className="hover:opacity-80 transition-opacity">
          <Image src="/common/svgs/facebook-icon.svg" alt="Facebook" width={48} height={48} />
        </Link>
        <Link href="#" className="hover:opacity-80 transition-opacity">
          <Image src="/common/svgs/linkedin-icon.svg" alt="LinkedIn" width={48} height={48} />
        </Link>
        <Link href="#" className="hover:opacity-80 transition-opacity">
          <Image src="/common/svgs/youtube-icon.svg" alt="YouTube" width={48} height={48} />
        </Link>
      </div>

      {/* Center Text */}
      <div className="text-center justify-self-center">
        <p className="font-montserrat font-normal text-[2.5rem] leading-12.25 tracking-[0.375rem] text-secondary-grey">
          SEU
        </p>
        <p className="font-montserrat font-normal text-[2.5rem] leading-12.25 tracking-[0.375rem] text-secondary-grey">
          development
        </p>
      </div>

      {/* Logo */}
      <Image
        src="/common/svgs/seu-logo.svg"
        alt="SEU Development Logo"
        width={133}
        height={117}
        className="object-contain justify-self-end"
      />
    </div>
  );
}
