import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSkills, getStudentById, getStudentScores, addStudentScores } from '../../services/api';
import Loader from '../../components/Loader';

export default function EditStudentScores() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [student, setStudent] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillScores, setSkillScores] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      // Load student info
      const studentRes = await getStudentById(id);
      setStudent(studentRes.data.student);
      
      // Load available skills
      const skillsRes = await getSkills();
      setSkills(skillsRes.data);
      
      // Load existing scores
      const scoresRes = await getStudentScores(id);
      const existingScores = {};
      scoresRes.data.scores.forEach(score => {
        existingScores[score.skill_name] = score.total_score.toString();
      });
      
      // Initialize with existing scores
      const initialScores = {};
      skillsRes.data.forEach(skill => {
        initialScores[skill.name] = existingScores[skill.name] || '';
      });
      setSkillScores(initialScores);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (skillName, value) => {
    setSkillScores({
      ...skillScores,
      [skillName]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate at least one score
    const scores = Object.entries(skillScores).filter(([_, score]) => score !== '');
    if (scores.length === 0) {
      setError('Please enter at least one skill score');
      return;
    }
    
    // Validate score ranges
    for (const [skillName, score] of scores) {
      const numScore = parseInt(score);
      if (isNaN(numScore) || numScore < 0 || numScore > 100) {
        setError(`Invalid score for ${skillName}. Must be between 0 and 100`);
        return;
      }
    }
    
    setSaving(true);
    try {
      const formattedScores = scores.map(([skillName, score]) => ({
        skillName,
        score: parseInt(score)
      }));
      
      await addStudentScores(parseInt(id), formattedScores);
      setSuccess('Skill scores updated successfully!');
      
      setTimeout(() => {
        navigate('/students/manage');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update scores');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Edit Student Scores</h2>
        <p className="text-slate-500 text-sm mt-1">
          Update skill scores for <span className="font-medium">{student?.name}</span>
        </p>
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

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Skill Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  {skillScores[skill.name] && (
                    <div className="mt-1 text-xs text-slate-500">
                      Current: {skillScores[skill.name]}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/students/manage')}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Updating Scores...' : 'Update Scores'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
