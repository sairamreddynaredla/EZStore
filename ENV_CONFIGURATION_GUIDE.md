# Environment Configuration Templates

## 📝 FOR BACKEND

### File: `backend/.env.example`
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ezstore_dev"

# Server
NODE_ENV=development
PORT=5000

# JWT Secrets (Generate random 32+ character strings)
JWT_SECRET=your-super-secret-jwt-key-generate-random-string-here-12345
ADMIN_JWT_SECRET=your-super-secret-admin-jwt-key-generate-random-string-here-12345

# CORS Origins (allow these domains)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# API Configuration
API_TIMEOUT=30000

# File Upload
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (Optional - for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@ezstore.com

# Payment Gateway (Optional - for production)
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Logging
LOG_LEVEL=info
```

### File: `backend/.env.production` (For Render)
```
# Database (From Render PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Server
NODE_ENV=production
PORT=5000

# JWT Secrets (Generate NEW random strings for production)
JWT_SECRET=prod-super-secret-jwt-key-generate-new-random-string-here-abcdef12345
ADMIN_JWT_SECRET=prod-super-secret-admin-jwt-key-generate-new-random-string-here-abcdef12345

# CORS Origins (your actual Vercel URLs)
FRONTEND_URL=https://your-frontend-domain.vercel.app
ADMIN_URL=https://your-admin-domain.vercel.app

# API Configuration
API_TIMEOUT=30000

# File Upload
MAX_FILE_SIZE=5242880

# Rate Limiting (Stricter in production)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@ezstore.com

# Payment Gateway
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Logging
LOG_LEVEL=warn
```

---

## 📝 FOR FRONTEND

### File: `frontend/.env.example`
```
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_SOCKET_URL=http://localhost:5000

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true

# App Configuration
VITE_APP_NAME=EZStore
VITE_APP_VERSION=1.0.0
```

### File: `frontend/.env.production` (For Vercel)
```
# API Configuration (Change to your actual Render backend URL)
VITE_API_BASE_URL=https://your-backend-domain.onrender.com
VITE_API_TIMEOUT=30000
VITE_SOCKET_URL=https://your-backend-domain.onrender.com

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# App Configuration
VITE_APP_NAME=EZStore
VITE_APP_VERSION=1.0.0
```

---

## 📝 FOR ADMIN PANEL

### File: `admin/.env.example`
```
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# Admin Settings
VITE_ADMIN_APP_NAME=EZStore Admin
VITE_MAX_FILE_UPLOAD_SIZE=5242880
```

### File: `admin/.env.production` (For Vercel)
```
# API Configuration (Change to your actual Render backend URL)
VITE_API_BASE_URL=https://your-backend-domain.onrender.com
VITE_SOCKET_URL=https://your-backend-domain.onrender.com

# Admin Settings
VITE_ADMIN_APP_NAME=EZStore Admin
VITE_MAX_FILE_UPLOAD_SIZE=5242880
```

---

## 🔐 HOW TO GENERATE SECURE JWT SECRETS

### Option 1: Using Node.js (Best)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Output example:
```
3a7f8c2b5e9d1a4c6f2e8b3a5d7c9e1f4a6b8c2e5f1a3d7c9e2b4f6a8c1d3e
```

### Option 2: Using OpenSSL
```bash
openssl rand -hex 32
```

### Option 3: Online Generator
https://generate-random.org/encryption-key-generator

---

## 🚀 STEP-BY-STEP ENV SETUP

### Step 1: Create `.env` files locally

```bash
cd c:\Users\shali\Desktop\EZStore\chinna\EZStore

# Backend
cd backend
copy .env.example .env

# Frontend
cd ..\frontend
copy .env.example .env

# Admin
cd ..\admin
copy .env.example .env

cd ..
```

### Step 2: Update local URLs

Edit each `.env` file:

**backend/.env:**
```
DATABASE_URL="postgresql://your-local-user:password@localhost:5432/ezstore_dev"
NODE_ENV=development
PORT=5000
JWT_SECRET=<run the generator command above>
ADMIN_JWT_SECRET=<run the generator command above>
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

**frontend/.env:**
```
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**admin/.env:**
```
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Step 3: Test locally
```bash
cd backend && npm start
# Should see: "Server running on port 5000"
```

### Step 4: Set up on Render and Vercel

**For Render Backend:**
1. Go to: Render Dashboard → ezstore-backend → Settings → Environment
2. Add these variables (from .env.production):
   - DATABASE_URL (from PostgreSQL)
   - NODE_ENV = production
   - JWT_SECRET (generated)
   - ADMIN_JWT_SECRET (generated)
   - FRONTEND_URL = https://your-frontend.vercel.app
   - ADMIN_URL = https://your-admin.vercel.app
   - All other production vars

**For Vercel Frontend:**
1. Go to: Vercel Dashboard → frontend → Settings → Environment Variables
2. Add:
   - VITE_API_BASE_URL=https://your-backend.onrender.com
   - VITE_SOCKET_URL=https://your-backend.onrender.com

**For Vercel Admin:**
1. Go to: Vercel Dashboard → admin → Settings → Environment Variables
2. Add:
   - VITE_API_BASE_URL=https://your-backend.onrender.com
   - VITE_SOCKET_URL=https://your-backend.onrender.com

---

## ⚠️ IMPORTANT NOTES

### Never commit `.env` files!
```bash
# Make sure .gitignore has:
# .env
# .env.local
# .env.*.local
```

### Keep `.env.example` updated
- Always update `.env.example` when adding new variables
- This helps team members know what variables are needed
- Don't put actual secrets in `.env.example`

### Rotate secrets regularly
- Every 6 months rotate JWT_SECRET
- Change database passwords after significant changes
- Update Stripe keys if compromised

### Different secrets for different environments
- **Development:** One set of keys
- **Testing:** Another set
- **Production:** Yet another set (most secure)

---

## 🔍 VERIFICATION CHECKLIST

After setting up environment variables:

- [ ] Can start backend locally: `npm start`
- [ ] Backend connects to database
- [ ] Frontend can fetch from backend API
- [ ] Admin panel can fetch from backend API
- [ ] No "undefined" errors in console
- [ ] All API URLs are correct
- [ ] Socket.IO connections work
- [ ] Production build doesn't expose secrets

---

## 🆘 TROUBLESHOOTING

### "Cannot find variable VITE_API_BASE_URL"
```
Fix: 
1. Make sure .env file exists in correct folder
2. Restart dev server: npm start
3. Check .env file has correct naming (VITE_ prefix)
```

### "DATABASE_URL is undefined"
```
Fix:
1. Check backend/.env file exists
2. DATABASE_URL format is correct
3. Render backend has DATABASE_URL in Environment
```

### "CORS error" after production deployment
```
Fix:
1. Check FRONTEND_URL and ADMIN_URL in backend/.env
2. Make sure they match actual Vercel URLs
3. Deploy backend again after updating
```

### "Socket.IO won't connect"
```
Fix:
1. Check VITE_SOCKET_URL in frontend/.env
2. Should match VITE_API_BASE_URL
3. Backend socket.io configuration correct
```

---

**Keep this file safe! 🔐 It contains sensitive configuration information.**
