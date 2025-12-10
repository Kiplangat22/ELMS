import { useState } from "react";
import { useGetAllLeaveRequestsQuery } from "../../../features/leave/LeaveRequestAPI";
import { toast } from "sonner";

const unwrap = (r: any) => r?.data ?? r ?? [];

export default function LeaveRequests() {
  const { data, isLoading, error, refetch } = useGetAllLeaveRequestsQuery();
  const leaveRequests = unwrap(data);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Leave Requests</h2>

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
              <th className="p-3">Status</th>
              <th className="p-3">Justification</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={8}>Loading...</td></tr>}
            {error && <tr><td className="p-3 text-red-600" colSpan={8}>Error loading requests</td></tr>}
            {!isLoading && leaveRequests.length === 0 && <tr><td className="p-3" colSpan={8}>No leave requests</td></tr>}
            {leaveRequests.map((req: any) => (
              <tr key={req.request_id} className="border-t">
                <td className="p-3">{req.request_id}</td>
                <td className="p-3">{req.employee_id}</td>
                <td className="p-3">{req.leave_type_id}</td>
                <td className="p-3">{req.start_date}</td>
                <td className="p-3">{req.end_date}</td>
                <td className="p-3">{req.total_days}</td>
                <td className="p-3">
                  <span className={`badge ${req.status === 'Approved' ? 'badge-success' : req.status === 'Rejected' ? 'badge-error' : 'badge-warning'}`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-3">{req.justification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}