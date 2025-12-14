import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/userSlice";
import { toast } from "sonner";
import { useGetEmployeeBalanceQuery } from "../../features/leave/leaveBalanceAPI";
import { useGetMyLeaveRequestsQuery } from "../../features/leave/LeaveRequestAPI";
import type { RootState } from "../../app/store";

const UserDashboardHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const { data: balance, isLoading: balanceLoading } = useGetEmployeeBalanceQuery(user?.user_id || 0, { skip: !user });
  const { data: requests, isLoading: requestsLoading } = useGetMyLeaveRequestsQuery();

  const availableLeave = balance?.balance_days || 0;
  const pendingRequests = requests?.data?.filter(r => r.status === 'Pending').length || 0;
  const recentRequests = requests?.data?.slice(0, 5) || []; // last 5

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">Employee Dashboard</h1>
        <button
          onClick={handleLogout}
          className="btn btn-error"
          data-cy="logout-btn"
        >
          Logout
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
        <div className="stat" data-cy="available-leave-card">
          <div className="stat-title">Available Leave</div>
          <div className="stat-value text-primary">
            {balanceLoading ? <span className="loading loading-spinner" /> : availableLeave}
          </div>
          <div className="stat-desc">Days remaining</div>
        </div>

        <div className="stat" data-cy="pending-requests-card">
          <div className="stat-title">Pending Requests</div>
          <div className="stat-value text-secondary">
            {requestsLoading ? <span className="loading loading-spinner" /> : pendingRequests}
          </div>
          <div className="stat-desc">Awaiting approval</div>
        </div>

        <div className="stat" data-cy="recent-requests-card">
          <div className="stat-title">Recent Requests</div>
          <div className="stat-value text-accent">
            {requestsLoading ? <span className="loading loading-spinner" /> : recentRequests.length}
          </div>
          <div className="stat-desc">Last 5 requests</div>
        </div>
      </div>

      {/* QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Apply for Leave</h2>
            <p>Submit a new leave request for approval</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/user/dashboard/apply-leave")}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">My Requests</h2>
            <p>View all your leave requests and status</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/user/dashboard/leave-requests")}
              >
                View All
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Leave Balance</h2>
            <p>Check your current leave balance</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-accent"
                onClick={() => navigate("/user/dashboard/my-leaves")}
              >
                Check Balance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHome;