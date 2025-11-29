# ✅ READY TO DEPLOY TO VERCEL

## Configuration Complete

Your N8N webhook URL has been updated to:
```
https://n8n-0lhx.onrender.com/webhook/disease-detection
```

---

## 🚀 Deploy to Vercel Now

### Option 1: Vercel Dashboard (Recommended)

#### Step 1: Go to Vercel
1. Visit: https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose: `sudanva21/AgroGuard`

#### Step 2: Configure Build Settings
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Step 3: Add Environment Variables

Click **"Environment Variables"** and add these:

```
VITE_SUPABASE_URL=https://jzmhvjgqsgxvhxmcrabm.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bWh2amdxc2d4dmh4bWNyYWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Mjc2NDAsImV4cCI6MjA3OTQwMzY0MH0.KWv49VInj0fRtx15wxYAPP85ANGor3E98aueBDOJm6o

VITE_GROQ_API_KEY=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

VITE_GOOGLE_GEMINI_API_KEY=AIzaSyAcu8G4ObS6XmSks8b0ihvQZap685Qx704

VITE_HUGGINGFACE_API_KEY=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

VITE_OPENWEATHER_API_KEY=b0499ca14f87f338580d1765151babc6

VITE_TWILIO_ACCOUNT_SID=AC62f8c147c8235c6de45b25f0315966a9

VITE_TWILIO_AUTH_TOKEN=c6f171775501a663ef79032ebd5ee76e

VITE_TWILIO_PHONE_NUMBER=+19787979187

VITE_TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

VITE_FAST2SMS_API_KEY=EnGXP5NI9j8mtogeSAbR6c73z1hJyZrdC4vTHKpLO0uWxw2lBF3kIp2lqifUJzGe6KRungrMZ9jyXCY0

VITE_RAZORPAY_KEY_ID=rzp_test_K7CipNQYyyMMkP

VITE_N8N_WEBHOOK_URL=https://n8n-0lhx.onrender.com/webhook/disease-detection
```

#### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://agroguard-ai.vercel.app` (or similar)

---

### Option 2: Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add VITE_N8N_WEBHOOK_URL
# When prompted, paste: https://n8n-0lhx.onrender.com/webhook/disease-detection
```

---

## ✅ Verify Deployment

### 1. Test N8N Connection
After deployment, open your Vercel app and:

1. Go to **Disease Detection** page
2. Upload a test plant image
3. Open browser console (F12)
4. Look for:
   ```
   🚀 Starting N8N disease detection...
   📤 Sending to N8N: https://n8n-0lhx.onrender.com/webhook/disease-detection
   ✅ N8N response parsed: {...}
   ```

### 2. Check for Errors

If you see errors:

#### "Cannot connect to N8N"
- ✅ Go to Render dashboard
- ✅ Check N8N service is running
- ✅ Verify environment variables in Render:
  - `WEBHOOK_URL=https://n8n-0lhx.onrender.com`
  - `N8N_HOST=n8n-0lhx.onrender.com`
  - `N8N_PROTOCOL=https`

#### "N8N returned empty response"
- ✅ Open: https://n8n-0lhx.onrender.com
- ✅ Verify workflow is **activated** (green toggle)
- ✅ Check workflow has API keys set:
  - `HUGGINGFACE_API_KEY`
  - `GROQ_API_KEY`

#### "Workflow not found"
- ✅ Import `n8n-disease-detection-workflow.json` to Render N8N
- ✅ Activate the workflow

---

## 🧪 Test N8N Webhook Manually

Before deploying, verify N8N is working:

```bash
curl -X POST https://n8n-0lhx.onrender.com/webhook/disease-detection \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==\",\"crop\":\"tomato\",\"timestamp\":\"2025-11-29T00:00:00Z\"}"
```

**Expected:** JSON response with disease detection result  
**If fails:** Check Render N8N configuration

---

## 📋 Pre-Deployment Checklist

- [x] N8N deployed to Render at: `n8n-0lhx.onrender.com`
- [x] N8N workflow imported and activated
- [x] N8N webhook URL updated in `.env`: `https://n8n-0lhx.onrender.com/webhook/disease-detection`
- [ ] N8N webhook tested manually (run curl command above)
- [ ] Vercel project created or selected
- [ ] All environment variables added to Vercel
- [ ] Vercel deployment initiated
- [ ] Disease detection tested on production
- [ ] All features verified working

---

## 🎯 Production URLs After Deployment

- **Frontend (Vercel)**: `https://agroguard-ai.vercel.app` (or your custom domain)
- **N8N Workflow (Render)**: `https://n8n-0lhx.onrender.com`
- **N8N Webhook**: `https://n8n-0lhx.onrender.com/webhook/disease-detection`
- **Supabase Backend**: `https://jzmhvjgqsgxvhxmcrabm.supabase.co`

---

## ⚠️ Important: Do NOT Commit .env File

Your `.env` file contains sensitive API keys and should NOT be committed to git.

To restore it without committing:
```bash
git restore .env
```

The production environment variables will be set directly in Vercel dashboard.

---

## 🚀 Ready to Deploy!

1. ✅ Test N8N webhook (run curl command above)
2. ✅ Go to Vercel dashboard
3. ✅ Import your GitHub repository
4. ✅ Add all environment variables
5. ✅ Click Deploy
6. ✅ Test disease detection on production

**Your app is ready for production deployment!** 🎉
