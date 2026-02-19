import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { getDashboardStats, getAlerts } from '../../services/api';
import Card from '../../components/Card';
import NotificationCard from '../../components/NotificationCard';
import StatusBadge from '../../components/StatusBadge';
import SkeletonLoader from '../../components/SkeletonLoader';

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

const getBarColor = (score) => {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#3b82f6';
  return '#ef4444';
};

export default function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getAlerts()
    ])
      .then(([statsRes, alertsRes]) => {
        setStats(statsRes.data);
        setAlerts(alertsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton h-7 w-48 mb-2" />
          <div className="skeleton h-4 w-64" />
        </div>
        <SkeletonLoader type="card" />
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <p className="text-sm font-medium">Failed to load dashboard</p>
      </div>
    );
  }

  const isStudent = user?.role === 'student';

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Welcome back, {user?.name}
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">
          {isStudent ? "Here's your academic performance overview" : 'Monitor student progress and class performance'}
        </p>
      </div>

      {/* Stats Cards */}
      {isStudent ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
          <Card title="Skills Tracked" value={stats.totalSkills} color="blue" icon="skills" />
          <Card
            title="Your Average"
            value={`${stats.averageScore}%`}
            color="purple"
            icon="average"
            trend={stats.averageScore - stats.classAverage}
            subtitle={`Class avg: ${stats.classAverage}%`}
          />
          <Card title="Strongest Skill" value={stats.bestSkill} color="green" icon="best" />
          <Card title="Needs Improvement" value={stats.weakestSkill} color="red" icon="weak" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 stagger-children">
          <Card title="Total Students" value={stats.totalStudents} color="blue" icon="students" />
          <Card title="Skills Tracked" value={stats.totalSkills} color="purple" icon="skills" />
          <Card title="Class Average" value={`${stats.averageScore}%`} color="green" icon="class" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
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
          
          {((isStudent && (!stats.scores || stats.scores.length === 0)) || (!isStudent && (!stats.topStudents || stats.topStudents.length === 0))) ? (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium">No data available</p>
                <p className="text-xs text-slate-400 mt-1">
                  {isStudent ? 'No skill scores recorded yet' : 'No student data available'}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full bg-white rounded-xl border border-slate-200 p-5 overflow-hidden">
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
              
              <div className="w-full" style={{ height: '350px' }}>
                {isStudent && stats.scores && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={stats.scores.map(s => ({
                        name: s.skill_name,
                        yourScore: Number(s.total_score),
                        classAverage: Number(s.class_avg || 0)
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 11, fill: '#64748b' }}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
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
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        iconType="rect"
                        iconSize={10}
                      />
                      <Bar dataKey="yourScore" fill="#3b82f6" name="Your Score" />
                      <Bar dataKey="classAverage" fill="#94a3b8" name="Class Average" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                
                {!isStudent && stats.topStudents && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={stats.topStudents.map(s => ({
                        name: s.name,
                        avgScore: Number(s.avg_score)
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 11, fill: '#64748b' }}
                      />
                      <Tooltip />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        iconType="rect"
                        iconSize={10}
                      />
                      <Bar dataKey="avgScore" fill="#3b82f6" name="Avg Score" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right panel - Alerts or Activity */}
        <div className="space-y-4">
          {alerts.length > 0 && <NotificationCard alerts={alerts} />}

          {/* Quick stats / Recent scores */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              {isStudent ? 'Score Breakdown' : 'Attention Required'}
            </h3>
            <div className="space-y-2.5">
              {isStudent ? (
                stats.scores?.slice(0, 5).map((s) => (
                  <div key={s.skill_name} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-slate-600 font-medium truncate flex-1">{s.skill_name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${s.total_score}%`,
                            backgroundColor: getBarColor(s.total_score),
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-8 text-right">{s.total_score}%</span>
                      <StatusBadge score={s.total_score} />
                    </div>
                  </div>
                ))
              ) : (
                stats.lowPerformers?.length > 0 ? (
                  stats.lowPerformers.map((lp, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-[10px] font-bold">
                          {lp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-700">{lp.name}</p>
                          <p className="text-[10px] text-slate-400">{lp.skill_name}</p>
                        </div>
                      </div>
                      <StatusBadge score={lp.total_score} />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">All students performing well</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
