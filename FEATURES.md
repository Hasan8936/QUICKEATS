# QuickEats - Feature Documentation

## 🏠 Home Page (`/`)

### Overview
The main food ordering page where users browse and select restaurants.

### Key Features

#### 1. Zone Selector
- **Desktop**: Sticky navbar dropdown
- **Mobile**: Full-width selector button
- Shows zone statistics inline
- Displays current surge multiplier
- Real-time partner count

#### 2. Restaurant Grid
- Responsive layout (1-3 columns)
- Restaurant cards with:
  - Image carousel (ready for implementation)
  - Name and cuisine type
  - Star rating with icon
  - Base and surge-adjusted delivery fees
  - Estimated delivery time
  - Surge badge (if applicable)
- Hover animations and transitions
- Click handler for restaurant detail

#### 3. Zone Statistics Cards
- **Available Partners**: Real-time count
- **Active Orders**: Current orders in zone
- **Est. Delivery**: Average wait time
- Cards update based on selected zone

#### 4. Surge Information Banner
- Only shows when surge active (multiplier > 1.0)
- Displays percentage increase
- Warning icon and color
- Educational text about demand

### Component Props
```typescript
// RestaurantCard
{
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
```

### Data Flow
```
Home → State (selectedZone) →
Filter restaurants →
Calculate surge →
Render cards →
Handle click → Navigate to detail page
```

---

## 👥 Partners Page (`/partners`)

### Overview
Delivery partner management dashboard. Shows all delivery professionals in a zone.

### Key Features

#### 1. Zone Filter
- Dropdown selector for all zones
- Updates partner list in real-time
- Shows zone name in header

#### 2. Status Filter
- All Partners (default)
- Available (🟢 green)
- Busy (🟡 yellow)
- Offline (⚫ gray)

#### 3. Statistics Cards
- **Total Partners**: Count in zone
- **Available**: Number ready to deliver
- **Busy**: Currently on delivery
- **Offline**: Not active
- Color-coded left border

#### 4. Partner Cards Grid
Each card displays:
- **Profile Section**:
  - Avatar image
  - Partner name
  - Zone assignment
  - Status badge with color
  
- **Rating Section**:
  - Star rating (filled)
  - Total deliveries count
  
- **Details Section**:
  - Vehicle type with icon
  - Total earnings
  - View details button

#### 5. Vehicle Icons
- Bike 🏍️
- Scooter 🛵
- Car 🚗

### Component Props
```typescript
interface DeliveryPartner {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  totalDeliveries: number;
  zone: string;
  status: 'available' | 'busy' | 'offline';
  earnings: number;
  image: string;
}
```

### Status Colors
```
Available → bg-green bg-opacity-10, text-green
Busy      → bg-orange bg-opacity-10, text-orange
Offline   → bg-gray bg-opacity-10, text-gray
```

---

## ⚡ Surge Control Panel (`/surge`)

### Overview
Administrative panel for configuring and monitoring surge pricing by zone.

### Key Features

#### 1. Zone Selection
- Interactive zone cards
- Shows zone name + current surge
- Active state with orange border
- Updates display in real-time

#### 2. Main Metrics Display
- **Surge Multiplier**: Current (e.g., 1.5x)
- **Demand Level**: Categorized (Low/Medium/High/Critical)
- **Orders in Zone**: Current active orders
- **Available Partners**: Count of free partners

#### 3. Configuration Sliders
Three interactive sliders to adjust pricing logic:

**a) Demand Ratio Threshold**
- Range: 1 to 10
- Label: "1 : X ratio"
- Represents: Orders per partner
- Default: 4

**b) Supply Threshold**
- Range: 5 to 50
- Label: "X partners minimum"
- Represents: Minimum required partners
- Default: 15

**c) Maximum Surge Multiplier**
- Range: 1.0x to 3.0x
- Label: "Up to X.Xx"
- Represents: Ceiling on price increase
- Default: 1.9x

#### 4. Save Configuration Button
- Full-width orange button
- Updates surge calculation logic
- (Ready for backend integration)

#### 5. Zone Comparison Table
All-zones-at-a-glance table:
- Zone Name
- Current Surge (badge)
- Demand Level (capitalized)
- Active Orders
- Available Partners (color-coded)
- Estimated Wait Time

#### 6. Educational Info Section
Box explaining pricing model:
- 1.0x - 1.2x range explanation
- 1.2x - 1.5x range explanation
- 1.5x - 1.8x range explanation
- 1.8x+ range explanation

### Real-time Preview
Sliders update calculations instantly without page reload.

---

## 📊 Analytics Dashboard (`/analytics`)

### Overview
Comprehensive business intelligence and metrics dashboard.

### Key Features

#### 1. Time Period Selector
- Today
- Week
- Month
- Year
- Selection state highlighted in orange

#### 2. KPI Cards (6 cards)
```
Total Orders          → 4,256 orders  (+12%)
Total Revenue         → ₹18.5L        (+18%)
Avg Order Value       → ₹435          (+5%)
Active Customers      → 8,234         (+8%)
Avg Delivery Time     → 32 min        (-3%)
Customer Rating       → 4.7 ⭐        (+2%)
```

Each card includes:
- Metric name
- Current value
- Trend percentage
- Trend icon (↑↓)
- Trend color (green/red)
- Metric icon

#### 3. Orders Trend Chart
- 12-day bar chart
- Interactive hover states
- Orange bars
- Responsive height
- Shows upward trajectory

#### 4. Revenue Breakdown
- Delivery Fees (33.5%)
- Subscription (22.2%)
- Surcharge (31.4%)
- Commissions (12.9%)
- Color-coded progress bars

#### 5. Zone Performance Table
Columns:
- Zone Name
- Orders (count)
- Revenue (formatted ₹)
- Surge (badge)
- Partners (color-coded)

Color coding for partners:
- Green: > 30 partners
- Orange: 15-30 partners
- Red: < 15 partners

#### 6. Recent Orders Table
Latest 5 orders with:
- Order ID (#ORD-XXXX)
- Customer name
- Restaurant name
- Amount (₹ formatted)
- Status (Delivered/In Transit/Preparing)
- Time (relative, e.g., "2 min ago")

Status badge colors:
- Delivered → Green
- In Transit → Blue
- Preparing → Orange

---

## 🛒 Cart Drawer (`CartDrawer.tsx`)

### Overview
Slide-in shopping cart from the right side of the screen.

### Key Features

#### 1. Header Section
- "Your Order" title
- Close (X) button
- Restaurant name (optional)

#### 2. Items List
For each cart item:
- Item name
- Price per unit
- Quantity controls:
  - Minus button (red)
  - Quantity display
  - Plus button (orange)
- Total for item (right-aligned)

Empty state:
- Empty cart icon
- Message: "Your cart is empty"

#### 3. Quantity Controls
- Plus/Minus buttons
- Responsive background color
- Prevent negative quantities
- Instant update

#### 4. Promo Code Section
- Text input placeholder: "Promo code"
- Apply button
- Ready for discount logic

#### 5. Bill Details Breakdown
```
Subtotal              ₹450
[if surge > 1]
Base Delivery Fee     ₹40 (strikethrough)
Surge Pricing (+50%)  ₹20 (orange highlight)
---
Delivery Fee          ₹60
Total                 ₹510 (bold)
```

#### 6. CTA Section
- Full-width "Place Order" button
- Disabled if cart empty
- Helpful subtext: "You'll save more with a bigger order"

#### 7. Animations
- Slide in from right (0.3s)
- Smooth backdrop fade
- All transitions smooth

### Props
```typescript
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  deliveryFee: number;
  surgeMultiplier: number;
  restaurantName?: string;
}
```

---

## 🎨 Component Library

### SurgeBadge
```tsx
<SurgeBadge 
  multiplier={1.5}
  showLabel={true}
  size="md"
/>
```
- Shows demand level color-coded badge
- Supports low/medium/high/critical
- Sizes: sm, md
- Optional label text

### PriceDisplay
```tsx
<PriceDisplay 
  amount={250}
  showCurrency={true}
  size="md"
  strikethrough={false}
/>
```
- Formats Indian rupees
- Supports strikethrough
- Sizes: sm, md, lg
- Locale-aware formatting

### RestaurantCard
Fully composed card for restaurant selection.

### CartDrawer
Full slide-in cart implementation.

---

## 🔧 Surge Pricing Algorithm

### Formula
```
demandRatio = ordersInZone / availablePartners

if demandRatio > 15:  surge = 1.9x ❌ Critical
elif demandRatio > 12: surge = 1.8x ⚠️ High
elif demandRatio > 8:  surge = 1.5x ⚠️ Medium
elif demandRatio > 4:  surge = 1.2x ⚡ Low
else:                  surge = 1.0x ✅ Normal
```

### Demand Level Classification
```
getDemandLevel(multiplier):
  1.8+ → 'critical'
  1.5+ → 'high'
  1.2+ → 'medium'
  < 1.2 → 'low'
```

### Final Amount Calculation
```
surgeDeliveryFee = baseDeliveryFee * surgeMultiplier
totalAmount = subtotal + surgeDeliveryFee
```

### Delivery Time Estimation
```
estimatedTime = baseTime * (1 + (surge - 1) * 0.5)

Example:
baseTime = 30 min
surge = 1.5x
result = 30 * (1 + (1.5-1) * 0.5) = 30 * 1.25 = 37.5 min
```

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- Single column layouts
- Full-width inputs
- Stack cards vertically
- Touch-friendly buttons (44px+)
- Bottom sticky CTAs
- Collapsed menus

### Tablet (640px - 1024px)
- 2-column grid
- Side-by-side comparisons
- Medium spacing

### Desktop (> 1024px)
- 3-4 column grid
- Horizontal tables
- Comfortable spacing

---

## 🎯 Interaction States

### Buttons
- **Default**: Neutral appearance
- **Hover**: Darker color, shadow lift
- **Active**: Scale down 95%
- **Disabled**: Opacity 50%, no pointer events

### Cards
- **Default**: Subtle shadow
- **Hover**: Enhanced shadow, border color change
- **Active**: Color highlight

### Inputs
- **Focus**: Ring outline (2px orange)
- **Valid**: Green border (ready for validation)
- **Error**: Red border (ready for error handling)

---

## 🚀 Integration Points

### Ready to Connect:
1. Restaurant detail page (onClick handler)
2. Cart drawer functionality (integrate with global state)
3. Order placement (checkout page)
4. Payment gateway integration
5. Order tracking page
6. Partner assignment logic
7. Real-time surge updates (WebSocket)
8. User authentication
9. Historical analytics data
10. Backend API endpoints

---

**End of Feature Documentation**
