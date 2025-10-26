-- =====================================================
-- AgroGuard AI - Fertilizer Application Schedule Schema
-- =====================================================
-- Run these queries in your Supabase SQL Editor
-- This is OPTIONAL - currently using localStorage
-- Use this if you want cloud storage and sync across devices
-- =====================================================

-- 1. Create fertilizer_schedules table
CREATE TABLE IF NOT EXISTS public.fertilizer_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crop VARCHAR(100) NOT NULL,
    growth_stage VARCHAR(100),
    soil_type VARCHAR(100),
    nutrient_name VARCHAR(200) NOT NULL,
    nutrient_source VARCHAR(300),
    dosage VARCHAR(200),
    timing VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    application_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fertilizer_schedules_user_crop 
ON public.fertilizer_schedules(user_id, crop);

CREATE INDEX IF NOT EXISTS idx_fertilizer_schedules_status 
ON public.fertilizer_schedules(user_id, status);

-- 3. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach trigger to table
CREATE TRIGGER update_fertilizer_schedules_updated_at
    BEFORE UPDATE ON public.fertilizer_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.fertilizer_schedules ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- Users can view their own schedules
CREATE POLICY "Users can view own schedules"
    ON public.fertilizer_schedules
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own schedules
CREATE POLICY "Users can insert own schedules"
    ON public.fertilizer_schedules
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own schedules
CREATE POLICY "Users can update own schedules"
    ON public.fertilizer_schedules
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own schedules
CREATE POLICY "Users can delete own schedules"
    ON public.fertilizer_schedules
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- ADDITIONAL TABLE: Nutrient Plans History (Optional)
-- =====================================================
-- Store complete nutrient recommendation plans

CREATE TABLE IF NOT EXISTS public.nutrient_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crop VARCHAR(100) NOT NULL,
    growth_stage VARCHAR(100) NOT NULL,
    soil_type VARCHAR(100) NOT NULL,
    recommendations JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index for nutrient plans
CREATE INDEX IF NOT EXISTS idx_nutrient_plans_user_crop 
ON public.nutrient_plans(user_id, crop, created_at DESC);

-- Enable RLS
ALTER TABLE public.nutrient_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for nutrient_plans
CREATE POLICY "Users can view own nutrient plans"
    ON public.nutrient_plans
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrient plans"
    ON public.nutrient_plans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify your tables were created:

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('fertilizer_schedules', 'nutrient_plans');

-- Check columns in fertilizer_schedules
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'fertilizer_schedules';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('fertilizer_schedules', 'nutrient_plans');

-- =====================================================
-- SAMPLE QUERIES FOR YOUR APPLICATION
-- =====================================================

-- Insert a schedule entry
-- INSERT INTO public.fertilizer_schedules (
--     user_id, crop, nutrient_name, nutrient_source, 
--     dosage, timing, status
-- ) VALUES (
--     auth.uid(), 'Tomato', 'Nitrogen (N)', 'Urea (46% N)', 
--     '260 kg/ha', 'At Sowing/Basal', 'pending'
-- );

-- Get all schedules for a crop
-- SELECT * FROM public.fertilizer_schedules 
-- WHERE user_id = auth.uid() AND crop = 'Tomato' 
-- ORDER BY created_at DESC;

-- Mark as completed
-- UPDATE public.fertilizer_schedules 
-- SET status = 'completed', 
--     application_date = '2025-10-26', 
--     notes = 'Applied in morning'
-- WHERE id = 'your-schedule-id' AND user_id = auth.uid();

-- Get statistics
-- SELECT 
--     crop,
--     COUNT(*) as total_applications,
--     COUNT(*) FILTER (WHERE status = 'completed') as completed,
--     COUNT(*) FILTER (WHERE status = 'pending') as pending,
--     ROUND(COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*), 2) as completion_rate
-- FROM public.fertilizer_schedules 
-- WHERE user_id = auth.uid()
-- GROUP BY crop;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. This is OPTIONAL - your app currently works with localStorage
-- 2. Benefits of Supabase:
--    - Data syncs across devices
--    - Data persists even if browser cache is cleared
--    - Can access data from mobile app
--    - Better for multiple users
-- 3. To integrate, you'll need to:
--    - Update ScheduleTracker.jsx to use Supabase queries
--    - Add authentication checks
--    - Handle offline mode with localStorage fallback
-- 4. Current localStorage approach is perfectly fine for single-device use
