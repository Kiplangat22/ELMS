import { Outlet } from "react-router-dom";
import Navbar from "../../../components/nav/Navbar";
import { AdminDrawer } from "../aside/AdminDrawer";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { Footer } from "../../../components/footer/Footer";

const AdminDashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen((prev) => !prev);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Navbar */}
            <Navbar />

            {/* Dashboard Header (Mobile Drawer Button) */}
            <div className="flex px-4 py-4 bg-gray-700 items-center">
                <button
                    className="mr-4 text-white text-2xl lg:hidden"
                    onClick={handleDrawerToggle}
                >
                    {drawerOpen ? <IoMdClose /> : <FaBars />}
                </button>

                <span className="text-white text-lg font-semibold">
                    Welcome to your Admin Dashboard
                </span>
            </div>

            {/* Layout */}
            <div className="flex flex-1">
                {/* Sidebar / Drawer */}
                <aside
                    className={`
                        fixed top-0 z-40 w-64 bg-gray-800 text-white 
                        ${drawerOpen ? "block" : "hidden"} 
                        lg:static lg:block lg:w-64
                    `}
                    style={{ minHeight: "100vh" }}
                >
                    {/* Close button for mobile */}
                    <button
                        className="absolute top-4 right-4 text-white text-3xl lg:hidden"
                        onClick={handleDrawerToggle}
                    >
                        <IoMdClose />
                    </button>

                    {/* Drawer Component */}
                    <AdminDrawer />
                </aside>

                {/* Dashboard Main Content */}
                <main className="flex-1 bg-gray-100 min-h-screen p-4">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
