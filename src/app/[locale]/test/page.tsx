import ContactForm from "@/components/ContactForm";
import ContactPanel from "@/components/ContactPanel";
import FooterUpper from "@/components/FooterUpper";
import FooterLower from "@/components/FooterLower";
import HeaderNew from "@/components/HeaderNew";

const Page = () => {
    return (
        <div>
            <HeaderNew/>
            <ContactForm/>
            <ContactPanel/>
            <FooterUpper/>
            <FooterLower/>
        </div>
    )
}

export default Page;