import { useState, useEffect } from 'react';
import { getProfile, getAllUsers, deleteUser } from '../../services/api';
import Loader from '../../components/Loader';

export default function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
        if (user?.role === 'admin') {
          const usersRes = await getAllUsers();
          setUsers(usersRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.role]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
        <p className="text-slate-500 text-sm mt-1">Your account details</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
            {profile?.name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{profile?.name}</h3>
            <p className="text-sm text-slate-500">{profile?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium capitalize">
              {profile?.role}
            </span>
          </div>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Manage Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 text-slate-500 font-medium">Name</th>
                  <th className="text-left p-3 text-slate-500 font-medium">Email</th>
                  <th className="text-left p-3 text-slate-500 font-medium">Role</th>
                  <th className="text-right p-3 text-slate-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100">
                    <td className="p-3 text-slate-700">{u.name}</td>
                    <td className="p-3 text-slate-500">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
