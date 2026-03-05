import Link from "next/link";
import Image from "next/image";

type HeaderLinkProps = {
    label: string;
    href: string;
    className?: string;
    children?: React.ReactNode;
}

const HeaderLink = ({label, href, className, children}: HeaderLinkProps) => {

    return <Link href={href} className={"font-[18px]"}>{label}</Link>
}


export const HeaderDesktop = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c1829]/95 backdrop-blur-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/racxa">Visual Search</Link>
                    <Link href="/racxa">Search Apartment</Link>
                    <Link href="/racxa">SEU CARD</Link>
                    <Link href="/racxa">
                        <Image src={"/common/seu-minimalistic.png"} alt={"dwad"} width={20} height={46}/>
                    </Link>
                    <Link href="/racxa">NEWS</Link>
                    <Link href="/racxa">About</Link>
                    <Link href="/racxa">Contact Us</Link>
                </div>
            </div>
        </header>
    );
};
