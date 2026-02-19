import { useState, useEffect } from 'react';
import { getAllAdminUsers, deleteAdminUser } from '../../services/api';
import Loader from '../../components/Loader';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getAllAdminUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName, userRole) => {
    const confirmMessage = `Are you sure you want to delete ${userRole} "${userName}"? This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeleting(userId);
    try {
      await deleteAdminUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      alert(`${userRole} "${userName}" deleted successfully`);
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Loader />;

  const students = users.filter(user => user.role === 'student');
  const faculty = users.filter(user => user.role === 'faculty');

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
            <p className="text-slate-500 text-sm mt-1">View and delete users and faculty accounts</p>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div className="mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Students ({students.length})
          </h3>
          
          {students.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <div className="text-lg font-medium">No students found</div>
              <div className="text-sm mt-1">Students will appear here once they are added</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-3 text-slate-500 font-medium">Name</th>
                    <th className="text-left p-3 text-slate-500 font-medium">Email</th>
                    <th className="text-left p-3 text-slate-500 font-medium">Department</th>
                    <th className="text-left p-3 text-slate-500 font-medium">Roll Number</th>
                    <th className="text-center p-3 text-slate-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="p-3 text-slate-700 font-medium">{student.name}</td>
                      <td className="p-3 text-slate-600">{student.email}</td>
                      <td className="p-3 text-slate-600">{student.department || 'Not set'}</td>
                      <td className="p-3 text-slate-600">{student.roll_number || 'Not set'}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteUser(student.id, student.name, 'Student')}
                          disabled={deleting === student.id}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-medium"
                        >
                          {deleting === student.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Faculty Section */}
      <div className="mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Faculty ({faculty.length})
          </h3>
          
          {faculty.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <div className="text-lg font-medium">No faculty found</div>
              <div className="text-sm mt-1">Faculty members will appear here once they are added</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-3 text-slate-500 font-medium">Name</th>
                    <th className="text-left p-3 text-slate-500 font-medium">Email</th>
                    <th className="text-left p-3 text-slate-500 font-medium">Department</th>
                    <th className="text-center p-3 text-slate-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((facultyMember) => (
                    <tr key={facultyMember.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="p-3 text-slate-700 font-medium">{facultyMember.name}</td>
                      <td className="p-3 text-slate-600">{facultyMember.email}</td>
                      <td className="p-3 text-slate-600">{facultyMember.department || 'Not set'}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteUser(facultyMember.id, facultyMember.name, 'Faculty')}
                          disabled={deleting === facultyMember.id}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-medium"
                        >
                          {deleting === facultyMember.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
