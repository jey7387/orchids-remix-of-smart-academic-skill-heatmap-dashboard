export function getScoreColor(score) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#eab308';
  return '#ef4444';
}

export function getScoreBg(score) {
  if (score >= 75) return 'bg-green-100 text-green-800';
  if (score >= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export function getScoreLabel(score) {
  if (score >= 75) return 'Strong';
  if (score >= 50) return 'Average';
  return 'Weak';
}

export function getStatusConfig(score) {
  if (score >= 75) return { label: 'Strong', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
  if (score >= 50) return { label: 'Average', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
  return { label: 'Weak', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' };
}
