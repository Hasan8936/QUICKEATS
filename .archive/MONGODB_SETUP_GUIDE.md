# MongoDB Setup Guide for QuickEats

## Overview
QuickEats now uses MongoDB as the primary database for storing restaurants, orders, users, reviews, and analytics data. This guide walks you through the setup process.

## Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- Git

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up"
3. Create a new account with your email
4. Verify your email

## Step 2: Create a Database Cluster

1. After login, click "Create" to create a new project
2. Name it "QuickEats"
3. Click "Continue"
4. Select "Create a Shared Cluster" (Free M0 tier)
5. Choose your preferred cloud provider (AWS/Google Cloud/Azure)
6. Select a region close to your users
7. Click "Create Cluster"

## Step 3: Set Up Database Access

### Create a Database User:
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Select "Username and Password" authentication
4. Set username: `quickeats_user`
5. Set password: Generate a secure password or create your own
6. **SAVE THIS PASSWORD - You'll need it for the connection string**
7. Click "Add User"

### Set Up Network Access:
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's IP only
5. Click "Confirm"

## Step 4: Get Your Connection String

1. Go to "Databases" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Choose "Node.js" as the driver
5. Copy the connection string
6. Replace `<username>` with `quickeats_user`
7. Replace `<password>` with your actual password
8. Replace `<myFirstDatabase>` with `quickeats_dev` (or `quickeats_prod`)

**Example:**
```
mongodb+srv://quickeats_user:yourPassword@cluster.mongodb.net/quickeats_dev?retryWrites=true&w=majority
```

## Step 5: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and replace the MongoDB URI:
```env
MONGODB_URI=mongodb+srv://quickeats_user:yourPassword@cluster.mongodb.net/quickeats_dev?retryWrites=true&w=majority
```

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Initialize Database with Sample Data

```bash
npm run seed
```

This will populate your MongoDB with sample restaurants, zones, menu items, and users.

## Step 8: Verify Connection

Run the development server:
```bash
npm run dev
```

Visit http://localhost:3000 in your browser. If you see the app without errors, MongoDB is connected!

## Database Schema Overview

### Collections:

#### **users**
- User account information and addresses
- Fields: email, password, phone, name, addresses[], preferences{}

#### **restaurants**
- Restaurant details and metadata
- Fields: name, cuisine[], rating, deliveryFee, zoneId, location{}, image

#### **menuItems**
- Menu items for each restaurant
- Fields: restaurantId, name, price, category, description, image, availability

#### **orders**
- Customer orders and tracking
- Fields: userId, restaurantId, items[], total, status, deliveryAddress, estimatedDeliveryTime

#### **zones**
- Delivery zones and surge pricing
- Fields: name, coordinates{}, deliveryPartnersAvailable, surgeMultiplier, ordersInZone

#### **reviews**
- Customer reviews and ratings
- Fields: userId, restaurantId, rating, comment, images[]

#### **surgeEvents** & **trafficMetrics**
- Historical data for analytics
- Fields: zoneId, multiplier/load, timestamp

## API Endpoints

### Restaurants
```
GET /api/restaurants                          # List all restaurants
GET /api/restaurants?zoneId=123&cuisine=Indian
GET /api/restaurants/[id]                     # Get restaurant details with menu
```

### Orders
```
GET /api/orders?userId=123                    # Get user's orders
POST /api/orders                              # Create new order
GET /api/orders/[id]                          # Get order details
PUT /api/orders/[id]                          # Update order status
DELETE /api/orders/[id]                       # Cancel order
```

### Zones
```
GET /api/zones                                # List all zones
POST /api/zones                               # Create new zone
GET /api/zones/[id]/surge                     # Get surge pricing for zone
```

## Troubleshooting

### Connection Error: "auth failed"
- Verify your username and password in the connection string
- Check that the database user exists in MongoDB Atlas
- Ensure username and password don't contain special characters that need URL encoding

### Connection Error: "IP address not allowed"
- Go to Network Access in MongoDB Atlas
- Check that your IP is whitelisted
- For 0.0.0.0/0: Allows all IPs (development only)

### Connection Error: "MongoServerSelectionError"
- Check your internet connection
- Verify the MongoDB URI is correct
- Ensure the cluster is running (not paused)

### Model Conflicts
If you see "Cannot overwrite model" errors:
- Models are checked before creating to prevent duplicates
- Clear your terminal and restart the dev server

## Performance Optimization

### Indexes
MongoDB automatically indexes:
- `_id` (primary key)
- `email` (unique index on users)
- `restaurantId` (on menu items and orders)
- `userId` (on orders and reviews)
- `zoneId` (on zones and restaurants)

### Query Optimization Tips
1. Always filter by `zoneId` when listing restaurants
2. Use pagination for large result sets
3. Limit the number of reviews returned (10 by default)
4. Cache zone data as it changes infrequently

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use `.env.local` for local development only
   - Use managed secrets in production (Vercel, AWS Secrets Manager, etc.)

2. **Database Access**
   - Use different credentials for dev/prod
   - Implement role-based access control
   - Rotate passwords regularly
   - Monitor database access logs

3. **API Security**
   - Validate all input data
   - Implement rate limiting
   - Use HTTPS in production
   - Add authentication/authorization

## Deployment to Production

### Vercel Deployment:
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel Settings:
   - `MONGODB_URI`: Production MongoDB URI (different cluster recommended)
   - `NODE_ENV`: Set to "production"
   - `SESSION_SECRET`: Strong random string
4. Deploy!

### Environment Separation:
```
Development:  mongodb+srv://...@cluster.mongodb.net/quickeats_dev
Production:   mongodb+srv://...@cluster.mongodb.net/quickeats_prod
Staging:      mongodb+srv://...@cluster.mongodb.net/quickeats_staging
```

## Next Steps

1. ✅ Setup MongoDB Atlas and connection string
2. ✅ Configure .env.local with MongoDB URI
3. ✅ Run `npm install` and `npm run dev`
4. ✅ Verify the connection
5. 📝 Review API documentation in `/API_DOCUMENTATION.md`
6. 🎨 Explore the redesigned UI components
7. 🚀 Deploy to Vercel when ready

## Support & Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/)
- [Mongoose Documentation](https://mongoosejs.com/)
- QuickEats Issues: Check GitHub issues for questions
