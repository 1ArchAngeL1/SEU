import HeaderNew from "@/components/HeaderNew";
import React from "react";

interface ContactLayoutProps {
    children: React.ReactNode;
}

const ContactLayout = ({children}: ContactLayoutProps) => {

    return <div className={"flex flex-col h-screen overflow-hidden"}>
        <HeaderNew/>
        {children}
    </div>

}

export default ContactLayout