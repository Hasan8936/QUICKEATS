export type DemandLevel = 'low' | 'medium' | 'high' | 'critical';

export function getDemandLevel(multiplier: number): DemandLevel {
  if (multiplier >= 1.8) return 'critical';
  if (multiplier >= 1.5) return 'high';
  if (multiplier > 1.0) return 'medium';
  return 'low';
}
