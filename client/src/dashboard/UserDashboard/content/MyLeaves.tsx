import { useSelector } from "react-redux";
import { useGetMyLeaveRequestsQuery, useCancelLeaveRequestMutation, TypeLeaveRequest } from "../../../features/leave/LeaveRequestAPI";
import { useGetEmployeeBalanceQuery } from "../../../features/leave/leaveBalanceAPI";
import { useGetLeaveTypesQuery, TypeLeaveType } from "../../../features/leave/leaveTypeAPI";
import { toast } from "sonner";
import type { RootState } from "../../../app/store";
export default function MyLeaves() {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: leaveRequestsData, isLoading: requestsLoading, refetch: refetchRequests } = useGetMyLeaveRequestsQuery();
  const { data: balanceData, isLoading: balanceLoading } = useGetEmployeeBalanceQuery(user?.user_id || 0, {
    skip: !user?.user_id
  });
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
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      try {
        await cancelRequest(requestId).unwrap();
        toast.success('Leave request cancelled successfully');
        refetchRequests();
      } catch (error) {
        toast.error('Failed to cancel leave request');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Leaves</h1>

      {/* Leave Balance Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
        {balanceLoading ? (
          <div className="text-center py-4">Loading balance...</div>
        ) : balance ? (
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{balance.balance_days}</div>
            <div className="text-gray-600">Available Leave Days</div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No balance information available</div>
        )}
      </div>

      {/* Leave Requests Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>

        {requestsLoading ? (
          <div className="text-center py-4">Loading requests...</div>
        ) : leaveRequests.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No leave requests found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request: TypeLeaveRequest) => (
                  <tr key={request.request_id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getLeaveTypeName(request.leave_type_id)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.total_days}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelRequest(request.request_id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm"
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
  );
}