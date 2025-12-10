import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useUpdateUserMutation } from "../../features/auth/userAPI";
import { toast } from "sonner";

export default function Profile() {
  const reduxUser = useSelector((s: RootState) => s.user.user);
  const [user, setUser] = useState<any | null>(reduxUser ?? null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (!reduxUser) return;
    setUser(reduxUser);
    setForm({
      first_name: reduxUser.first_name ?? reduxUser.first_name ?? "",
      last_name: reduxUser.last_name ?? reduxUser.last_name ?? "",
      email: reduxUser.email ?? "",
    });
  }, [reduxUser]);

  if (!user) return <div className="p-6">Please login to view profile</div>;

  const save = async () => {
    try {
      await updateUser({ id: user.user_id ?? user.id, ...form }).unwrap();
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err:any) { toast.error("Update failed"); }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <div className="bg-white shadow rounded p-6">
        {!isEditing ? (
          <div>
            <div className="text-xl font-medium">{user.first_name} {user.last_name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            <div className="mt-4">
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <input className="input w-full" value={form.first_name} onChange={(e)=>setForm(f=>({...f, first_name: e.target.value}))}/>
            <input className="input w-full" value={form.last_name} onChange={(e)=>setForm(f=>({...f, last_name: e.target.value}))}/>
            <input className="input w-full" value={form.email} onChange={(e)=>setForm(f=>({...f, email: e.target.value}))}/>
            <div className="flex gap-2 mt-2">
              <button className="btn" onClick={()=>setIsEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={isUpdating}>{isUpdating? "Saving...":"Save"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
