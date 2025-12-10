import { useState } from "react";
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from "../../../../features/auth/userAPI";
import { toast } from "sonner";

const unwrap = (r:any) => r?.data ?? r ?? [];

export default function Users() {
  const { data, isLoading, error, refetch } = useGetUsersQuery();
  const users = unwrap(data);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [editing, setEditing] = useState<any | null>(null);
  const [role, setRole] = useState<string>("user");

  const openEdit = (u:any) => { setEditing(u); setRole(u.role ?? "user"); (document.getElementById("user-modal") as HTMLDialogElement)?.showModal(); };

  const save = async () => {
    if (!editing) return;
    try {
      await updateUser({ id: editing.id ?? editing.user_id, role }).unwrap();
      toast.success("Updated");
      refetch();
      (document.getElementById("user-modal") as HTMLDialogElement)?.close();
    } catch (err:any) { toast.error("Update failed"); }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete user?")) return;
    try { await deleteUser(id).unwrap(); toast.success("Deleted"); refetch(); } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100"><tr>
            <th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={5}>Loading...</td></tr>}
            {error && <tr><td className="p-3 text-red-600" colSpan={5}>Error</td></tr>}
            {!isLoading && users.length === 0 && <tr><td className="p-3" colSpan={5}>No users</td></tr>}
            {users.map((u:any) => (
              <tr key={u.id ?? u.user_id} className="border-t">
                <td className="p-3">{u.id ?? u.user_id}</td>
                <td className="p-3">{u.first_name ?? u.firstName} {u.last_name ?? u.lastName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="btn btn-sm" onClick={()=>openEdit(u)}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={()=>remove(u.id ?? u.user_id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="user-modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Update Role</h3>
          <div className="py-4">
            <label className="label"><span className="label-text">Role</span></label>
            <select className="select w-full" value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={()=> (document.getElementById("user-modal") as HTMLDialogElement)?.close()}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
