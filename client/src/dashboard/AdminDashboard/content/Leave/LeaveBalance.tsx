import { useState } from "react";
import { useGetAllBalancesQuery, useCreateLeaveBalanceMutation, useUpdateLeaveBalanceMutation, LeaveBalance } from "../../../../features/leave/leaveBalanceAPI";
import { toast } from "sonner";

export default function LeaveBalanceComponent() {
  const { data, isLoading, error, refetch } = useGetAllBalancesQuery();
  const balances = data ?? [];
  const [createBalance] = useCreateLeaveBalanceMutation();
  const [updateBalance] = useUpdateLeaveBalanceMutation();

  const [editing, setEditing] = useState<LeaveBalance | null>(null);
  const [form, setForm] = useState({ employee_id: 0, balance_days: 0 });

  const openCreate = () => { setEditing(null); setForm({ employee_id: 0, balance_days: 0 }); (document.getElementById("bal-modal") as HTMLDialogElement)?.showModal(); };
  const openEdit = (b: LeaveBalance) => { setEditing(b); setForm({ employee_id: b.employee_id, balance_days: b.balance_days }); (document.getElementById("bal-modal") as HTMLDialogElement)?.showModal(); };

  const save = async () => {
    try {
      if (!form.employee_id) return toast.error("Employee id required");
      if (editing) {
        await updateBalance({ balance_id: editing.balance_id, balance_days: form.balance_days }).unwrap();
      } else {
        await createBalance(form).unwrap();
      }
      toast.success("Saved");
      refetch();
      (document.getElementById("bal-modal") as HTMLDialogElement)?.close();
    } catch (err:any) { toast.error("Error saving"); }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Leave Balances</h2>
        <button className="btn btn-primary" onClick={openCreate}>Create</button>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead className="bg-gray-100"><tr>
            <th className="p-3">Balance ID</th><th className="p-3">Employee</th><th className="p-3">Days</th><th className="p-3">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={4}>Loading...</td></tr>}
            {error && <tr><td className="p-3 text-red-600" colSpan={4}>Error</td></tr>}
            {!isLoading && balances.length === 0 && <tr><td className="p-3" colSpan={4}>No balances</td></tr>}
            {balances.map((b: LeaveBalance) => (
              <tr key={b.balance_id} className="border-t">
                <td className="p-3">{b.balance_id}</td>
                <td className="p-3">{b.employee_id}</td>
                <td className="p-3">{b.balance_days}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="btn btn-sm" onClick={()=>openEdit(b)}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="bal-modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">{editing ? "Edit" : "Create"} Balance</h3>
          <div className="py-4 space-y-3">
            <input className="input w-full" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e)=>setForm(s=>({...s, employee_id: Number(e.target.value)}))}/>
            <input className="input w-full" placeholder="Balance days" type="number" value={form.balance_days} onChange={(e)=>setForm(s=>({...s, balance_days: Number(e.target.value)}))}/>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={()=> (document.getElementById("bal-modal") as HTMLDialogElement)?.close()}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
