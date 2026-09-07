# QuickEats - Vercel Deployment Guide

## Prerequisites
- GitHub account with the QuickEats repository
- Vercel account (free tier works)
- MongoDB Atlas account with a production cluster

---

## Step 1: Prepare MongoDB for Production

### 1.1 Create Production Cluster in MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster named `quickeats-prod` (M0 free tier is fine)
3. Create a database user:
   - **Username**: `quickeats_prod_user`
   - **Password**: Generate a strong password
   - **Save the password securely**

### 1.2 Get Production Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" driver
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Replace `<myFirstDatabase>` with `quickeats_prod`

**Example**:
```
mongodb+srv://quickeats_prod_user:YOUR_PASSWORD@cluster.mongodb.net/quickeats_prod?retryWrites=true&w=majority
```

### 1.3 Network Access

1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. This is required for Vercel to access MongoDB

---

## Step 2: Deploy to Vercel

### 2.1 Push Code to GitHub

```bash
cd QUICKEATS

# Add all files
git add .

# Commit
git commit -m "feat: Complete UI redesign with MongoDB and REST API

- Modern design system with vibrant colors and typography
- MongoDB integration with 8 typed schemas
- Complete REST API with 10+ endpoints
- Comprehensive documentation and setup guides

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Push to GitHub
git push origin main
```

### 2.2 Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository (QUICKEATS)
4. Click "Import"

### 2.3 Configure Environment Variables

**IMPORTANT**: Before deploying, add environment variables:

1. In Vercel Project Settings, go to "Environment Variables"
2. Add the following:

| Key | Value | Environment |
|-----|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://quickeats_prod_user:PASSWORD@cluster.mongodb.net/quickeats_prod?retryWrites=true&w=majority` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://quickeats-inky.vercel.app` | Production |
| `NEXT_PUBLIC_API_BASE_URL` | `https://quickeats-inky.vercel.app/api` | Production |
| `NODE_ENV` | `production` | Production |
| `SESSION_SECRET` | `your-super-secret-key-change-this` | Production |

**⚠️ CRITICAL**: 
- Never commit `.env.local` or any file with secrets
- Use Vercel's environment variables dashboard
- Keep `MONGODB_URI` private and secure

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Check logs if there are errors

---

## Step 3: Verify Deployment

### 3.1 Test API Endpoints

```bash
# Test 1: Get all zones
curl https://quickeats-inky.vercel.app/api/zones

# Expected response:
{
  "success": true,
  "data": [...]
}

# Test 2: Get restaurants
curl "https://quickeats-inky.vercel.app/api/restaurants?zoneId=zone_001"

# Test 3: Check if MongoDB is connected
# Should NOT return "Database not configured" error
```

### 3.2 Check Vercel Logs

1. Go to your Vercel project
2. Click "Deployments"
3. Select the latest deployment
4. View logs to check for errors

### 3.3 Browser Console

1. Visit https://quickeats-inky.vercel.app
2. Open DevTools (F12)
3. Check Console tab for any errors
4. Check Network tab for API call status

---

## Troubleshooting

### Error: "Database connection not configured"

**Cause**: `MONGODB_URI` not set in Vercel environment variables

**Solution**:
1. Go to Vercel Project Settings
2. Add `MONGODB_URI` environment variable
3. Redeploy the project

```bash
# In Vercel Dashboard:
Settings → Environment Variables → Add new
Key: MONGODB_URI
Value: mongodb+srv://...
Environment: Production
```

### Error: "Database authentication failed"

**Cause**: Wrong username/password in MongoDB URI

**Solution**:
1. Go to MongoDB Atlas
2. Verify database user credentials
3. Update `MONGODB_URI` in Vercel with correct credentials
4. Redeploy

### Error: "IP address not allowed"

**Cause**: Vercel's IP not whitelisted in MongoDB Atlas

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Check if "Allow Access from Anywhere" (0.0.0.0/0) is enabled
3. If not, click "Add IP Address" and select "Allow Access from Anywhere"

### API returns 404

**Cause**: API routes not built correctly

**Solution**:
1. Check Vercel build logs for errors
2. Ensure all files are committed and pushed
3. Verify `src/app/api/` folder structure
4. Redeploy the project

---

## Production Best Practices

### 1. Environment Variables
```env
# Development (.env.local)
MONGODB_URI=mongodb+srv://...@cluster.mongodb.net/quickeats_dev
NODE_ENV=development

# Production (Vercel Dashboard)
MONGODB_URI=mongodb+srv://...@cluster.mongodb.net/quickeats_prod
NODE_ENV=production
```

### 2. Database Backups

1. Go to MongoDB Atlas
2. Click "Backups" on your cluster
3. Enable automatic backups (free tier: 7-day retention)
4. Test restore process regularly

### 3. Monitoring

1. Setup MongoDB Atlas Alerts:
   - CPU usage > 80%
   - Connection count > 500
   - Disk usage > 80%

2. Setup Vercel Monitoring:
   - Enable error tracking
   - Monitor build times
   - Check response times

### 4. Security

- [ ] Rotate MongoDB password monthly
- [ ] Use strong, unique `SESSION_SECRET`
- [ ] Enable 2FA on MongoDB Atlas account
- [ ] Enable 2FA on Vercel account
- [ ] Review MongoDB network access rules
- [ ] Monitor API usage for abuse
- [ ] Setup rate limiting (future enhancement)

---

## Rollback Procedure

If something goes wrong:

```bash
# View deployments
git log --oneline -10

# Rollback to previous commit
git revert <commit-hash>
git push origin main

# Or revert in Vercel Dashboard:
# Deployments → Select previous version → Redeploy
```

---

## Performance Tips

### 1. Database Optimization
- Ensure MongoDB indexes are created
- Use pagination for large result sets
- Cache frequently accessed data (future: Redis)

### 2. API Optimization
- Implement response compression
- Use pagination (already done)
- Add caching headers
- Monitor query performance

### 3. Frontend Optimization
- Enable image optimization
- Use Next.js built-in caching
- Code splitting (automatic with Next.js)

---

## Monitoring Checklist

Daily:
- [ ] Check Vercel deployment status
- [ ] Review error logs
- [ ] Monitor API response times

Weekly:
- [ ] Check MongoDB disk usage
- [ ] Review API usage statistics
- [ ] Test database backup restoration

Monthly:
- [ ] Rotate sensitive credentials
- [ ] Review security settings
- [ ] Analyze performance metrics
- [ ] Update dependencies

---

## Support Resources

| Issue | Resource |
|-------|----------|
| MongoDB Setup | MONGODB_SETUP_GUIDE.md |
| API Documentation | API_DOCUMENTATION.md |
| Build Errors | Vercel Logs (Dashboard) |
| Deployment Help | Vercel Documentation |
| Database Help | MongoDB Atlas Documentation |

---

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)

---

## Next Steps

1. ✅ Add `MONGODB_URI` to Vercel environment variables
2. ✅ Deploy to Vercel (redeploy if already deployed)
3. ✅ Test API endpoints
4. ✅ Monitor logs for errors
5. ✅ Setup alerts and monitoring
6. ✅ Implement additional API endpoints
7. ✅ Add authentication (NextAuth.js)
8. ✅ Setup CI/CD pipeline

---

**Current Status**: Ready to deploy  
**Last Updated**: 2026-09-07  
**Version**: 1.0.0
