import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { RootState } from './app/store';
// import type { UserState } from './features/auth/userSlice';

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
import ApproveLeave from './dashboard/AdminDashboard/content/ApproveLeave';

import LeaveRequests from './dashboard/AdminDashboard/content/LeaveRequests';
import Profile from './components/profile/Profile';

import MyLeaves from './dashboard/UserDashboard/content/MyLeaves';
import ApplyLeave from './pages/user/ApplyLeave';
import UserRequests from './pages/user/UserRequest';
import UserDashboardHome from './pages/user/UserDashboardHome';

// Admin components
import LeaveBalanceComponent from './dashboard/AdminDashboard/content/Leave/LeaveBalance';
import Users from './dashboard/AdminDashboard/content/users/users';
import Departments from './dashboard/AdminDashboard/content/departments/Department';
import LeaveTypes from './dashboard/AdminDashboard/content/Leave/LeaveType';
// import MyLeaves from './dashboard/UserDashboard/content/MyLeaves';

function App() {
  const user = useSelector((state: RootState) => state.user.user);
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const router = useMemo(() => createBrowserRouter([
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
          path: 'leave-balances',
          element: <LeaveBalanceComponent />
        },
        {
          path: 'leave-requests',
          element: <LeaveRequests />
        },
        {
          path: 'approve-leave',
          element: <ApproveLeave />
        },
        {
          path: 'employees',
          element: <Users />
        },
        {
          path: 'departments',
          element: <Departments />
        },
        {
          path: 'leave-types',
          element: <LeaveTypes />
        },
        {
          path: 'analytics',
          element: <h1>Our analytics</h1>
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: '',
          element: <LeaveRequests /> // default admin page
        }
      ]
    },

    // user dashboard
    {
      path: '/user/dashboard/',
      element: isUser ? <UserDashboard /> : <Login />,
      children: [
        {
          path: 'my-leaves',
          element: <MyLeaves />
        },
        {
          path: 'leave-requests',
          element: <UserRequests />
        },
        {
          path: 'apply-leave',
          element: <ApplyLeave />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: '',
          element: <UserDashboardHome /> // default user page
        }
      ]
    }

  ]), [isAdmin, isUser]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='top-right' richColors />
    </>
  );
}

export default App;
