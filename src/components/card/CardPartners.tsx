import PartnerCard from './PartnerCard';
import FadeIn from '@/components/FadeIn';

const partners = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  description:
    'SEU Development has been operating in the real estate market since 2014. SEU Development has been operating in the real estate market since 2014. SEU Development has been operating in the real estate market since 2014.',
}));

export default function CardPartners() {
  return (
    <div className="py-20">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <FadeIn>
          <h2 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-title-lg leading-tight lg:leading-[4.1875rem] text-[#0D2F21] mb-8 lg:mb-12">
            PARTNERS.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, i) => (
            <FadeIn key={partner.id} delay={(i % 3) * 100} duration={600}>
              <PartnerCard description={partner.description} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
