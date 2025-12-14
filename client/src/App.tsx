// App.tsx
import { createBrowserRouter } from 'react-router';
import { RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import type { RootState } from './app/store';

import Error from './components/Error';
import { Register } from "./components/auth/Register";
import { Login } from './components/auth/Login';
import LandingPage from './pages/LandingPage';
import { AboutPage } from "./pages/AboutPage";
import ServicesPage from './pages/ServicesPage';
import { Toaster } from 'sonner';
import { Verification } from './components/auth/Verification';
import AdminSummary from './dashboard/AdminDashboard/content/AdminSummary';
import Analytics from './dashboard/AdminDashboard/content/Analytics';

import AdminDashboard from './dashboard/AdminDashboard/content/AdminDashboard';
import UserDashboardLayout from './dashboard/UserDashboard/UserDashboardLayout';
import UserDashboardHome from './dashboard/UserDashboard/UserDashboardHome';
import ApproveLeave from './dashboard/AdminDashboard/content/ApproveLeave';
import LeaveRequests from './dashboard/AdminDashboard/content/LeaveRequests';
import Profile from './components/profile/Profile';
import MyLeaves from './dashboard/UserDashboard/content/MyLeaves';
import ApplyLeave from './pages/user/ApplyLeave';
import UserRequests from './pages/user/UserRequest';
import LeaveBalanceComponent from './dashboard/AdminDashboard/content/Leave/LeaveBalance';
import Users from './dashboard/AdminDashboard/content/users/users';
import Departments from './dashboard/AdminDashboard/content/departments/Department';
import LeaveTypes from './dashboard/AdminDashboard/content/Leave/LeaveType';

// Protected Route Wrapper
function ProtectedRoute({ user, role, children }: { user: any; role: string; children: React.ReactElement }) {
  if (!user || user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const user = useSelector((state: RootState) => state.user.user);

  const router = useMemo(() => createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/services', element: <ServicesPage /> },
    { path: '/register', element: <Register /> },
    { path: '/verify', element: <Verification /> },
    { path: '/login', element: <Login /> },
    { path: '/dashboard', element: user ? (user.role === 'admin' ? <Navigate to="/admin/dashboard/" replace /> : <Navigate to="/user/dashboard/" replace />) : <Navigate to="/login" replace /> },
    { path: '/admin/dashboard', element: <Navigate to="/admin/dashboard/" replace /> },
    { path: '/employees', element: <Navigate to="/admin/dashboard/users" replace /> },
    { path: '/leave-requests', element: <Navigate to="/admin/dashboard/leave-requests" replace /> },
    { path: '/leave-types', element: <Navigate to="/admin/dashboard/leave-types" replace /> },
    { path: '*', element: <Error /> },

    // Admin dashboard
    {
      path: '/admin/dashboard/',
      element: (
        <ProtectedRoute user={user} role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <AdminSummary /> }, // default admin page
        { path: 'leave-balances', element: <LeaveBalanceComponent /> },
        { path: 'leave-requests', element: <LeaveRequests /> },
        { path: 'approve-leave', element: <ApproveLeave /> },
        { path: 'users', element: <Users /> },
        { path: 'departments', element: <Departments /> },
        { path: 'leave-types', element: <LeaveTypes /> },
        { path: 'analytics', element: <Analytics /> },
        { path: 'profile', element: <Profile /> }
      ]
    },

    // User dashboard (clean, one main layout)
    {
      path: '/user/dashboard/',
      element: (
        <ProtectedRoute user={user} role="user">
          <UserDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <UserDashboardHome /> }, // default page when they open dashboard
        { path: 'my-leaves', element: <MyLeaves /> },
        { path: 'leave-requests', element: <UserRequests /> },
        { path: 'apply-leave', element: <ApplyLeave /> },
        { path: 'profile', element: <Profile /> },
      ]
    }

  ]), [user]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='top-right' richColors />
    </>
  );
}

export default App;
