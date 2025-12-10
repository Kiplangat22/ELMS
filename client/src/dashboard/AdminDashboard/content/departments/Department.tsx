import { useState } from "react";
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from "../../../../features/departments/departmentAPI";
import { toast } from "sonner";

type Dept = { departmentid?: number; department_name: string; description?: string };

const unwrapData = (res: any) => res?.data ?? res ?? [];

export default function Departments() {
  const { data, isLoading, error, refetch } = useGetDepartmentsQuery();
  const [createDept] = useCreateDepartmentMutation();
  const [updateDept] = useUpdateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();

  const depts: Dept[] = unwrapData(data);

  const [editing, setEditing] = useState<Dept | null>(null);
  const [form, setForm] = useState({ department_name: "", description: "" });

  const openCreate = () => {
    setEditing(null);
    setForm({ department_name: "", description: "" });
    (document.getElementById("dept-modal") as HTMLDialogElement)?.showModal();
  };

  const openEdit = (d: Dept) => {
    setEditing(d);
    setForm({ department_name: d.department_name, description: d.description ?? "" });
    (document.getElementById("dept-modal") as HTMLDialogElement)?.showModal();
  };

  const save = async () => {
    try {
      if (!form.department_name.trim()) return toast.error("Name required");
      if (editing) {
        await updateDept({ id: editing.departmentid!, data: form }).unwrap();
        toast.success("Department updated");
      } else {
        await createDept(form).unwrap();
        toast.success("Department created");
      }
      refetch();
      (document.getElementById("dept-modal") as HTMLDialogElement)?.close();
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? "Error");
    }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete department?")) return;
    try {
      await deleteDept(id).unwrap();
      toast.success("Deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Delete failed");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Departments</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          New Department
        </button>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td className="p-3" colSpan={4}>Loading...</td></tr>
            )}
            {error && (
              <tr><td className="p-3 text-red-600" colSpan={4}>Error loading</td></tr>
            )}
            {!isLoading && depts.length === 0 && (
              <tr><td className="p-3" colSpan={4}>No departments</td></tr>
            )}
            {depts.map((d) => (
              <tr key={d.departmentid} className="border-t">
                <td className="p-3">{d.departmentid}</td>
                <td className="p-3">{d.department_name}</td>
                <td className="p-3">{d.description}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="btn btn-sm" onClick={() => openEdit(d)}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => remove(d.departmentid)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="dept-modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">{editing ? "Edit" : "New"} Department</h3>
          <div className="py-4 space-y-3">
            <input className="input w-full" placeholder="Name" value={form.department_name}
              onChange={(e) => setForm((s) => ({ ...s, department_name: e.target.value }))} />
            <textarea className="textarea w-full" placeholder="Description" value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={() => (document.getElementById("dept-modal") as HTMLDialogElement)?.close()}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
