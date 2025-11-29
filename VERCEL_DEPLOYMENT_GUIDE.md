# 🚀 Vercel Deployment Guide - AgroGuard AI

## Prerequisites

Before deploying to Vercel, you **MUST** deploy your N8N workflow instance to a public URL.

---

## Step 1: Deploy N8N Workflow

### Option A: n8n.cloud (Recommended - Free Tier Available)

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for free account
3. Create a new workflow instance
4. Import workflow from `n8n-disease-detection-workflow.json`
5. Set environment variables in n8n.cloud:
   - `HUGGINGFACE_API_KEY` = Your Hugging Face token
   - `GROQ_API_KEY` = Your Groq API key
6. **Activate the workflow** (toggle switch on)
7. Copy your webhook URL (e.g., `https://your-instance.app.n8n.cloud/webhook/disease-detection`)

### Option B: Deploy to Render (Free)

```bash
# 1. Install n8n CLI
npm install n8n -g

# 2. Create Render account at render.com

# 3. Create new Web Service
#    - Environment: Docker
#    - Docker Image: n8nio/n8n
#    - Add environment variables:
#      N8N_BASIC_AUTH_ACTIVE=true
#      N8N_BASIC_AUTH_USER=admin
#      N8N_BASIC_AUTH_PASSWORD=your_password
#      WEBHOOK_URL=https://your-app.onrender.com

# 4. Deploy and note your webhook URL
```

### Option C: Railway (Free $5 credit)

```bash
# 1. Go to railway.app
# 2. Click "Deploy n8n" from templates
# 3. Set environment variables
# 4. Deploy and note webhook URL
```

---

## Step 2: Configure Vercel Environment Variables

Once N8N is deployed, add this to your Vercel project:

### Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Open your project
3. Go to **Settings → Environment Variables**
4. Add these variables:

```
# Supabase
VITE_SUPABASE_URL = https://jzmhvjgqsgxvhxmcrabm.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bWh2amdxc2d4dmh4bWNyYWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Mjc2NDAsImV4cCI6MjA3OTQwMzY0MH0.KWv49VInj0fRtx15wxYAPP85ANGor3E98aueBDOJm6o

# AI APIs
VITE_GROQ_API_KEY = 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
VITE_GOOGLE_GEMINI_API_KEY = AIzaSyAcu8G4ObS6XmSks8b0ihvQZap685Qx704
VITE_HUGGINGFACE_API_KEY = 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

# Weather & SMS
VITE_OPENWEATHER_API_KEY = b0499ca14f87f338580d1765151babc6
VITE_FAST2SMS_API_KEY = EnGXP5NI9j8mtogeSAbR6c73z1hJyZrdC4vTHKpLO0uWxw2lBF3kIp2lqifUJzGe6KRungrMZ9jyXCY0

# Twilio
VITE_TWILIO_ACCOUNT_SID = AC62f8c147c8235c6de45b25f0315966a9
VITE_TWILIO_AUTH_TOKEN = c6f171775501a663ef79032ebd5ee76e
VITE_TWILIO_PHONE_NUMBER = +19787979187
VITE_TWILIO_WHATSAPP_NUMBER = whatsapp:+14155238886

# Payment
VITE_RAZORPAY_KEY_ID = rzp_test_K7CipNQYyyMMkP

# ⚠️ CRITICAL: Replace this with your deployed N8N webhook URL
VITE_N8N_WEBHOOK_URL = https://your-n8n-instance.app.n8n.cloud/webhook/disease-detection
```

### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Set environment variables
vercel env add VITE_N8N_WEBHOOK_URL
# Paste your N8N webhook URL when prompted

# Add other variables similarly or bulk import from .env
vercel env pull
```

---

## Step 3: Deploy to Vercel

### Method 1: Via GitHub (Recommended)

```bash
# 1. Commit all changes
git add .
git commit -m "feat: add N8N workflow integration for disease detection"
git push origin main

# 2. Go to vercel.com
# 3. Click "Import Project"
# 4. Select your GitHub repo
# 5. Configure:
#    - Framework Preset: Vite
#    - Build Command: npm run build
#    - Output Directory: dist
# 6. Add environment variables (from Step 2)
# 7. Click "Deploy"
```

### Method 2: Via Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# Follow prompts:
# - Setup and deploy? Y
# - Which scope? Your account
# - Link to existing project? N (first time) or Y
# - Project name? agroguard-ai
# - Directory? ./
# - Override settings? N

# 4. Deploy to production
vercel --prod
```

---

## Step 4: Verify Deployment

### Test N8N Connection

1. Open your deployed Vercel URL
2. Go to Disease Detection page
3. Upload a test image
4. Check browser console for:
   ```
   🚀 Starting N8N disease detection...
   📤 Sending to N8N: https://your-n8n-instance...
   ✅ N8N response parsed: {...}
   ```

### Troubleshooting

#### Error: "Cannot connect to N8N"
- ✅ Verify N8N workflow is **activated** (green toggle)
- ✅ Check N8N webhook URL is correct in Vercel env vars
- ✅ Test N8N webhook manually:
  ```bash
  curl -X POST https://your-n8n-instance.app/webhook/disease-detection \
    -H "Content-Type: application/json" \
    -d '{"image":"test","crop":"rice"}'
  ```

#### Error: "N8N returned empty response"
- ✅ Check N8N workflow has Hugging Face & Groq API keys set
- ✅ Verify workflow nodes are properly connected
- ✅ Check N8N execution logs for errors

#### Build Failed on Vercel
- ✅ Ensure all environment variables are set
- ✅ Check build logs for missing dependencies
- ✅ Verify `package.json` has all required packages

---

## Step 5: Post-Deployment Configuration

### Update Vercel Domain (Optional)

```bash
# Add custom domain
vercel domains add yourdomain.com

# Or use Vercel domain
# https://agroguard-ai.vercel.app
```

### Enable Analytics

1. Go to Vercel Dashboard → Your Project
2. Click **Analytics** tab
3. Enable Web Analytics (free)

### Enable Speed Insights

1. Install package:
   ```bash
   npm install @vercel/analytics
   ```

2. Update `src/main.jsx`:
   ```jsx
   import { inject } from '@vercel/analytics'
   inject()
   ```

### Setup Monitoring

1. Enable Vercel Monitoring (Settings → Monitoring)
2. Set up error tracking
3. Configure performance budgets

---

## Step 6: Continuous Deployment

### Auto-Deploy on Git Push

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "your message"
git push origin main

# Vercel will automatically:
# 1. Detect push
# 2. Build project
# 3. Deploy to production
# 4. Send deployment notification
```

### Preview Deployments

Every pull request gets a preview URL:
1. Create feature branch
2. Make changes
3. Push and create PR
4. Vercel creates preview deployment
5. Test before merging

---

## Quick Deploy Checklist

- [ ] N8N workflow deployed and activated
- [ ] N8N webhook URL copied
- [ ] All environment variables added to Vercel
- [ ] `VITE_N8N_WEBHOOK_URL` set to production N8N URL
- [ ] Code committed and pushed to GitHub
- [ ] Vercel project connected to GitHub repo
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Deployment successful
- [ ] Disease detection tested and working
- [ ] All features verified on production

---

## Production URLs

After deployment, you'll have:

- **Frontend**: `https://agroguard-ai.vercel.app`
- **N8N Workflow**: `https://your-instance.app.n8n.cloud`
- **Supabase Backend**: `https://jzmhvjgqsgxvhxmcrabm.supabase.co`

---

## Support

If you encounter issues:

1. Check [Vercel Logs](https://vercel.com/dashboard/deployments)
2. Check [N8N Execution History](https://your-instance.app.n8n.cloud/executions)
3. Review browser console for errors
4. Check [Supabase Logs](https://app.supabase.com/project/_/logs)

---

## Cost Breakdown (FREE)

- ✅ **Vercel**: Free (Hobby plan - unlimited deployments)
- ✅ **N8N Cloud**: Free tier available (5 workflows)
- ✅ **Supabase**: Free tier (500MB database, 1GB file storage)
- ✅ **Hugging Face**: Free (unlimited inference API)
- ✅ **Groq**: Free (6000 requests/day)
- ✅ **OpenWeather**: Free (1000 calls/day)

**Total Cost: ₹0 / $0 per month** 🎉

---

**Ready to deploy? Follow the steps above! 🚀**
