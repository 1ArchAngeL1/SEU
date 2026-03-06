import ContactForm from "@/components/ContactForm";
import ContactPanel from "@/components/ContactPanel";

const ContactPage = () => {
    return (
        <div className={"flex-1 bg-[#F4F0E9]"}>
            <ContactForm/>
            <ContactPanel/>
        </div>
    )
}

export default ContactPage;