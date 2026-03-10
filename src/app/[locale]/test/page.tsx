import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import FooterUpper from '@/components/FooterUpper';
import FooterLower from '@/components/FooterLower';
import SeuHeader from '@/components/header/SeuHeader';
import ChooseApartment from '@/components/ChooseApartment';

const Page = () => {
  return (
    <div>
      <SeuHeader />
      <ContactForm />
      <ContactPanel />
      <FooterUpper />
      <ChooseApartment />
      <FooterLower />
    </div>
  );
};

export default Page;
