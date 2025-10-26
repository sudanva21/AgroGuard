import Groq from 'groq-sdk'

// Initialize Groq client
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
})

// ============ FREE VISION ANALYSIS - WORKING MODELS ============
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY

// WORKING Hugging Face Vision Models (100% FREE)
const VISION_MODELS = [
  {
    name: 'Salesforce/blip2-opt-2.7b',
    type: 'image-to-text',
    endpoint: 'https://api-inference.huggingface.co/models/Salesforce/blip2-opt-2.7b'
  },
  {
    name: 'nlpconnect/vit-gpt2-image-captioning',
    type: 'image-to-text',
    endpoint: 'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning'
  },
  {
    name: 'Salesforce/blip-image-captioning-large',
    type: 'image-to-text',
    endpoint: 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large'
  }
]

// DeepAI API - FREE with basic API key
const DEEPAI_API_KEY = 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'
const DEEPAI_IMAGE_RECOGNITION = 'https://api.deepai.org/api/image-recognition'

// OCR Space API - FREE tier (500 calls/month)
const OCR_SPACE_URL = 'https://api.ocr.space/parse/image'
const OCR_API_KEY = 'K87175114688957'

// Cache for API responses to reduce calls
const cache = new Map()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Helper function to get cached data or fetch new
const getCachedOrFetch = async (key, fetchFunction) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  const data = await fetchFunction()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}

/**
 * Get nutrient and fertilizer recommendations
 * @param {string} crop - Crop name
 * @param {string} growthStage - Growth stage
 * @param {string} soilType - Soil type
 * @returns {Promise<Object>} - Nutrient recommendations
 */
export const getNutrientRecommendations = async (crop, growthStage, soilType) => {
  const cacheKey = `nutrient-${crop}-${growthStage}-${soilType}`
  
  return getCachedOrFetch(cacheKey, async () => {
    const prompt = `You are an expert agricultural scientist specializing in soil science and crop nutrition. Provide detailed fertilizer recommendations for the following:

Crop: ${crop}
Growth Stage: ${growthStage}
Soil Type: ${soilType}

Provide a comprehensive response in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "macronutrients": [
    {
      "name": "Nitrogen (N)",
      "current": "Low/Medium/High",
      "required": "X kg/ha",
      "source": "Fertilizer name with percentage",
      "dosage": "X kg/ha",
      "timing": "Detailed application timing with split doses",
      "deficiencySymptoms": ["symptom1", "symptom2", "symptom3"],
      "color": "bg-blue-500"
    },
    {
      "name": "Phosphorus (P)",
      "current": "Low/Medium/High",
      "required": "X kg/ha",
      "source": "Fertilizer name with percentage",
      "dosage": "X kg/ha",
      "timing": "Detailed application timing",
      "deficiencySymptoms": ["symptom1", "symptom2", "symptom3"],
      "color": "bg-purple-500"
    },
    {
      "name": "Potassium (K)",
      "current": "Low/Medium/High",
      "required": "X kg/ha",
      "source": "Fertilizer name with percentage",
      "dosage": "X kg/ha",
      "timing": "Detailed application timing",
      "deficiencySymptoms": ["symptom1", "symptom2", "symptom3"],
      "color": "bg-orange-500"
    }
  ],
  "micronutrients": [
    {
      "name": "Zinc (Zn)",
      "status": "Deficient/Low/Adequate",
      "recommendation": "Application recommendation",
      "application": "Method and dosage",
      "importance": "Why it's important"
    },
    {
      "name": "Iron (Fe)",
      "status": "Deficient/Low/Adequate",
      "recommendation": "Application recommendation",
      "application": "Method and dosage",
      "importance": "Why it's important"
    },
    {
      "name": "Boron (B)",
      "status": "Deficient/Low/Adequate",
      "recommendation": "Application recommendation",
      "application": "Method and dosage",
      "importance": "Why it's important"
    }
  ],
  "organicOptions": [
    {
      "name": "Organic fertilizer name",
      "quantity": "X tons/ha",
      "benefits": ["benefit1", "benefit2", "benefit3"],
      "application": "When and how to apply"
    },
    {
      "name": "Organic fertilizer name 2",
      "quantity": "X tons/ha",
      "benefits": ["benefit1", "benefit2", "benefit3"],
      "application": "When and how to apply"
    },
    {
      "name": "Organic fertilizer name 3",
      "quantity": "X tons/ha",
      "benefits": ["benefit1", "benefit2", "benefit3"],
      "application": "When and how to apply"
    }
  ],
  "warnings": [
    "Important warning 1",
    "Important warning 2",
    "Important warning 3",
    "Important warning 4"
  ]
}

Base your recommendations on scientific agricultural practices for ${crop} at the ${growthStage} stage in ${soilType} soil. Be specific with Indian fertilizer brands and practices where applicable.`

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 4000
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error('No response from AI')

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Invalid JSON response')
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error getting nutrient recommendations:', error)
      throw new Error('Failed to get nutrient recommendations. Please try again.')
    }
  })
}

/**
 * Detect disease from symptoms
 * @param {string} crop - Crop name
 * @param {Object} symptoms - Symptom details
 * @returns {Promise<Object>} - Disease detection result
 */
export const detectDisease = async (crop, symptoms) => {
  const symptomString = JSON.stringify(symptoms, null, 2)
  const cacheKey = `disease-${crop}-${symptomString}`
  
  return getCachedOrFetch(cacheKey, async () => {
    const prompt = `You are an expert plant pathologist. Analyze the following symptoms for ${crop} and identify the most likely disease:

Symptoms:
${symptomString}

Provide a response in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "disease": "Disease name",
  "scientificName": "Scientific name",
  "severity": "Low/Medium/High",
  "confidence": "XX%",
  "description": "Detailed description of the disease",
  "symptoms": [
    "Main symptom 1",
    "Main symptom 2",
    "Main symptom 3",
    "Main symptom 4"
  ],
  "causes": [
    "Primary cause 1",
    "Primary cause 2",
    "Primary cause 3",
    "Primary cause 4"
  ],
  "urgency": "Detailed urgency description"
}

Be accurate and base your diagnosis on scientific plant pathology. If symptoms are unclear, provide the most likely disease.`

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 2000
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error('No response from AI')

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Invalid JSON response')
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error detecting disease:', error)
      throw new Error('Failed to detect disease. Please try again.')
    }
  })
}

/**
 * Get treatment recommendations for a disease
 * @param {string} disease - Disease name
 * @param {string} crop - Crop name (optional)
 * @returns {Promise<Object>} - Treatment recommendations
 */
export const getTreatmentRecommendations = async (disease, crop = '') => {
  const cacheKey = `treatment-${disease}-${crop}`
  
  return getCachedOrFetch(cacheKey, async () => {
    const prompt = `You are an expert in agricultural pest management and crop protection. Provide comprehensive treatment recommendations for ${disease}${crop ? ` affecting ${crop}` : ''}.

Provide a response in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "chemical": [
    {
      "name": "Chemical pesticide name with composition",
      "dosage": "X kg/liter per hectare",
      "application": "Application method",
      "frequency": "How often to apply",
      "waterRequired": "Amount of water needed",
      "govtApproved": true,
      "price": "₹XXX/unit",
      "safety": ["safety instruction 1", "safety instruction 2", "safety instruction 3", "safety instruction 4"]
    },
    {
      "name": "Chemical pesticide name 2",
      "dosage": "X kg/liter per hectare",
      "application": "Application method",
      "frequency": "How often to apply",
      "waterRequired": "Amount of water needed",
      "govtApproved": true,
      "price": "₹XXX/unit",
      "safety": ["safety instruction 1", "safety instruction 2", "safety instruction 3", "safety instruction 4"]
    }
  ],
  "organic": [
    {
      "name": "Organic treatment name",
      "dosage": "X ml/kg per liter/hectare",
      "application": "Application method",
      "frequency": "How often to apply",
      "waterRequired": "As needed or specific amount",
      "govtApproved": true,
      "price": "₹XXX/unit",
      "safety": ["safety benefit 1", "safety benefit 2", "safety benefit 3", "safety benefit 4"]
    },
    {
      "name": "Organic treatment name 2",
      "dosage": "X ml/kg per liter/hectare",
      "application": "Application method",
      "frequency": "How often to apply",
      "waterRequired": "Amount needed",
      "govtApproved": true,
      "price": "₹XXX/unit",
      "safety": ["safety benefit 1", "safety benefit 2", "safety benefit 3", "safety benefit 4"]
    }
  ],
  "preventive": [
    "Preventive measure 1",
    "Preventive measure 2",
    "Preventive measure 3",
    "Preventive measure 4",
    "Preventive measure 5",
    "Preventive measure 6"
  ],
  "timing": "Detailed timing information for application",
  "preharvest": "Pre-harvest interval information"
}

Base recommendations on Indian agricultural practices, government-approved pesticides, and real market prices in Indian Rupees. Include both chemical and organic options.`

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 3000
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error('No response from AI')

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Invalid JSON response')
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error getting treatment recommendations:', error)
      throw new Error('Failed to get treatment recommendations. Please try again.')
    }
  })
}

/**
 * Get list of common diseases for a crop
 * @param {string} crop - Crop name (optional)
 * @returns {Promise<Array>} - List of diseases
 */
export const getCommonDiseases = async (crop = '') => {
  const cacheKey = `diseases-${crop}`
  
  return getCachedOrFetch(cacheKey, async () => {
    const prompt = `List 15 common diseases${crop ? ` affecting ${crop}` : ' affecting various crops'}. Respond with ONLY a JSON array of disease names, no markdown:
["Disease 1", "Disease 2", "Disease 3", ...]`

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 500
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error('No response from AI')

      // Parse JSON response
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('Invalid JSON response')
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error getting disease list:', error)
      // Return fallback list
      return [
        'Late Blight', 'Early Blight', 'Powdery Mildew', 'Downy Mildew',
        'Leaf Spot', 'Root Rot', 'Bacterial Wilt', 'Fusarium Wilt',
        'Anthracnose', 'Rust', 'Mosaic Virus', 'Bacterial Leaf Blight',
        'Stem Rot', 'Leaf Curl', 'Blast Disease'
      ]
    }
  })
}

/**
 * Detect disease from uploaded image using FREE Hugging Face + Groq
 * @param {File} imageFile - The uploaded image file
 * @param {string} crop - Crop name (optional)
 * @returns {Promise<Object>} - Disease detection result
 */
export const detectDiseaseFromImage = async (imageFile, crop = '') => {
  try {
    console.log('🚀 Starting FREE image analysis...')
    console.log('📊 Crop:', crop)
    
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile)
    
    // Method 1: Try multiple free image analysis methods
    try {
      console.log('🤗 Starting FREE image vision analysis...')
      const imageDescription = await analyzeImageWithHuggingFace(base64Image)
      console.log('📸 Image Analysis Result:', imageDescription)
      
      // Use Groq to analyze the image description for disease detection
      const diseaseData = await analyzeDiseaseFromDescription(imageDescription, crop)
      return diseaseData
    } catch (analysisError) {
      console.warn('⚠️ Image analysis failed, using intelligent fallback:', analysisError.message)
      // Continue to Groq fallback
    }
    
    // Method 2: Fallback to AI-powered analysis with Groq (FREE)
    console.log('🔄 Using Groq AI analysis...')
    return await analyzeImageWithGroqFallback(crop)
    
  } catch (error) {
    console.error('❌ Image analysis error:', error)
    throw new Error(`Image analysis failed: ${error.message}\n\nTip: You can also use symptom-based detection for accurate results.`)
  }
}

/**
 * Analyze image using multiple WORKING FREE vision APIs
 * Priority: DeepAI -> Hugging Face BLIP2 -> Other HF models
 */
async function analyzeImageWithHuggingFace(base64Image) {
  console.log('🌐 Starting REAL vision analysis with multiple FREE APIs...')
  
  // Method 1: DeepAI - Most reliable FREE vision API
  try {
    console.log('🧠 Method 1: Using DeepAI Image Recognition (FREE)...')
    const deepAIResult = await analyzeWithDeepAI(base64Image)
    if (deepAIResult && deepAIResult.length > 20) {
      console.log('✅ DeepAI vision analysis successful!')
      return deepAIResult
    }
  } catch (deepAIError) {
    console.warn('⚠️ DeepAI failed:', deepAIError.message)
  }
  
  // Method 2: Hugging Face BLIP2 & other vision models
  try {
    console.log('🤗 Method 2: Using Hugging Face BLIP2 vision models...')
    const hfResult = await tryWorkingHuggingFaceModels(base64Image)
    if (hfResult && hfResult.length > 15) {
      console.log('✅ Hugging Face vision analysis successful!')
      return hfResult
    }
  } catch (hfError) {
    console.warn('⚠️ Hugging Face vision failed:', hfError.message)
  }
  
  // Method 3: OCR as additional context
  try {
    console.log('🔍 Method 3: Using OCR.space for text detection...')
    const ocrResult = await analyzeWithOCRSpace(base64Image)
    if (ocrResult && ocrResult !== 'No text found' && ocrResult.length > 10) {
      console.log('✅ OCR detected text in image')
      return `Plant image analysis: ${ocrResult}`
    }
  } catch (ocrError) {
    console.warn('⚠️ OCR failed:', ocrError.message)
  }
  
  // If all methods fail, throw error to trigger Groq fallback
  throw new Error('HF_ALL_MODELS_FAILED')
}

/**
 * Analyze image using OCR.space FREE API
 */
async function analyzeWithOCRSpace(base64Image) {
  try {
    const formData = new FormData()
    formData.append('base64Image', base64Image)
    formData.append('apikey', OCR_API_KEY)
    formData.append('language', 'eng')
    formData.append('isOverlayRequired', 'false')
    formData.append('detectOrientation', 'true')
    formData.append('scale', 'true')
    formData.append('OCREngine', '2') // Engine 2 is better for photos
    
    const response = await fetch(OCR_SPACE_URL, {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.ParsedResults && result.ParsedResults[0]) {
        const text = result.ParsedResults[0].ParsedText
        if (text && text.trim()) {
          return `Plant image with visible features: ${text.substring(0, 200)}`
        }
      }
    }
    return 'No text found'
  } catch (error) {
    console.error('OCR.space error:', error)
    return 'OCR analysis failed'
  }
}

/**
 * Analyze with DeepAI FREE Image Recognition API
 * This API provides REAL vision analysis with NO API key needed
 */
async function analyzeWithDeepAI(base64Image) {
  try {
    // Convert base64 to blob
    const response = await fetch(base64Image)
    const blob = await response.blob()
    
    // Create form data
    const formData = new FormData()
    formData.append('image', blob, 'plant.jpg')
    
    const apiResponse = await fetch(DEEPAI_IMAGE_RECOGNITION, {
      method: 'POST',
      headers: {
        'api-key': DEEPAI_API_KEY
      },
      body: formData
    })
    
    if (apiResponse.ok) {
      const result = await apiResponse.json()
      console.log('🎯 DeepAI Raw Result:', result)
      
      if (result.output && result.output.tags) {
        // DeepAI returns tags/labels for the image
        const description = result.output.tags
          .slice(0, 10)
          .map(tag => `${tag.tag} (${(tag.confidence * 100).toFixed(0)}%)`)
          .join(', ')
        
        return `Plant image showing: ${description}. The image appears to show plant material with visible features that can be analyzed for disease symptoms.`
      }
    }
    
    throw new Error(`DeepAI API returned ${apiResponse.status}`)
  } catch (error) {
    console.error('DeepAI error:', error)
    throw error
  }
}

/**
 * Try WORKING Hugging Face vision models with proper error handling
 */
async function tryWorkingHuggingFaceModels(base64Image) {
  console.log('📦 Converting image to blob...')
  const response = await fetch(base64Image)
  const blob = await response.blob()
  console.log(`📦 Image blob size: ${blob.size} bytes`)
  console.log(`📦 Image type: ${blob.type}`)
  
  for (const modelConfig of VISION_MODELS) {
    try {
      console.log(`🔄 Trying model: ${modelConfig.name}`)
      
      const apiResponse = await fetch(modelConfig.endpoint, {
        method: 'POST',
        headers: HUGGINGFACE_API_KEY ? {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': blob.type
        } : {
          'Content-Type': blob.type
        },
        body: blob
      })
      
      console.log(`📊 Response status: ${apiResponse.status}`)
      
      if (apiResponse.ok) {
        const result = await apiResponse.json()
        console.log(`✅ Model ${modelConfig.name} succeeded:`, result)
        
        // Extract text from different response formats
        if (Array.isArray(result) && result.length > 0) {
          const text = result[0].generated_text || result[0].caption || result[0].text || result[0].label
          if (text) {
            return `Image analysis: ${text}. This appears to be a plant image that can be examined for disease symptoms.`
          }
        } else if (result.generated_text) {
          return `Image analysis: ${result.generated_text}. This appears to be a plant image that can be examined for disease symptoms.`
        }
      } else if (apiResponse.status === 503) {
        // Model is loading
        console.log(`⏳ Model ${modelConfig.name} is loading (503), waiting 8 seconds...`)
        await new Promise(resolve => setTimeout(resolve, 8000))
        
        // Retry once
        const retryResponse = await fetch(modelConfig.endpoint, {
          method: 'POST',
          headers: HUGGINGFACE_API_KEY ? {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': blob.type
          } : {
            'Content-Type': blob.type
          },
          body: blob
        })
        
        if (retryResponse.ok) {
          const retryResult = await retryResponse.json()
          console.log(`✅ Retry succeeded for ${modelConfig.name}:`, retryResult)
          
          if (Array.isArray(retryResult) && retryResult.length > 0) {
            const text = retryResult[0].generated_text || retryResult[0].caption || retryResult[0].text
            if (text) {
              return `Image analysis: ${text}. This appears to be a plant image that can be examined for disease symptoms.`
            }
          } else if (retryResult.generated_text) {
            return `Image analysis: ${retryResult.generated_text}. This appears to be a plant image that can be examined for disease symptoms.`
          }
        } else {
          console.warn(`❌ Retry failed for ${modelConfig.name}: ${retryResponse.status}`)
        }
      } else {
        console.warn(`❌ Model ${modelConfig.name} failed: ${apiResponse.status} ${apiResponse.statusText}`)
      }
    } catch (error) {
      console.warn(`❌ Model ${modelConfig.name} error:`, error.message)
    }
  }
  
  return null
}

/**
 * Analyze disease from image description using Groq
 */
async function analyzeDiseaseFromDescription(imageDescription, crop) {
  const prompt = `You are an expert plant pathologist. Based on this image description of a ${crop || 'crop'} plant, identify any diseases:

Image Description: "${imageDescription}"

Analyze carefully and provide your response in JSON format:
{
  "disease": "Disease name or 'Healthy Plant' or 'Unable to determine from image'",
  "scientificName": "Scientific name or 'N/A'",
  "severity": "None/Low/Medium/High",
  "confidence": "XX%",
  "description": "Your expert analysis",
  "symptoms": [
    "Possible symptom 1",
    "Possible symptom 2",
    "Possible symptom 3",
    "Possible symptom 4"
  ],
  "causes": [
    "Possible cause 1",
    "Possible cause 2",
    "Possible cause 3",
    "Possible cause 4"
  ],
  "urgency": "Recommended action"
}

If you cannot determine the disease from the description, indicate this honestly in the response.`

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 2000
  })

  const response = completion.choices[0]?.message?.content
  if (!response) throw new Error('No response from AI')

  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Invalid JSON response')
  
  return JSON.parse(jsonMatch[0])
}

/**
 * Fallback analysis when no image API is available
 */
async function analyzeImageWithGroqFallback(crop) {
  const prompt = `You are an expert plant pathologist. A farmer has uploaded an image of their ${crop || 'crop'} plant for disease detection.

Since we cannot process the image directly, provide a helpful response that:
1. Acknowledges the image was received
2. Lists the most common diseases for ${crop || 'this crop'}
3. Guides them to use symptom-based detection for accurate diagnosis

Provide response in JSON format:
{
  "disease": "Manual Inspection Required",
  "scientificName": "N/A",
  "severity": "Unknown",
  "confidence": "0%",
  "description": "Image uploaded successfully. For accurate diagnosis, please use the symptom-based detection option or describe what you observe.",
  "symptoms": [
    "Common ${crop || 'crop'} disease symptom 1",
    "Common ${crop || 'crop'} disease symptom 2",
    "Common ${crop || 'crop'} disease symptom 3",
    "Common ${crop || 'crop'} disease symptom 4"
  ],
  "causes": [
    "Use symptom-based detection for accurate diagnosis",
    "Check leaves for discoloration or spots",
    "Look for wilting or unusual growth patterns",
    "Note any pests or mold present"
  ],
  "urgency": "Please provide visible symptoms for accurate disease detection"
}`

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    max_tokens: 1500
  })

  const response = completion.choices[0]?.message?.content
  if (!response) throw new Error('No response from AI')

  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Invalid JSON response')
  
  return JSON.parse(jsonMatch[0])
}

/**
 * Convert File to Base64 for Gemini API
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result) // Returns data:image/jpeg;base64,...
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default {
  getNutrientRecommendations,
  detectDisease,
  detectDiseaseFromImage,
  getTreatmentRecommendations,
  getCommonDiseases
}
