import Navbar from "../components/nav/Navbar";
import { Footer } from "../components/footer/Footer";
import { useEffect, useState } from "react";
import { leaveTypeService } from "../services/leaveType.service";

const Dashboard = () => {
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const data = await leaveTypeService.getAll();
                setLeaveTypes(data);
            } catch (error) {
                console.error("Failed to fetch leave types:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveTypes();
    }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen p-8 bg-base-200">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Employee Dashboard</h1>

                {/* STAT CARDS */}
                <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
                    <div className="stat">
                        <div className="stat-title">Available Leave</div>
                        <div className="stat-value text-primary">21</div>
                        <div className="stat-desc">Days remaining</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">Pending Requests</div>
                        <div className="stat-value text-secondary">3</div>
                        <div className="stat-desc">Awaiting approval</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">Used This Year</div>
                        <div className="stat-value text-accent">8</div>
                        <div className="stat-desc">Days taken in 2025</div>
                    </div>
                </div>

                {/* QUICK ACTION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Apply for Leave</h2>
                            <p>Submit a new leave request for approval</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">Apply Now</button>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">My Requests</h2>
                            <p>View all your leave requests and status</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-secondary">View All</button>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Leave Balance</h2>
                            <p>Check your current leave balance</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-accent">Check Balance</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECENT ACTIVITY TABLE */}
                <div className="card bg-base-100 shadow-xl mb-10">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">Recent Activity</h2>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Date</th>
                                        <th>Leave Type</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>1</th>
                                        <td>2025-01-15</td>
                                        <td>Annual Leave</td>
                                        <td>3 days</td>
                                        <td><span className="badge badge-warning">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <th>2</th>
                                        <td>2024-12-20</td>
                                        <td>Sick Leave</td>
                                        <td>2 days</td>
                                        <td><span className="badge badge-success">Approved</span></td>
                                    </tr>
                                    <tr>
                                        <th>3</th>
                                        <td>2024-11-05</td>
                                        <td>Annual Leave</td>
                                        <td>5 days</td>
                                        <td><span className="badge badge-success">Approved</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* LEAVE TYPES FETCHED FROM BACKEND */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">Available Leave Types</h2>

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Type Name</th>
                                            <th>Description</th>
                                            <th>Default Days</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaveTypes.map((lt) => (
                                            <tr key={lt.leave_type_id}>
                                                <td>{lt.leave_type_id}</td>
                                                <td>{lt.type_name}</td>
                                                <td>{lt.description || "—"}</td>
                                                <td>{lt.default_days ?? "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Dashboard;
