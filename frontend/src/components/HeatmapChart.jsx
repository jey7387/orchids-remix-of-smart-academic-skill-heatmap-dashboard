import { useState } from 'react';
import { getScoreColor } from '../utils/colors';
import { getStatusConfig } from '../utils/colors';

export default function HeatmapChart({ data }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        <p className="text-sm font-medium">No heatmap data available</p>
        <p className="text-xs mt-1">Data will appear once scores are recorded</p>
      </div>
    );
  }

  const students = [...new Set(data.map((d) => d.student_name))];
  const skills = [...new Set(data.map((d) => d.skill_name))];

  const scoreMap = {};
  data.forEach((d) => {
    scoreMap[`${d.student_name}-${d.skill_name}`] = d.total_score;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-3 min-w-[140px]">Student</th>
            {skills.map((skill) => (
              <th key={skill} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider p-3 min-w-[90px]">
                {skill}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student} className="border-t border-slate-100 table-row-hover">
              <td className="text-sm font-medium text-slate-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {student.charAt(0)}
                  </div>
                  <span className="truncate">{student}</span>
                </div>
              </td>
              {skills.map((skill) => {
                const score = scoreMap[`${student}-${skill}`] || 0;
                const color = getScoreColor(score);
                const status = getStatusConfig(score);
                const isHovered = hoveredCell === `${student}-${skill}`;
                return (
                  <td key={skill} className="p-1.5 text-center">
                    <div
                      className="relative rounded-lg py-2.5 px-2 text-white font-semibold text-sm cursor-default transition-all duration-200"
                      style={{
                        backgroundColor: color,
                        opacity: isHovered ? 1 : 0.85,
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      }}
                      onMouseEnter={() => setHoveredCell(`${student}-${skill}`)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {score}
                      {isHovered && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white rounded-lg text-xs whitespace-nowrap z-10 shadow-lg animate-fadeIn">
                          <p className="font-semibold">{student}</p>
                          <p className="text-slate-300">{skill}: {score}% - {status.label}</p>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-8 mt-6 pt-4 border-t border-slate-100 justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-6 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
          <span>Weak (&lt;50)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-6 h-3 rounded" style={{ backgroundColor: '#eab308' }} />
          <span>Average (50-74)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-6 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
          <span>Strong (75+)</span>
        </div>
      </div>
    </div>
  );
}
