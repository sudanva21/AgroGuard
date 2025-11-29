# ✅ Troubleshooting Checklist

Use this checklist if the FIXED workflow still doesn't work.

---

## Pre-Flight Checks

### ☐ N8N is running
```bash
# Check if N8N is running
netstat -ano | findstr :5678

# If not running, start it
npx n8n
```

### ☐ Workflow is imported
- Open http://localhost:5678
- You should see: **"Disease Detection - AgroGuard AI (FIXED)"**
- If not, import `n8n-disease-detection-workflow-FIXED.json`

### ☐ Workflow is ACTIVE
- Look for **green toggle** at the top
- If gray/red, click it to activate

### ☐ Environment variables are set
- Go to **Settings** → **Environments**
- Must have:
  - `HUGGINGFACE_API_KEY` = `hf_...`
  - `GROQ_API_KEY` = `gsk_...`

---

## Test API Keys

### Test HuggingFace Key
```bash
curl -X POST https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large -H "Authorization: Bearer YOUR_HF_KEY_HERE" -H "Content-Type: application/json" -d "{\"inputs\": \"test\"}"
```

**Expected**: JSON response (not 401/403 error)

### Test Groq Key
```bash
curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer YOUR_GROQ_KEY_HERE"
```

**Expected**: JSON response with model list (not 401/403 error)

---

## Test Workflow Manually

### 1. Manual webhook test
Create file `test-payload.json`:
```json
{
  "image": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwA=",
  "crop": "wheat",
  "timestamp": "2025-11-28T13:00:00.000Z",
  "imageType": "image/jpeg"
}
```

Test with curl:
```bash
curl -X POST http://localhost:5678/webhook/disease-detection -H "Content-Type: application/json" -d @test-payload.json
```

**Expected**: JSON response with disease data (not empty, not error)

### 2. Check execution in N8N UI
- Go to **Executions** tab in N8N
- Click the latest execution
- **All 11 nodes** should be highlighted/completed
- Click each node to see Input/Output

---

## Common Issues & Fixes

### Issue: "Unauthorized" or 401 error
**Cause**: API keys are wrong or not set  
**Fix**: 
1. Double-check keys in N8N Settings → Environments
2. Test keys with curl commands above
3. Get new keys if needed:
   - HuggingFace: https://huggingface.co/settings/tokens
   - Groq: https://console.groq.com/keys

### Issue: Workflow still stops at node 3
**Cause**: You imported the OLD workflow, not the FIXED one  
**Fix**:
1. Check workflow name: should say **(FIXED)** at the end
2. Delete and re-import `n8n-disease-detection-workflow-FIXED.json`

### Issue: "Model is loading" error from HuggingFace
**Cause**: Model is cold-starting (first request)  
**Fix**: Wait 20-30 seconds and try again

### Issue: Timeout error
**Cause**: AI models taking too long to respond  
**Fix**: 
1. Try again (models speed up after first use)
2. Increase timeout in nodes 4 and 8 to 60000 (60 seconds)

### Issue: Frontend shows "Cannot connect to N8N"
**Cause**: N8N not running or wrong URL  
**Fix**:
```bash
# Check if N8N is listening
netstat -ano | findstr :5678

# If not, start N8N
npx n8n
```

### Issue: "Unexpected end of JSON input"
**Cause**: Empty response from N8N  
**Fix**: This is the original issue! Make sure you:
1. ✅ Imported the **FIXED** workflow
2. ✅ Deleted the old workflow
3. ✅ Activated the workflow (green toggle)

---

## Debug Execution Step-by-Step

### Node 1: Webhook Trigger
**Check**: 
- Click node → Output tab
- Should show: `{ body: { image: "...", crop: "...", ... } }`

### Node 2: Extract Request Data
**Check**: 
- Click node → Output tab
- Should show: `{ crop: "wheat", imageBase64: "...", imageType: "image/jpeg" }`

### Node 3: Convert Base64 to Binary ⭐ CRITICAL
**Check**: 
- Click node → Output tab
- Should show: `{ json: {...}, binary: { data: {...} } }`
- The `binary` object must exist!
- If missing or empty → workflow is still using OLD version

### Node 4: HuggingFace Image Analysis
**Check**: 
- Click node → Output tab
- Should show: `[ { generated_text: "a plant with leaves..." } ]`
- If error → check HUGGINGFACE_API_KEY

### Node 8: Groq Disease Analysis
**Check**: 
- Click node → Output tab
- Should show: `{ choices: [ { message: { content: "{...}" } } ] }`
- If error → check GROQ_API_KEY

### Node 9: Parse Disease Response
**Check**: 
- Click node → Output tab
- Should show disease data:
```json
{
  "disease": "...",
  "scientificName": "...",
  "severity": "...",
  "confidence": "...",
  "symptoms": [...],
  "causes": [...]
}
```

---

## Still Not Working?

### Enable N8N Debug Mode
```bash
# Stop N8N (Ctrl+C)
# Start with debug logging
N8N_LOG_LEVEL=debug npx n8n
```

### Check Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Upload image in disease detection
4. Look for errors

### Verify Frontend Code
Check `src/services/n8nDiseaseService.js`:
```javascript
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/disease-detection'
```
URL must match webhook path in N8N workflow.

---

## Get Help

If none of the above works, gather this info:

1. **N8N execution screenshot** (show all nodes)
2. **Browser console errors** (F12 → Console tab)
3. **N8N node output** (click each node, copy Output)
4. **Workflow name** (does it say "FIXED"?)
5. **N8N version** (check bottom left in N8N UI)

---

**Most likely fix**: You need to import `n8n-disease-detection-workflow-FIXED.json` 🎯
