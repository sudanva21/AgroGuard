# 🚀 Pest Alerts - Quick Start Guide

## ⚡ 3-Step Setup (5 Minutes)

### Step 1: Database Setup (1 minute)

1. Open Supabase SQL Editor
2. Copy entire content of `supabase_pest_alerts.sql`
3. Paste and click **Run**
4. Done! ✅

### Step 2: Get Free API Keys (3 minutes)

#### OpenWeatherMap (Required for real weather):
1. Go to: https://openweathermap.org/api
2. Sign up (free, no credit card)
3. Copy API key from dashboard
4. Wait 1-2 hours for activation

#### Fast2SMS (Optional - for Indian SMS):
1. Go to: https://www.fast2sms.com/
2. Sign up with mobile number
3. Copy API key from dashboard
4. Get 50 free SMS/day forever

### Step 3: Configure & Run (1 minute)

```bash
# Copy environment file
cp .env.example .env

# Edit .env and add your API keys
# At minimum, add OpenWeatherMap API key

# Restart dev server
npm run dev
```

**Done! Visit http://localhost:5173/pest-alert** 🎉

---

## 📱 Testing (2 Minutes)

1. **Select language** (top-right) - verify translation works
2. **Select state and crop** - see real-time predictions
3. **Enter mobile number** - subscribe to alerts
4. **Click "Send Test Alert"** - receive SMS/WhatsApp

---

## 🎯 What You Get

### Without Any API Keys:
- ✅ Page works perfectly
- ✅ Translation works
- ✅ Mock weather data (seasonal)
- ✅ Scientific pest predictions
- ✅ Alerts logged to database

### With OpenWeatherMap Key:
- ✅ **Real weather data** for your location
- ✅ **Accurate predictions** based on actual conditions
- ✅ Temperature, humidity, rainfall data

### With SMS API Keys:
- ✅ **Actual SMS alerts** sent to farmers
- ✅ **WhatsApp messages** with pest info
- ✅ **Test alerts** for verification

---

## 📋 API Keys Summary

| API | Cost | Setup Time | Priority |
|-----|------|------------|----------|
| **OpenWeatherMap** | Free Forever | 2 min | ⭐⭐⭐ Required |
| **Fast2SMS** | Free Forever | 2 min | ⭐⭐ Recommended |
| **Twilio** | Free Trial | 5 min | ⭐ Optional |

---

## ✅ Verification Checklist

After setup, verify these work:

- [ ] Page loads at `/pest-alert`
- [ ] Language selector changes all text
- [ ] State and crop dropdowns translated
- [ ] Predictions show after selecting crop
- [ ] Weather data displayed (real or mock)
- [ ] Can subscribe with phone number
- [ ] Confirmation message appears
- [ ] Database shows subscription (check Supabase)

---

## 🆘 Quick Fixes

### Weather Not Working:
```bash
# Check if API key is set
echo $VITE_OPENWEATHER_API_KEY

# Restart dev server
npm run dev
```

### SMS Not Sending:
- Verify phone number is Indian (+91) for Fast2SMS
- Check API key is correct in .env
- System works fine without SMS - alerts logged to database

### Translation Not Working:
- Translation uses free API - no setup needed
- Check browser console for errors
- Refresh page

### Database Errors:
```sql
-- Verify tables exist in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'pest%';

-- Should show 3 tables:
-- pest_alert_subscriptions
-- alert_logs  
-- unsent_alerts
```

---

## 📖 Full Documentation

- **Setup Guide:** `PEST_ALERTS_SETUP.md` (detailed instructions)
- **Implementation:** `PEST_ALERTS_IMPLEMENTATION_SUMMARY.md` (technical details)
- **Database Schema:** `supabase_pest_alerts.sql` (SQL code)

---

## 🌾 Supported Crops

Rice • Wheat • Cotton • Tomato • Potato • Sugarcane • Chili • Onion • Maize • Soybean

**21 different pests** with scientific outbreak conditions!

---

## 💡 Tips

1. **Start Simple:** Just add OpenWeatherMap key first
2. **Test Thoroughly:** Use different crops and locations
3. **Read Docs:** Full setup guide has detailed troubleshooting
4. **No Rush:** APIs can be added later without affecting functionality

---

## 🎉 You're Ready!

The system is **production-ready** and works even without API keys. Add them as you go!

**Happy Farming! 🌾**
