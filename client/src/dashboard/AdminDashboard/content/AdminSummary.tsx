import { useGetUsersQuery } from "../../../features/auth/userAPI";
import { useGetAllRequestsQuery, useGetPendingRequestsQuery } from "../../../features/leave/LeaveRequestAPI";
import { useGetDepartmentsQuery } from "../../../features/departments/departmentAPI";
import { useGetLeaveTypesQuery } from "../../../features/leave/leaveTypeAPI";
import { useGetAllBalancesQuery } from "../../../features/leave/leaveBalanceAPI";

const AdminSummary = () => {
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: allRequests, isLoading: requestsLoading } = useGetAllRequestsQuery();
  const { data: pendingRequests, isLoading: pendingLoading } = useGetPendingRequestsQuery();
  const { data: departments, isLoading: departmentsLoading } = useGetDepartmentsQuery();
  const { data: leaveTypes, isLoading: leaveTypesLoading } = useGetLeaveTypesQuery();
  const { data: leaveBalances, isLoading: balancesLoading } = useGetAllBalancesQuery();

  const employeesCount = users?.length || 0;
  const leaveRequestsCount = allRequests?.data?.length || 0;
  const pendingApprovalsCount = pendingRequests?.data?.length || 0;
  const departmentsCount = departments?.data?.length || 0;
  const leaveTypesCount = leaveTypes?.data?.length || 0;
  const leaveBalancesCount = leaveBalances?.length || 0;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-white shadow-xl" data-cy="employees-card">
          <div className="card-body">
            <h2 className="card-title">Total Employees</h2>
            <div className="text-3xl font-bold text-primary">
              {usersLoading ? <span className="loading loading-spinner" /> : employeesCount}
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-xl" data-cy="departments-card">
          <div className="card-body">
            <h2 className="card-title">Total Departments</h2>
            <div className="text-3xl font-bold text-secondary">
              {departmentsLoading ? <span className="loading loading-spinner" /> : departmentsCount}
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-xl" data-cy="leave-types-card">
          <div className="card-body">
            <h2 className="card-title">Total Leave Types</h2>
            <div className="text-3xl font-bold text-accent">
              {leaveTypesLoading ? <span className="loading loading-spinner" /> : leaveTypesCount}
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-xl" data-cy="leave-balances-card">
          <div className="card-body">
            <h2 className="card-title">Total Leave Balances</h2>
            <div className="text-3xl font-bold text-info">
              {balancesLoading ? <span className="loading loading-spinner" /> : leaveBalancesCount}
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-xl" data-cy="leave-requests-card">
          <div className="card-body">
            <h2 className="card-title">Total Leave Requests</h2>
            <div className="text-3xl font-bold text-warning">
              {requestsLoading ? <span className="loading loading-spinner" /> : leaveRequestsCount}
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-xl" data-cy="pending-approvals-card">
          <div className="card-body">
            <h2 className="card-title">Pending Approvals</h2>
            <div className="text-3xl font-bold text-error">
              {pendingLoading ? <span className="loading loading-spinner" /> : pendingApprovalsCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;