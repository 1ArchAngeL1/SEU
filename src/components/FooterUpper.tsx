import Link from "next/link";

const links = [
  { label: "PROJECTS", href: "#" },
  { label: "SEU CARD", href: "#" },
  { label: "PRIVACY POLICY", href: "#" },
  { label: "NEWS", href: "#" },
  { label: "ABOUT", href: "#" },
];

export default function FooterUpper() {
  return (
    <nav className="w-full h-[7.5rem] border border-secondary-black flex items-center">
      <div className="flex flex-wrap items-center justify-evenly w-full">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-montserrat font-medium text-lg leading-[1.375rem] tracking-[0.169rem] text-pale-gray hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
