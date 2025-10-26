-- ============================================
-- PROFILE STATS - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================

-- Function to calculate real user statistics
CREATE OR REPLACE FUNCTION get_real_user_stats(user_uuid UUID)
RETURNS TABLE(
  diseases_detected BIGINT,
  treatments_received BIGINT,
  queries_asked BIGINT,
  days_active BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Count disease reports (diseases detected)
    (SELECT COUNT(*) FROM disease_reports WHERE user_id = user_uuid)::BIGINT as diseases_detected,
    
    -- Count treatment records (treatments received)
    (SELECT COUNT(*) FROM treatment_records WHERE user_id = user_uuid)::BIGINT as treatments_received,
    
    -- Count chatbot queries (if you have a table for it, otherwise use 0)
    -- For now, we'll count disease reports as queries too
    (SELECT COUNT(*) FROM disease_reports WHERE user_id = user_uuid)::BIGINT as queries_asked,
    
    -- Calculate days active (days since first report)
    CASE 
      WHEN (SELECT MIN(created_at) FROM disease_reports WHERE user_id = user_uuid) IS NOT NULL 
      THEN (CURRENT_DATE - (SELECT MIN(created_at)::DATE FROM disease_reports WHERE user_id = user_uuid))::BIGINT
      ELSE 0
    END as days_active;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_real_user_stats(UUID) TO authenticated;

-- Test the function (replace with your user_id)
-- SELECT * FROM get_real_user_stats(auth.uid());
