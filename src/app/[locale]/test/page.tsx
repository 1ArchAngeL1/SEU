import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import FooterUpper from '@/components/FooterUpper';
import FooterLower from '@/components/FooterLower';
import HeaderNew from '@/components/header/HeaderNew';
import ChooseApartment from '@/components/ChooseApartment';

const Page = () => {
  return (
    <div>
      <HeaderNew />
      <ContactForm />
      <ContactPanel />
      <FooterUpper />
      <ChooseApartment />
      <FooterLower />
    </div>
  );
};

export default Page;
