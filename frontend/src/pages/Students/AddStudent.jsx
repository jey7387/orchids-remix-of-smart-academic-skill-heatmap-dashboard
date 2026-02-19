import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent, getSkills, addStudentScores } from '../../services/api';
import Loader from '../../components/Loader';

export default function AddStudent() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skills, setSkills] = useState([]);
  
  // Student info
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  // Skill scores
  const [skillScores, setSkillScores] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await getSkills();
      setSkills(res.data);
      
      // Initialize skill scores with empty values
      const initialScores = {};
      res.data.forEach(skill => {
        initialScores[skill.name] = '';
      });
      setSkillScores(initialScores);
    } catch (err) {
      console.error('Failed to load skills:', err);
    }
  };

  const handleStudentInfoChange = (e) => {
    setStudentInfo({
      ...studentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleScoreChange = (skillName, value) => {
    setSkillScores({
      ...skillScores,
      [skillName]: value
    });
  };

  const validateStep1 = () => {
    if (!studentInfo.name || !studentInfo.email || !studentInfo.password) {
      setError('All fields are required');
      return false;
    }
    if (studentInfo.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const scores = Object.entries(skillScores).filter(([_, score]) => score !== '');
    if (scores.length === 0) {
      setError('Please enter at least one skill score');
      return false;
    }
    
    for (const [skillName, score] of scores) {
      const numScore = parseInt(score);
      if (isNaN(numScore) || numScore < 0 || numScore > 100) {
        setError(`Invalid score for ${skillName}. Must be between 0 and 100`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateStep2()) return;
    
    setLoading(true);
    try {
      // Step 1: Create student
      const studentRes = await createStudent(studentInfo.name, studentInfo.email, studentInfo.password);
      const newStudent = studentRes.data.student;
      
      // Step 2: Add skill scores
      const scores = Object.entries(skillScores)
        .filter(([_, score]) => score !== '')
        .map(([skillName, score]) => ({
          skillName,
          score: parseInt(score)
        }));
      
      if (scores.length > 0) {
        await addStudentScores(newStudent.id, scores);
      }
      
      setSuccess('Student and scores added successfully!');
      setTimeout(() => {
        navigate('/students/manage');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Add New Student</h2>
        <p className="text-slate-500 text-sm mt-1">
          {step === 1 ? 'Enter student information' : 'Enter skill scores for the student'}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${
              step >= 2 ? 'bg-blue-600' : 'bg-slate-200'
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
          {success}
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={studentInfo.name}
                onChange={handleStudentInfoChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Enter student's full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={studentInfo.email}
                onChange={handleStudentInfoChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Enter student's email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={studentInfo.password}
                onChange={handleStudentInfoChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Enter temporary password (min 6 characters)"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Skill Scores</h3>
            <p className="text-sm text-slate-600">
              Student: <span className="font-medium">{studentInfo.name}</span> ({studentInfo.email})
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {skills.map((skill) => (
              <div key={skill.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {skill.name}
                  {skill.category && (
                    <span className="text-xs text-slate-500 ml-1">({skill.category})</span>
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skillScores[skill.name] || ''}
                  onChange={(e) => handleScoreChange(skill.name, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                  placeholder="0-100"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Adding Student...' : 'Add Student'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
