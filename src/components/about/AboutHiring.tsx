export default function AboutHiring() {
  return (
    <div className="bg-pale-gray py-20 lg:py-28">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Left - Title & Info Box */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between pr-0 lg:pr-20">
            <div>
              <h2 className="font-[--font-bodoni] font-normal text-seu-title text-dark-green uppercase mb-4">
                We Are Hiring.
              </h2>
              <p className="font-[--font-bodoni] font-normal text-seu-body-lg text-dark-green/70 italic">
                Benefits working with us.
              </p>
            </div>

            {/* PLACEHOLDER: IMAGE - Hiring section image */}
            <div className="w-full flex-1 bg-secondary-black/20 rounded-lg flex items-center justify-center my-8">
              <span className="text-secondary-grey/50 font-montserrat text-seu-caption">Image Placeholder</span>
            </div>

            {/* Blue info box */}
            <div className="mt-auto -ml-4 sm:-ml-6 lg:-ml-10 -mr-0 lg:-mr-20 bg-dark-green px-4 sm:px-6 lg:px-10 py-16">
              <p className="font-montserrat font-medium text-seu-body text-pale-gray/80 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </div>

          {/* Right - Job Listing */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg p-10">
            <h3 className="font-[--font-bodoni] font-normal text-seu-heading text-dark-green uppercase mb-2">
              Marketing
            </h3>
            <p className="font-montserrat font-semibold text-seu-caption-sm text-dark-green/80 leading-tight mb-4">
              SEU Development has been operating in the
              <br />
              real estate market since 2014
            </p>

            <hr className="border-dark-green/20 mb-6" />

            <div className="space-y-5 font-montserrat font-normal text-seu-caption text-dark-green/80 leading-relaxed">
              <p>
                The career development and alumni relations department in
                Georgia&apos;s National University SEU provides quality services
                designed to assist students and graduates in developing
                successful careers and makes guide a handbook covering Career
                Development.
              </p>

              <p>
                Various employment and career coaching services are offered to
                students and graduates by the appropriate organizations
                representing either the private or public sector.
              </p>

              <p>
                Training sessions, workshops, public lectures, job fairs,
                individual consultations, travel, regarding employment, on-site
                and online professional, university or community available
                scholarships. Through its comprehensive services, the department
                supports students and graduates in developing skills and making
                connections that are important to them, which further the
                country&apos;s higher socio-economic progress.
              </p>

              <p>
                Students and alumni can benefit from counseling in the career
                development and alumni relations service, both in person and
                through email and telephone communications.
              </p>

              <p>
                Career development and alumni national department is offering
                students and graduates career counseling. Sessions are conducted
                individually face to face, as well as in small and telephone
                communications.
              </p>
            </div>

            <button className="mt-8 bg-primary-green text-white font-montserrat font-medium text-seu-caption px-8 py-2 rounded-lg hover:bg-primary-green/85 transition-colors uppercase">
              Send Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
