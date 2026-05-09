import Image from 'next/image';
import FadeIn from '@/components/FadeIn';

export default function CardHero() {
  return (
    <div className="py-20">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left — Text */}
        <FadeIn direction="left">
          <h1 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-title-xl leading-tight lg:leading-[6rem] text-dark-green mb-4 lg:mb-8">
            SEU CARD
          </h1>
          <p className="font-montserrat font-normal text-seu-body lg:text-seu-subheading leading-relaxed lg:leading-[3.125rem] text-[#3D3D3D]">
            When buying property in any of the company&apos;s projects, clients
            will receive an exclusive personalized SEU card. Residents will be
            able to use the card at the company&apos;s partner establishments,
            taking advantage of exclusive conditions and discounts. You can see
            the full list of our partners below:
          </p>
        </FadeIn>

        {/* Right — Card Image */}
        <FadeIn direction="right" delay={200} className="flex flex-col items-center justify-center">
          <div className="relative">
            {/* Blurred background copy */}
            <Image
              src="/common/pngs/seu-card.png"
              alt=""
              width={363}
              height={514}
              aria-hidden
              className="absolute top-2 left-2 rounded-lg opacity-[0.46] blur-[37px] rotate-[5deg]"
            />
            {/* Card */}
            <Image
              src="/common/pngs/seu-card.png"
              alt="SEU Card"
              width={363}
              height={514}
              className="relative rounded-lg rotate-[5deg]"
            />
          </div>
          {/* Drop shadow */}
          <div className="w-[14.6875rem] h-5 bg-navy-green blur-[20px] mt-24" />
        </FadeIn>
      </div>
    </div>
  );
}
