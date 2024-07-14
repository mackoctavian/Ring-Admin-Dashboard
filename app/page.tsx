import {Hero} from "@/components/landing/Hero";
import NavBar from "@/components/landing/NavBar";

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
            <NavBar />
            <Hero />
        </div>
    );
}

export default LandingPage