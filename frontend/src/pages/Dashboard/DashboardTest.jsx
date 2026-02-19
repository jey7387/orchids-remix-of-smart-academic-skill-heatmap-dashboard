import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { getDashboardStats } from '../../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-slate-600">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-semibold">{p.value}%</span>
        </p>
      ))}
    </div>
  );
};

export default function DashboardTest({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(res => {
        console.log('Dashboard stats received:', res.data);
        console.log('Student scores:', res.data.scores);
        setStats(res.data);
      })
      .catch(err => {
        console.error('Dashboard error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="p-8">No stats data</div>;
  }

  const isStudent = user?.role === 'student';
  
  // Log chart data for debugging
  const chartData = isStudent
    ? (stats.scores || []).map((s) => ({
        name: s.skill_name,
        score: s.total_score,
        classAvg: s.class_avg,
      }))
    : [];

  console.log('Chart data:', chartData);
  console.log('Chart data length:', chartData.length);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Test</h2>
        <p className="text-slate-500 text-sm mt-1">Debug chart rendering</p>
      </div>

      {/* Debug Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Debug Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>User Role:</strong> {user?.role}
          </div>
          <div>
            <strong>Is Student:</strong> {isStudent ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Total Skills:</strong> {stats.totalSkills}
          </div>
          <div>
            <strong>Scores Array:</strong> {stats.scores?.length || 0} items
          </div>
        </div>
        
        <div className="mt-4">
          <strong>Chart Data Preview:</strong>
          <pre className="mt-2 p-3 bg-slate-50 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(chartData.slice(0, 3), null, 2)}
          </pre>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {isStudent ? 'Skill Scores vs Class Average' : 'Top Students'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isStudent ? 'Your performance compared to class' : 'Based on average scores'}
            </p>
          </div>
        </div>
        
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center">
              <p className="text-sm font-medium">No chart data available</p>
              <p className="text-xs text-slate-400 mt-1">
                {isStudent ? 'No skill scores recorded yet' : 'No student data available'}
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Your Score" barSize={28} />
              <Bar dataKey="classAvg" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Class Average" barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
