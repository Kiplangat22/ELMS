// UserDashboard.tsx
import { Outlet } from "react-router";
import { UserDrawer } from "../aside/userDrawer";

const UserDashboard = () => {
    return (
        <div className="flex h-screen bg-gray-900">
            
            <aside className="w-64 bg-gray-800">
                <UserDrawer />
            </aside>

            <main className="flex-1 p-6 overflow-y-auto text-white">
                <Outlet />
            </main>

        </div>
    )
}

export default UserDashboard;
