import Image from 'next/image';

export default function AboutCompany() {
  return (
    <section id="about" className="py-20 bg-[#0c1829]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-seu-heading md:text-seu-heading-lg font-light text-white mb-4">
            About company.
          </h2>
        </div>

        {/* Panoramic Image */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-12">
          <Image
            src="/panorama.jpg"
            alt="360 View"
            fill
            className="object-cover"
          />
          {/* 360 View Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-[#0c1829]/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0c1829]/80 transition-colors">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#9ca3af] text-seu-caption leading-relaxed mb-4">
            Your home-market partner since 2016. Developing various real estate
            projects, luxury apartments, commercial buildings to serve the
            evolving needs of modern lifestyle and business.
          </p>
          <p className="text-[#9ca3af] text-seu-caption leading-relaxed">
            SEU Development has been operating in the real estate market since
            2016. The company&apos;s mission is to create high-quality,
            comfortable, and modern residential spaces that meet the highest
            standards.
          </p>
        </div>
      </div>
    </section>
  );
}
