# N8N Commands - Quick Reference Card

## 🚀 Quick Start Commands

### Install N8N
```bash
npm install -g n8n
```

### Start N8N
```bash
n8n start
```

### Start N8N with Specific Port
```bash
n8n start --port 5679
```

### Start N8N in Background (with PM2)
```bash
npm install -g pm2
pm2 start n8n
pm2 list
```

### Stop N8N
```bash
# If started normally
Ctrl + C

# If started with PM2
pm2 stop n8n
```

---

## 🧪 Testing Commands

### Test N8N is Running
```bash
curl http://localhost:5678
```

### Test Webhook Endpoint
```bash
curl -X POST http://localhost:5678/webhook/disease-detection ^
  -H "Content-Type: application/json" ^
  -d "{\"image\":\"base64_here\",\"crop\":\"Tomato\",\"timestamp\":\"2025-11-28T09:00:00Z\"}"
```

### Test HuggingFace API Key
```bash
curl -H "Authorization: Bearer YOUR_HF_KEY" ^
  https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large
```

### Test Groq API Key
```bash
curl https://api.groq.com/openai/v1/models ^
  -H "Authorization: Bearer YOUR_GROQ_KEY"
```

---

## 🔧 Frontend Commands

### Install Dependencies
```bash
cd c:\Users\sudanva\Desktop\agri
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📊 N8N Management Commands

### View N8N Version
```bash
n8n --version
```

### Update N8N
```bash
npm update -g n8n
```

### View N8N Logs (PM2)
```bash
pm2 logs n8n
```

### View N8N Logs (Real-time)
```bash
pm2 logs n8n --lines 100
```

### Restart N8N (PM2)
```bash
pm2 restart n8n
```

### View N8N Process Info
```bash
pm2 info n8n
```

---

## 🗂️ File Locations

### N8N Workflow
```
c:\Users\sudanva\Desktop\agri\n8n-disease-detection-workflow.json
```

### N8N Service (Frontend)
```
c:\Users\sudanva\Desktop\agri\src\services\n8nDiseaseService.js
```

### Disease Detection Page
```
c:\Users\sudanva\Desktop\agri\src\pages\DiseaseDetection.jsx
```

### Documentation
```
c:\Users\sudanva\Desktop\agri\N8N_QUICK_START.md
c:\Users\sudanva\Desktop\agri\N8N_DISEASE_DETECTION_SETUP.md
c:\Users\sudanva\Desktop\agri\N8N_WORKFLOW_VISUAL_GUIDE.md
c:\Users\sudanva\Desktop\agri\N8N_IMPLEMENTATION_SUMMARY.md
c:\Users\sudanva\Desktop\agri\N8N_INTEGRATION_COMPLETE.md
```

---

## 🌐 URLs

### N8N Dashboard
```
http://localhost:5678
```

### Webhook Endpoint
```
http://localhost:5678/webhook/disease-detection
```

### Frontend (Development)
```
http://localhost:5173
```

### HuggingFace API
```
https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large
```

### Groq API
```
https://api.groq.com/openai/v1/chat/completions
```

---

## 🔑 API Key URLs

### HuggingFace Token
```
https://huggingface.co/settings/tokens
```

### Groq API Keys
```
https://console.groq.com/keys
```

---

## 🐛 Debugging Commands

### Check N8N Environment Variables
```bash
# In N8N UI
Settings → Environment Variables
```

### Test Full Workflow (with curl)
```bash
curl -X POST http://localhost:5678/webhook/disease-detection ^
  -H "Content-Type: application/json" ^
  -d @test-payload.json
```

**test-payload.json**:
```json
{
  "image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "crop": "Tomato",
  "timestamp": "2025-11-28T09:00:00.000Z",
  "imageType": "image/png",
  "imageSize": 1234
}
```

### Check N8N Port
```bash
netstat -ano | findstr :5678
```

### Kill N8N Process (if stuck)
```bash
# Find process ID
netstat -ano | findstr :5678

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## 🚀 Production Deployment Commands

### Deploy to Railway (N8N)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Deploy N8N
railway up
```

### Deploy Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## 📝 Configuration Commands

### Set N8N Environment Variable (Command Line)
```bash
# Windows
set HUGGINGFACE_API_KEY=hf_your_key
set GROQ_API_KEY=gsk_your_key

# Linux/Mac
export HUGGINGFACE_API_KEY=hf_your_key
export GROQ_API_KEY=gsk_your_key
```

### Create .env File for N8N
```bash
echo HUGGINGFACE_API_KEY=hf_your_key > .env
echo GROQ_API_KEY=gsk_your_key >> .env
```

---

## 🔄 Workflow Management

### Export Workflow (via UI)
```
N8N Dashboard → Workflows → Select Workflow → 
Menu (⋮) → Download → Save as JSON
```

### Import Workflow (via UI)
```
N8N Dashboard → Workflows → Import from File → 
Select JSON → Import
```

---

## 📊 Monitoring Commands

### View All PM2 Processes
```bash
pm2 list
```

### Monitor N8N Resource Usage
```bash
pm2 monit
```

### View N8N Logs (Last 100 lines)
```bash
pm2 logs n8n --lines 100
```

### Clear N8N Logs
```bash
pm2 flush n8n
```

---

## 🧹 Cleanup Commands

### Stop and Delete N8N Process (PM2)
```bash
pm2 delete n8n
```

### Clear N8N Cache
```bash
# Stop N8N
pm2 stop n8n

# Clear cache (N8N user data directory)
# Windows
rd /s /q %USERPROFILE%\.n8n

# Linux/Mac
rm -rf ~/.n8n

# Restart
pm2 restart n8n
```

---

## 🔍 Verification Commands

### Check if Port 5678 is Available
```bash
netstat -ano | findstr :5678
```

### Check Node Version (N8N requires Node 16+)
```bash
node --version
```

### Check NPM Version
```bash
npm --version
```

### Test Frontend Service (from browser console)
```javascript
// Open browser console on disease detection page
await detectDiseaseViaN8N(new File(['test'], 'test.jpg', {type: 'image/jpeg'}), 'Tomato')
```

---

## 🎯 Common Workflows

### Workflow 1: First Time Setup
```bash
# Install N8N
npm install -g n8n

# Start N8N
n8n start

# In another terminal, start frontend
cd c:\Users\sudanva\Desktop\agri
npm run dev
```

### Workflow 2: Daily Development
```bash
# Terminal 1: N8N (with PM2)
pm2 start n8n

# Terminal 2: Frontend
cd c:\Users\sudanva\Desktop\agri
npm run dev

# When done
pm2 stop n8n
```

### Workflow 3: Troubleshooting
```bash
# Check N8N is running
curl http://localhost:5678

# Check logs
pm2 logs n8n

# Test webhook
curl -X POST http://localhost:5678/webhook/disease-detection ^
  -H "Content-Type: application/json" ^
  -d "{\"image\":\"test\",\"crop\":\"Tomato\"}"

# Restart if needed
pm2 restart n8n
```

### Workflow 4: Testing API Keys
```bash
# Test HuggingFace
curl -H "Authorization: Bearer YOUR_HF_KEY" ^
  https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large

# Test Groq
curl https://api.groq.com/openai/v1/models ^
  -H "Authorization: Bearer YOUR_GROQ_KEY"
```

---

## 🆘 Emergency Commands

### N8N Won't Start
```bash
# Check if port is in use
netstat -ano | findstr :5678

# Kill process if found
taskkill /PID <PID> /F

# Restart N8N
n8n start
```

### Frontend Can't Connect
```bash
# Verify N8N is running
curl http://localhost:5678

# Check webhook URL in service file
type src\services\n8nDiseaseService.js | findstr N8N_WEBHOOK_URL

# Should be: http://localhost:5678/webhook/disease-detection
```

### Workflow Not Executing
```bash
# Check workflow is activated
# Go to N8N UI → Workflows → Check toggle is GREEN

# Check execution logs
# Go to N8N UI → Executions → Look for errors
```

---

## 📚 Documentation Commands

### View Documentation
```bash
# Quick Start
type N8N_QUICK_START.md

# Complete Guide
type N8N_DISEASE_DETECTION_SETUP.md

# Visual Guide
type N8N_WORKFLOW_VISUAL_GUIDE.md

# Implementation Summary
type N8N_IMPLEMENTATION_SUMMARY.md

# Integration Complete
type N8N_INTEGRATION_COMPLETE.md

# This File
type N8N_COMMANDS_REFERENCE.md
```

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| N8N Dashboard | http://localhost:5678 |
| Frontend | http://localhost:5173 |
| N8N Docs | https://docs.n8n.io/ |
| HuggingFace | https://huggingface.co/settings/tokens |
| Groq Console | https://console.groq.com/keys |
| N8N Community | https://community.n8n.io/ |

---

## 💡 Pro Tips

### Tip 1: Keep N8N Running
```bash
# Use PM2 to keep N8N running in background
pm2 start n8n
pm2 save
pm2 startup  # Auto-start on system boot
```

### Tip 2: Quick Test Script
Create `test-n8n.bat`:
```batch
@echo off
curl -X POST http://localhost:5678/webhook/disease-detection ^
  -H "Content-Type: application/json" ^
  -d "{\"image\":\"test\",\"crop\":\"Tomato\",\"timestamp\":\"%date%T%time%\"}"
pause
```

### Tip 3: Environment Variables Shortcut
Create `n8n-env.bat`:
```batch
@echo off
set HUGGINGFACE_API_KEY=hf_your_key_here
set GROQ_API_KEY=gsk_your_key_here
n8n start
```

### Tip 4: View Webhook URL
```bash
# In N8N UI, click Webhook Trigger node
# URL is displayed in node configuration
```

---

## 🎓 Learning Commands

### Try Test Curl Requests
```bash
# 1. Simple test (check N8N is running)
curl http://localhost:5678

# 2. Test webhook (minimal payload)
curl -X POST http://localhost:5678/webhook/disease-detection ^
  -H "Content-Type: application/json" ^
  -d "{\"crop\":\"Tomato\"}"

# 3. Test with base64 image (1x1 pixel PNG)
curl -X POST http://localhost:5678/webhook/disease-detection ^
  -H "Content-Type: application/json" ^
  -d "{\"image\":\"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==\",\"crop\":\"Tomato\",\"timestamp\":\"2025-11-28T09:00:00Z\"}"
```

---

## ✅ Verification Checklist Commands

Run these to verify everything is working:

```bash
# 1. Check N8N version
n8n --version

# 2. Check N8N is running
curl http://localhost:5678

# 3. Check webhook endpoint
curl -X POST http://localhost:5678/webhook/disease-detection

# 4. Check Node version
node --version

# 5. Check frontend dependencies
cd c:\Users\sudanva\Desktop\agri && npm list

# 6. Check if port 5678 is in use
netstat -ano | findstr :5678

# 7. Test HuggingFace API
curl -H "Authorization: Bearer YOUR_HF_KEY" https://api-inference.huggingface.co/

# 8. Test Groq API
curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer YOUR_GROQ_KEY"
```

---

**Print this page for quick reference while working with N8N!** 📄

*Last Updated: November 28, 2025*
