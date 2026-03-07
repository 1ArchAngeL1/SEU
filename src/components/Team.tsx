import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function Upcoming() {
  const upcomingProjects = [
    {
      id: 1,
      title: "SEU VARKETILI",
      image: "/upcoming-1.jpg",
      status: "Coming Soon",
    },
    {
      id: 2,
      title: "SEU VARKETILI",
      image: "/upcoming-2.jpg",
      status: "Coming Soon",
    },
  ];

  return (
    <section id="projects" className="py-20 bg-[#0c1829]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-seu-heading md:text-seu-heading-lg font-light text-white">
            UPCOMING.
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block"
            >
              <div className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden mb-4">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Status Badge */}
                <div className="absolute top-4 left-4 bg-[#c9a962]/90 text-[#0c1829] text-seu-caption-sm uppercase tracking-wider px-3 py-1 rounded">
                  {project.status}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#c9a962] text-seu-caption-sm uppercase tracking-[0.2em] mb-1">
                    Upcoming project
                  </p>
                  <h3 className="text-white font-medium text-seu-body-lg">
                    {project.title}
                  </h3>
                </div>

                {/* Arrow Button */}
                <div className="w-12 h-12 border border-[#c9a962]/30 rounded-full flex items-center justify-center group-hover:bg-[#c9a962]/20 transition-colors">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
