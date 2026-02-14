export default function SkeletonLoader({ rows = 3, type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="skeleton h-3 w-20 mb-3" />
            <div className="skeleton h-7 w-16 mb-2" />
            <div className="skeleton h-2.5 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="skeleton h-5 w-40 mb-6" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 mb-4">
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-4 w-1/6" />
            <div className="skeleton h-4 w-1/6" />
            <div className="skeleton h-4 w-1/6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="skeleton h-5 w-48 mb-4" />
      <div className="skeleton h-64 w-full" />
    </div>
  );
}
