import Image from 'next/image';
import FadeIn from '@/components/FadeIn';

const PARTNERS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: 'Bank of Georgia',
  logo: '/common/svgs/bog.svg',
}));

export default function AboutPartners() {
  return (
    <div>
      {/* Light header area */}
      <div className="bg-pale-gray pt-12 lg:pt-16 pb-0">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
          <FadeIn direction="left">
            <h2 className="font-[--font-bodoni] font-normal text-seu-title text-dark-green uppercase">
              Partners.
            </h2>
          </FadeIn>
        </div>
      </div>

      {/* Dark area from 80+ onwards */}
      <div className="bg-dark-green pt-3 pb-12 lg:pb-16">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
          <p className="font-montserrat font-normal text-seu-body text-secondary-grey mb-12">
            80+ Partners trust us.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PARTNERS.map((partner, i) => (
              <FadeIn key={partner.id} delay={(i % 4) * 80} duration={500}>
                <div className="h-24 flex items-center justify-center border border-secondary-black rounded-xl bg-dark-green/50 px-6 hover-lift">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={50}
                    className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
