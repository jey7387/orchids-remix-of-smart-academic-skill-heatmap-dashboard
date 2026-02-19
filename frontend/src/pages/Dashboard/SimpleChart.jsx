import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function SimpleChart({ user }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Hardcode test data to verify chart works
    const testData = [
      { name: 'AI', score: 57, classAvg: 60 },
      { name: 'JavaScript', score: 85, classAvg: 72 },
      { name: 'Python', score: 51, classAvg: 63 },
      { name: 'Java', score: 84, classAvg: 58 },
      { name: 'React', score: 81, classAvg: 72 }
    ];
    
    console.log('Setting chart data:', testData);
    setChartData(testData);
  }, []);

  console.log('Current chart data:', chartData);

  const isStudent = user?.role === 'student';

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Simple Chart Test</h2>
      
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {isStudent ? 'Skill Scores vs Class Average' : 'Top Students'}
        </h3>
        
        <div className="border-2 border-blue-500 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-600">Debug: Chart container (should be visible)</p>
          <p className="text-xs text-slate-500">Data length: {chartData.length}</p>
          <p className="text-xs text-slate-500">First item: {JSON.stringify(chartData[0])}</p>
        </div>
        
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: '400px', border: '2px solid red' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#3b82f6" name="Your Score" />
                <Bar dataKey="classAvg" fill="#94a3b8" name="Class Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No chart data available
          </div>
        )}
      </div>
    </div>
  );
}
