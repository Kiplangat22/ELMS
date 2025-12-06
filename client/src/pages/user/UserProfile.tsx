// UserProfile.tsx
const UserProfile = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>

            <div className="bg-white p-6 rounded shadow-md">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4 mb-6">
                    <img
                        src="https://via.placeholder.com/100"
                        className="h-20 w-20 rounded-full border"
                        alt="User profile"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">John Doe</h2>
                        <p className="text-gray-600">User Role: Employee</p>
                    </div>
                </div>

                {/* User Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>Email:</strong> johndoe@example.com</p>
                    <p><strong>Department:</strong> HR</p>
                    <p><strong>Status:</strong> Active</p>
                    <p><strong>Verified:</strong> Yes</p>
                </div>

                {/* Edit profile button */}
                <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
