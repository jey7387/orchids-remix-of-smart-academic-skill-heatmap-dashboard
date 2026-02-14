export default function NotificationCard({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Performance Alerts</h3>
        <span className="ml-auto text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{alerts.length}</span>
      </div>
      <div className="space-y-2.5">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              alert.type === 'critical' ? 'bg-red-50/50 border-red-100' : 'bg-amber-50/50 border-amber-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${alert.type === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>
            </div>
            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
              alert.type === 'critical' ? 'text-red-600 bg-red-100' : 'text-amber-600 bg-amber-100'
            }`}>
              {alert.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
