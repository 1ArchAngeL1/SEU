"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const leftLinks = [
  { label: "Search Apartment", href: "/search" },
  { label: "Visual Search", href: "/visual-search" },
  { label: "SEU CARD", href: "/card" },
];

const rightLinks = [
  { label: "NEWS", href: "/news" },
  { label: "About", href: "/about" },
];

export default function HeaderNew() {
  const pathname = usePathname();

  return (
    <header className="w-full grid grid-cols-[1fr_auto_1fr] items-center px-20 py-4 bg-dark-green">
      {/* Left Links */}
      <nav className="flex items-center justify-between">
        {leftLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`font-montserrat font-medium text-lg leading-5.5 tracking-[0.056rem] text-pale-gray hover:text-white transition-colors ${pathname === link.href ? "underline underline-offset-4" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Center Logo */}
      <Link href="/" className="flex flex-col items-center justify-self-center px-48">
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
      </Link>

      {/* Right Links + Contact + Language */}
      <div className="flex items-center justify-between">
        {rightLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`font-montserrat font-medium text-lg leading-5.5 tracking-[0.056rem] text-pale-gray hover:text-white transition-colors ${pathname === link.href ? "underline underline-offset-4" : ""}`}
          >
            {link.label}
          </Link>
        ))}

        <Link
          href="/contact"
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
