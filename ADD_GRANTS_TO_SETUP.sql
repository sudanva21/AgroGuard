-- =====================================================
-- ADD THIS TO THE END OF COMPLETE_SUPABASE_SETUP.sql
-- These GRANT statements ensure REST API access works
-- =====================================================

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO authenticated, anon, service_role;

-- Grant table permissions for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.disease_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pest_alerts TO authenticated;

-- Grant read permissions for anon users (signup, public data)
GRANT SELECT, INSERT ON public.profiles TO anon;
GRANT SELECT ON public.pest_alerts TO anon;
GRANT SELECT ON public.marketplace_products TO anon;

-- Grant function execution
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, anon, service_role;

-- Ensure service_role has full access for backend operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
