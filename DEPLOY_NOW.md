# 🚀 DEPLOY TO VERCEL - ACTION ITEMS

## ✅ What I Fixed For You

1. **Fixed N8N service** - Now uses environment variable instead of hardcoded localhost
2. **Updated .env files** - Added `VITE_N8N_WEBHOOK_URL` configuration
3. **Committed all changes** - Pushed to GitHub (commit: d8ece75)
4. **Created deployment guide** - See `VERCEL_DEPLOYMENT_GUIDE.md`

---

## ⚠️ CRITICAL: Before Deploying to Vercel

Your app **WILL NOT WORK** on Vercel until you deploy N8N to a public URL.

---

## 📋 Deployment Steps (In Order)

### STEP 1: Deploy N8N Workflow (Choose One)

#### Option A: n8n.cloud (Easiest - Free)

1. Go to https://n8n.cloud
2. Sign up for free account
3. Create new instance
4. Import `n8n-disease-detection-workflow.json`
5. Set environment variables:
   - `HUGGINGFACE_API_KEY` = `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`
   - `GROQ_API_KEY` = `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`
6. **ACTIVATE THE WORKFLOW** (toggle switch - must be green!)
7. Copy webhook URL (looks like: `https://yourname.app.n8n.cloud/webhook/disease-detection`)

#### Option B: Render (Free)

1. Go to https://render.com
2. Create new Web Service
3. Select Docker
4. Use image: `n8nio/n8n`
5. Add environment variables (same as above)
6. Deploy and copy webhook URL

#### Option C: Railway (Free $5 credit)

1. Go to https://railway.app
2. Deploy n8n template
3. Set environment variables
4. Copy webhook URL

---

### STEP 2: Configure Vercel

1. Go to https://vercel.com
2. Import your GitHub repo: `sudanva21/AgroGuard`
3. Configure build settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables** (Settings → Environment Variables):

```
VITE_SUPABASE_URL=https://jzmhvjgqsgxvhxmcrabm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bWh2amdxc2d4dmh4bWNyYWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Mjc2NDAsImV4cCI6MjA3OTQwMzY0MH0.KWv49VInj0fRtx15wxYAPP85ANGor3E98aueBDOJm6o

VITE_GROQ_API_KEY=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
VITE_GOOGLE_GEMINI_API_KEY=AIzaSyAcu8G4ObS6XmSks8b0ihvQZap685Qx704
VITE_HUGGINGFACE_API_KEY=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

VITE_OPENWEATHER_API_KEY=b0499ca14f87f338580d1765151babc6
VITE_FAST2SMS_API_KEY=EnGXP5NI9j8mtogeSAbR6c73z1hJyZrdC4vTHKpLO0uWxw2lBF3kIp2lqifUJzGe6KRungrMZ9jyXCY0

VITE_TWILIO_ACCOUNT_SID=AC62f8c147c8235c6de45b25f0315966a9
VITE_TWILIO_AUTH_TOKEN=c6f171775501a663ef79032ebd5ee76e
VITE_TWILIO_PHONE_NUMBER=+19787979187
VITE_TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

VITE_RAZORPAY_KEY_ID=rzp_test_K7CipNQYyyMMkP

VITE_N8N_WEBHOOK_URL=<PASTE YOUR N8N WEBHOOK URL HERE>
```

⚠️ **REPLACE** `VITE_N8N_WEBHOOK_URL` with your actual N8N URL from Step 1!

5. Click **Deploy**

---

### STEP 3: Verify Deployment

1. Wait for build to complete (~2 minutes)
2. Open your Vercel URL (e.g., `agroguard-ai.vercel.app`)
3. Go to Disease Detection page
4. Upload a test image
5. Check browser console (F12) for:
   - ✅ `🚀 Starting N8N disease detection...`
   - ✅ `📤 Sending to N8N: https://...`
   - ✅ `✅ N8N response parsed: {...}`

---

## 🐛 Troubleshooting

### Error: "Cannot connect to N8N"

**Solution:**
1. ✅ Check N8N workflow is **ACTIVATED** (green toggle in n8n.cloud)
2. ✅ Verify `VITE_N8N_WEBHOOK_URL` in Vercel matches your N8N URL exactly
3. ✅ Test N8N manually:
   ```bash
   curl -X POST https://your-n8n-url/webhook/disease-detection \
     -H "Content-Type: application/json" \
     -d "{\"image\":\"test\",\"crop\":\"rice\"}"
   ```

### Error: "N8N returned empty response"

**Solution:**
1. ✅ Check N8N has environment variables set (Hugging Face & Groq API keys)
2. ✅ Check N8N execution history for errors
3. ✅ Verify workflow nodes are connected properly

### Build Failed on Vercel

**Solution:**
1. ✅ Check all environment variables are set
2. ✅ Review build logs in Vercel dashboard
3. ✅ Ensure `package.json` has all dependencies

---

## 📱 Alternative: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add VITE_N8N_WEBHOOK_URL
```

---

## ✅ Final Checklist

- [ ] N8N deployed to n8n.cloud/Render/Railway
- [ ] N8N workflow imported and ACTIVATED
- [ ] N8N environment variables set (Hugging Face + Groq)
- [ ] N8N webhook URL copied
- [ ] Vercel project created
- [ ] All environment variables added to Vercel
- [ ] `VITE_N8N_WEBHOOK_URL` set correctly
- [ ] Deployment successful
- [ ] Disease detection tested on production
- [ ] All features working

---

## 🎯 Your Next Actions

1. **Deploy N8N now** → Choose n8n.cloud (fastest)
2. **Get webhook URL** → Copy from n8n.cloud dashboard
3. **Deploy to Vercel** → Import GitHub repo
4. **Add env vars** → Paste N8N webhook URL
5. **Test & Launch** → Upload image, verify it works

---

## 📞 Need Help?

- Read: `VERCEL_DEPLOYMENT_GUIDE.md` (comprehensive guide)
- Check: N8N execution logs in n8n.cloud
- Review: Vercel deployment logs
- Test: N8N webhook manually with curl

---

**Ready? Deploy N8N first, then Vercel! 🚀**
