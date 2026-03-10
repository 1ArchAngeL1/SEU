import Image from 'next/image';

export default function AboutHero() {
  return (
    <div className="relative h-[calc(100dvh-10rem)] overflow-hidden">
      {/* PLACEHOLDER: IMAGE - Office/lounge interior with SEU logo on wall */}
      <div className="absolute inset-0 bg-secondary-black/60 flex items-center justify-center">
        <Image
          src="/common/svgs/SEUcolored.svg"
          alt="SEU Development Office"
          width={120}
          height={120}
          className="opacity-30"
        />
      </div>

      {/* Fade gradient on top */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-dark-green to-transparent" />

      {/* Content overlaid on image */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 pt-24">
        <p className="font-montserrat font-medium text-seu-body text-pale-gray mb-2">
          The company&apos;s team
        </p>
        <h1 className="font-[--font-bodoni] font-normal text-seu-title-lg text-pale-gray">
          Seu development
        </h1>
      </div>
    </div>
  );
}
