import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents, deleteStudent, getStudentScores } from '../../services/api';
import Loader from '../../components/Loader';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showScores, setShowScores] = useState(false);
  const [studentScores, setStudentScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleViewScores = async (student) => {
    try {
      setSelectedStudent(student);
      setShowScores(true);
      const res = await getStudentScores(student.id);
      setStudentScores(res.data.scores);
    } catch (err) {
      console.error('Failed to load student scores:', err);
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This will also delete all their skill scores.`)) {
      return;
    }

    try {
      await deleteStudent(studentId);
      setStudents(students.filter(s => s.id !== studentId));
      if (showScores && selectedStudent?.id === studentId) {
        setShowScores(false);
        setSelectedStudent(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete student');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manage Students</h2>
            <p className="text-slate-500 text-sm mt-1">View, edit, and manage student records</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/students/semester-marks')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              Manage Semester Marks
            </button>
            <button
              onClick={() => navigate('/students/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Add New Student
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
            placeholder="Search students by name or email..."
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-700">Name</th>
                <th className="text-left p-4 text-sm font-medium text-slate-700">Email</th>
                <th className="text-left p-4 text-sm font-medium text-slate-700">Joined</th>
                <th className="text-center p-4 text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    {searchTerm ? 'No students found matching your search.' : 'No students found. Add your first student to get started.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{student.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-600">{student.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-600 text-sm">
                        {new Date(student.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewScores(student)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-xs font-medium"
                        >
                          View Scores
                        </button>
                        <button
                          onClick={() => navigate(`/students/edit/${student.id}`)}
                          className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Scores Modal */}
      {showScores && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Skill Scores - {selectedStudent.name}
                </h3>
                <button
                  onClick={() => setShowScores(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {studentScores.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No skill scores recorded for this student.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentScores.map((score) => (
                    <div key={score.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="font-medium text-slate-900 mb-1">{score.skill_name}</div>
                      {score.category && (
                        <div className="text-xs text-slate-500 mb-2">{score.category}</div>
                      )}
                      <div className="text-2xl font-bold text-blue-600">{score.total_score}%</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Added: {new Date(score.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => navigate(`/students/scores/${selectedStudent.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium mr-3"
              >
                Update Scores
              </button>
              <button
                onClick={() => setShowScores(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
