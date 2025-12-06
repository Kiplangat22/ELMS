// UserRequests.tsx
const UserRequests = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Leave Requests</h1>

            <p className="text-gray-700 mb-4">
                Below is your list of submitted leave requests. You can also apply for new leave.
            </p>

            {/* You can add a button here to open a modal for applying leave */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
                Apply for Leave
            </button>

            {/* Table placeholder */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">Your Requests</h2>

                <p className="text-gray-600">No leave requests available yet.</p>
                {/* Later you will replace this with: 
                - useGetMyLeavesQuery()
                - map through list
                */}
            </div>
        </div>
    );
};

export default UserRequests;
