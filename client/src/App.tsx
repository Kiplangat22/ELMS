import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './app/store';

import Error from './components/Error';
import { Register } from "./components/auth/Register";
import { Login } from './components/auth/Login';
import LandingPage from './pages/LandingPage';
import { AboutPage } from "./pages/AboutPage";
import { Verification } from './components/auth/Verification';
import Services from './components/Services';
import { Toaster } from 'sonner';

import AdminDashboard from './dashboard/AdminDashboard/content/AdminDashboard';
import UserDashboard from './dashboard/UserDashboard/content/userDashboard';

// import LeaveRequests from './dashboard/AdminDashboard/content/LeaveRequests';
// import ApproveLeave from './dashboard/AdminDashboard/content/ApproveLeave';
// import Employees from './dashboard/AdminDashboard/content/Employees';
// import Profile from './components/profile/Profile';

// import MyLeaves from './dashboard/UserDashboard/content/MyLeaves';
// import ApplyLeave from './dashboard/UserDashboard/content/ApplyLeave';

function App() {
  const user = useSelector((state: RootState) => state.user.user);
  // const isAdmin = user?.role === 'admin';
  // const isUser = user?.role === 'user';

  const isAdmin = true;  // Set true to see admin dashboard
  const isUser = false; 

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />
    },
    {
      path: '/about',
      element: <AboutPage />
    },
    {
      path: '/services',
      element: <Services />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/verify',
      element: <Verification />
    },
    {
      path: '*',
      element: <Error />
    },

    // admin dashboard
    {
      path: '/admin/dashboard/',
      element: isAdmin ? <AdminDashboard /> : <Login />,
      children: [
        {
          path: 'leave-requests',
          element: <h1>Leave Requests</h1> 
        },
        {
          path: 'approve-leave',
          element: <h1>Approve Leave</h1>
        },
        {
          path: 'employees',
          element: <h1>Employees</h1>
        },
        {
          path: 'analytics',
          element: <h1>Our analytics</h1>
        },
        {
          path: 'profile',
          element: <h1>Profile</h1>
        },
        {
          path: '',
          element: <h1>Leave Requests</h1> // default admin page
        }
      ]
    },

    // user dashboard
    {
      path: '/user/dashboard/',
      element: isUser ? <UserDashboard /> : <Login />,
      children: [
        {
          path: 'leave-requests',
          element: <h1>My Leaves Requests</h1>
        },
        {
          path: 'apply-leave',
          element: <h1>Apply Leave</h1>
        },
        {
          path: 'Profile',
          element: <h1>Profile</h1>
        },
        {
          path: '',
          element: <h1>My Leaves</h1> // default user page
        }
      ]
    }

  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='top-right' richColors />
    </>
  );
}

export default App;
