# 🚀 TechHub Deployment Guide

## The Problem You're Facing
When you turn off your laptop, your backend server stops running. Even though your Supabase database is online, your website can't work because it needs the backend server to communicate with the database.

## The Solution
Deploy your backend server to a cloud hosting platform that runs 24/7.

---

## 📋 Prerequisites

1. **Your Supabase Database Connection String**
   - Log into Supabase
   - Go to Project Settings → Database
   - Copy the "Connection String" (URI format)
   - Example: `postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres`

2. **Create a GitHub Repository** (recommended for easier deployment)
   - Go to https://github.com
   - Create a new repository
   - Push your code to GitHub

---

## 🎯 Recommended: Deploy to Render (FREE)

Render offers free hosting perfect for your project.

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with your GitHub account

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:

**Basic Settings:**
```
Name: techhub-backend
Environment: Node
Region: Choose closest to you
Branch: main (or your default branch)
Root Directory: (leave blank)
Build Command: npm install
Start Command: npm start
```

### Step 3: Add Environment Variables
Click "Advanced" and add these environment variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Supabase connection string |
| `DB_TYPE` | `postgresql` |
| `JWT_SECRET` | Any random string (e.g., `techhub-secret-2026-your-random-string`) |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

**To get your Supabase connection string:**
- Supabase Dashboard → Settings → Database → Connection String (URI)
- Copy the full string and replace `[YOUR-PASSWORD]` with your actual password

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. You'll get a URL like: `https://techhub-backend.onrender.comcom`

### Step 5: Update Your Frontend
You need to update your website to use the deployed backend URL instead of localhost.

Edit `config.js` to use your deployed backend:

```javascript
const API_URL = 'https://your-app-name.onrender.com/api';
```

---

## 🔧 Alternative: Deploy to Railway

Railway also offers free hosting with generous limits.

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository

### Step 3: Add Environment Variables
Click on your service → Variables tab:

```
DATABASE_URL=your_supabase_connection_string
DB_TYPE=postgresql
JWT_SECRET=your-random-secret-key
NODE_ENV=production
```

### Step 4: Configure Start Command
Railway should auto-detect your `package.json`, but verify:
- Build Command: `npm install`
- Start Command: `npm start`

### Step 5: Deploy
1. Railway will automatically deploy
2. Click "Settings" → "Generate Domain" to get your public URL
3. Update `config.js` with this URL

---

## 🌐 Alternative: Deploy to Heroku

Heroku offers 1000 free hours per month (enough for 24/7 if you verify with a credit card).

### Step 1: Install Heroku CLI
Download from https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Login and Create App
```bash
heroku login
heroku create techhub-backend
```

### Step 3: Set Environment Variables
```bash
heroku config:set DATABASE_URL="your_supabase_connection_string"
heroku config:set DB_TYPE="postgresql"
heroku config:set JWT_SECRET="your-random-secret"
heroku config:set NODE_ENV="production"
```

### Step 4: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

Your app will be at: `https://techhub-backend.herokuapp.com`

---

## ✅ After Deployment Checklist

### 1. Test Your Backend API
Visit: `https://your-deployed-url.com/api/health`

You should see:
```json
{
  "status": "Server is running",
  "timestamp": "2026-02-16T..."
}
```

### 2. Update Frontend Configuration
Edit `c:\Users\96179\Desktop\train\config.js`:

**Before:**
```javascript
const API_URL = window.location.origin + '/api';
```

**After:**
```javascript
// Use your deployed backend URL
const API_URL = 'https://your-deployed-backend.onrender.com/api';
```

### 3. Deploy Frontend to Netlify or Vercel

**Option A: Netlify**
1. Go to https://netlify.com
2. Drag and drop your project folder
3. Done! You'll get a URL like `https://your-site.netlify.app`

**Option B: Vercel**
1. Go to https://vercel.com
2. Connect your GitHub repository
3. Deploy
4. You'll get a URL like `https://your-site.vercel.app`

**Important:** Make sure to use the parent directory (train), not just the backend folder, since your HTML files are in the root.

---

## 🔍 Troubleshooting

### "Cannot connect to database"
- Check your Supabase connection string is correct
- Verify environment variables are set correctly
- Check Supabase dashboard → Database → Connection pooler settings

### "CORS errors"
- Make sure your frontend is using the correct backend URL
- Backend already has CORS enabled in `server.js`

### "JWT errors / Cannot login"
- Verify JWT_SECRET environment variable is set
- Make sure it's the same value you used before (or create new accounts)

### "Server keeps sleeping/going offline"
- Free tier services may sleep after inactivity
- Render: First request may take 30-50 seconds to wake up
- Railway: Consider upgrading for 24/7 uptime
- Use a service like UptimeRobot to ping your server every 5 minutes

---

## 📝 Quick Summary

1. **Deploy Backend** to Render/Railway/Heroku with Supabase credentials
2. **Get Backend URL** (e.g., `https://your-app.onrender.com`)
3. **Update config.js** to use the deployed backend URL
4. **Deploy Frontend** to Netlify/Vercel
5. **Access your website** through the frontend URL

Your website will now work 24/7 even when your laptop is off! 🎉

---

## 💡 Need Help?

Common issues:
- If you see "nothing works", check the browser console (F12) for errors
- Make sure you updated `config.js` with the correct backend URL
- Verify all environment variables are set on the hosting platform
- Test the `/api/health` endpoint to confirm backend is running
