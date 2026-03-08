import PartnerCard from './PartnerCard';

const partners = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  description:
    'SEU Development has been operating in the real estate market since 2014. SEU Development has been operating in the real estate market since 2014. SEU Development has been operating in the real estate market since 2014.',
}));

export default function CardPartners() {
  return (
    <div className="py-20">
      <div className="max-w-[1920px] mx-auto px-12">
        <h2 className="font-[--font-bodoni] font-normal text-seu-title-lg leading-[4.1875rem] text-[#0D2F21] mb-12">
          PARTNERS.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} description={partner.description} />
          ))}
        </div>
      </div>
    </div>
  );
}
