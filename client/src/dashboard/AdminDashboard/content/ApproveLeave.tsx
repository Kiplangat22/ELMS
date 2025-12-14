import { useState } from "react";
import { useGetAllRequestsQuery, useApproveLeaveRequestMutation, useRejectLeaveRequestMutation } from "../../../features/leave/LeaveRequestAPI";
import { toast } from "sonner";

const unwrap = (r: any) => r?.data ?? r ?? [];

export default function ApproveLeave() {
  const { data, isLoading, error, refetch } = useGetAllRequestsQuery();
  const leaveRequests = unwrap(data);
  const [approveLeave] = useApproveLeaveRequestMutation();
  const [rejectLeave] = useRejectLeaveRequestMutation();

  const handleApprove = async (id: number) => {
    try {
      await approveLeave(id).unwrap();
      toast.success("Leave approved");
      refetch();
    } catch (err) {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectLeave(id).unwrap();
      toast.success("Leave rejected");
      refetch();
    } catch (err) {
      toast.error("Failed to reject");
    }
  };

  const pendingRequests = leaveRequests.filter((req: any) => req.status === 'Pending');

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Approve Leave Requests</h2>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Employee ID</th>
              <th className="p-3">Leave Type</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Days</th>
              <th className="p-3">Justification</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={8}>Loading...</td></tr>}
            {error && <tr><td className="p-3 text-red-600" colSpan={8}>Error loading requests</td></tr>}
            {!isLoading && pendingRequests.length === 0 && <tr><td className="p-3" colSpan={8}>No pending requests</td></tr>}
            {pendingRequests.map((req: any) => (
              <tr key={req.request_id} className="border-t">
                <td className="p-3">{req.request_id}</td>
                <td className="p-3">{req.employee_id}</td>
                <td className="p-3">{req.leave_type_id}</td>
                <td className="p-3">{req.start_date}</td>
                <td className="p-3">{req.end_date}</td>
                <td className="p-3">{req.total_days}</td>
                <td className="p-3">{req.justification}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-success" onClick={() => handleApprove(req.request_id)}>Approve</button>
                    <button className="btn btn-sm btn-error" onClick={() => handleReject(req.request_id)}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}