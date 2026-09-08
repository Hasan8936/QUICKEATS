# QuickEats Data Implementation Guide

## 🎯 Overview

This guide explains how to use the Lucknow-based mock data in QuickEats, including all 10 zones, 20+ restaurants, and 20 delivery partners with realistic names and surge pricing.

---

## 📦 What's Included

### ✅ Zones (10 Total)
```
zone-1: Hazratganj (1.2x surge - low demand)
zone-2: Gomti Nagar (1.5x surge - medium demand)
zone-3: Indira Nagar (1.8x surge - high demand)
zone-4: Charbagh (1.9x surge - critical demand)
zone-5: Alambagh (1.3x surge)
zone-6: Aminabad (1.4x surge)
zone-7: Chowk (1.6x surge)
zone-8: Aliganj (1.2x surge)
zone-9: Mahanagar (1.35x surge)
zone-10: Rajajipuram (1.7x surge)
```

**Key Feature**: Each zone has demand/supply ratio reflected in surge multiplier, making the platform feel realistic.

### ✅ Restaurants (20+ Total)
**Famous Lucknow Restaurants:**
- Dastarkhwan (Awadhi cuisine - authentic Lucknow style)
- Tunday Kababi (Lucknowi Kebabs - iconic brand)
- Behrouz Biryani (Famous biryani chain)

**National Brands:**
- Domino's Pizza, Pizza Hut, KFC
- Barbeque Nation

**Local Specialties:**
- Chai Ki Dukan (Street food, busy status)
- Momos Corner (Tibetan dumplings)
- Sushi Paradise (Premium Japanese)

**Unique Features:**
- Each restaurant has 3+ menu items
- Prices in Indian Rupees (₹)
- Vegetarian indicators
- Spice levels (1-5)
- Status (open/busy/closed)

### ✅ Delivery Partners (20 Realistic Names)
```
Rajesh Kumar, Amit Sharma, Vikram Singh, Priya Verma, Arjun Patel,
Sanjay Das, Neha Gupta, Rohan Mishra, Divya Nair, Manoj Kumar,
Ravi Singh, Ananya Reddy, Karan Dhillon, Pooja Chauhan, Saurav Pandey,
Meera Singh, Nikhil Verma, Anjali Patel, Sachin Nair, Zoya Khan
```

**Features:**
- Status: available/busy/offline
- Performance: rating (4.5-4.9), delivery count, earnings
- Zone assignments (5 per zone for load balancing)
- Realistic earnings (₹50K - ₹220K monthly)

---

## 🔌 How to Use in Components

### 1. Home Page - Display Restaurants by Zone

```typescript
// src/app/page.tsx
import { zones, restaurants } from '@/entities/mockData';

export default function Home() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);

  // Filter restaurants for selected zone
  const zoneRestaurants = restaurants.filter(
    (r) => r.zone === selectedZone.id
  );

  return (
    <div>
      {/* Zone Selector */}
      {zones.map((zone) => (
        <button
          key={zone.id}
          onClick={() => setSelectedZone(zone)}
          className={selectedZone.id === zone.id ? 'active' : ''}
        >
          {zone.name}
          {zone.surgeMultiplier > 1 && (
            <SurgeBadge multiplier={zone.surgeMultiplier} />
          )}
        </button>
      ))}

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zoneRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            {...restaurant}
            surgeMultiplier={selectedZone.surgeMultiplier}
          />
        ))}
      </div>
    </div>
  );
}
```

### 2. Delivery Partners - Filter by Zone & Status

```typescript
// src/app/partners/page.tsx
import { zones, deliveryPartners } from '@/entities/mockData';

export default function PartnersPage() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter partners
  const zonePartners = deliveryPartners.filter((p) => {
    const isRightZone = p.zone === selectedZone.id;
    const isRightStatus =
      selectedStatus === 'all' || p.status === selectedStatus;
    return isRightZone && isRightStatus;
  });

  const stats = {
    available: zonePartners.filter((p) => p.status === 'available').length,
    busy: zonePartners.filter((p) => p.status === 'busy').length,
    offline: zonePartners.filter((p) => p.status === 'offline').length,
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div>Available: {stats.available}</div>
        <div>Busy: {stats.busy}</div>
        <div>Offline: {stats.offline}</div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zonePartners.map((partner) => (
          <PartnerCard key={partner.id} {...partner} />
        ))}
      </div>
    </div>
  );
}
```

### 3. Surge Control Panel - Update Zone Surge

```typescript
// src/app/surge/page.tsx
import { zones } from '@/entities/mockData';
import { calculateSurgeMultiplier } from '@/lib/surgeEngine';

export default function SurgePage() {
  const [selectedZone, setSelectedZone] = useState(zones[3]); // Charbagh (highest surge)
  const [config, setConfig] = useState({
    demandThreshold: 1.5,
    supplyThreshold: 20,
    maxSurge: 1.9,
  });

  // Calculate real-time surge based on zone data
  const estimatedSurge = calculateSurgeMultiplier(selectedZone);

  return (
    <div>
      {/* Zone Cards */}
      <div className="flex gap-4 overflow-x-auto">
        {zones.map((zone) => (
          <div
            key={zone.id}
            onClick={() => setSelectedZone(zone)}
            className="cursor-pointer p-4 rounded-lg border-2"
            style={{
              borderColor:
                selectedZone.id === zone.id ? '#FC8019' : '#E8E8E8',
            }}
          >
            <h3>{zone.name}</h3>
            <SurgeBadge multiplier={zone.surgeMultiplier} />
            <p>{zone.ordersInZone} orders</p>
            <p>{zone.deliveryPartnersAvailable} partners</p>
          </div>
        ))}
      </div>

      {/* Config Sliders */}
      <div className="mt-8">
        <label>Demand Threshold: {config.demandThreshold.toFixed(1)}</label>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={config.demandThreshold}
          onChange={(e) =>
            setConfig({
              ...config,
              demandThreshold: parseFloat(e.target.value),
            })
          }
        />

        <label>Supply Threshold (min partners): {config.supplyThreshold}</label>
        <input
          type="range"
          min="5"
          max="50"
          step="1"
          value={config.supplyThreshold}
          onChange={(e) =>
            setConfig({
              ...config,
              supplyThreshold: parseInt(e.target.value),
            })
          }
        />

        <label>Max Surge: {config.maxSurge.toFixed(1)}x</label>
        <input
          type="range"
          min="1.0"
          max="3.0"
          step="0.1"
          value={config.maxSurge}
          onChange={(e) =>
            setConfig({
              ...config,
              maxSurge: parseFloat(e.target.value),
            })
          }
        />
      </div>

      {/* Zone Comparison Table */}
      <table className="w-full mt-8">
        <thead>
          <tr>
            <th>Zone</th>
            <th>Surge</th>
            <th>Orders</th>
            <th>Partners</th>
            <th>Ratio</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr key={zone.id}>
              <td>{zone.name}</td>
              <td>
                <SurgeBadge multiplier={zone.surgeMultiplier} />
              </td>
              <td>{zone.ordersInZone}</td>
              <td>{zone.deliveryPartnersAvailable}</td>
              <td>
                {(
                  zone.ordersInZone / zone.deliveryPartnersAvailable
                ).toFixed(1)}
                :1
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 4. Cart Drawer - Calculate Final Price with Surge

```typescript
// src/components/CartDrawer.tsx
import { calculateFinalAmount } from '@/lib/surgeEngine';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  deliveryFee: number;
  surgeMultiplier: number;
  restaurantName: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  deliveryFee,
  surgeMultiplier,
  restaurantName,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const finalDeliveryFee = deliveryFee * surgeMultiplier;
  const totalAmount = calculateFinalAmount(subtotal, deliveryFee, surgeMultiplier);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 z-50">
      <h2 className="text-xl font-bold mb-4">Your Order</h2>
      <p className="text-sm text-gray-600 mb-6">{restaurantName}</p>

      {/* Items */}
      <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">Cart is empty</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span className="font-semibold">₹{item.price}</span>
            </div>
          ))
        )}
      </div>

      {/* Bill Breakdown */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {surgeMultiplier > 1 ? (
          <>
            <div className="flex justify-between text-gray-500 line-through">
              <span>Base Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-orange-600 font-semibold">
              <span>Delivery Fee (Surge {(surgeMultiplier * 100).toFixed(0)}%)</span>
              <span>₹{finalDeliveryFee.toFixed(0)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
        )}

        <div className="flex justify-between text-lg font-bold bg-orange-50 p-3 rounded">
          <span>Total</span>
          <span className="text-orange-600">₹{totalAmount.toFixed(0)}</span>
        </div>
      </div>

      <button
        onClick={() => alert(`Order placed for ₹${totalAmount.toFixed(0)}`)}
        disabled={items.length === 0}
        className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300"
      >
        Place Order
      </button>
    </div>
  );
}
```

---

## 📊 Data Query Examples

### Get All Restaurants in a Zone

```typescript
const getRestaurantsInZone = (zoneId: string) => {
  return restaurants.filter((r) => r.zone === zoneId);
};

// Usage
const hazratganjRestaurants = getRestaurantsInZone('zone-1');
// Returns: [Dastarkhwan, Tunday Kababi, Marksmen Café, ...]
```

### Get Available Delivery Partners

```typescript
const getAvailablePartners = (zoneId: string) => {
  return deliveryPartners.filter(
    (p) => p.zone === zoneId && p.status === 'available'
  );
};

// Usage
const availableInCharbagh = getAvailablePartners('zone-4');
// Returns: 3 available partners in Charbagh
```

### Calculate Demand-Supply Ratio

```typescript
const getDemandSupplyRatio = (zoneId: string) => {
  const zone = zones.find((z) => z.id === zoneId);
  if (!zone) return 0;
  return zone.ordersInZone / zone.deliveryPartnersAvailable;
};

// Usage
const ratio = getDemandSupplyRatio('zone-4'); // 234/12 = 19.5:1 (critical!)
```

### Get Zone Performance

```typescript
const getZonePerformance = () => {
  return zones
    .map((zone) => ({
      zone: zone.name,
      orders: zone.ordersInZone,
      partners: zone.deliveryPartnersAvailable,
      ratio: (zone.ordersInZone / zone.deliveryPartnersAvailable).toFixed(1),
      surge: zone.surgeMultiplier,
      demand: getDemandLevel(zone.surgeMultiplier),
    }))
    .sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio));
};

// Returns zones sorted by demand
```

---

## 🎨 UI Rendering Patterns

### Pattern 1: Zone Selector Dropdown

```typescript
<select value={selectedZone.id} onChange={(e) => setSelectedZone(zones.find(z => z.id === e.target.value))}>
  {zones.map((zone) => (
    <option key={zone.id} value={zone.id}>
      {zone.name} ({zone.surgeMultiplier}x surge)
    </option>
  ))}
</select>
```

### Pattern 2: Restaurant Card with Surge

```typescript
<div className="card">
  <img src={restaurant.image} alt={restaurant.name} />
  <h3>{restaurant.name}</h3>
  <p>{restaurant.cuisine}</p>
  {surgeMultiplier > 1 && <SurgeBadge multiplier={surgeMultiplier} />}
  <div className="flex justify-between">
    <div>
      <span className="line-through text-gray-400">₹{restaurant.deliveryFee}</span>
      <span className="font-bold">₹{(restaurant.deliveryFee * surgeMultiplier).toFixed(0)}</span>
    </div>
    <span>{restaurant.deliveryTime} min</span>
  </div>
</div>
```

### Pattern 3: Partner Status Badge

```typescript
<div className="partner-card">
  <img src={partner.image} alt={partner.name} />
  <div className="flex justify-between">
    <div>
      <h4>{partner.name}</h4>
      <p className="text-sm">{partner.zone}</p>
    </div>
    <span className={`badge badge-${partner.status}`}>
      {partner.status}
    </span>
  </div>
  <div className="flex justify-between text-sm text-gray-600">
    <span>⭐ {partner.rating}</span>
    <span>{partner.totalDeliveries} deliveries</span>
  </div>
</div>
```

---

## ✅ Implementation Checklist

- [x] All 10 zones are properly configured
- [x] 20+ restaurants with realistic names
- [x] All restaurants assigned to zones
- [x] 20 delivery partners with realistic names
- [x] Partners distributed across zones
- [x] Surge multipliers reflect demand/supply
- [x] All menu items have prices and metadata
- [x] Component integration examples provided
- [x] Query patterns documented
- [x] UI rendering patterns shown

---

## 🔄 Next Steps

1. **Replace Mock Data**: When backend is ready, replace imports with API calls:
   ```typescript
   // Before (mock)
   import { zones, restaurants } from '@/entities/mockData';

   // After (API)
   const zones = await fetch('/api/zones').then(r => r.json());
   const restaurants = await fetch('/api/restaurants').then(r => r.json());
   ```

2. **Add Real-time Updates**: Use WebSocket for live surge updates:
   ```typescript
   useEffect(() => {
     const ws = new WebSocket('ws://your-server/surge-updates');
     ws.onmessage = (e) => setZones(JSON.parse(e.data));
     return () => ws.close();
   }, []);
   ```

3. **Implement Filtering**: Add more granular filters (cuisine, price, delivery time)

4. **Add Search**: Implement full-text search across restaurants and areas

5. **Connect to Payment**: Integrate Razorpay/Stripe for real orders

---

**Created**: January 2, 2026
**Status**: Ready for Implementation ✅
