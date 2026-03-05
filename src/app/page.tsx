import Hero from "@/components/Hero";
import AboutCompany from "@/components/Mission";
import Ongoing from "@/components/Ongoing";
import SeuVajaLight from "@/components/SeuVajaLight";
import SeuVajaDark from "@/components/SeuVajaDark";
import Upcoming from "@/components/Team";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";
import {HeaderDesktop} from "@/components/header/header.desktop";

export default function Home() {
    return (
        <main>
            <HeaderDesktop/>
            <Hero/>
            <AboutCompany/>
            <Ongoing/>
            <SeuVajaLight/>
            <SeuVajaDark/>
            <Upcoming/>
            <Partners/>
            <Footer/>
        </main>
    );
}
