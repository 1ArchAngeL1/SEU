import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function SeuVajaLight() {
  return (
    <section className="py-20 bg-[#e8dcc8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/seu-vaja-building.jpg"
              alt="SEU VAJA Building"
              fill
              className="object-cover"
            />
          </div>

          {/* Right - Content */}
          <div>
            <p className="text-[#c9a962] text-seu-caption-sm uppercase tracking-[0.3em] mb-4">
              New Project
            </p>
            <h2 className="text-seu-heading-lg md:text-seu-title font-light text-[#0c1829] mb-6">
              SEU VAJA
            </h2>
            <p className="text-[#6b7280] text-seu-caption leading-relaxed mb-8">
              Modern residential complex in the heart of Tbilisi. Premium apartments
              with stunning city views, contemporary design, and world-class amenities.
              Experience luxury living at its finest with SEU VAJA.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#c9a962]/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-[#0c1829] text-seu-caption">Modern Design</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#c9a962]/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[#0c1829] text-seu-caption">Prime Location</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#c9a962]/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <span className="text-[#0c1829] text-seu-caption">Premium Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#c9a962]/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-[#0c1829] text-seu-caption">Secure Living</span>
              </div>
            </div>

            <Link
              href="/projects/seu-vaja"
              className="inline-flex items-center gap-2 bg-[#c9a962] text-[#0c1829] px-8 py-3 rounded font-medium hover:bg-[#d4b872] transition-colors"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
