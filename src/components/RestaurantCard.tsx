import { Clock, Star } from 'lucide-react';
import { SurgeBadge } from './SurgeBadge';
import { PriceDisplay } from './PriceDisplay';

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  deliveryFee: number;
  deliveryTime: number;
  surgeMultiplier: number;
  onClick?: () => void;
}

export function RestaurantCard({
  id: _id,
  name,
  cuisine,
  image,
  rating,
  deliveryFee,
  deliveryTime,
  surgeMultiplier,
  onClick,
}: RestaurantCardProps) {
  const finalDeliveryFee = deliveryFee * surgeMultiplier;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      aria-label={`Open ${name} details`}
      tabIndex={0}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
      className="card-interactive overflow-hidden group transform transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 pointer-events-none" />
        
        {/* Surge Badge - Absolute Position */}
        {surgeMultiplier > 1 && (
          <div className="absolute top-3 right-3">
            <SurgeBadge multiplier={surgeMultiplier} size="sm" />
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-full shadow-md">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[var(--color-text-primary)] mb-1 text-lg">{name}</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-3">{cuisine}</p>

        {/* Pricing & Time */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <PriceDisplay amount={finalDeliveryFee} size="sm" />
              {surgeMultiplier > 1 && (
                <span className="text-xs text-[var(--color-text-muted)] line-through">
                  ₹{deliveryFee}
                </span>
              )}
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">Delivery fee</span>
          </div>

          <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{deliveryTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
