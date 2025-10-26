# AgroGuard AI

**Tagline:** "Smart Disease Detection, Smarter Farming Decisions."

## Vision
To empower Indian farmers with a multilingual digital agronomist that accurately detects crop diseases, guides correct treatment, boosts soil and nutrient health, and improves access to farming essentials.

## Features
- 🔍 Symptom-Based Disease Identification
- 💊 Treatment and Pesticide Recommendation
- 🌱 Nutrient and Fertilizer Advisory
- 🗣️ Multilingual AI Chatbot (10+ languages)
- 🛒 Smart Agro Marketplace
- ⚠️ Pest Outbreak Early Warning System

## Getting Started

### Prerequisites
- Node.js 16+ installed
- A Supabase account (free tier available at https://supabase.com)

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up Supabase**
   - Go to https://app.supabase.com
   - Create a new project
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Set up authentication in Supabase**
   - Go to Authentication > Providers
   - Enable Email provider
   - Configure email templates (optional)

### Development
```bash
npm run dev
```
Visit http://localhost:3000

### Build
```bash
npm run build
```

## Features

### Authentication
- ✅ User registration with email/password
- ✅ Secure login with Supabase
- ✅ Protected routes (Disease Detection, Treatment, Nutrients, Pest Alerts, Marketplace, Chatbot)
- ✅ User session management
- ✅ Logout functionality

### Page Transitions
- ✅ Realistic falling leaves animation when navigating between pages
- ✅ Smooth fade transitions
- ✅ Framer Motion powered animations

### Protected Features (Login Required)
- Disease Detection
- Treatment Recommendations
- Nutrient Advisory
- AI Chatbot
- Marketplace
- Pest Outbreak Alerts

## Tech Stack
- React 18
- Vite
- TailwindCSS
- Framer Motion (animations)
- Lucide React Icons
- React Router
- Supabase (authentication & backend)

## License
MIT
