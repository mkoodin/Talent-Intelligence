# Deployment Guide

## Quick Deployment Options

### Option 1: Railway (Recommended - Easiest)

Railway can deploy both frontend and backend automatically.

**Steps:**
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `mkoodin/Talent-Intelligence`
5. Select branch: `claude/netflix-insights-platform-01DcopixWmwGQgGBVCUDKmK7`
6. Railway will detect both services automatically
7. Set environment variables if needed
8. Deploy!

**Result:** You'll get two URLs:
- Backend: `https://your-backend.railway.app`
- Frontend: `https://your-frontend.railway.app`

**Cost:** Free tier: 500 hours/month, $5/month after

---

### Option 2: Vercel (Frontend + Backend)

Vercel can host both as a monorepo.

**Steps:**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import `mkoodin/Talent-Intelligence`
4. Select branch: `claude/netflix-insights-platform-01DcopixWmwGQgGBVCUDKmK7`
5. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
6. Deploy

**Note:** Backend will run as serverless functions.

**Cost:** Free for hobby projects

---

### Option 3: Render (Frontend + Backend)

**Steps:**
1. Go to https://render.com
2. Sign in with GitHub
3. Click "New" → "Blueprint"
4. Connect repository: `mkoodin/Talent-Intelligence`
5. Select branch: `claude/netflix-insights-platform-01DcopixWmwGQgGBVCUDKmK7`
6. Render will use `render.yaml` configuration
7. Deploy both services

**Cost:** Free tier available (services spin down after inactivity)

---

### Option 4: Netlify (Frontend) + Railway (Backend)

**Frontend on Netlify:**
1. Go to https://netlify.com
2. "Add new site" → "Import from Git"
3. Select repository and branch
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Deploy

**Backend on Railway:**
Follow Railway steps above, but only deploy the backend service.

**After deployment:**
Update frontend API URL in `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-backend.railway.app/api';
```

---

## Environment Variables

### Backend
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (production/development)

### Frontend
No environment variables needed, but you may need to update the API URL in production.

---

## Post-Deployment Steps

1. **Test the backend API:**
   ```
   curl https://your-backend-url/api/health
   ```

2. **Test the frontend:**
   Open your frontend URL in a browser

3. **Seed the database** (if needed):
   - Railway: Use Railway CLI or dashboard shell
   - Render: Use Render shell
   ```bash
   npm run seed
   ```

---

## Database Persistence

For production, consider upgrading from SQLite to PostgreSQL:
- Railway provides free PostgreSQL
- Render provides free PostgreSQL
- Update `backend/src/config/database.ts` accordingly

---

## Custom Domain

All platforms support custom domains:
- Add your domain in platform settings
- Update DNS records
- Enable HTTPS (automatic on all platforms)

---

## Support

- Railway: https://railway.app/help
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Netlify: https://docs.netlify.com
