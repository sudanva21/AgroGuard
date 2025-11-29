# 🔧 Troubleshooting: N8N Webhook Empty Response

## Your Current Error

```
❌ N8N disease detection error: SyntaxError: Unexpected end of JSON input
```

**Meaning**: N8N webhook is returning an empty response (no JSON data).

---

## ✅ Quick Fix Steps

### Step 1: Verify N8N is Running

```bash
# Open browser and visit:
http://localhost:5678
```

**Expected**: You should see N8N login/dashboard  
**If not**: Start N8N with `n8n start`

---

### Step 2: Import the Workflow

The workflow file exists but needs to be imported to N8N:

1. Open N8N: http://localhost:5678
2. Click **Workflows** (left sidebar)
3. Click **Import from File** button
4. Browse to: `c:\Users\sudanva\Desktop\agri\n8n-disease-detection-workflow.json`
5. Click **Import**

**Expected**: Workflow appears named "Disease Detection - AgroGuard AI"

---

### Step 3: Activate the Workflow

1. Click on the imported workflow to open it
2. Look at top-right corner
3. Find the **Activate** toggle switch
4. Click it to turn it **GREEN** ✅

**Important**: If the toggle is gray/off, the webhook won't respond!

---

### Step 4: Configure Environment Variables

1. In N8N, click **Settings** ⚙️ (bottom-left)
2. Click **Environment Variables**
3. Click **+ Add Variable**

**Add these two variables:**

**Variable 1:**
- Name: `HUGGINGFACE_API_KEY`
- Value: (Get from https://huggingface.co/settings/tokens)

**Variable 2:**
- Name: `GROQ_API_KEY`
- Value: (Get from https://console.groq.com/keys)

4. Click **Save**
5. **Restart N8N** (close and run `n8n start` again)

---

### Step 5: Test the Webhook

**Option A - Use PowerShell Test Script:**
```powershell
cd c:\Users\sudanva\Desktop\agri
.\test-n8n-webhook.ps1
```

**Option B - Use Batch Test Script:**
```batch
cd c:\Users\sudanva\Desktop\agri
test-n8n-webhook.bat
```

**Expected Output**: JSON response with disease data

---

## 🔍 Detailed Checks

### Check 1: Is the workflow activated?

Go to N8N → Workflows → Find "Disease Detection - AgroGuard AI"

**Look for**:
- Green toggle = ✅ Active
- Gray toggle = ❌ Inactive (click to activate)

### Check 2: Is the webhook path correct?

1. Open workflow in N8N
2. Click the **Webhook Trigger** node
3. Check the "Path" field shows: `disease-detection`
4. The full URL should be: `http://localhost:5678/webhook/disease-detection`

### Check 3: Are environment variables set?

In N8N:
- Settings → Environment Variables
- Should see:
  - `HUGGINGFACE_API_KEY` = `hf_...`
  - `GROQ_API_KEY` = `gsk_...`

**If missing**: Add them and restart N8N

### Check 4: View N8N Execution Logs

1. In N8N, click **Executions** (left sidebar)
2. You should see execution attempts
3. Click on any failed execution to see error details

**Common errors**:
- Red node = That step failed
- Check error message for details

---

## 🎯 Most Common Issues

### Issue 1: Workflow Not Imported
**Symptom**: Webhook returns 404 or empty response  
**Fix**: Import `n8n-disease-detection-workflow.json` to N8N

### Issue 2: Workflow Not Activated
**Symptom**: Webhook returns empty response  
**Fix**: Click the green **Activate** toggle in workflow

### Issue 3: Missing API Keys
**Symptom**: Workflow executes but nodes fail  
**Fix**: Add `HUGGINGFACE_API_KEY` and `GROQ_API_KEY` to N8N environment variables

### Issue 4: N8N Not Restarted After Config
**Symptom**: Environment variables not working  
**Fix**: Stop and restart N8N (it caches env vars)

---

## 🧪 Manual Test in N8N UI

**Best way to debug**: Test directly in N8N

1. Open N8N workflow
2. Click **Webhook Trigger** node
3. Click **Listen for Test Event** button
4. In another terminal, run:

```powershell
# PowerShell
$payload = @{
    image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    crop = "Tomato"
    timestamp = "2025-11-28T09:00:00.000Z"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5678/webhook/disease-detection" `
    -Method Post `
    -ContentType "application/json" `
    -Body $payload
```

5. Watch N8N UI - nodes should light up one by one
6. If a node turns red, click it to see error

---

## 📋 Complete Checklist

Before testing again, verify:

- [ ] N8N is running (`http://localhost:5678` opens)
- [ ] Workflow `n8n-disease-detection-workflow.json` is imported
- [ ] Workflow is **activated** (green toggle)
- [ ] Environment variables are set in N8N:
  - [ ] `HUGGINGFACE_API_KEY`
  - [ ] `GROQ_API_KEY`
- [ ] N8N was restarted after adding env vars
- [ ] Webhook path is `/webhook/disease-detection`
- [ ] Test script shows JSON response

---

## 🚀 After Fixing

Once webhook works:

1. Refresh your frontend dev server:
   ```bash
   npm run dev
   ```

2. Go to Disease Detection page

3. Upload an image

4. Should see: "Analysis complete! Results powered by N8N workflow." ✅

---

## 📞 Still Having Issues?

### Check N8N Logs

If you started N8N with PM2:
```bash
pm2 logs n8n
```

If you started N8N normally, check the terminal output.

### View Execution Details

1. N8N → Executions
2. Click on failed execution
3. Check which node failed
4. Read error message

### Common Node Errors

**Node 4 (HuggingFace) Fails**:
- Error: `401 Unauthorized` → Invalid `HUGGINGFACE_API_KEY`
- Error: `503 Service Unavailable` → Model loading (wait 10s, retry)

**Node 7 (Groq) Fails**:
- Error: `401 Unauthorized` → Invalid `GROQ_API_KEY`
- Error: `429 Too Many Requests` → Rate limit exceeded

---

## 📚 Additional Resources

- **Setup Guide**: `N8N_QUICK_START.md`
- **Visual Guide**: `N8N_WORKFLOW_VISUAL_GUIDE.md`
- **Complete Docs**: `N8N_DISEASE_DETECTION_SETUP.md`
- **Commands**: `N8N_COMMANDS_REFERENCE.md`

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Test scripts return JSON data (not empty)
2. ✅ N8N Executions show green checkmarks
3. ✅ Frontend console shows: `✅ N8N response parsed`
4. ✅ Disease results display in UI

---

**Next Action**: Follow Steps 1-5 above, then run the test script!
