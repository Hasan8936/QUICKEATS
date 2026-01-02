# QuickEats - Swiggy-Inspired Food Delivery Platform

A **production-grade food delivery web application** with **dynamic surge pricing**, built with Next.js 13 App Router, TypeScript, and Tailwind CSS. This project demonstrates a complete **system design** for a Swiggy-like platform. [ https://quickeats-inky.vercel.app/](https://quickeats34.netlify.app/)

## 🎯 Project Overview

**QuickEats** is a full-featured food delivery platform showcasing:

- ✅ **Swiggy-like UI/UX** with clean, modern design
- ✅ **Dynamic Surge Pricing Engine** - real-time demand/supply based pricing
- ✅ **Multi-Zone Architecture** - zone-wise inventory and delivery partner management
- ✅ **Real-time Analytics Dashboard** - comprehensive business metrics
- ✅ **Delivery Partner Management** - partner status tracking and earnings
- ✅ **Responsive Design** - mobile-first, fully responsive
- ✅ **Production-Ready Code** - TypeScript, scalable architecture

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

## 🎨 Design System

### Color Palette (Swiggy-Inspired)

```css
--color-primary-orange: #FC8019        /* Primary action color */
--color-primary-orange-dark: #E46D0A   /* Hover state */
--color-primary-orange-light: #FFF1E8  /* Light background */

--color-text-primary: #282C3F          /* Main text */
--color-text-secondary: #686B78        /* Secondary text */
--color-text-muted: #93959F            /* Muted text */

--color-background: #F8F8F8            /* Page background */
--color-white: #FFFFFF                 /* Card background */
--color-border: #E8E8E8                /* Borders */

--color-success: #60B246               /* Success state */
--color-warning: #DB7C38               /* Warning state */
--color-danger: #EF4F5F                /* Danger state */
```

### Typography

- **Font Stack**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, etc.)
- **Headings**: Bold (800), Sizes 3xl → sm
- **Body**: Regular (400), Primary text color
- **Muted**: Secondary text muted color

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
| **Next.js 13** | App Router, SSR, API routes |
| **TypeScript** | Type safety, scalability |
| **Tailwind CSS** | Responsive utility-first styling |
| **Lucide Icons** | 400+ accessible SVG icons |
| **CSS Variables** | Dynamic theming |

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

## 📚 API Design (Reference)

### REST Endpoints (to be implemented)

```
GET    /api/v1/zones              # Get all zones
GET    /api/v1/zones/:id          # Get zone details
GET    /api/v1/restaurants        # List restaurants
GET    /api/v1/restaurants/:id    # Restaurant with menu
POST   /api/v1/orders             # Create order
GET    /api/v1/orders/:id         # Order status
GET    /api/v1/partners           # List delivery partners
POST   /api/v1/surge/config       # Update surge config
GET    /api/v1/analytics          # Analytics data
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
