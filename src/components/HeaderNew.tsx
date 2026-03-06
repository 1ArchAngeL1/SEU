import Link from "next/link";
import Image from "next/image";

const leftLinks = [
  { label: "Search Apartment", href: "#" },
  { label: "Visual Search", href: "#" },
  { label: "SEU CARD", href: "#" },
];

const rightLinks = [
  { label: "NEWS", href: "#" },
  { label: "About", href: "#" },
];

export default function HeaderNew() {
  return (
    <header className="w-full grid grid-cols-[1fr_auto_1fr] items-center px-20 py-4">
      {/* Left Links */}
      <nav className="flex items-center justify-between">
        {leftLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-montserrat font-medium text-lg leading-5.5 tracking-[0.056rem] text-pale-gray hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Center Logo */}
      <div className="flex flex-col items-center justify-self-center px-48">
        <Image
          src="/common/svgs/Group 169.svg"
          alt="SEU Development Logo"
          width={53}
          height={47}
          className="object-contain"
        />
        <p className="font-montserrat font-normal text-sm tracking-[0.169rem] text-pale-gray mt-1">
          S E U
        </p>
        <p className="font-montserrat font-normal text-xs tracking-wide text-pale-gray">
          Development
        </p>
      </div>

      {/* Right Links + Contact + Language */}
      <div className="flex items-center justify-between">
        {rightLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-montserrat font-medium text-lg leading-5.5 tracking-[0.056rem] text-pale-gray hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}

        <Link
          href="#"
          className="font-montserrat font-medium text-base leading-[1.1875rem] tracking-[0.15rem] text-pale-gray/60 bg-pale-gray/[0.18] border border-secondary-grey/60 rounded-[0.625rem] w-[8.875rem] h-[2.4375rem] flex items-center justify-center hover:text-pale-gray/80 hover:bg-pale-gray/25 transition-colors"
        >
          Contact us
        </Link>

        {/* Language Switcher */}
        <div className="flex items-center gap-0.5 h-10 border border-secondary-grey bg-pale-gray/10 rounded-[10px] px-[0.175rem]">
          <button className="flex-1 h-8 w-16 font-montserrat font-medium text-base leading-[1.1875rem] tracking-[0.15rem] text-pale-gray bg-pale-gray/30 border border-secondary-grey rounded-[8px] transition-colors">
            EN
          </button>
          <button className="flex-1 h-8 w-16 font-montserrat font-medium text-base leading-[1.1875rem] tracking-[0.15rem] text-pale-gray/50 rounded-[8px] hover:bg-pale-gray/15 transition-colors">
            GE
          </button>
        </div>
      </div>
    </header>
  );
}
