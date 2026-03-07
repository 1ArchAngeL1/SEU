import Image from "next/image";

export default function Partners() {
  const partners = [
    { name: "Bank of Georgia", logo: "/partners/bog.png" },
    { name: "TBC Bank", logo: "/partners/tbc.png" },
    { name: "Liberty Bank", logo: "/partners/liberty.png" },
    { name: "Basis Bank", logo: "/partners/basis.png" },
    { name: "Credo Bank", logo: "/partners/credo.png" },
    { name: "ProCredit Bank", logo: "/partners/procredit.png" },
  ];

  return (
    <section id="partners" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-seu-subheading md:text-seu-heading font-light text-[#0c1829]">
            PARTNERS.
          </h2>
        </div>

        {/* Partners Logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
