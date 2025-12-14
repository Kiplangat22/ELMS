import { useState, useEffect } from "react";
import { useCreateLeaveRequestMutation, NewLeaveRequest } from "../../features/leave/LeaveRequestAPI";
import { useGetLeaveTypesQuery } from "../../features/leave/leaveTypeAPI";
import { toast } from "sonner";

export default function ApplyLeave() {
  const { data: leaveTypesData, isLoading: typesLoading } = useGetLeaveTypesQuery();
  const leaveTypes = leaveTypesData?.data || [];
  const [createLeaveRequest, { isLoading: isSubmitting }] = useCreateLeaveRequestMutation();

  const [form, setForm] = useState<NewLeaveRequest>({
    leave_type_id: 0,
    start_date: "",
    end_date: "",
    justification: "",
  });

  useEffect(() => {
    if (leaveTypes.length > 0 && form.leave_type_id === 0) {
      setForm(prev => ({ ...prev, leave_type_id: leaveTypes[0].leavetypeid }));
    }
  }, [leaveTypes, form.leave_type_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start_date || !form.end_date || !form.justification.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await createLeaveRequest(form).unwrap();
      toast.success("Leave request submitted successfully");
      setForm({ leave_type_id: leaveTypes[0]?.leavetypeid || 0, start_date: "", end_date: "", justification: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit leave request");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Apply for Leave</h1>
      <form className="space-y-4" onSubmit={handleSubmit} data-cy="apply-leave-form">
        <div>
          <label className="block font-semibold mb-1">Leave Type</label>
          <select
            name="leave_type_id"
            value={form.leave_type_id}
            onChange={handleChange}
            className="select select-bordered w-full"
            data-cy="leave-type-select"
            disabled={typesLoading}
          >
            {leaveTypes.map(type => <option key={type.leavetypeid} value={type.leavetypeid}>{type.leave_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="input input-bordered w-full"
            data-cy="start-date-input"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">End Date</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="input input-bordered w-full"
            data-cy="end-date-input"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Justification</label>
          <textarea
            name="justification"
            value={form.justification}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            data-cy="justification-textarea"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          data-cy="submit-leave-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? <span className="loading loading-spinner text-white" /> : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
