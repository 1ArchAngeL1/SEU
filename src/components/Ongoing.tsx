import Image from "next/image";
import Link from "next/link";

export default function Ongoing() {
  const projects = [
    {
      id: 1,
      image: "/project-1.jpg",
      title: "SEU Varketili",
    },
    {
      id: 2,
      image: "/project-2.jpg",
      title: "SEU Vaja",
    },
    {
      id: 3,
      image: "/project-3.jpg",
      title: "SEU Premium",
    },
  ];

  return (
    <section className="py-20 bg-[#0c1829]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-white">
            Ongoing.
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group relative block overflow-hidden rounded-lg"
            >
              <div className="relative h-[250px] md:h-[300px]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1829]/80 via-transparent to-transparent" />

                {/* Title */}
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-medium text-lg">
                    {project.title}
                  </h3>
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#c9a962]/20 rounded-full flex items-center justify-center group-hover:bg-[#c9a962]/40 transition-colors">
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
