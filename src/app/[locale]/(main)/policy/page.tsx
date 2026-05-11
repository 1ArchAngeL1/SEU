'use client';

import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';

const sections = [
  {
    title: null,
    content:
      'წინამდებარე ვებ გვერდი www.seudevelopment.ge (შემდგომში ,,ვებ გვერდი\'\') წარმოადგენს შპს ,,სეუ გრუპ დეველოპმენტ კომპანი\'\'-ს (ს/კ 405062836) საკუთრებას. ჩვენი კომპანიისთვის პრიორიტეტულია მომხმარებლის ნდობა და მათი პირადი სივრცის ხელშეუხებლობა. წინამდებარე დოკუმენტი განმარტავს თუ როგორ უზრუნველყოფს შპს ,,სეუ გრუპ დეველოპმენტ კომპანი\'\' თქვენს მიერ მოწოდებული ინფორმაციის უსაფრთხოებასა და კონფიდენციალურობას მოქმედი კანონმდებლობის შესაბამისად.',
  },
  {
    title: 'რა სახის ინფორმაციას ვაგროვებთ?',
    content:
      'ჩვენს ვებგვერდზე სტუმრობისას, მონაცემთა შეგროვება ხდება შემდეგი გზებით:',
    bullets: [
      'აქტიური კომუნიკაცია: როდესაც იყენებთ ,,ნომრის დატოვების\'\' ფუნქციას, ჩვენ ვინახავთ თქვენს საკონტაქტო ნომერს თქვენთან დასაკავშირებლად და საინტერესო შეთავაზებების მოსაწოდებლად.',
      'ანალიტიკური მონაცემები: ჩვენ აღვრიცხავთ ინფორმაციას იმის შესახებ, თუ რომელი წყაროდან შემოხვედით ვებგვერდზე, რა დრო დაყავით კონკრეტულ გვერდზე და რა ტიპის პროდუქციით დაინტერესდით. ეს გვეხმარება მომსახურების ხარისხის გაუმჯობესებაში.',
    ],
  },
  {
    title: 'მომხმარებლის უფლებები',
    content:
      'თქვენ სრულად ფლობთ კონტროლს თქვენს პერსონალურ მონაცემებზე და გაქვთ უფლება:',
    bullets: [
      'მოითხოვოთ ინფორმაცია თქვენი მონაცემების დამუშავების შესახებ;',
      'მოითხოვოთ არასწორი ან არაზუსტი მონაცემების შესწორება;',
      'მოითხოვოთ მონაცემების წაშლა ან მათი დამუშავების შეწყვეტა;',
    ],
    note: 'შენიშვნა: ნებისმიერ მოთხოვნაზე კომპანია გიპასუხებთ 30 სამუშაო დღის განმავლობაში.',
  },
  {
    title: 'მონაცემთა უსაფრთხოება და შენახვა',
    content:
      'კომპანია იყენებს თანამედროვე ტექნიკურ და ორგანიზაციულ გადაწყვეტილებებს თქვენი ინფორმაციის დასაცავად. მონაცემები ინახება მხოლოდ იმ ვადით, რაც საჭიროა მომსახურების გაუმჯობესებისა და სარეკლამო მიზნების მისაღწევად. მიზნის მიღწევის ან თქვენი მოთხოვნის საფუძველზე, ინფორმაცია ექვემდებარება უსაფრთხო წაშლას.',
  },
];

export default function PolicyPage() {
  const t = useTranslations('policy');
  return (
    <main>
      {/* Dark Hero */}
      <div className="bg-dark-green py-12">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
          <FadeIn direction="left" duration={900}>
            <h1 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-title-xl leading-tight lg:leading-[6rem] text-pale-gray mb-4 py-6 lg:py-10">
              {t('title')}
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Light Content */}
      <div className="bg-pale-gray py-10 lg:py-16">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10 flex flex-col gap-10">
          {sections.map((section, i) => (
            <FadeIn key={i} delay={i * 100}>
              {section.title && (
                <h2 className="font-[--font-bodoni] font-normal text-seu-subheading lg:text-seu-heading leading-tight text-dark-green mb-4">
                  {section.title}
                </h2>
              )}
              <p className="font-montserrat font-normal text-seu-body-sm lg:text-seu-body-lg leading-7 text-dark-green">
                {section.content}
              </p>
              {section.bullets && (
                <ul className="mt-4 flex flex-col gap-3 pl-5 list-disc">
                  {section.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="font-montserrat font-normal text-seu-body-sm lg:text-seu-body-lg leading-7 text-dark-green"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {section.note && (
                <p className="mt-4 font-montserrat font-medium text-seu-body-sm lg:text-seu-body leading-7 text-dark-green/80 italic">
                  {section.note}
                </p>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
}
