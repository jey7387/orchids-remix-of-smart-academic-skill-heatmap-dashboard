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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={
                isStudent
                  ? stats.scores?.map((s) => ({
                      name: s.skill_name,
                      score: s.total_score,
                      classAvg: s.class_avg,
                    }))
                  : stats.topStudents?.map((s) => ({
                      name: s.name,
                      score: parseInt(s.avg_score),
                    }))
              }
              barGap={isStudent ? 4 : 0}
            >
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
              {isStudent ? (
                <>
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Your Score" barSize={28} />
                  <Bar dataKey="classAvg" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Class Average" barSize={28} />
                </>
              ) : (
                <Bar dataKey="score" radius={[6, 6, 0, 0]} name="Avg Score" barSize={40}>
                  {stats.topStudents?.map((_, i) => (
                    <Cell key={i} fill={['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'][i]} />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
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
