'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingAbout() {
  return (
    <section className="bg-pale-gray py-20 lg:py-32">
      <div className="mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left - Text Content */}
          <div className="flex-1 max-w-xl">
            <h2 className="font-bodoni text-seu-title lg:text-seu-title-lg text-black mb-8">
              About SEU.
            </h2>

            <div className="space-y-6 text-seu-body text-black/80 leading-relaxed">
              <p>
                SEU Development has been operating in the real estate market
                since 2014.
              </p>

              <p>
                The company's team, consisting of experienced professionals who
                care about continuous development, implements high construction
                standards and uses innovative and modern approaches that meet
                European standards.
              </p>

              <p>
                Successfully completed projects by SEU Development include the
                old and new buildings of the Georgian National University, which
                house modern educational and exhibition facilities, as well as a
                business center in the suburbs of Tbilisi. All SEU Development
                construction projects are fully funded at an early stage, which
                ensures they are completed on time.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-block mt-10 bg-primary-green text-white font-montserrat font-medium text-seu-body px-16 py-3 rounded-lg hover:bg-primary-green/85 transition-colors"
            >
              CONTACT
            </Link>
          </div>

          {/* Right - Logo */}
          <div className="flex-1 flex items-center justify-center lg:justify-end mr-52">
            <Image
              src="/common/svgs/SEUcolored.svg"
              alt="SEU Development Logo"
              width={400}
              height={400}
              className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
