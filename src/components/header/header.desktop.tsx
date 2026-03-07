import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

type HeaderLinkProps = {
    href: string;
    className?: string;
    children?: React.ReactNode;
}

const HeaderLink = ({href, className, children}: HeaderLinkProps) => {

    return <Link href={href} className={cn("text-seu-body", className)}>{children}</Link>
}

const CenterSeuLink = () => {
    return (
        <div className={"flex flex-col text-center items-center"}>
            <Image src={"/common/seu-minimalistic.png"} alt={"dwad"} width={40} height={92}/>
            <p className={"text-seu-body"}>SEU</p>
            <p className={"text-seu-caption-sm"}>Developlment</p>
        </div>
    )
}

export const HeaderDesktop = () => {
    return (
        <header className="sticky top-0 z-50 bg-[#0c1829]/95 backdrop-blur-sm">
            <div className="flex items-center justify-between h-24 p-8">
                <HeaderLink href="/racxa">Visual Search</HeaderLink>
                <HeaderLink href="/racxa">Search Apartment</HeaderLink>
                <HeaderLink href="/racxa">SEU CARD</HeaderLink>
                <CenterSeuLink/>
                <HeaderLink href="/racxa">NEWS</HeaderLink>
                <HeaderLink href="/racxa">About</HeaderLink>
                <HeaderLink href="/racxa">
                    <Button variant={"secondary"}>
                        Contact Us
                    </Button>
                </HeaderLink>
            </div>
        </header>
    );
};
