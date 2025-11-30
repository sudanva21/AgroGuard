-- ============================================
-- INSERT 20 PREMIUM MARKETPLACE PRODUCTS
-- For Presentation Demo
-- ============================================
-- Run this in Supabase SQL Editor

-- Clear existing products first (optional - comment out if you want to keep old products)
DELETE FROM marketplace_products;

-- Insert 20 premium agricultural products with real images
INSERT INTO marketplace_products (
  name, category, price, unit, description, full_description,
  supplier, image, images, verified, in_stock, rating, reviews,
  features, specifications, created_by
) VALUES

-- ========== SEEDS (5 Products) ==========

-- 1. Hybrid Tomato Seeds
(
  'Hybrid Tomato Seeds - Arka Vikas (High Yield)',
  'seeds',
  450,
  '100g',
  'Disease-resistant hybrid variety with 60-70 tonnes/hectare yield',
  'Arka Vikas is a premium hybrid tomato variety developed by Indian Institute of Horticultural Research (IIHR), Bangalore. This variety is known for its exceptional disease resistance, high yield potential, and excellent fruit quality. Ideal for both commercial cultivation and home gardens. The fruits are firm, uniform in size (80-90g), and have excellent shelf life.',
  'National Seeds Corporation Limited',
  'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606588260474-8f27c28c4d66?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.7,
  342,
  '["Yield: 60-70 tonnes/hectare", "Harvest: 65-70 days", "Fruit weight: 80-90g", "Disease resistant", "All-season variety"]'::jsonb,
  '{"Type": "Hybrid F1", "Germination": "85-90%", "Sowing Season": "All seasons", "Plant Spacing": "60cm x 45cm", "Certification": "IARI Certified"}'::jsonb,
  'system'
),

-- 2. Basmati Rice Seeds
(
  'Pusa Basmati 1121 - Premium Aromatic Rice Seeds',
  'seeds',
  120,
  '1kg',
  'Extra long grain aromatic basmati variety, 8-9mm grain length',
  'Pusa Basmati 1121 is the world-renowned extra-long grain basmati rice variety developed by Indian Agricultural Research Institute (IARI), New Delhi. This variety is famous for its exceptional aroma, cooking quality, and elongation upon cooking. The grain length extends to 8-9mm after cooking, making it the premium choice for export quality basmati production.',
  'Indian Agricultural Research Institute',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589307357838-e8a89df6cf7e?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.9,
  678,
  '["Grain length: 8-9mm", "Extra long grain", "Highly aromatic", "Export quality", "Duration: 135-140 days"]'::jsonb,
  '{"Variety": "Pusa 1121", "Type": "Basmati Rice", "Sowing Time": "June-July", "Seed Rate": "15-20 kg/hectare", "Soil Type": "Clay loam"}'::jsonb,
  'system'
),

-- 3. Hybrid Maize Seeds
(
  'Pioneer 30V92 - High Yield Hybrid Maize Seeds',
  'seeds',
  650,
  '500g',
  'Premium hybrid maize with 90-110 quintal/hectare yield potential',
  'Pioneer 30V92 represents the pinnacle of hybrid maize breeding technology. This variety offers exceptional yield stability across diverse environmental conditions. With outstanding tolerance to major diseases and pests, this hybrid ensures consistent performance. The cobs are well-filled with bold, yellow grains of excellent quality, suitable for both grain and fodder purposes.',
  'Corteva Agriscience (Pioneer)',
  'https://images.unsplash.com/photo-1551453062-41d3e6adc9e6?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1551453062-41d3e6adc9e6?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517843211561-3ff891f3da29?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1623788447451-ad9d5a5c3a8a?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.8,
  456,
  '["Yield: 90-110 quintals/hectare", "Disease resistant", "Maturity: 90-95 days", "Bold grains", "Drought tolerant"]'::jsonb,
  '{"Type": "Triple Cross Hybrid", "Season": "Kharif", "Seed Rate": "20-25 kg/hectare", "Spacing": "60cm x 20cm", "Cob Length": "18-22cm"}'::jsonb,
  'system'
),

-- 4. Wheat Seeds HD 2967
(
  'HD 2967 Certified Wheat Seeds - Drought Tolerant',
  'seeds',
  35,
  '1kg',
  'High yielding bread wheat variety with excellent disease resistance',
  'HD 2967 is a premium bread wheat variety released by Indian Agricultural Research Institute (IARI) in 2011. This variety has gained immense popularity due to its high yield potential (50-55 quintals/hectare), excellent disease resistance particularly against yellow and brown rust, and superior grain quality. It performs exceptionally well in timely sown irrigated conditions and has good drought tolerance.',
  'Punjab Agricultural University',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551453062-41d3e6adc9e6?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.6,
  789,
  '["Yield: 50-55 quintals/hectare", "Rust resistant", "Duration: 140-150 days", "Drought tolerant", "Excellent grain quality"]'::jsonb,
  '{"Variety": "HD 2967", "Type": "Bread Wheat", "Sowing Time": "November", "Seed Rate": "100 kg/hectare", "Grain Type": "Amber hard"}'::jsonb,
  'system'
),

-- 5. Hybrid Chili Seeds
(
  'Teja Hybrid Chili Seeds - Extra Hot Variety',
  'seeds',
  580,
  '10g',
  'High pungent hybrid chili, 35,000-40,000 SHU, excellent for spice production',
  'Teja Hybrid Chili is specifically bred for commercial spice production with exceptional pungency levels (35,000-40,000 Scoville Heat Units). This variety produces long, slender, bright red fruits that are perfect for drying and spice powder production. With excellent disease resistance and high yield potential, it is the preferred choice for chili farmers across India.',
  'Indo-American Hybrid Seeds',
  'https://images.unsplash.com/photo-1583454155184-870a1f63b6f6?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1583454155184-870a1f63b6f6?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529660704552-5bb7f9046f29?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.5,
  234,
  '["Pungency: 35,000-40,000 SHU", "Yield: 15-20 tonnes/hectare", "Length: 8-10cm", "Bright red color", "Disease resistant"]'::jsonb,
  '{"Type": "Hybrid F1", "Season": "All seasons", "Seed Rate": "300-400g/hectare", "Spacing": "60cm x 45cm", "Harvest": "150-180 days"}'::jsonb,
  'system'
),

-- ========== PESTICIDES (5 Products) ==========

-- 6. Neem Oil Organic Pesticide
(
  'Neem Oil 1500 PPM - 100% Organic Pesticide',
  'pesticides',
  280,
  '1L',
  'Cold-pressed neem oil, controls 200+ pests, safe for beneficial insects',
  'Premium quality cold-pressed neem oil with standardized Azadirachtin content of 1500 PPM. This organic pesticide provides effective control against more than 200 species of pests including aphids, whiteflies, thrips, mealybugs, and spider mites. Unlike chemical pesticides, neem oil is completely safe for humans, pets, birds, and beneficial insects like honeybees and ladybugs. It also has anti-fungal properties.',
  'Neem India Organic Products',
  'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585594776544-4a8a2be47678?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.9,
  892,
  '["Controls 200+ pests", "Organic certified", "Safe for pollinators", "Anti-fungal properties", "Zero harvest interval"]'::jsonb,
  '{"Active Ingredient": "Azadirachtin 1500 PPM", "Certification": "Organic India", "Application": "Foliar spray", "Dilution": "2-3 ml/litre water", "PHI": "0 days"}'::jsonb,
  'system'
),

-- 7. Trichoderma Bio-Fungicide
(
  'Trichoderma Viride Bio-Fungicide 1x10^8 CFU/g',
  'pesticides',
  350,
  '1kg',
  'Biological fungicide for soil-borne diseases, eco-friendly solution',
  'Trichoderma viride is a highly effective bio-fungicide that works through multiple mechanisms including mycoparasitism, antibiosis, and competition. It provides excellent control against soil-borne fungal pathogens causing root rot, wilt, damping off, and collar rot in various crops. Being a beneficial fungus, it also enhances plant growth by improving nutrient availability and producing growth-promoting substances.',
  'BioControl Research Laboratories',
  'https://images.unsplash.com/photo-1601575434663-7350b6ccaaa3?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1601575434663-7350b6ccaaa3?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.7,
  456,
  '["Controls soil diseases", "100% organic", "Plant growth promoter", "Safe for environment", "Increases yield"]'::jsonb,
  '{"Active Ingredient": "Trichoderma viride 1x10^8 CFU/g", "Application": "Seed/Soil treatment", "Dosage": "4-5 kg/acre", "Target": "Fusarium, Pythium, Rhizoctonia"}'::jsonb,
  'system'
),

-- 8. Emamectin Benzoate Insecticide
(
  'Emamectin Benzoate 5% SG - Premium Insecticide',
  'pesticides',
  480,
  '100g',
  'Highly effective against fruit borers, leaf folders, DBM',
  'Emamectin Benzoate 5% SG is a second-generation avermectin insecticide with exceptional efficacy against lepidopteran pests. It works through stomach and contact action, providing quick knockdown and long residual control. Particularly effective against fruit borers in tomato and okra, diamond back moth in cabbage, and pod borer in chickpea and pigeon pea. Low application rate makes it economical.',
  'Syngenta India Limited',
  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.6,
  567,
  '["Highly effective", "Low dosage", "Long residual action", "Government approved", "IPM compatible"]'::jsonb,
  '{"Active Ingredient": "Emamectin Benzoate 5% SG", "Dosage": "80-100g/acre", "Application": "Foliar spray", "PHI": "3-5 days", "Registration": "CIB Approved"}'::jsonb,
  'system'
),

-- 9. Copper Oxychloride Fungicide
(
  'Copper Oxychloride 50% WP - Broad Spectrum Fungicide',
  'pesticides',
  320,
  '1kg',
  'Controls late blight, downy mildew, bacterial diseases',
  'Copper Oxychloride 50% WP is a well-established broad-spectrum contact fungicide and bactericide. It provides excellent protective action against a wide range of fungal and bacterial diseases. Particularly effective against late blight and early blight in potato and tomato, downy mildew in grapes and vegetables, and bacterial leaf spot. Its multi-site mode of action prevents resistance development.',
  'Rallis India Limited',
  'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585594776544-4a8a2be47678?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.5,
  389,
  '["Broad spectrum control", "Protectant fungicide", "Controls bacteria", "No resistance", "Weather resistant"]'::jsonb,
  '{"Active Ingredient": "Copper Oxychloride 50% WP", "Dosage": "2-2.5 kg/acre", "Application": "Foliar spray", "Target": "Late blight, Downy mildew", "PHI": "7 days"}'::jsonb,
  'system'
),

-- 10. Bacillus Thuringiensis Bio-Insecticide
(
  'Bt (Bacillus Thuringiensis) Bio-Insecticide WP',
  'pesticides',
  300,
  '500g',
  'Biological insecticide, safe for beneficial insects and environment',
  'Bacillus thuringiensis (Bt) is nature''s own insecticide - a naturally occurring soil bacterium that produces crystal proteins toxic to specific insect larvae. This bio-insecticide is highly selective, targeting only caterpillars and worms while being completely harmless to humans, animals, birds, fish, and beneficial insects. Perfect for organic farming and integrated pest management programs.',
  'Bio-Organics India',
  'https://images.unsplash.com/photo-1585594776544-4a8a2be47678?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1585594776544-4a8a2be47678?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601575434663-7350b6ccaaa3?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.8,
  678,
  '["100% biological", "Selective action", "Safe for beneficials", "Organic certified", "No resistance"]'::jsonb,
  '{"Active Ingredient": "Bacillus thuringiensis var kurstaki", "Potency": "5000 IU/mg", "Dosage": "500g-1kg/acre", "Target": "Caterpillars, Borers", "PHI": "0 days"}'::jsonb,
  'system'
),

-- ========== FERTILIZERS (5 Products) ==========

-- 11. NPK 19:19:19 Water Soluble
(
  'NPK 19:19:19 Water Soluble Fertilizer - Complete Nutrition',
  'fertilizers',
  850,
  '5kg',
  '100% water soluble, balanced NPK for all growth stages',
  'Premium grade NPK 19:19:19 water soluble fertilizer with equal proportions of Nitrogen, Phosphorus, and Potassium. This complete balanced fertilizer is 100% water soluble with no impurities, making it perfect for drip irrigation, fertigation, and foliar application. Suitable for all crops during all growth stages. Quick acting formula ensures rapid nutrient uptake and visible results within days.',
  'Coromandel International Limited',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.8,
  543,
  '["100% water soluble", "No impurities", "Quick acting", "All crops suitable", "Drip & foliar compatible"]'::jsonb,
  '{"NPK Ratio": "19:19:19", "Solubility": "100%", "Application": "Drip/Fertigation/Foliar", "Dosage": "2-3 kg/acre", "pH": "5.5-6.5"}'::jsonb,
  'system'
),

-- 12. Vermicompost Organic Manure
(
  'Premium Vermicompost - 100% Organic Manure',
  'fertilizers',
  400,
  '40kg',
  'Enriched with beneficial microbes, improves soil health and structure',
  'Premium quality vermicompost produced through vermiculture process using red earthworms (Eisenia fetida). This organic manure is rich in macro and micronutrients, beneficial microorganisms, growth hormones, and enzymes. It significantly improves soil structure, water holding capacity, and nutrient availability. Regular use reduces chemical fertilizer requirement by 30-40% and improves crop quality.',
  'Green Gold Organic Products',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585594776544-4a8a2be47678?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599255723323-8f70f3ac48e2?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.9,
  867,
  '["100% organic", "Rich in microbes", "Improves soil structure", "Reduces chemical fertilizer need", "Organic certified"]'::jsonb,
  '{"Organic Carbon": "12-18%", "Nitrogen": "1.5-2%", "Phosphorus": "0.8-1.2%", "Potassium": "1.2-1.8%", "Application": "200-400 kg/acre"}'::jsonb,
  'system'
),

-- 13. Humic Acid Liquid
(
  'Humic Acid 12% Liquid - Plant Growth Promoter',
  'fertilizers',
  550,
  '1L',
  'Enhances nutrient uptake, improves soil health, boosts immunity',
  'Premium liquid humic acid extracted from high-grade leonardite. Humic acid acts as a natural chelating agent, improving nutrient availability and uptake efficiency. It stimulates root growth, enhances soil microbial activity, improves soil structure, and increases plant immunity against stress. Regular use results in healthier plants, better yields, and improved produce quality.',
  'Agro Solutions Private Limited',
  'https://images.unsplash.com/photo-1599255723323-8f70f3ac48e2?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1599255723323-8f70f3ac48e2?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.7,
  334,
  '["Enhances nutrient uptake", "Stimulates root growth", "Improves soil health", "Increases stress tolerance", "100% organic"]'::jsonb,
  '{"Humic Acid": "12%", "Fulvic Acid": "3%", "pH": "8-10", "Application": "Drip/Foliar/Soil", "Dosage": "2-3 ml/litre"}'::jsonb,
  'system'
),

-- 14. DAP Fertilizer
(
  'DAP (Di-Ammonium Phosphate) 18:46:0 Fertilizer',
  'fertilizers',
  1250,
  '50kg',
  'High phosphorus fertilizer, ideal for root development and flowering',
  'Di-Ammonium Phosphate (DAP) is the world''s most widely used phosphorus fertilizer. With 18% nitrogen and 46% phosphorus, it provides an excellent combination for early plant growth, root development, and establishment. DAP is particularly beneficial during sowing/planting and early growth stages. It dissolves quickly in soil moisture, making nutrients readily available to plants.',
  'Indian Farmers Fertiliser Cooperative (IFFCO)',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.6,
  1234,
  '["High phosphorus content", "Quick dissolving", "Ideal for sowing time", "All crops suitable", "Government certified"]'::jsonb,
  '{"NPK Ratio": "18:46:0", "Nitrogen": "18%", "Phosphorus (P2O5)": "46%", "Application": "Basal/Broadcasting", "Dosage": "50-75 kg/acre"}'::jsonb,
  'system'
),

-- 15. Potash (MOP)
(
  'Muriate of Potash (MOP) 0:0:60 - Pure Potassium',
  'fertilizers',
  980,
  '50kg',
  'High potassium fertilizer for fruit quality and disease resistance',
  'Muriate of Potash (MOP) is the most concentrated and economical source of potassium (K) for plants. With 60% K2O content, it significantly improves fruit quality, size, color, taste, and shelf life. Potassium plays a crucial role in photosynthesis, protein synthesis, disease resistance, and water management in plants. Essential for all fruit crops, vegetables, and commercial crops.',
  'Rashtriya Chemicals & Fertilizers Limited',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.7,
  678,
  '["60% K2O content", "Improves fruit quality", "Enhances disease resistance", "Water stress management", "All crops suitable"]'::jsonb,
  '{"NPK Ratio": "0:0:60", "Potassium (K2O)": "60%", "Chlorine": "47%", "Application": "Top dressing/Basal", "Dosage": "40-60 kg/acre"}'::jsonb,
  'system'
),

-- ========== TOOLS (5 Products) ==========

-- 16. Battery Knapsack Sprayer
(
  'Battery Operated Knapsack Sprayer 16L - 12V',
  'tools',
  2500,
  'piece',
  'Rechargeable 12V battery, 4-6 hours backup, adjustable pressure',
  'Professional-grade battery-operated knapsack sprayer with 16-litre capacity and powerful 12V 8Ah rechargeable battery. Features variable pressure control, adjustable nozzle for different spray patterns, and ergonomic design for comfortable operation. Includes 1.5m flexible spray lance with brass nozzle. Perfect for pesticide application, fertilizer spraying, and disinfection work in farms, gardens, and orchards.',
  'KisanKraft Limited',
  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.5,
  456,
  '["16L capacity", "12V 8Ah battery", "4-6 hours backup", "Adjustable pressure", "Brass nozzle"]'::jsonb,
  '{"Tank Capacity": "16 litres", "Battery": "12V 8Ah Lithium", "Pressure": "2-4 bar", "Lance Length": "1.5m", "Weight": "5.5kg", "Warranty": "1 year"}'::jsonb,
  'system'
),

-- 17. Drip Irrigation Kit
(
  'Drip Irrigation System Complete Kit - 1 Acre',
  'tools',
  3500,
  'set',
  'Complete drip system with laterals, drippers, filter, fittings',
  'Complete drip irrigation kit designed for 1 acre cultivation. Includes main line pipes, lateral pipes with inline drippers (30cm spacing), screen filter, pressure regulator, venturi for fertigation, valves, and all necessary fittings. Saves 40-50% water compared to flood irrigation, increases yield by 30-40%, improves fertilizer efficiency, and reduces labor costs. Suitable for all row crops, vegetables, and orchards.',
  'Jain Irrigation Systems Limited',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.8,
  234,
  '["Covers 1 acre", "40-50% water saving", "30-40% yield increase", "Fertigation compatible", "Complete kit"]'::jsonb,
  '{"Coverage": "1 acre (4000 sq.m)", "Dripper Spacing": "30cm", "Lateral Spacing": "1.5m", "Dripper Flow": "4 LPH", "Filter": "120 mesh screen filter"}'::jsonb,
  'system'
),

-- 18. Garden Pruning Shears
(
  'Professional Bypass Pruning Shears - SK5 Steel',
  'tools',
  450,
  'piece',
  'Sharp SK-5 carbon steel blades, ergonomic grip, cuts up to 20mm',
  'Premium quality bypass pruning shears crafted from high-grade SK-5 carbon steel. Features precision-ground cutting blade and anvil for clean, smooth cuts. Ergonomic design with non-slip rubber grips reduces hand fatigue during extended use. Perfect for pruning roses, fruit trees, shrubs, and grape vines. Includes safety lock and replacement spring. Cuts branches up to 20mm diameter effortlessly.',
  'Garden Pro Tools India',
  'https://images.unsplash.com/photo-1617634667039-8e3033a9b9d0?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1617634667039-8e3033a9b9d0?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616627073638-2c00f9dc3e35?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.6,
  345,
  '["SK-5 carbon steel", "Bypass cutting action", "Ergonomic design", "Cuts 20mm branches", "Safety lock included"]'::jsonb,
  '{"Blade Material": "SK-5 Carbon Steel", "Cutting Type": "Bypass", "Max Cutting Diameter": "20mm", "Length": "200mm", "Weight": "200g"}'::jsonb,
  'system'
),

-- 19. Soil pH Meter Digital
(
  'Digital Soil pH & Moisture Meter 3-in-1',
  'tools',
  1200,
  'piece',
  'Measures pH, moisture, and light - No batteries required',
  'Advanced 3-in-1 soil testing device that measures soil pH (3-8), moisture content (1-10 scale), and sunlight intensity (0-2000 Lux). No batteries or external power required. Simply insert the probes into soil and get instant readings. Essential tool for precision agriculture, greenhouse cultivation, and garden management. Helps optimize soil conditions for better crop growth and higher yields.',
  'AgriTech Instruments',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092583537-20d51b2a5f0b?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.7,
  189,
  '["3-in-1 functionality", "No batteries needed", "Instant readings", "pH range 3-8", "Durable probes"]'::jsonb,
  '{"pH Range": "3.0-8.0", "Moisture Range": "1-10 scale", "Light Range": "0-2000 Lux", "Probe Length": "200mm", "Material": "ABS plastic + metal probes"}'::jsonb,
  'system'
),

-- 20. Power Weeder Machine
(
  'Mini Power Weeder Cultivator - 2 Stroke Petrol',
  'tools',
  8500,
  'piece',
  '52cc engine, lightweight, perfect for vegetable farming',
  'Efficient mini power weeder with powerful 52cc 2-stroke petrol engine. Designed specifically for weeding between crop rows and inter-cultivation in vegetable farms, sugarcane, cotton, and other row crops. Features adjustable tilling width (200-400mm), lightweight design (only 15kg), and easy maneuverability. Reduces labor costs by 80% and completes weeding faster than manual methods. Increases soil aeration and breaks soil crust.',
  'Honda Power Products India',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&h=400&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&h=800&fit=crop&q=80'
  ],
  true,
  true,
  4.4,
  167,
  '["52cc petrol engine", "Adjustable tilling width", "Lightweight 15kg", "Reduces labor 80%", "Easy operation"]'::jsonb,
  '{"Engine": "52cc 2-stroke", "Power": "1.5 HP", "Tilling Width": "200-400mm adjustable", "Tilling Depth": "50-100mm", "Weight": "15kg", "Fuel Tank": "1.2L"}'::jsonb,
  'system'
);

-- ============================================
-- VERIFY INSERTION
-- ============================================

SELECT 
  id, 
  name, 
  category, 
  price,
  unit,
  verified,
  in_stock,
  rating,
  array_length(images, 1) as image_count
FROM marketplace_products
ORDER BY 
  CASE category
    WHEN 'seeds' THEN 1
    WHEN 'pesticides' THEN 2
    WHEN 'fertilizers' THEN 3
    WHEN 'tools' THEN 4
  END,
  created_at DESC;

-- Success message
SELECT 
  '🎉 SUCCESS! 20 Premium Products Inserted!' as message,
  COUNT(*) as total_products,
  COUNT(CASE WHEN category = 'seeds' THEN 1 END) as seeds,
  COUNT(CASE WHEN category = 'pesticides' THEN 1 END) as pesticides,
  COUNT(CASE WHEN category = 'fertilizers' THEN 1 END) as fertilizers,
  COUNT(CASE WHEN category = 'tools' THEN 1 END) as tools
FROM marketplace_products;
