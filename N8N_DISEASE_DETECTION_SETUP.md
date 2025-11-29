# N8N Disease Detection Workflow Setup

## Overview

This guide will help you set up the N8N workflow for disease detection using **100% FREE AI models**.

### Architecture

```
Frontend (React) 
    ↓
N8N Webhook
    ↓
HuggingFace (Image → Text) [FREE]
    ↓
Groq AI (Disease Analysis) [FREE]
    ↓
Structured JSON Response
```

---

## Prerequisites

✅ N8N installed and running on `http://localhost:5678`  
✅ HuggingFace account (free)  
✅ Groq API key (free)

---

## Step 1: Get Free API Keys

### HuggingFace API Key (FREE)

1. Go to https://huggingface.co/
2. Sign up / Log in
3. Click your profile → **Settings** → **Access Tokens**
4. Click **New token** → Name it `disease-detection` → Create
5. Copy the token (starts with `hf_...`)

### Groq API Key (FREE)

1. Go to https://console.groq.com/
2. Sign up / Log in
3. Go to **API Keys**
4. Click **Create API Key**
5. Copy the key (starts with `gsk_...`)

---

## Step 2: Configure N8N Environment Variables

### Option A: Via N8N UI

1. Open N8N at http://localhost:5678
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
HUGGINGFACE_API_KEY=hf_your_key_here
GROQ_API_KEY=gsk_your_key_here
```

### Option B: Via .env File (if running N8N locally)

Edit your N8N `.env` file:

```env
HUGGINGFACE_API_KEY=hf_your_key_here
GROQ_API_KEY=gsk_your_key_here
```

Restart N8N after adding variables.

---

## Step 3: Import Workflow to N8N

1. Open N8N at http://localhost:5678
2. Click **Workflows** in sidebar
3. Click **Import from File**
4. Select `n8n-disease-detection-workflow.json`
5. Click **Import**

---

## Step 4: Activate the Workflow

1. Open the imported workflow "Disease Detection - AgroGuard AI"
2. Click the **Webhook Trigger** node
3. Copy the **Webhook URL** (should be like `http://localhost:5678/webhook/disease-detection`)
4. Click **Activate** toggle in top-right corner (should turn green)

---

## Step 5: Test the Workflow

### Test via N8N UI

1. Click on **Webhook Trigger** node
2. Click **Listen for Test Event**
3. Open a new terminal and run:

```bash
curl -X POST http://localhost:5678/webhook/disease-detection \
  -H "Content-Type: application/json" \
  -d '{
    "image": "base64_encoded_image_here",
    "crop": "Tomato",
    "timestamp": "2025-11-28T08:00:00.000Z"
  }'
```

4. Check N8N - you should see data flowing through nodes

### Test via Frontend

1. Start your React app:
```bash
npm run dev
```

2. Go to **Disease Detection** page
3. Upload a crop image
4. Click **Analyze Image**
5. Check browser console for logs

---

## Step 6: Update Frontend Configuration (Optional)

If your N8N is NOT on `localhost:5678`, update the webhook URL:

**File**: `src/services/n8nDiseaseService.js`

```javascript
const N8N_WEBHOOK_URL = 'http://YOUR_N8N_URL:5678/webhook/disease-detection'
```

---

## Workflow Node Breakdown

### 1. **Webhook Trigger**
- Receives POST requests from frontend
- Accepts: `{ image: base64, crop: string }`

### 2. **Extract Request Data**
- Parses incoming JSON
- Extracts crop name and image data

### 3. **Convert Base64 to Binary**
- Converts base64 string to binary file
- Required for HuggingFace API

### 4. **HuggingFace Image Analysis**
- **Model**: `Salesforce/blip-image-captioning-large`
- **Cost**: 100% FREE (unlimited requests)
- **Output**: Text description of image

### 5. **Check HF Success**
- Validates HuggingFace response
- Fallback if analysis fails

### 6. **Parse HF Response**
- Extracts image description from HF output
- Prepares for disease analysis

### 7. **Groq Disease Analysis**
- **Model**: `llama-3.3-70b-versatile`
- **Cost**: FREE (6000 requests/day)
- **Input**: Image description + crop name
- **Output**: Disease diagnosis in JSON

### 8. **Parse Disease Response**
- Extracts structured JSON from AI response
- Formats for frontend consumption

### 9. **Respond to Webhook**
- Returns JSON response to frontend
- Completes the request

---

## Response Format

```json
{
  "disease": "Late Blight",
  "scientificName": "Phytophthora infestans",
  "severity": "High",
  "confidence": "85%",
  "description": "A fungal disease affecting tomato plants...",
  "symptoms": [
    "Dark brown spots on leaves",
    "White fuzzy growth on undersides",
    "Rapid leaf decay",
    "Stem lesions"
  ],
  "causes": [
    "High humidity (>90%)",
    "Cool temperatures (15-20°C)",
    "Poor air circulation",
    "Overhead watering"
  ],
  "urgency": "Immediate action required - apply fungicide within 24 hours",
  "analyzedAt": "2025-11-28T08:00:00.000Z",
  "source": "N8N-Workflow"
}
```

---

## Troubleshooting

### ❌ Error: "Cannot connect to N8N"

**Solution**: Ensure N8N is running
```bash
# Check if N8N is running
curl http://localhost:5678

# Start N8N
n8n start
```

### ❌ Error: "HuggingFace API failed"

**Solution**: Check API key in N8N environment variables

1. Go to Settings → Environment Variables
2. Verify `HUGGINGFACE_API_KEY` is set correctly
3. Test key: https://huggingface.co/settings/tokens

### ❌ Error: "Groq API failed"

**Solution**: Check Groq API key

1. Verify `GROQ_API_KEY` in N8N settings
2. Check daily limit (6000 requests/day)
3. Test key: https://console.groq.com/keys

### ❌ Error: "Model loading (503)"

**Solution**: HuggingFace model is cold-starting

- Wait 10-15 seconds and retry
- First request may be slow (~20s)
- Subsequent requests are fast (~2-3s)

### ❌ Workflow not triggering

**Solution**: 
1. Check workflow is **Activated** (green toggle)
2. Verify webhook URL matches frontend service
3. Check N8N logs: Settings → Logs

---

## Performance Optimization

### 1. Enable Caching

The frontend service (`n8nDiseaseService.js`) has built-in caching:
- Cache duration: 30 minutes
- Same image + crop = instant response

### 2. Image Optimization

Before upload, resize images:
- Max width: 800px
- Max height: 800px
- Format: JPEG (better compression)
- Quality: 85%

### 3. N8N Execution Settings

In N8N workflow settings:
- **Timeout**: 60 seconds
- **Error Workflow**: Create a fallback workflow
- **Save Executions**: Only save failed executions (saves space)

---

## Cost Analysis

| Component | Provider | Model | Cost |
|-----------|----------|-------|------|
| Image Analysis | HuggingFace | BLIP | **FREE** |
| Disease Detection | Groq | Llama 3.3 70B | **FREE** (6000/day) |
| Workflow Execution | N8N | Self-hosted | **FREE** |

**Total Monthly Cost**: **$0.00**

---

## Scaling & Production

### For Production Deployment:

1. **Deploy N8N on Cloud**
   - Railway.app (free tier)
   - Render.com (free tier)
   - Digital Ocean ($5/month)

2. **Update Webhook URL**
   ```javascript
   const N8N_WEBHOOK_URL = 'https://your-n8n.railway.app/webhook/disease-detection'
   ```

3. **Add Rate Limiting**
   - Use N8N "Limit" node
   - Max 10 requests/minute per user

4. **Add Caching Layer**
   - Use N8N "Redis" node
   - Cache results for 1 hour

5. **Monitor Usage**
   - N8N Dashboard → Executions
   - Groq Console → Usage Stats
   - HuggingFace → API Logs

---

## Alternative Free Models

If HuggingFace fails, add these to workflow:

### Alternative Image Models

1. **Google Gemini Vision** (FREE)
   - 60 requests/minute
   - Better accuracy
   - Requires Google AI API key

2. **DeepAI** (FREE)
   - 500 requests/month
   - Quickstart key included

### Alternative Disease Analysis

1. **OpenAI GPT-3.5** (FREE tier)
   - $5 free credit for new users
   - Better medical accuracy

2. **Claude Haiku** (via Anthropic)
   - $5 free credit
   - Fastest response time

---

## Next Steps

✅ Import workflow to N8N  
✅ Configure API keys  
✅ Activate workflow  
✅ Test with sample image  
✅ Monitor execution logs  

---

## Support

**N8N Documentation**: https://docs.n8n.io/  
**HuggingFace Docs**: https://huggingface.co/docs  
**Groq API Docs**: https://console.groq.com/docs  

**Workflow Issues**: Check N8N execution logs  
**API Issues**: Verify environment variables  
**Frontend Issues**: Check browser console

---

## Summary

✅ **Zero API costs** - All models are free  
✅ **Self-hosted** - Full control over data  
✅ **Scalable** - Easy to upgrade to paid models  
✅ **Monitoring** - Built-in N8N execution logs  
✅ **Flexible** - Swap models without code changes
