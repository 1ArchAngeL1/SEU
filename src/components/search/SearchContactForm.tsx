import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';

export const SearchContactForm = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-10 bg-dark-green px-5 sm:px-10 py-10 lg:py-16">
      <ContactForm className="max-w-2xl" />
      <ContactPanel className="max-w-2xl" />
    </div>
  );
};
