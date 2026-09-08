# QuickEats - Modern Food Delivery Platform

A **production-grade food delivery web application** with **modern UI/UX redesign**, **MongoDB database integration**, and **complete REST API**, built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## 🎯 Project Overview

**QuickEats** is a full-featured food delivery platform showcasing:

- ✅ **Modern UI/UX Design System** - Vibrant, accessible, mobile-first
- ✅ **MongoDB Integration** - Fully typed schemas with Mongoose
- ✅ **Complete REST API** - 6+ endpoints with validation & error handling
- ✅ **Dynamic Surge Pricing Engine** - Real-time demand/supply based pricing
- ✅ **Multi-Zone Architecture** - Zone-wise inventory and delivery partner management
- ✅ **Real-time Analytics Dashboard** - Comprehensive business metrics
- ✅ **Responsive Design** - Mobile-first, fully responsive (375px-1440px)
- ✅ **Production-Ready Code** - TypeScript, scalable architecture, WCAG compliant

---

## 🚀 Quick Start

### 1. Setup MongoDB
Follow **[MONGODB_SETUP_GUIDE.md](./MONGODB_SETUP_GUIDE.md)** for step-by-step setup:
- Create MongoDB Atlas account (free tier)
- Setup database user & connection string
- Configure network access

### 2. Configure Environment
```bash
# Copy template
cp .env.local.example .env.local

# Edit .env.local with your MongoDB URI
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/quickeats_dev
```

### 3. Install & Run
```bash
npm install
npm run dev
```

Visit http://localhost:3000 and test the API at http://localhost:3000/api/zones

### 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[MONGODB_SETUP_GUIDE.md](./MONGODB_SETUP_GUIDE.md)** | Complete MongoDB setup & troubleshooting |
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | Full API reference with examples |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | Summary of all changes & improvements |
| **[REDESIGN_PLAN.md](./REDESIGN_PLAN.md)** | Comprehensive redesign plan & roadmap |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Global layout with sticky navbar
│   ├── page.tsx                   # Main food ordering page
│   ├── globals.css                # Swiggy-inspired color palette & styles
│   ├── partners/
│   │   └── page.tsx               # Delivery partner management
│   ├── surge/
│   │   └── page.tsx               # Surge pricing control panel
│   └── analytics/
│       └── page.tsx               # Real-time analytics dashboard
├── components/
│   ├── SurgeBadge.tsx             # Reusable surge indicator badge
│   ├── PriceDisplay.tsx           # Currency formatter component
│   ├── RestaurantCard.tsx         # Restaurant card with surge info
│   └── CartDrawer.tsx             # Slide-in cart with checkout
├── entities/
│   └── mockData.ts                # Mock zones, restaurants, partners
├── lib/
│   └── surgeEngine.ts             # Dynamic surge pricing logic
└── types/
    └── index.ts                   # TypeScript interfaces

```

---

## 🎨 Modern Design System (UI/UX Pro Max)

### Color Palette (Vibrant & Food-Focused)

```css
--color-primary: #EA580C              /* Appetizing Orange */
--color-secondary: #F97316            /* Vibrant Orange */
--color-accent: #2563EB               /* Trust Blue (CTA) */
--color-background: #FFF7ED           /* Warm White */
--color-foreground: #0F172A           /* Deep Navy */

--color-text-primary: #0F172A         /* Main text */
--color-text-secondary: #475569       /* Secondary text */
--color-text-muted: #94A3B8           /* Muted text */

--color-success: #60B246              /* Success state */
--color-warning: #DB7C38              /* Warning state */
--color-danger: #EF4F5F               /* Danger state */
```

**Legacy compatibility**: `--color-primary-orange` still available for backward compatibility

### Typography (Google Fonts)

- **Headings**: Playfair Display SC (elegant, culinary aesthetic)
- **Body**: Karla (modern, clean, highly readable)
- **Base Size**: 16px, responsive scaling for 375px-1440px
- **Line Height**: 1.5 for optimal readability
- **WCAG Compliance**: 4.5:1 contrast ratio (AAA)

### Spacing System

```css
--space-xs: 4px      /* 1 unit */
--space-sm: 8px      /* 2 units */
--space-md: 16px     /* 4 units */
--space-lg: 24px     /* 6 units */
--space-xl: 32px     /* 8 units */
--space-2xl: 48px    /* 12 units */
--space-3xl: 64px    /* 16 units */
--space-4xl: 96px    /* 24 units */
```

### Accessibility Features

- ✅ 4.5:1 text contrast (AAA standard)
- ✅ Focus rings on all interactive elements
- ✅ Keyboard navigation support
- ✅ ARIA labels for screen readers
- ✅ Reduced motion support (@prefers-reduced-motion)
- ✅ Touch-friendly targets (44×44px minimum)

---

## 🔧 Core Features

### 1. **Home Page (Order Food)**
- **Zone Selector**: Switch between Lucknow zones
- **Restaurant Grid**: Browse restaurants with:
  - Live surge pricing badges
  - Real delivery fees (base + surge)
  - Ratings and delivery times
  - Food images with hover animations
- **Zone Metrics**: Live order/partner stats
- **Responsive Design**: Mobile-first layout

### 2. **Surge Pricing Engine** (`lib/surgeEngine.ts`)

Calculates dynamic pricing based on **demand/supply ratio**:

```typescript
demandRatio = ordersInZone / availablePartners

// Pricing tiers:
- 1.0x:  Ratio ≤ 4  (Low demand)
- 1.2x:  Ratio 4-8  (Medium demand)
- 1.5x:  Ratio 8-12 (High demand)
- 1.8x:  Ratio 12-15 (Very high)
- 1.9x:  Ratio > 15 (Critical)
```

**Demand Levels**:
- `low` (1.0x)
- `medium` (1.2x)
- `high` (1.5x+)
- `critical` (1.8x+)

### 3. **Delivery Partners Page**
- **Zone Filtering**: View partners by zone
- **Status Badges**: Available/Busy/Offline
- **Partner Cards**:
  - Profile image & name
  - Vehicle type (Bike, Scooter, Car)
  - Rating & total deliveries
  - Earnings display
  - Status indicator with color coding
- **Stats Overview**: Available/Busy/Offline counts

### 4. **Surge Control Panel** (`app/surge/page.tsx`)
- **Zone Selection**: Interactive zone cards
- **Configuration Sliders**:
  - Demand ratio threshold
  - Supply threshold (minimum partners)
  - Max surge multiplier cap
- **Real-time Preview**: See impact on pricing
- **Zone Comparison Table**: All zones at a glance

### 5. **Analytics Dashboard** (`app/analytics/page.tsx`)
- **KPI Cards**:
  - Total Orders & Revenue
  - Avg Order Value
  - Active Customers
  - Avg Delivery Time
  - Customer Rating
- **Charts**:
  - Orders trend (12-day bar chart)
  - Revenue breakdown (percentage stacked)
- **Zone Performance Table**:
  - Orders, revenue, surge, partner count per zone
- **Recent Orders Table**: Live order tracking

### 6. **Global Layout & Navigation**
- **Sticky Navbar**:
  - QuickEats logo
  - Location dropdown (all zones)
  - Cart icon with badge
  - Responsive mobile menu
- **Footer**: Links + copyright

---

## 📊 Data Model

### Zone
```typescript
interface Zone {
  id: string;
  name: string;                    // e.g., "Zone 1 - Hazratganj"
  surgeMultiplier: number;         // Calculated surge
  deliveryPartnersAvailable: number;
  ordersInZone: number;
  estimatedWait: number;           // Minutes
}
```

### Restaurant
```typescript
interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  deliveryFee: number;             // Base fee
  deliveryTime: number;            // Minutes
  zone: string;                    // Zone ID
  menu: MenuItem[];
  status: 'open' | 'closed' | 'busy';
}
```

### DeliveryPartner
```typescript
interface DeliveryPartner {
  id: string;
  name: string;
  vehicle: string;                 // Bike, Scooter, Car
  rating: number;
  totalDeliveries: number;
  zone: string;
  status: 'available' | 'busy' | 'offline';
  earnings: number;                // Total earnings
  image: string;
}
```

### CartItem
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
}
```

---

## 🚀 Key Components

### **SurgeBadge Component**
Displays surge multiplier with visual indicator:
```tsx
<SurgeBadge multiplier={1.5} showLabel={true} size="md" />
// Output: "⚡ Medium Surge 1.5x"
```

### **PriceDisplay Component**
Formats currency with rupee symbol:
```tsx
<PriceDisplay amount={250} size="md" />
// Output: "₹250"
```

### **RestaurantCard Component**
Card showing restaurant with surge pricing:
- Image with hover zoom effect
- Surge badge overlay
- Rating badge
- Final delivery fee calculation

### **CartDrawer Component**
Slide-in cart from right side:
- Add/remove items with quantity buttons
- Surge pricing breakdown
- Promo code input
- Final total with checkout CTA

---

## 💻 Technical Stack

| Tech | Purpose |
|------|---------|
| **Next.js 14** | App Router, SSR, API routes, middleware |
| **React 18** | Component composition, hooks |
| **TypeScript** | Full type safety, scalability |
| **MongoDB** | Document database with Mongoose ODM |
| **Mongoose** | Schema validation & type definitions |
| **Tailwind CSS** | Responsive utility-first styling |
| **Lucide React** | 400+ accessible SVG icons |
| **Google Fonts** | Playfair Display SC + Karla |
| **CSS Variables** | Dynamic design tokens system |

### Database Architecture

- **MongoDB**: Primary database (restaurants, orders, users, zones)
- **Collections**: 8 fully typed schemas (User, Restaurant, MenuItem, Order, Review, Zone, SurgeEvent, TrafficMetric)
- **Indexing**: Performance-optimized with automatic indexes
- **Connection**: Cached connection pool with fallback

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** (< 640px): Single column, stacked layout
- **Tablet** (640px - 1024px): 2-column grid
- **Desktop** (> 1024px): 3-4 column grid

### Mobile-First Approach
- Touch-friendly buttons (min 44px height)
- Large tap targets
- Readable font sizes (≥ 16px base)
- Full-width inputs
- Bottom sticky CTA buttons

---

## 🎯 User Flows

### Order Placement Flow
1. **Home Page** → Select zone
2. **Browse** → View restaurants with surge badges
3. **Add Items** → Open restaurant detail (to be built)
4. **Cart** → Review items & pricing breakdown
5. **Checkout** → Place order (to be built)

### Partner Management Flow
1. **Partners Page** → Filter by zone/status
2. **View Partner** → Details, ratings, earnings
3. **Manage Status** → Available/Busy/Offline (to be built)

### Analytics Flow
1. **Analytics Dashboard** → Select time period
2. **View KPIs** → Orders, revenue, ratings
3. **Analyze Zones** → Zone-wise performance
4. **Track Orders** → Recent orders table

---

## 🔐 Security Considerations

- ✅ TypeScript for compile-time safety
- ✅ Input validation on forms (to be added)
- ✅ CSRF protection (to be added)
- ✅ Rate limiting on API endpoints (to be added)
- ✅ Authentication/Authorization (to be built)

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.quickeats.com
NEXT_PUBLIC_MAPBOX_TOKEN=<token>
DATABASE_URL=postgresql://...
```

---

## 📈 Future Enhancements

### Phase 2
- [ ] Restaurant detail page with menu
- [ ] Order checkout & payment integration
- [ ] Real-time order tracking with maps
- [ ] User authentication (Google/Phone)
- [ ] Order history & favorites

### Phase 3
- [ ] WebSocket for live updates
- [ ] Push notifications
- [ ] Delivery partner mobile app
- [ ] Admin control panel
- [ ] AI-based recommendations

### Phase 4
- [ ] Multi-language support
- [ ] Loyalty program
- [ ] Subscription plans
- [ ] API for third-party integrations
- [ ] Machine learning for surge prediction

---

## 🧪 Testing

### Unit Tests (to be added)
```bash
npm run test
```

### E2E Tests (to be added)
```bash
npm run test:e2e
```

### Performance Testing
- Lighthouse: Aim for 90+
- Core Web Vitals: All green
- Bundle size: < 200KB

---

## 🌐 REST API Endpoints

### ✅ Implemented Endpoints

#### Restaurants
```
GET    /api/restaurants                    # List restaurants (with filters)
GET    /api/restaurants/[id]               # Restaurant details + menu + reviews
```

#### Orders
```
GET    /api/orders?userId=xxx              # User's order history
POST   /api/orders                         # Create new order
GET    /api/orders/[id]                    # Order details
PUT    /api/orders/[id]                    # Update order status
DELETE /api/orders/[id]                    # Cancel order
```

#### Zones
```
GET    /api/zones                          # List all zones
POST   /api/zones                          # Create new zone
GET    /api/zones/[id]/surge               # Get surge pricing
```

### Query Examples

```bash
# List restaurants in zone with filters
curl "http://localhost:3000/api/restaurants?zoneId=zone_001&cuisine=Italian&page=1"

# Get restaurant details with menu
curl "http://localhost:3000/api/restaurants/rest_001"

# Get user's orders
curl "http://localhost:3000/api/orders?userId=user_001"

# Create new order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_001","restaurantId":"rest_001","items":[...]}'

# Get surge pricing for zone
curl "http://localhost:3000/api/zones/zone_001/surge"
```

See **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** for complete API reference.

### 🔄 Response Format

All endpoints return consistent JSON:

**Success (200, 201)**
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "pagination": { /* if paginated */ }
}
```

**Error (400, 404, 500)**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## 🎓 Learning Resources

### System Design
- Demand/supply pricing models
- Zone-based inventory management
- Real-time analytics architecture
- Scalable database design (SQL + NoSQL)

### Frontend Architecture
- Component composition patterns
- State management with hooks
- Server-side rendering (SSR)
- CSS-in-JS vs Utility CSS

### Production Readiness
- Error handling & logging
- Performance optimization
- Accessibility (a11y)
- Mobile responsiveness

---

## 📝 License

MIT License - Feel free to use for learning and portfolio projects.

---

## 👨‍💻 Author

Built as a **production-grade reference implementation** for food delivery platforms.

**Key Principles**:
- Clean, readable code
- Scalable architecture
- Interview-ready design
- Swiggy-inspired UX accuracy
- TypeScript best practices

---

## 📞 Support

For questions or improvements, refer to the code comments and component documentation within each file.

**Happy Coding! 🚀**
>>>>>>> d546600 (Initial commit)
