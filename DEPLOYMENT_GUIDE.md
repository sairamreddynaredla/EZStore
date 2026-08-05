# 🚀 EZStore Complete Deployment Guide

**Language: Hindi/English (Hinglish) Mix for clarity**

---

## 📋 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│  EZStore Deployment Structure                           │
├─────────────────────────────────────────────────────────┤
│ FRONTEND (Vercel)     │ ADMIN (Vercel)  │ BACKEND (Render) │
│ React + Vite          │ React + Vite    │ Express + Prisma  │
│ Public Store UI       │ Admin Dashboard │ REST API + DB     │
└─────────────────────────────────────────────────────────┘
```

---

# PART 1: BACKEND DEPLOYMENT (Express + Postgres on Render.com)

## Step 1: Render.com Par Account Banao

1. https://render.com/ par jaao
2. "Sign up" krte ho → GitHub se connect kro
3. Email verify kro

## Step 2: Database (PostgreSQL) Setup

### Render par PostgreSQL Banao:
1. Dashboard → "New +" → "PostgreSQL"
2. Fill kro:
   - **Name:** `ezstore-db`
   - **Database:** `ezstore_prod`
   - **User:** `postgres_user`
   - **Region:** Apne closest region chuno (example: `oregon`)
   - **Plan:** Free tier (production ke liye paid lena chahiye)
   - Baki settings default rakho

3. Create kr de → Database connection string copy kro
   - Ye teri `.env` file mein DAAALNA PADEGA

## Step 3: Backend Code Prepare Kro

### Apne local repo mein ye karke dekho:

```bash
# 1. Folder mein aao
cd backend

# 2. Dependencies install kro
npm install

# 3. Database migrations lagao
npx prisma migrate deploy

# 4. Database seed kro (test data)
npm run db:seed

# 5. Build test kro
npm run start
# Server ✅ start hona chahiye
```

### Errors ko fix kro:

**Error: "Cannot find module"**
```bash
npm install
npm install -D nodemon
```

**Error: "DATABASE_URL not found"**
- `.env` file banao with DATABASE_URL

## Step 4: GitHub mein Push Kro

```bash
# Backend folder commit kro
git add backend/
git commit -m "feat: prepare backend for production deployment"
git push origin main
```

## Step 5: Render Par Deploy Kro

### Option A: Automatic Deploy (Recommended)

1. Render dashboard → "New +" → "Web Service"
2. GitHub se apne repository connect kro
3. Select kro: **sairamreddynaredla/EZStore**
4. Fill kro:
   - **Name:** `ezstore-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma migrate deploy && npx prisma db seed`
   - **Start Command:** `npm start`
   - **Branch:** `main`
   - **Auto-deploy:** Toggle ON

5. **Environment Variables Set Kro:**
   ```
   NODE_ENV = production
   DATABASE_URL = (Apne PostgreSQL se copy kiya hua)
   JWT_SECRET = (Strong random 32+ characters)
   ADMIN_JWT_SECRET = (Strong random 32+ characters)
   PORT = 5000
   FRONTEND_URL = https://your-frontend-domain.vercel.app
   ADMIN_URL = https://your-admin-domain.vercel.app
   ```

6. "Create Web Service" kr de

### Deploy Status Check Kro:
- Render dashboard mein "ezstore-backend" service dekh
- Logs check kro - ✅ "Server running on port 5000" message dekha?
- Ya ❌ error dikha? Go to Step 6 (Troubleshooting)

---

# PART 2: FRONTEND DEPLOYMENT (React + Vite on Vercel)

## Step 1: Vercel Account Banao

1. https://vercel.com/signup par jaao
2. GitHub account se login kro
3. Email verify kro

## Step 2: Frontend Code Prepare Kro

### Local mein test kro:

```bash
# Frontend folder mein jaao
cd frontend

# Dependencies install kro
npm install

# Build kro
npm run build

# Preview dekho (production ke jaisa dikhega)
npm run preview
# http://localhost:4173 mein dekh
```

### Errors fix kro:

**Error: "Module not found"**
```bash
npm install
npm audit fix
```

**Error: "Cannot find .env"**
- `.env.local` banao (development ke liye test values daal)

## Step 3: Environment Variables Set Kro

### `.env.example` banao (frontend folder mein):
```
VITE_API_BASE_URL=https://ezstore-backend.onrender.com
VITE_API_TIMEOUT=30000
VITE_SOCKET_URL=https://ezstore-backend.onrender.com
```

### Local `.env.local` (development ke liye):
```
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Step 4: GitHub Push Kro

```bash
git add frontend/
git commit -m "feat: prepare frontend for production deployment"
git push origin main
```

## Step 5: Vercel Par Deploy Kro

### Automatic Deploy:

1. Vercel dashboard → "Add New" → "Project"
2. GitHub repo connect kro → Select `EZStore`
3. Configure project:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Environment Variables Add Kro:**
   ```
   VITE_API_BASE_URL = https://ezstore-backend.onrender.com
   VITE_SOCKET_URL = https://ezstore-backend.onrender.com
   ```

5. "Deploy" kr de

### Build Status Check Kro:
- Vercel dashboard mein deployments tab dekh
- Green checkmark ✅ aaye? Success!
- Red error ❌? Logs dekh → Go to Troubleshooting

---

# PART 3: ADMIN PANEL DEPLOYMENT (React + Vite on Vercel)

## Step 1: Admin Code Prepare Kro

```bash
# Admin folder mein jaao
cd admin

# Dependencies install kro
npm install

# Build kro
npm run build

# Preview kro
npm run preview
# http://localhost:4173 mein dekh
```

## Step 2: Vite Config Update Kro

**File:** `admin/vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "https://ezstore-backend.onrender.com", // Change this
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "https://ezstore-backend.onrender.com", // Change this
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
```

## Step 3: Environment Setup

### `.env.example` (admin folder mein):
```
VITE_API_BASE_URL=https://ezstore-backend.onrender.com
VITE_SOCKET_URL=https://ezstore-backend.onrender.com
```

## Step 4: GitHub Push Kro

```bash
git add admin/
git commit -m "feat: prepare admin panel for production deployment"
git push origin main
```

## Step 5: Vercel Par Deploy Kro

1. Vercel dashboard → "Add New" → "Project"
2. `EZStore` repo select kro (same repo, different folder)
3. Configure:
   - **Root Directory:** `admin`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Environment Variables:**
   ```
   VITE_API_BASE_URL = https://ezstore-backend.onrender.com
   VITE_SOCKET_URL = https://ezstore-backend.onrender.com
   ```

5. Deploy kro

---

# 🔧 COMMON ERRORS & FIXES

## ❌ Error 1: "DATABASE_URL is not defined"

**Cause:** Environment variable nahi mila

**Fix:**
```bash
# Render dashboard → ezstore-backend → Environment
# Add kro:
DATABASE_URL = postgresql://user:password@host:5432/dbname
```

## ❌ Error 2: "CORS Error: No 'Access-Control-Allow-Origin' header"

**Cause:** Frontend aur backend ke domains different hain

**Fix in backend (backend/src/app.js):**
```javascript
import cors from 'cors';

const allowedOrigins = [
  'https://your-frontend-domain.vercel.app',
  'https://your-admin-domain.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

**Then push:**
```bash
git add backend/
git commit -m "fix: update CORS for production domains"
git push origin main
```

## ❌ Error 3: "Cannot GET /api/products"

**Cause:** Backend server nahi chal raha

**Fix:**
```bash
# 1. Render logs check kro
# 2. Database connection check kro
# 3. Env variables sahi hain?
# 4. Restart service: Render → ezstore-backend → "Restart service"
```

## ❌ Error 4: "Module not found in production build"

**Cause:** Dependencies missing hain

**Fix:**
```bash
cd frontend  # ya admin
npm install
npm run build
git add .
git commit -m "fix: update dependencies"
git push origin main
```

## ❌ Error 5: "Prisma Migration Failed"

**Cause:** Database schema mismatch

**Fix:**
```bash
# Local mein:
npx prisma migrate reset  # ⚠️ Development ke liye hi use kro

# Production mein:
# Render → Environmental → DATABASE_URL check kro
# Phir manual reset karne padh sakta hai (data loss ho sakta hai)
```

---

# ✅ DEPLOYMENT CHECKLIST

## Before Deployment:

- [ ] `npm install` run kiya - koi error nahi aaye
- [ ] `npm run build` successful raha
- [ ] `npm start` locally test kiya - server ✅ start hua
- [ ] `.env.example` file banai
- [ ] Database migrations test kiye
- [ ] Sensitive data `.env` mein dala (code mein nahi)
- [ ] All commits GitHub mein push kiye

## After Deployment:

### Backend (Render):
- [ ] Service dashboard mein "Live" status dikha
- [ ] Database connection successful
- [ ] Logs mein error nahi dikha
- [ ] `https://your-backend-domain/api/health` response milta hai (agar ye route hai)

### Frontend (Vercel):
- [ ] Build successful
- [ ] Preview link automatically mila
- [ ] Login page load hoti hai
- [ ] API calls working hain

### Admin (Vercel):
- [ ] Build successful
- [ ] Admin dashboard load hoti hai
- [ ] API calls working hain

---

# 🌐 PRODUCTION DOMAIN SETUP

## Render (Backend):

1. Render Dashboard → ezstore-backend → Settings
2. **Custom Domain** section mein:
   - Custom domain add kro: `api.yourcompany.com`
   - SSL certificate automatically set hoti hai ✅

## Vercel (Frontend & Admin):

1. Vercel Dashboard → Project → Settings → Domains
2. Custom domain add kro:
   - Frontend: `store.yourcompany.com`
   - Admin: `admin.yourcompany.com`
3. DNS records update kro (apne domain registrar par)

---

# 📊 MONITORING & LOGS

## Render Backend Logs Check Kro:
1. Dashboard → ezstore-backend → Logs
2. Real-time logs dekh
3. Errors occur ho to immediately pata lag jayega

## Vercel Frontend Logs Check Kro:
1. Dashboard → Project → Deployments
2. Specific deployment select kro
3. Build logs aur runtime logs dekh

## Database Status Check Kro:
1. Render Dashboard → ezstore-db → Info
2. Connection string verify kro
3. Database size check kro

---

# 🔐 SECURITY CHECKLIST

**Before going to production:**

- [ ] All API keys `.env` mein stored hain (code mein nahi)
- [ ] JWT secrets strong hain (32+ random characters)
- [ ] CORS properly configured
- [ ] Rate limiting enabled (backend mein)
- [ ] HTTPS used everywhere (Vercel & Render automatic करते हैं)
- [ ] Database backups enabled (Render mein check kro)
- [ ] Admin panel password strong hai
- [ ] No console.log sensitive data
- [ ] Input validation everywhere

---

# 🚀 QUICK DEPLOYMENT COMMANDS

```bash
# 1. Local mein test (sabse pehle)
cd backend && npm install && npm start
cd ../frontend && npm install && npm run build && npm run preview
cd ../admin && npm install && npm run build && npm run preview

# 2. GitHub push kro
git add .
git commit -m "chore: deploy production"
git push origin main

# 3. Render auto-deploy hoga (backend)
# 4. Vercel auto-deploy hoga (frontend + admin)

# 5. Check logs
# - Render dashboard
# - Vercel dashboard
```

---

# 📞 TROUBLESHOOTING FLOWCHART

```
Deployment Failed?
│
├─ Backend (Render)?
│  ├─ Logs check: `Render → Logs`
│  ├─ Database URL valid? → DATABASE_URL check kro
│  ├─ Build failed? → npm install locally, push again
│  └─ Still failing? → Restart service
│
├─ Frontend (Vercel)?
│  ├─ Build logs check: `Vercel → Deployments → Logs`
│  ├─ Module error? → npm install, npm run build locally
│  ├─ Env vars missing? → Add VITE_* variables
│  └─ Still failing? → Clear build cache, rebuild
│
└─ Can't connect Frontend to Backend?
   ├─ Backend URL correct in .env? 
   ├─ CORS enabled? (backend par check kro)
   ├─ Backend server running? (Render logs check kro)
   └─ Network request tab mein kya error show ho raha hai?
```

---

# 📝 DEPLOYMENT TIMELINE

| Step | Time | Platform |
|------|------|----------|
| 1. Create Render DB | 2 min | Render |
| 2. Deploy Backend | 5 min | Render |
| 3. Deploy Frontend | 5 min | Vercel |
| 4. Deploy Admin | 5 min | Vercel |
| 5. Test everything | 10 min | Your browser |
| 6. Fix errors | Variable | All |
| **Total** | **~30 min** | All |

---

**Good Luck! 🎉 Agar koi problem aaye to logs dekh aur GitHub issue create kro!**
