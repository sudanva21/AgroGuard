-- ============================================
-- DISEASE DETECTION REPORTS TABLE
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- Create disease_reports table
CREATE TABLE IF NOT EXISTS disease_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Detection details
  crop_name VARCHAR(100) NOT NULL,
  detection_method VARCHAR(50) NOT NULL, -- 'symptoms', 'image', 'voice'
  
  -- Disease information
  disease_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  severity VARCHAR(50),
  confidence VARCHAR(20),
  description TEXT,
  urgency TEXT,
  
  -- Symptoms and causes
  symptoms JSONB, -- Array of symptoms
  causes JSONB, -- Array of causes
  
  -- Input data (for reference)
  input_symptoms JSONB, -- Original symptom inputs
  image_url TEXT, -- If uploaded image
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_disease_reports_user_id ON disease_reports(user_id);
CREATE INDEX idx_disease_reports_created_at ON disease_reports(created_at DESC);
CREATE INDEX idx_disease_reports_crop ON disease_reports(crop_name);

-- Enable Row Level Security (RLS)
ALTER TABLE disease_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON disease_reports
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own reports
CREATE POLICY "Users can insert own reports"
  ON disease_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update own reports"
  ON disease_reports
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete own reports"
  ON disease_reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TREATMENT RECORDS TABLE (Optional)
-- ============================================
-- Track treatments applied by farmers

CREATE TABLE IF NOT EXISTS treatment_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES disease_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Treatment details
  treatment_type VARCHAR(50) NOT NULL, -- 'chemical', 'organic'
  treatment_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(255),
  application_date DATE,
  
  -- Results
  effectiveness VARCHAR(50), -- 'excellent', 'good', 'moderate', 'poor'
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_treatment_records_report_id ON treatment_records(report_id);
CREATE INDEX idx_treatment_records_user_id ON treatment_records(user_id);

-- Enable RLS
ALTER TABLE treatment_records ENABLE ROW LEVEL SECURITY;

-- Create policies for treatment_records
CREATE POLICY "Users can view own treatments"
  ON treatment_records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own treatments"
  ON treatment_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own treatments"
  ON treatment_records
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own treatments"
  ON treatment_records
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKET FOR IMAGES (Optional)
-- ============================================
-- If you want to store uploaded disease images

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('disease-images', 'disease-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload disease images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'disease-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view disease images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'disease-images');

CREATE POLICY "Users can delete own disease images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'disease-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- USEFUL FUNCTIONS
-- ============================================

-- Function to get user's report statistics
CREATE OR REPLACE FUNCTION get_user_report_stats(user_uuid UUID)
RETURNS TABLE(
  total_reports BIGINT,
  reports_this_month BIGINT,
  most_common_disease VARCHAR,
  most_affected_crop VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_reports,
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW()))::BIGINT as reports_this_month,
    MODE() WITHIN GROUP (ORDER BY disease_name) as most_common_disease,
    MODE() WITHIN GROUP (ORDER BY crop_name) as most_affected_crop
  FROM disease_reports
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE QUERY TO TEST
-- ============================================
-- After creating tables, test with:
-- SELECT * FROM disease_reports WHERE user_id = auth.uid();
