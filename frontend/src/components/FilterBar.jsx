export default function FilterBar({ filters, onFilterChange }) {
  const { skills = [], categories = [], selectedSkill = '', selectedCategory = '' } = filters;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {categories.length > 0 && (
        <select
          value={selectedCategory}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer hover:border-slate-300"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      )}

      {skills.length > 0 && (
        <select
          value={selectedSkill}
          onChange={(e) => onFilterChange('skill', e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer hover:border-slate-300"
        >
          <option value="">All Skills</option>
          {skills.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )}

      {(selectedSkill || selectedCategory) && (
        <button
          onClick={() => { onFilterChange('skill', ''); onFilterChange('category', ''); }}
          className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
