import { useState } from "react";
import { useApplyLeaveMutation } from "../../features/leave/leaveAPI";

const ApplyLeave = () => {
    const [form, setForm] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const [applyLeave, { isLoading }] = useApplyLeaveMutation();

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await applyLeave(form);
        alert("Leave applied successfully");
    };

    return (
        <div className="max-w-md bg-gray-800 p-6 rounded">
            <h1 className="text-xl font-bold mb-4">Apply Leave</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <select
                    name="leaveType"
                    onChange={handleChange}
                    className="p-2 w-full rounded bg-gray-700"
                >
                    <option value="">Select Leave Type</option>
                    <option value="Annual">Annual</option>
                    <option value="Sick">Sick</option>
                    <option value="Maternity">Maternity</option>
                </select>

                <input
                    name="startDate"
                    type="date"
                    onChange={handleChange}
                    className="p-2 w-full rounded bg-gray-700"
                />

                <input
                    name="endDate"
                    type="date"
                    onChange={handleChange}
                    className="p-2 w-full rounded bg-gray-700"
                />

                <textarea
                    name="reason"
                    placeholder="Reason"
                    onChange={handleChange}
                    className="p-2 w-full rounded bg-gray-700"
                />

                <button
                    disabled={isLoading}
                    className="bg-blue-600 w-full p-2 rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ApplyLeave;
