-- ============================================
-- UPDATE MARKETPLACE PRODUCTS FOR MULTI-IMAGES
-- ============================================
-- Run this in Supabase SQL Editor

-- Add images column (array of image URLs)
ALTER TABLE marketplace_products 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Add more product details columns
ALTER TABLE marketplace_products 
ADD COLUMN IF NOT EXISTS full_description TEXT,
ADD COLUMN IF NOT EXISTS features JSONB,
ADD COLUMN IF NOT EXISTS specifications JSONB,
ADD COLUMN IF NOT EXISTS usage_instructions TEXT,
ADD COLUMN IF NOT EXISTS warranty TEXT;

-- Update existing products to have images array from single image
UPDATE marketplace_products 
SET images = ARRAY[image]
WHERE images IS NULL AND image IS NOT NULL;

-- ============================================
-- INSERT DEMO PRODUCTS WITH IMAGES
-- ============================================

-- Clear existing products (optional - comment out if you want to keep them)
-- DELETE FROM marketplace_products;

-- Insert 12 demo agricultural products with real images
INSERT INTO marketplace_products (
  name, category, price, unit, description, full_description,
  supplier, image, images, verified, in_stock, rating, reviews,
  features, specifications, created_by
) VALUES

-- 1. Hybrid Tomato Seeds
(
  'Hybrid Tomato Seeds (Arka Vikas)',
  'seeds',
  450,
  '100g',
  'High-yielding hybrid variety, disease resistant',
  'Arka Vikas is a premium hybrid tomato variety developed by Indian Institute of Horticultural Research. Known for excellent disease resistance, high yield, and adaptability to various climatic conditions.',
  'National Seeds Corporation',
  'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1606588260474-8f27c28c4d66?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.5,
  234,
  '["High yield 60-70 tonnes/hectare", "Disease resistant", "65-70 days harvest", "Fruit weight 80-90g"]'::jsonb,
  '{"Variety": "Hybrid F1", "Germination": "85-90%", "Season": "All seasons", "Spacing": "60cm x 45cm"}'::jsonb,
  'system'
),

-- 2. Neem Oil Pesticide
(
  'Neem Oil 1500 PPM Organic Pesticide',
  'pesticides',
  250,
  '1L',
  'Organic pest control, safe for environment',
  'Premium quality cold-pressed neem oil with 1500 PPM Azadirachtin. Effective against 200+ pests including aphids, whiteflies, and mites. Safe for humans, pets, and beneficial insects.',
  'Neem India Organics',
  'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585594776544-4a8a2be47678?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.8,
  567,
  '["Controls 200+ pests", "Organic certified", "Safe for beneficial insects", "No residue"]'::jsonb,
  '{"Active Ingredient": "Azadirachtin 1500 PPM", "Type": "Organic Pesticide", "Application": "Foliar spray", "Dilution": "2-3 ml per litre"}'::jsonb,
  'system'
),

-- 3. NPK Fertilizer
(
  'NPK 19:19:19 Water Soluble Fertilizer',
  'fertilizers',
  850,
  '5kg',
  'Complete balanced nutrition for all crops',
  'Premium grade NPK fertilizer with equal ratio of Nitrogen, Phosphorus, and Potassium. Completely water-soluble, quick acting, suitable for all crops and growth stages.',
  'Coromandel International',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.6,
  189,
  '["100% water soluble", "Quick acting", "All crops", "Balanced nutrition"]'::jsonb,
  '{"NPK Ratio": "19:19:19", "Solubility": "100%", "Application": "Drip/Foliar", "Dosage": "2-3 kg per acre"}'::jsonb,
  'system'
),

-- 4. Battery Sprayer
(
  'Battery Operated Knapsack Sprayer 16L',
  'tools',
  2500,
  'piece',
  'Rechargeable, 4-6 hours backup, 12V battery',
  'High-quality battery-operated sprayer with 16-litre capacity. Includes rechargeable 12V 8Ah battery, adjustable nozzle, and 1.5m spray lance. Perfect for farms, gardens, and orchards.',
  'KisanKraft Limited',
  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.3,
  145,
  '["16L capacity", "Rechargeable battery", "4-6 hours backup", "Adjustable nozzle"]'::jsonb,
  '{"Capacity": "16 litres", "Battery": "12V 8Ah", "Pressure": "3-4 bar", "Lance Length": "1.5m", "Weight": "5.5kg"}'::jsonb,
  'system'
),

-- 5. Wheat Seeds
(
  'Wheat Seeds HD 2967 Certified',
  'seeds',
  35,
  '1kg',
  'High yielding variety, drought tolerant',
  'HD 2967 is a popular bread wheat variety released by IARI. Known for high yield, disease resistance, and excellent grain quality. Suitable for timely sown irrigated conditions.',
  'Punjab Agricultural University',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551453062-41d3e6adc9e6?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.6,
  678,
  '["Yield 50-55 quintals/hectare", "Disease resistant", "100-105 days duration", "Drought tolerant"]'::jsonb,
  '{"Variety": "HD 2967", "Type": "Bread wheat", "Sowing Time": "November", "Seed Rate": "100kg/hectare"}'::jsonb,
  'system'
),

-- 6. Vermicompost
(
  'Vermicompost Organic Manure',
  'fertilizers',
  400,
  '40kg',
  'Rich in beneficial microbes, improves soil health',
  'Premium quality vermicompost produced from organic waste. Rich in NPK, micronutrients, and beneficial microorganisms. Improves soil structure, water retention, and plant growth.',
  'Green Gold Organics',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585594776544-4a8a2be47678?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599255723323-8f70f3ac48e2?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.9,
  423,
  '["100% organic", "Rich in microbes", "Improves soil health", "No chemical additives"]'::jsonb,
  '{"Organic Matter": ">35%", "NPK": "2:1:1", "Moisture": "<20%", "Application": "200-400 kg/acre"}'::jsonb,
  'system'
),

-- 7. Hybrid Corn Seeds
(
  'Hybrid Maize Seeds Pioneer 30V92',
  'seeds',
  650,
  '500g',
  'High yield, excellent disease resistance',
  'Pioneer 30V92 is a high-yielding hybrid maize variety with excellent tolerance to biotic and abiotic stresses. Suitable for kharif season with good cob filling and grain quality.',
  'Pioneer Seeds India',
  'https://images.unsplash.com/photo-1551453062-41d3e6adc9e6?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1551453062-41d3e6adc9e6?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517843211561-3ff891f3da29?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.7,
  321,
  '["Yield 90-110 quintals/hectare", "Disease resistant", "90-95 days", "Good grain quality"]'::jsonb,
  '{"Variety": "Hybrid", "Season": "Kharif", "Seed Rate": "20-25 kg/hectare", "Spacing": "60cm x 20cm"}'::jsonb,
  'system'
),

-- 8. Bio-Pesticide
(
  'Trichoderma Viride Bio-Fungicide',
  'pesticides',
  350,
  '1kg',
  'Biological fungicide, eco-friendly solution',
  'Trichoderma viride is a beneficial fungus that controls soil-borne diseases. Acts as a bio-control agent against root rot, wilt, and damping off. Completely safe and organic.',
  'BioControl India',
  'https://images.unsplash.com/photo-1601575434663-7350b6ccaaa3?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1601575434663-7350b6ccaaa3?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585594776544-4a8a2be47678?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.5,
  276,
  '["Controls soil diseases", "100% organic", "Beneficial fungus", "Safe for environment"]'::jsonb,
  '{"Active Ingredient": "Trichoderma viride 1x10^8 CFU/g", "Application": "Seed/Soil treatment", "Dosage": "4-5 kg/acre"}'::jsonb,
  'system'
),

-- 9. Drip Irrigation Kit
(
  'Drip Irrigation System 1 Acre Kit',
  'tools',
  3500,
  'set',
  'Complete drip system for 1 acre, water saving',
  'Complete drip irrigation kit for 1 acre including main line, lateral pipes, drippers, filters, and fittings. Saves 40-50% water, increases yield, and reduces labor costs.',
  'Jain Irrigation Systems',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.6,
  198,
  '["Covers 1 acre", "40-50% water saving", "Increases yield 30-40%", "Complete kit"]'::jsonb,
  '{"Coverage": "1 acre", "Dripper Spacing": "30cm", "Lateral Spacing": "1.5m", "Filter": "Screen filter included"}'::jsonb,
  'system'
),

-- 10. Basmati Rice Seeds
(
  'Pusa Basmati 1121 Seeds Certified',
  'seeds',
  120,
  '1kg',
  'Premium basmati variety, aromatic long grain',
  'Pusa Basmati 1121 is the longest grain basmati rice variety with excellent cooking quality and aroma. Developed by IARI Delhi, suitable for North India.',
  'Indian Agricultural Research Institute',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589307357838-e8a89df6cf7e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.8,
  542,
  '["Grain length 8-9mm", "Extra long grain", "Aromatic", "130-140 days"]'::jsonb,
  '{"Variety": "Pusa 1121", "Type": "Basmati", "Sowing": "June-July", "Seed Rate": "20kg/hectare"}'::jsonb,
  'system'
),

-- 11. Humic Acid
(
  'Humic Acid Liquid Plant Growth Promoter',
  'fertilizers',
  550,
  '1L',
  'Enhances soil health and nutrient uptake',
  'Premium liquid humic acid derived from leonardite. Improves soil structure, increases nutrient availability, enhances root growth, and boosts plant immunity.',
  'Agro Solutions Ltd',
  'https://images.unsplash.com/photo-1599255723323-8f70f3ac48e2?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1599255723323-8f70f3ac48e2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.7,
  167,
  '["Improves soil structure", "Increases nutrient uptake", "Enhances root growth", "100% organic"]'::jsonb,
  '{"Humic Acid": "12%", "Fulvic Acid": "3%", "Application": "Drip/Foliar", "Dosage": "2-3 ml/litre"}'::jsonb,
  'system'
),

-- 12. Garden Pruning Shears
(
  'Professional Garden Pruning Shears',
  'tools',
  450,
  'piece',
  'Sharp stainless steel, ergonomic handle, bypass type',
  'Professional-grade pruning shears with SK-5 carbon steel blades. Ergonomic design reduces hand fatigue. Perfect for pruning roses, shrubs, and fruit trees up to 20mm diameter.',
  'Gardening Pro Tools',
  'https://images.unsplash.com/photo-1617634667039-8e3033a9b9d0?w=400&h=300&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1617634667039-8e3033a9b9d0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1616627073638-2c00f9dc3e35?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=600&fit=crop'
  ],
  true,
  true,
  4.4,
  89,
  '["SK-5 carbon steel", "Ergonomic design", "Bypass type", "Cuts up to 20mm"]'::jsonb,
  '{"Blade Material": "SK-5 Carbon Steel", "Type": "Bypass", "Max Cut": "20mm", "Weight": "200g"}'::jsonb,
  'system'
)

ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFY INSERTION
-- ============================================

-- Check all products
SELECT id, name, category, price, array_length(images, 1) as image_count
FROM marketplace_products
ORDER BY created_at DESC;

-- Success message
SELECT 'Demo products inserted successfully! Check marketplace to see them.' as message;
