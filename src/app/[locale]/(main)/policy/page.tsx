const paragraphs = [
  'SEU Development has been operating in the real estate market since 2014.',
  'The company\u2019s team, consisting of experienced professionals who care about continuous development, implements high construction standards and uses innovative and modern approaches that meet European standards.',
  'Successfully completed projects by SEU Development include the old and new buildings of the Georgian National University, which house modern educational and exhibition facilities, as well as a business center in the suburbs of Tbilisi. All SEU Development construction projects are fully funded at an early stage, which ensures they are completed on time. The company\u2019s social responsibility ensures that it only uses energy efficient building materials for its projects.',
  'SEU Development aims to create a multifunctional residential complex that meets the needs and wishes of each client and ensures that such projects are accessible to every member of society.',
];

export default function PolicyPage() {
  return (
    <main>
      {/* Dark Hero */}
      <div className="bg-dark-green py-12">
        <div className="max-w-[1920px] mx-auto px-12">
          <h1 className="font-[--font-bodoni] font-normal text-seu-title-xl leading-[6rem] text-pale-gray mb-4 py-10">
            PRIVACY POLICY
          </h1>
          <p className="font-montserrat font-medium text-seu-subheading leading-[1.8125rem] text-pale-gray pt-10">
            Real estate market since 2014.
          </p>
        </div>
      </div>

      {/* Light Content */}
      <div className="bg-pale-gray py-16">
        <div className="max-w-[1920px] mx-auto px-12">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="mb-8 last:mb-0">
            {paragraphs.map((text, j) => (
              <p
                key={j}
                className="font-montserrat font-normal text-seu-body-lg leading-[1.5rem] text-dark-green mb-4 last:mb-0"
              >
                {text}
              </p>
            ))}
          </div>
        ))}
        </div>
      </div>
    </main>
  );
}
