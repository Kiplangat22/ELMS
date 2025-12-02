import Intro from "../components/about/Intro"
import Testimonials from "../components/about/Testimonials"
import Navbar from "../components/nav/Navbar"
import {Footer} from "../components/footer/Footer"

export const AboutPage = () => {
    return (
        <div>
            <Navbar />
            <Intro />
            <Testimonials />
            <Footer />
        </div>
    )
}

