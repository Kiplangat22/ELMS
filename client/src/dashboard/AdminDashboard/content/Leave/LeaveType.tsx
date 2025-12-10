import { useState } from "react";
import {
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
  type TypeLeaveType,
} from "../../../../features/leave/leaveTypeAPI";
import { toast } from "sonner";

type LT = TypeLeaveType;
const unwrap = (r: any) => r?.data ?? r ?? [];

export default function LeaveTypes() {
  const { data, isLoading, error, refetch } = useGetLeaveTypesQuery();
  const list: LT[] = unwrap(data);

  const [createLT] = useCreateLeaveTypeMutation();
  const [updateLT] = useUpdateLeaveTypeMutation();
  const [deleteLT] = useDeleteLeaveTypeMutation();

  const [editing, setEditing] = useState<LT | null>(null);
  const [form, setForm] = useState({ leave_name: "", description: "", max_days: "" });

  const openCreate = () => { setEditing(null); setForm({ leave_name: "", description: "", max_days: "" }); (document.getElementById("lt-modal") as HTMLDialogElement)?.showModal(); };
  const openEdit = (t: LT) => { setEditing(t); setForm({ leave_name: t.leave_name, description: t.description, max_days: String(t.max_days) }); (document.getElementById("lt-modal") as HTMLDialogElement)?.showModal(); };

  const save = async () => {
    try {
      if (!form.leave_name) return toast.error("Name required");
      if (!form.max_days || isNaN(Number(form.max_days)) || Number(form.max_days) <= 0) return toast.error("Valid max days required");
      const data = { ...form, max_days: Number(form.max_days) };
      if (editing) await updateLT({ id: editing.leavetypeid, data }).unwrap();
      else await createLT(data).unwrap();
      toast.success("Saved");
      refetch();
      (document.getElementById("lt-modal") as HTMLDialogElement)?.close();
    } catch (err: any) { toast.error(err?.data?.message ?? "Error"); }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete leave type?")) return;
    try { await deleteLT(id).unwrap(); toast.success("Deleted"); refetch(); } catch (e:any){ toast.error("Failed"); }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Leave Types</h2>
        <button className="btn btn-primary" onClick={openCreate}>New</button>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead className="bg-gray-100"><tr>
            <th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Max Days</th><th className="p-3">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={4}>Loading...</td></tr>}
            {error && <tr><td className="p-3 text-red-600" colSpan={4}>Error</td></tr>}
            {!isLoading && list.length === 0 && <tr><td className="p-3" colSpan={4}>No types</td></tr>}
            {list.map((t) => (
              <tr key={t.leavetypeid} className="border-t">
                <td className="p-3">{t.leavetypeid}</td>
                <td className="p-3">{t.leave_name}</td>
                <td className="p-3">{t.max_days}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="btn btn-sm" onClick={() => openEdit(t)}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => remove(t.leavetypeid)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="lt-modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">{editing ? "Edit" : "New"} Leave Type</h3>
          <div className="py-4 space-y-3">
            <input className="input w-full" placeholder="Name" value={form.leave_name} onChange={(e)=>setForm(s=>({...s, leave_name:e.target.value}))}/>
            <input className="input w-full" placeholder="Max days" type="number" value={form.max_days} onChange={(e)=>setForm(s=>({...s, max_days: e.target.value}))}/>
            <textarea className="textarea w-full" placeholder="Description" value={form.description} onChange={(e)=>setForm(s=>({...s, description:e.target.value}))}/>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={()=> (document.getElementById("lt-modal") as HTMLDialogElement)?.close()}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
