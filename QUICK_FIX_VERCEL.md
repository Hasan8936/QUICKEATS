# 🚀 Quick Fix: Deploy to Vercel with MongoDB

## The Issue
API endpoints return 404 because `MONGODB_URI` is not configured in Vercel.

## The Fix (3 Minutes)

### Step 1: Get MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy your connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/quickeats_prod
   ```

### Step 2: Add to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your QuickEats project
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Key**: `MONGODB_URI`
   - **Value**: (paste your MongoDB connection string)
   - **Environment**: Select "Production"
6. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the three-dots menu on latest deployment
3. Click **Redeploy**
4. Wait for build to complete ✅

### Step 4: Verify
```bash
# Test the API
curl https://quickeats-inky.vercel.app/api/zones

# Should return:
{
  "success": true,
  "data": [...]
}
```

---

## Common Issues

### Error: "auth failed"
- **Problem**: Wrong MongoDB username/password
- **Fix**: 
  1. Go to MongoDB Atlas → Database Access
  2. Copy the exact username & password
  3. Update MONGODB_URI in Vercel
  4. Redeploy

### Error: "IP address not allowed"
- **Problem**: MongoDB network not configured for Vercel's IP
- **Fix**:
  1. Go to MongoDB Atlas → Network Access
  2. Click "Add IP Address"
  3. Select "Allow Access from Anywhere" (0.0.0.0/0)
  4. Redeploy

### Still 404?
- Check Vercel logs: Deployments → Select latest → Logs
- Look for MongoDB connection errors
- Ensure MONGODB_URI is saved in Production environment

---

## Your MongoDB Connection String

You need ONE of these:

**Development (local)**:
```
mongodb+srv://user:pass@cluster.mongodb.net/quickeats_dev
```

**Production (Vercel)**:
```
mongodb+srv://user:pass@cluster.mongodb.net/quickeats_prod
```

⚠️ **Keep these secret! Never commit to GitHub!**

---

## Testing After Deploy

### Test 1: Zones Endpoint
```bash
curl https://quickeats-inky.vercel.app/api/zones
```
Expected: Returns list of zones (or empty if no data)

### Test 2: Restaurants Endpoint
```bash
curl "https://quickeats-inky.vercel.app/api/restaurants?zoneId=zone_001"
```
Expected: Returns restaurants (or empty if no data)

### Test 3: Check Error Handling
```bash
# This should show proper error if MongoDB is not connected
curl https://quickeats-inky.vercel.app/api/zones
```

---

## Full Setup Guide

For complete step-by-step instructions:
👉 **Read**: `VERCEL_DEPLOYMENT_GUIDE.md`

---

**Time to fix**: ~3-5 minutes  
**Difficulty**: ⭐ Easy  
**Downtime**: ~2-3 minutes during redeploy
