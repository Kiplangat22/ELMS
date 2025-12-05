import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const navLinkStyle =
        "text-white hover:text-blue-400 font-medium";

    return (
        <div className="navbar bg-gradient-to-r from-gray-500 via-gray-800 to-gray-900 shadow-lg">
            {/* Navbar Start / Mobile Menu */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle md:hidden text-white"
                    >
                        <FaBars />
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-gray-800 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        <li><NavLink to="/" className={navLinkStyle}>Home</NavLink></li>
                        <li><NavLink to="/about" className={navLinkStyle}>About</NavLink></li>

                        {/* ONLY admin dashboard */}
                        <li><NavLink to="/admin/dashboard" className={navLinkStyle}>Dashboard</NavLink></li>

                        <li><NavLink to="/register" className={navLinkStyle}>Register</NavLink></li>
                        <li><NavLink to="/login" className={navLinkStyle}>Login</NavLink></li>
                    </ul>
                </div>
            </div>

            {/* Navbar Center (Desktop) */}
            <div className="navbar-center hidden md:flex">
                <ul className="menu menu-horizontal px-1 gap-4">
                    <li><NavLink to="/" className={navLinkStyle}>Home</NavLink></li>
                    <li><NavLink to="/about" className={navLinkStyle}>About</NavLink></li>

                    {/* ONLY admin dashboard */}
                    <li><NavLink to="/admin/dashboard" className={navLinkStyle}>Dashboard</NavLink></li>
                </ul>
            </div>

            {/* Navbar End */}
            <div className="navbar-end flex gap-2">
                <NavLink to="/register" className="btn btn-ghost text-white hover:text-blue-400">Register</NavLink>
                <NavLink to="/login" className="btn btn-primary">Login</NavLink>
            </div>
        </div>
    );
};

export default Navbar;
