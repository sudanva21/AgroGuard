# N8N Disease Detection - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### What Changed?

**Before**: Frontend → HuggingFace → Groq → Response (2-3 API calls per image)  
**Now**: Frontend → N8N Workflow → Response (1 API call, centralized processing)

### Benefits

✅ **Reduced API Costs**: Single endpoint instead of multiple API calls  
✅ **Better Caching**: N8N can cache results to reduce duplicate requests  
✅ **Easy Monitoring**: See all requests in N8N dashboard  
✅ **Flexible**: Change AI models without touching frontend code  
✅ **Free Forever**: Using 100% free AI models (HuggingFace + Groq)

---

## Setup Steps

### 1️⃣ Install N8N (if not already installed)

```bash
npm install -g n8n
```

### 2️⃣ Start N8N

```bash
n8n start
```

N8N will open at: http://localhost:5678

### 3️⃣ Get Free API Keys

**HuggingFace** (for image analysis):
1. Go to https://huggingface.co/settings/tokens
2. Create new token
3. Copy it (starts with `hf_...`)

**Groq** (for disease detection):
1. Go to https://console.groq.com/keys
2. Create API key
3. Copy it (starts with `gsk_...`)

### 4️⃣ Configure N8N Environment Variables

In N8N:
1. Go to **Settings** → **Environment Variables**
2. Add:
   - `HUGGINGFACE_API_KEY` = your HuggingFace token
   - `GROQ_API_KEY` = your Groq API key
3. Save and restart N8N

### 5️⃣ Import Workflow

1. In N8N, click **Workflows** → **Import from File**
2. Select: `n8n-disease-detection-workflow.json`
3. Click **Import**

### 6️⃣ Activate Workflow

1. Open the imported workflow
2. Click **Activate** toggle (top-right, should turn green)
3. Done! ✅

### 7️⃣ Test the Integration

Start your React app:

```bash
npm run dev
```

1. Go to **Disease Detection** page
2. Upload a crop image
3. Click **Analyze Image**
4. You should see: "Analysis complete! Results powered by N8N workflow."

---

## Verify It's Working

### Check Browser Console

You should see:
```
🚀 Starting N8N disease detection...
📤 Sending to N8N: http://localhost:5678/webhook/disease-detection
✅ N8N response received: {disease: "...", confidence: "..."}
```

### Check N8N Dashboard

1. Go to http://localhost:5678
2. Click **Executions** in sidebar
3. You should see successful executions with green checkmarks

---

## Troubleshooting

### ❌ "Cannot connect to N8N"

**Fix**: Make sure N8N is running
```bash
n8n start
```

### ❌ "HuggingFace API failed"

**Fix**: Check your HuggingFace API key in N8N settings

### ❌ "Workflow not found"

**Fix**: Make sure workflow is activated (green toggle in N8N)

---

## What's Next?

✅ Frontend code updated to use N8N service  
✅ Old direct API calls replaced with webhook calls  
✅ Caching enabled for faster repeat requests  

**You're all set!** 🎉

---

## File Changes Summary

### New Files Created

1. **`src/services/n8nDiseaseService.js`**
   - New service for N8N webhook integration
   - Handles image upload to N8N
   - Built-in caching (30 min)

2. **`n8n-disease-detection-workflow.json`**
   - Ready-to-import N8N workflow
   - Configured with HuggingFace + Groq

3. **`N8N_DISEASE_DETECTION_SETUP.md`**
   - Complete setup guide
   - Troubleshooting tips
   - Production deployment guide

4. **`N8N_QUICK_START.md`** (this file)
   - 5-minute quick start

### Modified Files

1. **`src/pages/DiseaseDetection.jsx`**
   - Line 3-4: Imports N8N service
   - Line 206: Uses `detectDiseaseViaN8N()` instead of `detectDiseaseFromImage()`

2. **`.env.example`**
   - Added N8N configuration notes

---

## Architecture Diagram

```
┌─────────────────┐
│  React Frontend │
│  (User uploads  │
│      image)     │
└────────┬────────┘
         │ POST /webhook/disease-detection
         │ { image: base64, crop: "Tomato" }
         ▼
┌─────────────────────────────────────────┐
│            N8N Workflow                  │
│  ┌─────────────────────────────────┐   │
│  │ 1. Receive Image (Base64)        │   │
│  └──────────┬───────────────────────┘   │
│             ▼                             │
│  ┌─────────────────────────────────┐   │
│  │ 2. Convert to Binary             │   │
│  └──────────┬───────────────────────┘   │
│             ▼                             │
│  ┌─────────────────────────────────┐   │
│  │ 3. HuggingFace Image Analysis    │   │
│  │    (BLIP Model - FREE)           │   │
│  └──────────┬───────────────────────┘   │
│             ▼                             │
│  ┌─────────────────────────────────┐   │
│  │ 4. Groq Disease Detection        │   │
│  │    (Llama 3.3 70B - FREE)        │   │
│  └──────────┬───────────────────────┘   │
│             ▼                             │
│  ┌─────────────────────────────────┐   │
│  │ 5. Parse & Format Response       │   │
│  └──────────┬───────────────────────┘   │
└─────────────┼───────────────────────────┘
              ▼
      ┌─────────────────┐
      │  JSON Response   │
      │  {               │
      │   disease: "..." │
      │   symptoms: [...] │
      │   confidence: "%" │
      │  }               │
      └─────────────────┘
```

---

## Cost Comparison

| Approach | API Calls | Cost/Month |
|----------|-----------|------------|
| **Before** | 2-3 per image | $0 (but hitting rate limits) |
| **After (N8N)** | 1 per image | **$0** (optimized, cached) |

---

## Support

Need help? Check these files:
- **Quick Issues**: This file (N8N_QUICK_START.md)
- **Detailed Setup**: N8N_DISEASE_DETECTION_SETUP.md
- **N8N Docs**: https://docs.n8n.io/

---

**Ready to test? Upload an image and see the magic! ✨**
