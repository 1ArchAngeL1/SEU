'use client';

import Image from 'next/image';

const PARTNERS = [
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
];

export default function SeuPartners() {
  return (
    <section className="bg-dark-green py-20 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 mb-12">
        <h2 className="font-bodoni text-seu-title text-white uppercase tracking-wide">
          Partners.
        </h2>
      </div>

      {/* Infinite scroll container */}
      <div className="relative">
        <div className="flex animate-infinite-scroll hover:paused will-change-transform backface-hidden">
          {/* First set of partners */}
          {PARTNERS.map((partner, index) => (
            <div key={`first-${index}`} className="flex-shrink-0 mx-3">
              <div className="w-[220px] h-[100px] flex items-center justify-center border border-secondary-black rounded-xl bg-dark-green/50 px-6">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={180}
                  height={60}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {PARTNERS.map((partner, index) => (
            <div key={`second-${index}`} className="flex-shrink-0 mx-3">
              <div className="w-[220px] h-[100px] flex items-center justify-center border border-secondary-black rounded-xl bg-dark-green/50 px-6">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={180}
                  height={60}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
