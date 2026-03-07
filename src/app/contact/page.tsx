import ContactForm from "@/components/ContactForm";
import ContactPanel from "@/components/ContactPanel";

const ContactPage = () => {
    return (
        <div className="relative flex-1 min-h-screen overflow-hidden">
            {/* Dark section (left/top) */}
            <div
                className="absolute inset-0 bg-[#0D141D]"
                style={{
                    clipPath: "polygon(0 0, 90% 0, 0% 100%, 0 100%)"
                }}
            />
            {/* Light section (right/bottom) */}
            <div
                className="absolute inset-0 bg-[#F4F0E9]"
                style={{
                    clipPath: "polygon(90% 0, 100% 0, 100% 100%, 0% 100%)"
                }}
            />
            {/* Content layer */}
            <div className="relative z-10 min-h-screen">
                {/* Top-left: ContactForm on dark area */}
                <div className="absolute top-[120px] left-[62px] w-2xl">
                    <ContactForm/>
                </div>
                {/* Bottom-right: ContactPanel on light area */}
                <div className="absolute bottom-[142px] right-[48px] w-2xl">
                    <ContactPanel className={""} headerClassName={"text-[#0D141D]"}/>
                </div>
            </div>
        </div>
    )
}

export default ContactPage;