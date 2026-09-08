# QuickEats API Documentation

## Base URL
```
http://localhost:3000/api
```

## Response Format
All endpoints return JSON with the following structure:

### Success Response
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Restaurants Endpoints

### 1. List Restaurants
**GET** `/restaurants`

**Query Parameters:**
- `zoneId` (optional): Filter by zone ID
- `cuisine` (optional): Filter by cuisine type
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Example Request:**
```bash
GET /api/restaurants?zoneId=zone_001&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "rest_001",
      "name": "Pizza Palace",
      "cuisine": ["Italian", "Pizza"],
      "image": "https://example.com/pizza.jpg",
      "rating": 4.5,
      "reviewCount": 250,
      "deliveryFee": 50,
      "deliveryTime": 30,
      "minOrder": 200,
      "zoneId": "zone_001",
      "status": "open",
      "location": {
        "lat": 28.7041,
        "lng": 77.1025,
        "address": "123 Main St, New Delhi"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### 2. Get Restaurant Details
**GET** `/restaurants/[id]`

**Path Parameters:**
- `id`: Restaurant ID

**Example Request:**
```bash
GET /api/restaurants/rest_001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "rest_001",
    "name": "Pizza Palace",
    "description": "Authentic Italian pizzas and pastas",
    "cuisine": ["Italian", "Pizza"],
    "image": "https://example.com/pizza.jpg",
    "rating": 4.5,
    "reviewCount": 250,
    "deliveryFee": 50,
    "deliveryTime": 30,
    "minOrder": 200,
    "zoneId": "zone_001",
    "status": "open",
    "location": {
      "lat": 28.7041,
      "lng": 77.1025,
      "address": "123 Main St, New Delhi"
    },
    "hours": [
      {
        "day": "Monday",
        "open": "10:00",
        "close": "23:00"
      }
    ],
    "menu": [
      {
        "_id": "item_001",
        "name": "Margherita Pizza",
        "price": 250,
        "category": "Pizza",
        "description": "Classic cheese pizza with fresh basil",
        "image": "https://example.com/margherita.jpg",
        "isVeg": true,
        "availability": true
      }
    ],
    "reviews": [
      {
        "_id": "review_001",
        "userId": "user_001",
        "rating": 5,
        "comment": "Amazing pizza!",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## Orders Endpoints

### 1. Get User Orders
**GET** `/orders`

**Query Parameters:**
- `userId` (required): User ID
- `status` (optional): Filter by status (pending, confirmed, preparing, out_for_delivery, delivered, cancelled)

**Example Request:**
```bash
GET /api/orders?userId=user_001&status=delivered
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_001",
      "userId": "user_001",
      "restaurantId": "rest_001",
      "items": [
        {
          "menuItemId": "item_001",
          "name": "Margherita Pizza",
          "price": 250,
          "quantity": 2,
          "specialInstructions": "Extra cheese"
        }
      ],
      "subtotal": 500,
      "deliveryFee": 50,
      "tax": 25,
      "total": 575,
      "status": "delivered",
      "deliveryAddress": {
        "street": "456 Oak Ave",
        "city": "New Delhi",
        "zipCode": "110001",
        "lat": 28.6100,
        "lng": 77.2300
      },
      "deliveryPartnerId": "partner_001",
      "estimatedDeliveryTime": "2024-01-20T19:00:00Z",
      "actualDeliveryTime": "2024-01-20T18:55:00Z",
      "paymentMethod": "card",
      "paymentStatus": "completed",
      "createdAt": "2024-01-20T18:20:00Z",
      "updatedAt": "2024-01-20T18:55:00Z"
    }
  ]
}
```

---

### 2. Create Order
**POST** `/orders`

**Request Body:**
```json
{
  "userId": "user_001",
  "restaurantId": "rest_001",
  "items": [
    {
      "menuItemId": "item_001",
      "name": "Margherita Pizza",
      "price": 250,
      "quantity": 2,
      "specialInstructions": "Extra cheese"
    },
    {
      "menuItemId": "item_002",
      "name": "Coke",
      "price": 50,
      "quantity": 1
    }
  ],
  "deliveryAddress": {
    "street": "456 Oak Ave",
    "city": "New Delhi",
    "zipCode": "110001",
    "lat": 28.6100,
    "lng": 77.2300
  },
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "order_001",
    "userId": "user_001",
    "restaurantId": "rest_001",
    "items": [...],
    "subtotal": 550,
    "deliveryFee": 55,
    "tax": 27.5,
    "total": 632.5,
    "status": "pending",
    "paymentStatus": "pending",
    "estimatedDeliveryTime": "2024-01-20T19:05:00Z",
    "createdAt": "2024-01-20T18:20:00Z"
  },
  "message": "Order created successfully"
}
```

**Status Codes:**
- `201`: Order created successfully
- `400`: Missing required fields
- `500`: Server error

---

### 3. Get Order Details
**GET** `/orders/[id]`

**Path Parameters:**
- `id`: Order ID

**Example Request:**
```bash
GET /api/orders/order_001
```

**Response:** Full order details (same as in list endpoint)

---

### 4. Update Order Status
**PUT** `/orders/[id]`

**Request Body:**
```json
{
  "status": "confirmed",
  "paymentStatus": "completed"
}
```

**Response:** Updated order object

**Status Codes:**
- `200`: Order updated
- `404`: Order not found
- `500`: Server error

---

### 5. Cancel Order
**DELETE** `/orders/[id]`

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

**Status Codes:**
- `200`: Order cancelled
- `400`: Cannot cancel in current status
- `404`: Order not found
- `500`: Server error

---

## Zones Endpoints

### 1. List All Zones
**GET** `/zones`

**Example Request:**
```bash
GET /api/zones
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "zone_001",
      "name": "Indiranagar",
      "coordinates": {
        "lat": 28.5920,
        "lng": 77.6435
      },
      "deliveryPartnersAvailable": 15,
      "ordersInZone": 23,
      "estimatedWait": 32,
      "surgeMultiplier": 1.1,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-20T18:30:00Z"
    }
  ]
}
```

---

### 2. Get Surge Pricing for Zone
**GET** `/zones/[id]/surge`

**Path Parameters:**
- `id`: Zone ID

**Example Request:**
```bash
GET /api/zones/zone_001/surge
```

**Response:**
```json
{
  "success": true,
  "data": {
    "zoneId": "zone_001",
    "multiplier": 1.25,
    "activeOrders": 45,
    "availablePartners": 15,
    "loadRatio": 3.0,
    "estimatedWait": 45
  }
}
```

**Surge Multiplier Logic:**
- Load Ratio > 5: 1.5x multiplier
- Load Ratio > 3: 1.25x multiplier
- Load Ratio > 1: 1.1x multiplier
- Load Ratio ≤ 1: 1.0x multiplier (no surge)

---

### 3. Create Zone
**POST** `/zones`

**Request Body:**
```json
{
  "name": "Koramangala",
  "coordinates": {
    "lat": 28.4595,
    "lng": 77.6245
  },
  "polygon": [
    { "lat": 28.4500, "lng": 77.6100 },
    { "lat": 28.4500, "lng": 77.6400 },
    { "lat": 28.4700, "lng": 77.6400 },
    { "lat": 28.4700, "lng": 77.6100 }
  ]
}
```

**Response:** Created zone object

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Order not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to fetch restaurants"
}
```

---

## Rate Limiting

- Recommended: 100 requests per minute per IP
- Implement exponential backoff for retries
- Use caching for frequently accessed data

---

## Authentication (Future)

Authentication will be implemented using NextAuth.js with:
- JWT tokens
- Refresh token rotation
- Session-based authentication
- Role-based access control (admin, user, delivery partner)

---

## Data Types

### Order Status
- `pending`: Order placed, awaiting confirmation
- `confirmed`: Restaurant confirmed the order
- `preparing`: Restaurant is preparing the food
- `out_for_delivery`: Order is with delivery partner
- `delivered`: Order delivered to customer
- `cancelled`: Order cancelled by user or restaurant

### Payment Status
- `pending`: Payment not yet processed
- `completed`: Payment successful
- `failed`: Payment failed

### Restaurant Status
- `open`: Restaurant is open
- `closed`: Restaurant is closed
- `coming_soon`: Restaurant not yet operational

---

## Pagination

For endpoints that support pagination:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

- Default page size: 20
- Max page size: 100
- Example: `/api/restaurants?page=2&limit=50`

---

## Testing with cURL

### List Restaurants
```bash
curl "http://localhost:3000/api/restaurants?zoneId=zone_001"
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "restaurantId": "rest_001",
    "items": [{"menuItemId": "item_001", "name": "Pizza", "price": 250, "quantity": 1}],
    "deliveryAddress": {"street": "123 Main St", "city": "Delhi", "zipCode": "110001", "lat": 28.6100, "lng": 77.2300},
    "paymentMethod": "card"
  }'
```

### Get Order
```bash
curl "http://localhost:3000/api/orders/order_001?userId=user_001"
```

---

## Performance Tips

1. **Filtering**: Always use specific filters (zoneId, cuisine, etc.)
2. **Pagination**: Use pagination for large datasets
3. **Caching**: Cache restaurant and zone data (low change frequency)
4. **Indexing**: Ensure database indexes are created on search fields
5. **Lazy Loading**: Load reviews and detailed data on demand

---

## Future Endpoints

- `POST /api/users` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/search` - Full-text search
- `POST /api/reviews` - Add review
- `GET /api/analytics/trends` - Analytics dashboard
- WebSocket support for real-time order tracking

---

Last Updated: 2024-01-20
