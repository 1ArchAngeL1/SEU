import Image from "next/image";

interface PartnerCardProps {
  description: string;
}

export default function PartnerCard({ description }: PartnerCardProps) {
  return (
    <div className="bg-dark-green rounded-lg p-6">
      {/* Partner Logo + Title (embedded in SVG) */}
      <Image
        src="/common/svgs/bog.svg"
        alt="Bank of Georgia Group PLC"
        width={320}
        height={54}
        className="object-contain mb-4"
      />

      {/* Description */}
      <p className="font-montserrat font-normal text-seu-body-sm leading-[1.75rem] text-secondary-grey">
        {description}
      </p>
    </div>
  );
}
