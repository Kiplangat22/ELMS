import { useSelector } from "react-redux";
import { useGetMyLeaveRequestsQuery, useCancelLeaveRequestMutation, TypeLeaveRequest } from "../../../features/leave/LeaveRequestAPI";
import { useGetEmployeeBalanceQuery } from "../../../features/leave/leaveBalanceAPI";
import { useGetLeaveTypesQuery, TypeLeaveType } from "../../../features/leave/leaveTypeAPI";
import { toast } from "sonner";
import type { RootState } from "../../../app/store";

export default function MyLeaves() {
  const user = useSelector((state: RootState) => state.user.user);
  
  const { data: leaveRequestsData, isLoading: requestsLoading, refetch: refetchRequests } = useGetMyLeaveRequestsQuery();
  const { data: balanceData, isLoading: balanceLoading } = useGetEmployeeBalanceQuery(user?.user_id || 0, { skip: !user?.user_id });
  const { data: leaveTypesData } = useGetLeaveTypesQuery();
  const [cancelRequest] = useCancelLeaveRequestMutation();

  const leaveRequests = leaveRequestsData?.data || [];
  const balance = balanceData;
  const leaveTypes = leaveTypesData?.data || [];

  const getLeaveTypeName = (leaveTypeId: number) => {
    const type = leaveTypes.find((t: TypeLeaveType) => t.leavetypeid === leaveTypeId);
    return type?.leave_name || `Type ${leaveTypeId}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved": return "text-green-600 bg-green-100";
      case "rejected": return "text-red-600 bg-red-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "cancelled": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    if (window.confirm("Are you sure you want to cancel this leave request?")) {
      try {
        await cancelRequest(requestId).unwrap();
        toast.success("Leave request cancelled successfully");
        refetchRequests();
      } catch {
        toast.error("Failed to cancel leave request");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>

      {/* STAT CARDS */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
        <div className="stat">
          <div className="stat-title">Available Leave</div>
          <div className="stat-value text-primary">{balance?.balance_days ?? 0}</div>
          <div className="stat-desc">Days remaining</div>
        </div>
        <div className="stat">
          <div className="stat-title">Pending Requests</div>
          <div className="stat-value text-secondary">{leaveRequests.filter(r => r.status === "Pending").length}</div>
          <div className="stat-desc">Awaiting approval</div>
        </div>
        <div className="stat">
          <div className="stat-title">Used This Year</div>
          <div className="stat-value text-accent">{leaveRequests.filter(r => r.status === "Approved").reduce((sum, r) => sum + r.total_days, 0)}</div>
          <div className="stat-desc">Days taken</div>
        </div>
      </div>

      {/* LEAVE REQUESTS TABLE */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">My Leave Requests</h2>
          {requestsLoading ? (
            <p>Loading requests...</p>
          ) : leaveRequests.length === 0 ? (
            <p className="text-gray-500">No leave requests found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((req: TypeLeaveRequest) => (
                    <tr key={req.request_id}>
                      <td>{getLeaveTypeName(req.leave_type_id)}</td>
                      <td>{new Date(req.start_date).toLocaleDateString()}</td>
                      <td>{new Date(req.end_date).toLocaleDateString()}</td>
                      <td>{req.total_days}</td>
                      <td>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === "Pending" && (
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleCancelRequest(req.request_id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
