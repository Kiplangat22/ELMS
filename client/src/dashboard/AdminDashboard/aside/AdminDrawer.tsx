import { Link, useLocation } from "react-router-dom"
import { adminDrawerData } from "./drawerData"
import { useDispatch } from "react-redux"
import { logout } from "../../../features/auth/userSlice"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const AdminDrawer = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        dispatch(logout())
        toast.success("Logged out successfully")
        navigate("/login")
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-white p-4 border-b-2 border-gray-700 ">
                Dashboard Menu
            </h2>

            <ul>
                {
                    adminDrawerData.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.link}
                                className={`flex space-x-3 border-b-2 border-transparent hover:border-blue-400 text-white hover:bg-gray-700 p-4 ${
                                    location.pathname === item.link ? 'bg-blue-600 border-blue-400' : ''
                                }`}
                            >
                                <span className="text-xl text-gray-100 mb-2">{item.name}</span>
                            </Link>
                        </li>
                    ))
                }
            </ul>

            <div className="p-4">
                <button
                    onClick={handleLogout}
                    className="w-full btn btn-error text-white"
                    data-cy="logout-btn"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
