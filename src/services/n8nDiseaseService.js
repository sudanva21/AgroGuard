const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/disease-detection'
const REQUEST_TIMEOUT = 60000

const cache = new Map()
const CACHE_DURATION = 30 * 60 * 1000

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function detectDiseaseViaN8N(imageFile, crop = 'Unknown') {
  try {
    console.log('🚀 Starting N8N disease detection...')
    
    const base64Image = await fileToBase64(imageFile)
    const cacheKey = `n8n-${crop}-${base64Image.substring(0, 50)}`
    
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('✅ Returning cached result')
      return cached.data
    }
    
    const payload = {
      image: base64Image,
      crop: crop,
      timestamp: new Date().toISOString(),
      imageType: imageFile.type,
      imageSize: imageFile.size
    }
    
    console.log(`📤 Sending to N8N: ${N8N_WEBHOOK_URL}`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ N8N webhook error response:', errorText)
      throw new Error(`N8N webhook failed: ${response.status} ${response.statusText}`)
    }
    
    const responseText = await response.text()
    console.log('📥 N8N raw response:', responseText)
    
    if (!responseText) {
      throw new Error('N8N returned empty response. Please check: 1) Workflow is imported, 2) Workflow is activated (green toggle), 3) Environment variables are set in N8N')
    }
    
    const result = JSON.parse(responseText)
    console.log('✅ N8N response parsed:', result)
    
    cache.set(cacheKey, { data: result, timestamp: Date.now() })
    
    return result
    
  } catch (error) {
    console.error('❌ N8N disease detection error:', error)
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again with a smaller image.')
    }
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to N8N. Please ensure N8N is running on localhost:5678')
    }
    
    throw error
  }
}

export async function detectMultipleDiseasesViaN8N(imageFiles, crop = 'Unknown') {
  try {
    const results = []
    
    for (let i = 0; i < imageFiles.length; i++) {
      console.log(`📸 Processing image ${i + 1}/${imageFiles.length}`)
      const result = await detectDiseaseViaN8N(imageFiles[i], crop)
      results.push({
        imageIndex: i,
        fileName: imageFiles[i].name,
        ...result
      })
    }
    
    return {
      success: true,
      totalImages: imageFiles.length,
      results: results,
      crop: crop
    }
    
  } catch (error) {
    console.error('❌ Multiple image detection error:', error)
    throw error
  }
}

export default {
  detectDiseaseViaN8N,
  detectMultipleDiseasesViaN8N
}
