import { useGetUsersQuery } from "../../../features/auth/userAPI";
import { useGetAllRequestsQuery } from "../../../features/leave/LeaveRequestAPI";

const unwrap = (r: any) => r?.data ?? r ?? [];

export default function Analytics() {
  const { data: usersData } = useGetUsersQuery();
  const users = unwrap(usersData);

  const { data: requestsData } = useGetAllRequestsQuery();
  const requests = unwrap(requestsData);

  const totalUsers = users.length;
  const totalRequests = requests.length;
  const approvedRequests = requests.filter((r: any) => r.status === 'Approved').length;
  const pendingRequests = requests.filter((r: any) => r.status === 'Pending').length;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-blue-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Total Users</h3>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
        </div>

        <div className="card bg-green-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Total Leave Requests</h3>
            <p className="text-2xl font-bold">{totalRequests}</p>
          </div>
        </div>

        <div className="card bg-yellow-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Approved Requests</h3>
            <p className="text-2xl font-bold">{approvedRequests}</p>
          </div>
        </div>

        <div className="card bg-red-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Pending Requests</h3>
            <p className="text-2xl font-bold">{pendingRequests}</p>
          </div>
        </div>
      </div>
    </div>
  );
}