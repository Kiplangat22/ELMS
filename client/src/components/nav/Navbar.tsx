import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom"; 

const Navbar = () => {
    return (
        <div>
            <div className="navbar bg-gradient-to-r from-gray-500 via-gray-800 to-gray-900 shadow-lg">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle md:hidden text-white">
                            <FaBars />
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-gray-800 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <NavLink to="/" className="text-white hover:text-blue-400">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" className="text-white hover:text-blue-400">About</NavLink>
                            </li>
                            <li>
                                <NavLink to="/services" className="text-white hover:text-blue-400">Services</NavLink>
                                
                            </li>
                            <li>
                                <NavLink to="/dashboard" className="text-white hover:text-blue-400">Dashboard</NavLink>
                            </li>
                            <li>
                                <NavLink to="/register" className="text-white hover:text-blue-400">Register</NavLink>
                            </li>
                            <li>
                                <NavLink to="/login" className="text-white hover:text-blue-400">Login</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="navbar-center hidden md:flex">
                
                    <ul className="menu menu-horizontal px-1 gap-4">
                        <li>
                            <NavLink to="/" className="text-white hover:text-blue-400 font-medium">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className="text-white hover:text-blue-400 font-medium">About</NavLink>
                        </li>
                        <li>
                            <NavLink to="/services" className="text-white hover:text-blue-400 font-medium">Services</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard" className="text-white hover:text-blue-400 font-medium">Dashboard</NavLink>
                        </li>
                    </ul>
                </div>

                <div className="navbar-end flex gap-2">
                    <NavLink to="/register" className="btn btn-ghost text-white hover:text-blue-400">Register</NavLink>
                    <NavLink to="/login" className="btn btn-primary">Login</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar