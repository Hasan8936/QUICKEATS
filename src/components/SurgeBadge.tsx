import { AlertCircle, TrendingUp } from 'lucide-react';
import { getDemandLevel } from '@/lib/surgeEngine';

interface SurgeBadgeProps {
  multiplier: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function SurgeBadge({ multiplier, showLabel = true, size = 'md' }: SurgeBadgeProps) {
  if (multiplier <= 1.0) return null;

  const demandLevel = getDemandLevel(multiplier);
  
  const colorMap = {
    low: 'bg-[#F0F9FF] text-[var(--color-text-primary)] border-blue-200',
    medium: 'bg-[#FFF4E6] text-[var(--color-warning)] border-[var(--color-warning)]',
    high: 'bg-[#FFE8EC] text-[var(--color-danger)] border-[var(--color-danger)]',
    critical: 'bg-red-100 text-red-700 border-red-300',
  };

  const labelMap = {
    low: 'Low Surge',
    medium: 'Medium Surge',
    high: 'High Surge',
    critical: 'Critical Surge',
  };

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-1.5 py-0.5' 
    : 'text-xs px-2 py-1';

  return (
    <div className={`inline-flex items-center gap-1 rounded-full border font-semibold ${colorMap[demandLevel]} ${sizeClasses}`}>
      {demandLevel === 'critical' ? (
        <AlertCircle className="w-3 h-3" />
      ) : (
        <TrendingUp className="w-3 h-3" />
      )}
      {showLabel && <span>{labelMap[demandLevel]}</span>}
      <span className="font-bold">{multiplier.toFixed(1)}x</span>
    </div>
  );
}
