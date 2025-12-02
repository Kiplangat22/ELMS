import { Footer } from "../components/footer/Footer"
import { Hero } from "../components/Hero"
import Navbar from "../components/nav/Navbar"
import { Services } from "../components/Services"


const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <Services />
            <Footer />
        </div>
    )
}

export default LandingPage