import { useState } from "react";
import { useApplyLeaveMutation } from "../../features/leave/LeaveRequestAPI";
import { useGetLeaveTypesQuery } from "../../features/leave/leaveTypeAPI";

const ApplyLeave = () => {
    const [form, setForm] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const [applyLeave, { isLoading, error }] = useApplyLeaveMutation();
    const { data: leaveTypes, isLoading: loadingTypes } = useGetLeaveTypesQuery();

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Find the selected leave type ID
        const selectedType = leaveTypes?.data.find(type => type.leave_name === form.leaveType);
        if (!selectedType) {
            alert("Please select a valid leave type");
            return;
        }

        // Transform form data to match NewLeaveRequest type
        const leaveRequest = {
            leave_type_id: selectedType.leavetypeid,
            start_date: form.startDate,
            end_date: form.endDate,
            justification: form.reason
        };

        try {
            await applyLeave(leaveRequest).unwrap();
            alert("Leave applied successfully");
            // Reset form after successful submission
            setForm({
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: ""
            });
        } catch (err) {
            console.error("Failed to apply leave:", err);
            alert("Failed to apply leave. Please try again.");
        }
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
                    value={form.startDate}
                    onChange={handleChange}
                    className="p-2 w-full rounded bg-gray-700"
                    required
                />

                <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className="p-2 w-full rounded bg-gray-700"
                    required
                />

                <textarea
                    name="reason"
                    placeholder="Reason"
                    value={form.reason}
                    onChange={handleChange}
                    className="p-2 w-full rounded bg-gray-700"
                    required
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
