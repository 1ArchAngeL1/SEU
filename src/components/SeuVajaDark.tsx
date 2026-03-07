import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function SeuVajaDark() {
  return (
    <section className="py-20 bg-[#0d2e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <p className="text-[#c9a962] text-seu-caption-sm uppercase tracking-[0.3em] mb-4">
              Featured Project
            </p>
            <h2 className="text-seu-heading-lg md:text-seu-title font-light text-white mb-6">
              SEU VAJA
            </h2>
            <p className="text-[#9ca3af] text-seu-caption leading-relaxed mb-8">
              Discover the perfect blend of comfort and elegance. Our apartments
              feature spacious layouts, high-quality finishes, and breathtaking
              views of the city skyline.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-seu-heading font-light text-[#c9a962]">150+</p>
                <p className="text-[#9ca3af] text-seu-caption-sm uppercase tracking-wider mt-1">Apartments</p>
              </div>
              <div>
                <p className="text-seu-heading font-light text-[#c9a962]">12</p>
                <p className="text-[#9ca3af] text-seu-caption-sm uppercase tracking-wider mt-1">Floors</p>
              </div>
              <div>
                <p className="text-seu-heading font-light text-[#c9a962]">2025</p>
                <p className="text-[#9ca3af] text-seu-caption-sm uppercase tracking-wider mt-1">Completion</p>
              </div>
            </div>

            <Link
              href="/projects/seu-vaja"
              className="inline-flex items-center gap-2 border border-[#c9a962] text-[#c9a962] px-8 py-3 rounded font-medium hover:bg-[#c9a962] hover:text-[#0c1829] transition-colors"
            >
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Right - Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-[250px] md:h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/seu-vaja-1.jpg"
                alt="SEU VAJA Exterior"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-[250px] md:h-[300px] rounded-lg overflow-hidden mt-8">
              <Image
                src="/seu-vaja-2.jpg"
                alt="SEU VAJA Interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
