import { Link } from "react-router"


const Error = () => {
    return (
        <div>
            <h1>Page not found</h1>
            <p> Sorry, we could not find the page you are looking for.</p>

            <Link
                to="/">
                Go back Home
            </Link>
        </div>
    )
}

export default Error