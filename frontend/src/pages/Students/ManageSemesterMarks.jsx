import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents, getStudentSemesterMarksById, addStudentSemesterMarks } from '../../services/api';
import Loader from '../../components/Loader';

export default function ManageSemesterMarks() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [semesterMarks, setSemesterMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setSelectedSemester(1);
    
    try {
      const res = await getStudentSemesterMarksById(student.id);
      const marksBySemester = {};
      
      res.data.forEach(mark => {
        if (!marksBySemester[mark.semester]) {
          marksBySemester[mark.semester] = [];
        }
        marksBySemester[mark.semester].push(mark);
      });
      
      setSemesterMarks(marksBySemester);
    } catch (err) {
      console.error('Failed to load semester marks:', err);
    }
  };

  const handleAddMarks = async () => {
    if (!selectedStudent) return;
    
    // Prompt for 6 specific subject names and their marks
    const subjects = [];
    for (let i = 1; i <= 6; i++) {
      const subjectName = prompt(`Enter name for Subject ${i}:`, `Subject ${i}`);
      if (!subjectName) {
        alert('Please enter a name for all subjects');
        return;
      }
      
      const marks = prompt(`Enter marks for ${subjectName} (0-100):`, '75');
      if (!marks || isNaN(marks) || marks < 0 || marks > 100) {
        alert('Please enter valid marks between 0 and 100');
        return;
      }
      
      const marksNum = parseInt(marks);
      const grade = marksNum >= 90 ? 'A+' : marksNum >= 85 ? 'A' : marksNum >= 75 ? 'B+' : marksNum >= 65 ? 'B' : 'C';
      
      subjects.push({
        subject_name: subjectName,
        marks: marksNum,
        grade: grade
      });
    }
    
    setSaving(true);
    try {
      // Add the 6 subjects with their specific names and marks
      for (const subject of subjects) {
        const newSubject = {
          student_id: selectedStudent.id,
          semester: selectedSemester,
          subject_name: subject.subject_name,
          marks: subject.marks,
          max_marks: 100,
          grade: subject.grade
        };
        
        await addStudentSemesterMarks(newSubject);
      }
      
      // Reload marks for this student
      await handleSelectStudent(selectedStudent);
      
      alert(`Successfully added 6 subjects for Semester ${selectedSemester}`);
    } catch (err) {
      console.error('Failed to add marks:', err);
      alert('Failed to add marks. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomSubject = async () => {
    const subjectName = prompt('Enter subject name:');
    const marks = prompt('Enter marks (0-100):');
    
    if (!subjectName || !marks) return;
    
    setSaving(true);
    try {
      const newSubject = {
        student_id: selectedStudent.id,
        semester: selectedSemester,
        subject_name: subjectName,
        marks: parseInt(marks),
        max_marks: 100,
        grade: parseInt(marks) >= 90 ? 'A+' : parseInt(marks) >= 85 ? 'A' : parseInt(marks) >= 75 ? 'B+' : parseInt(marks) >= 65 ? 'B' : 'C'
      };
      
      await addStudentSemesterMarks(newSubject);
      await handleSelectStudent(selectedStudent);
      
      alert(`Added ${subjectName} with ${marks} marks`);
    } catch (err) {
      console.error('Failed to add subject:', err);
      alert('Failed to add subject. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manage Semester Marks</h2>
            <p className="text-slate-500 text-sm mt-1">Add and manage semester-wise subject marks for students</p>
          </div>
          <button
            onClick={() => navigate('/students/manage')}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition text-sm font-medium"
          >
            Back to Students
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Student</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedStudent?.id === student.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-medium text-sm">{student.name}</div>
                  <div className="text-xs text-slate-500">{student.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Semester Marks Management */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedStudent.name} - Semester Marks
                </h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddMarks}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition text-sm font-medium"
                  >
                    {saving ? 'Adding...' : 'Add 6 Subjects with Marks'}
                  </button>
                  <button
                    onClick={handleAddCustomSubject}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition text-sm font-medium"
                  >
                    {saving ? 'Adding...' : 'Add Custom Subject'}
                  </button>
                </div>
              </div>

              {/* Display existing marks for selected semester */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-slate-700">Semester {selectedSemester} Subjects</h4>
                
                {semesterMarks[selectedSemester] && semesterMarks[selectedSemester].length > 0 ? (
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
                        {semesterMarks[selectedSemester].map((mark, index) => (
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
                ) : (
                  <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                    <div className="text-lg font-medium">No subjects found for Semester {selectedSemester}</div>
                    <div className="text-sm mt-2">Click "Add 6 Subjects with Marks" to specify subject names and marks, or "Add Custom Subject" for individual entries</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="text-slate-500">
                <div className="text-lg font-medium mb-2">No Student Selected</div>
                <div className="text-sm">Select a student from the left panel to manage their semester marks</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
