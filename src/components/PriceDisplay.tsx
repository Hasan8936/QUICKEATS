interface PriceDisplayProps {
  amount: number;
  showCurrency?: boolean;
  size?: 'sm' | 'md' | 'lg';
  strikethrough?: boolean;
}

export function PriceDisplay({ amount, showCurrency = true, size = 'md', strikethrough = false }: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span className={`font-semibold text-[var(--color-text-primary)] ${sizeClasses[size]} ${strikethrough ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
      {showCurrency && '₹'}
      {amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
    </span>
  );
}
