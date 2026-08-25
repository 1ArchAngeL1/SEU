import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';

interface SearchContactFormProps {
  /** Apartment the form sits under — sent along so the admin sees which unit was asked about. */
  unitId?: string;
}

export const SearchContactForm = ({ unitId }: SearchContactFormProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-10 bg-site-bg px-5 sm:px-10 py-10 lg:py-16">
      <ContactForm className="max-w-3xl" unitId={unitId} />
      <ContactPanel className="max-w-3xl" />
    </div>
  );
};
