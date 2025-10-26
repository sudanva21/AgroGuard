# 🚀 Quick Start - Get Image Detection Working NOW!

## ⏱️ 2-Minute Setup

### **Step 1: Get FREE Hugging Face Token**

1. Go to: **https://huggingface.co/join**
2. Sign up (email or Google - FREE, no credit card)
3. Go to: **https://huggingface.co/settings/tokens**
4. Click "New token"
5. Copy the token (starts with `hf_...`)

---

### **Step 2: Add Token to .env File**

1. Open: `c:/Users/asus laptop/OneDrive/Desktop/agri/.env`
2. Add this line:
```
VITE_HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
```
(Replace with your actual token)

3. Save file

---

### **Step 3: Restart Server**

In terminal:
```bash
# Press Ctrl+C to stop server
# Then restart:
npm run dev
```

---

### **Step 4: Test Image Upload**

1. **Refresh browser:** Press `Ctrl + Shift + R`
2. Go to **Disease Detection** page
3. Click **"Upload Image"** tab
4. Select crop: Tomato
5. Upload a plant photo
6. Click **"Analyze Image"**
7. ✅ **See results!**

---

## ✅ What You Get (100% FREE)

- ✅ Real image analysis (Hugging Face AI)
- ✅ Disease detection (Groq AI)
- ✅ 1,000 images/day (FREE limit)
- ✅ No credit card needed
- ✅ No hidden costs
- ✅ Works forever

---

## 🐛 Not Working?

### **Check Browser Console (F12):**

**If you see:** "Image description: ..."
- ✅ It's working!

**If you see:** "401 Unauthorized"
- ❌ Token not added or wrong
- Fix: Check `.env` file, restart server

**If you see:** "503 Service Unavailable"
- ⏳ Model loading (first time)
- Fix: Wait 10 seconds, try again

---

## 📚 Need Help?

- **Detailed Setup:** See `HUGGINGFACE_SETUP.md`
- **How it Works:** See `FREE_IMAGE_ANALYSIS.md`

---

## 🎯 That's It!

**You're all set! Start detecting plant diseases with FREE AI!** 🌱
