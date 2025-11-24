# Deploy to Vercel (Easiest Method)

## Option 1: One-Click Vercel Deploy (Recommended)

### Step 1: Fork or Use Your Repo
Make sure your code is on GitHub at:
```
mkoodin/Talent-Intelligence
```
Branch: `claude/netflix-insights-platform-01DcopixWmwGQgGBVCUDKmK7`

### Step 2: Deploy Frontend to Vercel

1. Go to: **https://vercel.com/new**

2. Click "Import Git Repository"

3. Select your repository: `mkoodin/Talent-Intelligence`

4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Click **"Deploy"**

6. Wait 1-2 minutes for deployment

7. You'll get a URL like: `https://your-app.vercel.app`

### Step 3: Deploy Backend to Render (Free)

Since Vercel is best for frontend, use Render for backend:

1. Go to: **https://render.com**

2. Sign in with GitHub

3. Click **"New"** → **"Web Service"**

4. Connect your repository: `mkoodin/Talent-Intelligence`

5. Configure:
   - **Name**: netflix-insights-backend
   - **Branch**: `claude/netflix-insights-platform-01DcopixWmwGQgGBVCUDKmK7`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run seed && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

6. Click **"Create Web Service"**

7. You'll get a URL like: `https://netflix-insights-backend.onrender.com`

### Step 4: Connect Frontend to Backend

After backend is deployed, update your frontend:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com`
5. **Redeploy** your frontend

---

## Option 2: Deploy Both on Render (Simpler)

1. Go to: **https://render.com**
2. Click **"New"** → **"Blueprint"**
3. Connect your repo
4. Render will use the `render.yaml` file
5. Deploy both services automatically

---

## Option 3: Quick Frontend-Only Demo (No Backend)

If you just want to see the UI:

### Deploy to Netlify (Frontend Only)

1. Go to: **https://app.netlify.com/start**

2. Click **"Import from Git"**

3. Select your repository

4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

5. Deploy

You'll see the UI, but filters won't work without the backend.

---

## Troubleshooting

### Backend Issues on Railway/Render:
- **Database not persisting**: This is normal with SQLite on ephemeral filesystems
- **Solution**: Data will reset on each deploy (fine for demo)
- **For production**: Upgrade to PostgreSQL

### Frontend Can't Connect to Backend:
1. Check backend URL is correct
2. Backend must allow CORS (already configured)
3. Use full URL with `https://`

### Build Failures:
1. Make sure you selected the correct branch
2. Check build logs for specific errors
3. Ensure root directory is set correctly

---

## Result

After deployment you'll have:
- **Frontend**: Beautiful UI accessible via URL
- **Backend**: API serving insights data
- **Working App**: Fully functional talent intelligence platform

Share the frontend URL with your team!
