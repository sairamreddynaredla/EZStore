# 🔧 PRODUCTION TROUBLESHOOTING GUIDE

## अगर कुछ गलत हो गया to यहाँ देख!

---

## 🔴 BACKEND ERRORS

### ❌ Error 1: "Cannot connect to database"

**Symptoms:**
- Render logs में: `Error: connect ECONNREFUSED`
- या: `PostgreSQL connection timeout`

**Causes:**
- DATABASE_URL सही नहीं है
- PostgreSQL service down है
- Network/firewall issue

**Fix:**
```bash
# Step 1: Check DATABASE_URL in Render
Render Dashboard → ezstore-backend → Environment
# DATABASE_URL देख - format हो सकता है:
# postgresql://user:password@host:5432/dbname

# Step 2: Database status check करो
Render Dashboard → ezstore-db → Info
# Status "Available" दिख रहा है?

# Step 3: अगर नहीं तो database restart करो
Render Dashboard → ezstore-db → Settings → "Restart Database"

# Step 4: Backend restart करो
Render Dashboard → ezstore-backend → Settings → "Restart Service"

# Step 5: Logs check करो (2 mins wait करो)
Render Dashboard → ezstore-backend → Logs
# "Connected to database" या "Server running" message दिखना चाहिए
```

---

### ❌ Error 2: "Cannot find module 'express'" या कोई dependency नहीं

**Symptoms:**
- Render build fails
- Logs में: `Cannot find module`

**Causes:**
- `npm install` नहीं हुआ deployment time पर
- `package.json` में dependency नहीं लिखी है

**Fix:**
```bash
# Local में check करो:
cd backend
npm install  # सब dependencies install हो जाएंगे

# Check करो package.json में dependency है?
cat package.json | grep express

# अगर नहीं तो:
npm install express

# Commit करो:
git add package.json package-lock.json
git commit -m "fix: ensure all dependencies are installed"
git push origin main

# Render automatically redeploy करेगा (auto-deploy on)
# 5-10 mins wait करो, फिर logs देख
```

---

### ❌ Error 3: "CORS error: No 'Access-Control-Allow-Origin' header"

**Symptoms:**
- Frontend console में error:
```
Access to XMLHttpRequest at 'https://backend-url/api/products' 
from origin 'https://frontend-url' has been blocked by CORS policy
```

**Causes:**
- Backend में CORS configure नहीं है
- Frontend और backend के origins different हैं

**Fix:**
```javascript
// File: backend/src/app.js
// UPDATE करो:

import cors from 'cors';

// ✅ अपने actual URLs यहाँ डालो:
const allowedOrigins = [
  'https://ezstore-frontend-xxx.vercel.app',  // Frontend URL
  'https://ezstore-admin-xxx.vercel.app',     // Admin URL
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
```

**फिर commit करो:**
```bash
cd backend
git add src/app.js
git commit -m "fix: update CORS for production domains"
git push origin main

# Render redeploy करेगा (2-3 mins)
```

---

### ❌ Error 4: "Prisma migration failed"

**Symptoms:**
- Build output में: `Migration failed`
- या: `Schema mismatch`

**Causes:**
- Prisma schema और database मismatch है
- Previous migration fail हुआ था

**Fix:**
```bash
# Local में:
cd backend

# Option 1: Reset करो (सब data delete!)
# ⚠️ सिर्फ development में करो!
npx prisma migrate reset

# Option 2: Manual fix करो
# Database schema manually update कर
# या Render में database delete करके recreate कर

# फिर:
npx prisma migrate deploy
npm run db:seed

# Test करो locally:
npm start
# "Server running" दिख रहा है?

# तो push करो:
git add .
git commit -m "fix: prisma migrations"
git push origin main
```

---

### ❌ Error 5: "Cannot GET /api/products" या 404 error

**Symptoms:**
- API call करते हुए 404 response मिलता है
- या: `Cannot GET /api/products`

**Causes:**
- Route define नहीं है
- Backend server running नहीं है
- URL wrong है

**Fix:**
```bash
# Check करो सब routes defined हैं:
cd backend
ls src/routes/  # सब routes file दिखनी चाहिए

# Check करो routes app.js में imported हैं:
grep -r "import.*routes" src/app.js

# Backend locally test करो:
npm start

# Browser/curl से test करो:
curl http://localhost:5000/api/health
# Response मिलना चाहिए

# अगर नहीं मिलता तो console/logs check करो

# Vercel से error message copy करो और ठीक करो

# फिर:
git add .
git commit -m "fix: routing issues"
git push origin main
```

---

### ❌ Error 6: "JWT token invalid" या authentication fail

**Symptoms:**
- Login करते हुए: `Invalid token`
- या: `JWT malformed`

**Causes:**
- JWT_SECRET production में सही नहीं है
- Token format wrong है
- Token expired

**Fix:**
```bash
# Option 1: JWT_SECRET regenerate करो
# New secret generate करो:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Render में update करो:
Render Dashboard → ezstore-backend → Settings → Environment
# JWT_SECRET = नई generated secret

# Backend restart करो

# Option 2: Token refresh logic check करो
# File: backend/src/middleware/auth.js
# Token verification logic सही है?

# Local test करो फिर push करो:
git add .
git commit -m "fix: update JWT configuration"
git push origin main
```

---

## 🔴 FRONTEND ERRORS

### ❌ Error 1: "Cannot fetch from API" (Network error)

**Symptoms:**
- Frontend console में:
```
Failed to fetch from https://backend-url/api/products
Network error
```

**Causes:**
- Backend URL गलत है `.env` में
- Backend server running नहीं है
- CORS issue

**Fix:**
```bash
# Step 1: Check VITE_API_BASE_URL
cd frontend
cat .env  # या .env.production
# VITE_API_BASE_URL सही है?

# Step 2: Backend URL update करो (अगर गलत है)
# Edit करो: VITE_API_BASE_URL = https://your-actual-backend-url.onrender.com

# Step 3: Rebuild करो
npm run build

# Step 4: Test करो locally:
npm run preview
# Browser में API requests log देख (F12 → Network tab)

# Step 5: Push करो
git add frontend/.env
git commit -m "fix: update API base URL"
git push origin main

# Vercel auto-redeploy करेगा (1-2 mins)
```

---

### ❌ Error 2: "Module not found" या build failure

**Symptoms:**
- Vercel build fails
- या: `Cannot find module`

**Causes:**
- Dependencies missing हैं
- Import path गलत है

**Fix:**
```bash
cd frontend

# Step 1: Install करो
npm install

# Step 2: Check करो कोई error हैं?
npm run build

# अगर error दिखता है:
# 1. Error message read करो carefully
# 2. Missing file को find करो या create करो
# 3. Import statements check करो

# Step 3: Lint check करो
npm run lint
# Errors fix करो: npm run lint:fix

# Step 4: Push करो
git add .
git commit -m "fix: resolve build errors"
git push origin main

# Vercel auto-build होगा
```

---

### ❌ Error 3: "Blank page" या nothing renders

**Symptoms:**
- Frontend URL खोलो = blank page
- Console में JavaScript errors

**Causes:**
- React app start नहीं हुआ
- Entry point गलत है
- Environment variables नहीं मिले

**Fix:**
```bash
cd frontend

# Step 1: Locally preview कर:
npm run build
npm run preview

# Step 2: Browser console देख (F12):
# कोई JavaScript error दिख रहा है?

# Step 3: index.html check करो
cat index.html
# <div id="root"></div> है?

# Step 4: main.jsx check करो
cat src/main.jsx
# React.createRoot() सही है?

# Step 5: .env.production check करो
# VITE_API_BASE_URL सही है?

# ✅ Fix करके push करो
git add .
git commit -m "fix: resolve frontend rendering issues"
git push origin main
```

---

### ❌ Error 4: "Page not found" (404) or routing issues

**Symptoms:**
- कोई page खोलते हो = 404
- या: Page not found error

**Causes:**
- React Router configuration गलत है
- Vercel का configuration गलत है

**Fix:**
```bash
# Step 1: vercel.json check करो (root में)
cat vercel.json
# Should have rewrites for React routing:
# {
#   "rewrites": [
#     { "source": "/(.*)", "destination": "/index.html" }
#   ]
# }

# Step 2: नहीं है तो create करो:
# File: vercel.json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

# Step 3: Push करो
git add vercel.json
git commit -m "fix: add vercel routing configuration"
git push origin main

# Vercel redeploy करेगा
```

---

## 🔴 COMMON CONNECTION ISSUES

### ❌ Error: "Cannot connect to WebSocket"

**Symptoms:**
- Socket.IO connection fail
- Real-time features काम नहीं कर रहे

**Causes:**
- Socket URL गलत है
- Backend CORS में socket.io allow नहीं है

**Fix:**
```bash
# Frontend (.env या vite.config.js):
VITE_SOCKET_URL = https://your-backend-url.onrender.com
# (VITE_API_BASE_URL के जैसा ही होना चाहिए)

# Backend (src/app.js):
import { io } from 'socket.io';

const io = require('socket.io')(server, {
  cors: {
    origin: ['https://frontend-url', 'https://admin-url'],
    credentials: true
  }
});

# Push करो:
git add frontend .env backend/src/app.js
git commit -m "fix: socket.io configuration"
git push origin main
```

---

### ❌ Error: "Mixed Content" (HTTP और HTTPS)

**Symptoms:**
- Browser console में warning:
```
Mixed Content: The page was loaded over HTTPS, 
but requested an insecure resource 'http://...'
```

**Causes:**
- API URL HTTP है जबकि frontend HTTPS है

**Fix:**
```bash
# सब URLs को HTTPS करो:

# frontend/.env.production:
VITE_API_BASE_URL=https://your-backend.onrender.com  # NOT http://

# admin/.env.production:
VITE_API_BASE_URL=https://your-backend.onrender.com  # NOT http://

# backend URLs में भी HTTPS:
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app

git add .
git commit -m "fix: use HTTPS everywhere"
git push origin main
```

---

## 🔴 DATABASE ISSUES

### ❌ Error: "Database disk is full"

**Symptoms:**
- Render logs में: `Disk full` या similar

**Causes:**
- Database size बढ़ गया है
- Old data accumulate हुआ है

**Fix:**
```bash
# Option 1: Cleanup करो
# Render PostgreSQL में:
# 1. Query चलाओ: DELETE FROM logs WHERE created_at < now() - interval '30 days';
# 2. Optimize: VACUUM ANALYZE;

# Option 2: Upgrade करो paid plan में
# या backup लेके नया database create करो
```

---

### ❌ Error: "Too many connections"

**Symptoms:**
- Error: `FATAL: too many connections`

**Causes:**
- Connection pool limit exceed हो गई

**Fix:**
```bash
# backend/.env में add करो:
DATABASE_MAX_CONNECTIONS=10
DATABASE_MIN_CONNECTIONS=2

# Connection pooling configure करो (Prisma में):
# prisma/schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}

# फिर:
git add .
git commit -m "fix: connection pool configuration"
git push origin main
```

---

## 📊 LOGS CHECK करने का तरीका

### Render Backend Logs:
```
1. Render Dashboard खोलो
2. ezstore-backend select करो
3. "Logs" tab क्लिक करो
4. Real-time logs देख:
   - Blue = Info message
   - Yellow = Warning
   - Red = Error ⚠️
5. Errors manually fix करो
```

### Vercel Frontend/Admin Logs:
```
1. Vercel Dashboard खोलो
2. Project select करो
3. "Deployments" tab
4. Latest deployment click करो
5. "Build Logs" देख
6. या "Runtime Logs" (deployment के बाद)
```

### Browser Console Logs:
```
1. Frontend URL खोलो
2. F12 दबाओ
3. "Console" tab
4. Errors/warnings देख:
   - Red = JavaScript error
   - Yellow = Warning
   - Blue = Info
```

---

## 🆘 WHEN NOTHING WORKS

### Nuclear option (सब reset करो):

```bash
# ⚠️ यह सब को delete कर सकता है!

# Step 1: Local में fresh clone करो
cd c:\Users\shali\Desktop
git clone https://github.com/your-username/EZStore.git EZStore-fresh

# Step 2: नया backend setup करो
cd EZStore-fresh\backend
npm install
# .env file से database re-setup करो

# Step 3: Frontend setup करो
cd ..\frontend
npm install

# Step 4: सब locally test करो
# अगर यहाँ काम करे तो production में भी काम करेगा

# Step 5: Production services delete करो (अगर नहीं चल रहे हैं)
# Render → Services → Delete
# Vercel → Projects → Delete
# फिर fresh deploy करो

# Step 6: नया database setup करो
# Render → PostgreSQL → Delete + Create New
```

---

## 📞 QUICK REFERENCE

| Problem | Solution | Time |
|---------|----------|------|
| API not connecting | Check .env URL + CORS | 5 min |
| Blank page | Check console + verify entry point | 10 min |
| Build failed | npm install + npm run build locally | 10 min |
| Database error | Check DATABASE_URL + restart | 5 min |
| 404 errors | Add vercel.json routing config | 5 min |
| CORS error | Update allowedOrigins in backend | 5 min |
| JWT error | Regenerate JWT_SECRET | 5 min |
| WebSocket fail | Check VITE_SOCKET_URL | 5 min |

---

## 💡 PREVENTION TIPS

✅ **Future errors से बचने के लिए:**

1. **Local testing करो** - Deploy करने से पहले सब locally test करो
2. **Logs regularly check करो** - Issues early catch करने के लिए
3. **Backup लो** - Database का regular backup लो
4. **Staging deploy करो** - Production deploy करने से पहले staging environment में test करो
5. **CI/CD setup करो** - Automated tests run करो हर commit पर
6. **Monitor करो** - Uptime + errors monitor करने के लिए tools use करो

---

**अगर problem अभी भी resolve नहीं हुआ तो:**
1. GitHub issues create करो detailed logs के साथ
2. Stack Overflow पर search करो error message के साथ
3. Render/Vercel support contact करो

**Good luck! 🍀**
