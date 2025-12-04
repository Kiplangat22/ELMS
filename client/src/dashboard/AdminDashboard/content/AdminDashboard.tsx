
import { Outlet } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import { AdminDrawer } from "../aside/AdminDrawer"; 
import{ FaBars } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';




const AdminDashboard = () => {
    return (
        <div>
            <Navbar />

            <div>
                <aside>
                    AdminDrawer
                </aside>
                
                <main>
                    <Outlet />
                </main>

            </div>
        </div>  
    )
}

export default AdminDashboard;
            