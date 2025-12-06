// userDrawer.tsx
import { Link } from "react-router"
import { userDrawerData } from "./drawerData"

export const UserDrawer = () => {
    return (
        <div>
            <h2 className="text-xl font-bold text-white p-4 border-b-2 border-gray-700">
                User Menu
            </h2>

            <ul>
                {userDrawerData.map((item) => (
                    <li key={item.id}>
                        <Link
                            to={item.link}
                            className="flex space-x-3 border-b border-transparent hover:border-blue-400 text-white hover:bg-gray-700 p-4"
                        >
                            <span className="text-xl">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
