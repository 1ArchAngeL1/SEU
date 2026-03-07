import ContactForm from "@/components/ContactForm";
import ContactPanel from "@/components/ContactPanel";

const ContactPage = () => {
    return (
        <div className="relative flex-1 min-h-0 overflow-hidden">
            {/* Dark section (left/top) */}
            <div
                className="absolute inset-0 bg-dark-green"
                style={{
                    clipPath: "polygon(0 0, 90% 0, 5% 100%, 0 100%)"
                }}
            />
             {/*Light section (right/bottom) */}
            <div
                className="absolute inset-0 bg-pale-gray"
                style={{
                    clipPath: "polygon(90% 0, 100% 0, 100% 100%, 5% 100%)"
                }}
            />
             {/*Content layer */}
            <div className="relative z-10 h-full flex">
                {/* Left: ContactForm on dark area */}
                <div className="flex-1 flex items-start justify-start pt-16 pl-8 md:pl-16 lg:pl-20">
                    <ContactForm className="max-w-xl lg:max-w-2xl"/>
                </div>
                {/* Right: ContactPanel on light area */}
                <div className="flex-1 flex items-end justify-end pb-16 pr-8 md:pr-16 lg:pr-20">
                    <ContactPanel
                        className="max-w-xl lg:max-w-2xl"
                        headerClassName="text-dark-green"
                    />
                </div>
            </div>
        </div>
    )
}

export default ContactPage;