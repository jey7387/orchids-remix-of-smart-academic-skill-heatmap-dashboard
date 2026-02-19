import { useState, useEffect } from 'react';
import { getProfile, getAllUsers, deleteUser, getStudentSemesterMarks } from '../../services/api';
import Loader from '../../components/Loader';

export default function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [semesterMarks, setSemesterMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        // The API returns { user: {...} } so we need to extract the user data
        const userData = res.data.user || res.data;
        setProfile(userData);
        
        // Load semester marks if student
        if (user?.role === 'student') {
          try {
            const marksRes = await getStudentSemesterMarks();
            setSemesterMarks(marksRes.data || []);
          } catch (marksErr) {
            console.error('Semester marks load error:', marksErr);
            setSemesterMarks([]);
          }
        }
        
        if (user?.role === 'admin') {
          const usersRes = await getAllUsers();
          // The API returns { users: [...] } so we need to extract the users array
          const usersData = usersRes.data.users || usersRes.data;
          setUsers(Array.isArray(usersData) ? usersData : []);
        }
      } catch (err) {
        console.error('Profile load error:', err);
        // If profile fails, use the user prop as fallback
        setProfile(user);
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
            {(profile || user)?.name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{(profile || user)?.name}</h3>
            <p className="text-sm text-slate-500">{(profile || user)?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium capitalize">
              {(profile || user)?.role}
            </span>
          </div>
        </div>
        
        {/* Student Academic Information */}
        {user?.role === 'student' && (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Academic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Year</p>
                <p className="text-sm font-medium text-slate-900">{(profile || user)?.year || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Semester</p>
                <p className="text-sm font-medium text-slate-900">{(profile || user)?.semester || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Department</p>
                <p className="text-sm font-medium text-slate-900">{(profile || user)?.department || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Roll Number</p>
                <p className="text-sm font-medium text-slate-900">{(profile || user)?.roll_number || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Batch</p>
                <p className="text-sm font-medium text-slate-900">{(profile || user)?.batch || 'Not set'}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600">
                <strong>Note:</strong> Academic information can be updated by faculty. Contact your administrator if details are missing.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Semester Marks Section */}
      {user?.role === 'student' && semesterMarks.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Semester Marks</h3>
          <div className="space-y-4">
            {Object.entries(
              semesterMarks.reduce((acc, mark) => {
                if (!acc[mark.semester]) {
                  acc[mark.semester] = [];
                }
                acc[mark.semester].push(mark);
                return acc;
              }, {})
            ).map(([semester, marks]) => (
              <div key={semester} className="border border-slate-100 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Semester {semester}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left p-2 text-slate-500 font-medium">Subject</th>
                        <th className="text-center p-2 text-slate-500 font-medium">Marks</th>
                        <th className="text-center p-2 text-slate-500 font-medium">Max Marks</th>
                        <th className="text-center p-2 text-slate-500 font-medium">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map((mark, index) => (
                        <tr key={index} className="border-b border-slate-50">
                          <td className="p-2 text-slate-700">{mark.subject_name}</td>
                          <td className="p-2 text-center font-medium text-slate-900">{mark.marks}</td>
                          <td className="p-2 text-center text-slate-500">{mark.max_marks}</td>
                          <td className="p-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              mark.grade?.startsWith('A') ? 'bg-green-100 text-green-700' :
                              mark.grade?.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                              mark.grade?.startsWith('C') ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {mark.grade || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
