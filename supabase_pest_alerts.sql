-- ============================================
-- PEST ALERT SYSTEM DATABASE SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor to set up the pest alert system
-- This creates tables for storing alert subscriptions and logs

-- 1. Create pest_alert_subscriptions table
-- Stores user subscriptions to pest alerts
CREATE TABLE IF NOT EXISTS public.pest_alert_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    location TEXT NOT NULL,
    crop TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- 2. Create alert_logs table
-- Stores history of all alerts sent to users
CREATE TABLE IF NOT EXISTS public.alert_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    pest_name TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Create unsent_alerts table
-- Stores alerts that couldn't be sent immediately (for retry/manual processing)
CREATE TABLE IF NOT EXISTS public.unsent_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    alert_type TEXT NOT NULL, -- 'SMS' or 'WhatsApp'
    link TEXT, -- WhatsApp link if applicable
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'sent', 'failed'
    retry_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pest_subscriptions_user_id 
ON public.pest_alert_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_pest_subscriptions_active 
ON public.pest_alert_subscriptions(is_active) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_alert_logs_user_id 
ON public.alert_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_alert_logs_sent_at 
ON public.alert_logs(sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_unsent_alerts_status 
ON public.unsent_alerts(status) 
WHERE status = 'pending';

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.pest_alert_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unsent_alerts ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies

-- Pest Alert Subscriptions Policies
-- Users can view and manage their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.pest_alert_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
ON public.pest_alert_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON public.pest_alert_subscriptions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
ON public.pest_alert_subscriptions
FOR DELETE
USING (auth.uid() = user_id);

-- Alert Logs Policies
-- Users can view their own alert history
CREATE POLICY "Users can view their own alert logs"
ON public.alert_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert alert logs
CREATE POLICY "Service can insert alert logs"
ON public.alert_logs
FOR INSERT
WITH CHECK (true);

-- Unsent Alerts Policies (Service role only)
CREATE POLICY "Service can manage unsent alerts"
ON public.unsent_alerts
FOR ALL
USING (true)
WITH CHECK (true);

-- 7. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger for pest_alert_subscriptions
DROP TRIGGER IF EXISTS update_pest_subscriptions_updated_at ON public.pest_alert_subscriptions;
CREATE TRIGGER update_pest_subscriptions_updated_at
    BEFORE UPDATE ON public.pest_alert_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Grant necessary permissions
GRANT ALL ON public.pest_alert_subscriptions TO authenticated;
GRANT ALL ON public.alert_logs TO authenticated;
GRANT ALL ON public.unsent_alerts TO service_role;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the tables were created successfully:

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('pest_alert_subscriptions', 'alert_logs', 'unsent_alerts');

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('pest_alert_subscriptions', 'alert_logs', 'unsent_alerts');

-- View all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- AND tablename IN ('pest_alert_subscriptions', 'alert_logs', 'unsent_alerts');

-- ============================================
-- SAMPLE QUERIES (For testing)
-- ============================================

-- Get all active subscriptions
-- SELECT * FROM pest_alert_subscriptions WHERE is_active = true;

-- Get user's subscription
-- SELECT * FROM pest_alert_subscriptions WHERE user_id = 'your-user-id';

-- Get recent alerts for a user
-- SELECT * FROM alert_logs 
-- WHERE user_id = 'your-user-id' 
-- ORDER BY sent_at DESC 
-- LIMIT 10;

-- Get pending unsent alerts
-- SELECT * FROM unsent_alerts 
-- WHERE status = 'pending' 
-- ORDER BY created_at ASC 
-- LIMIT 20;

-- ============================================
-- CLEANUP (Use only if you need to reset)
-- ============================================
-- DROP TABLE IF EXISTS public.unsent_alerts CASCADE;
-- DROP TABLE IF EXISTS public.alert_logs CASCADE;
-- DROP TABLE IF EXISTS public.pest_alert_subscriptions CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
