// Translation service using Google Translate API (free tier via MyMemory API)
// MyMemory provides free translation API with no API key required

const TRANSLATION_CACHE = new Map()

// Language codes mapping
export const LANGUAGE_CODES = {
  'English': 'en',
  'हिंदी': 'hi',
  'मराठी': 'mr',
  'தமிழ்': 'ta',
  'తెలుగు': 'te',
  'ಕನ್ನಡ': 'kn',
  'বাংলা': 'bn',
  'ગુજરાતી': 'gu',
  'ਪੰਜਾਬੀ': 'pa',
  'മലയാളം': 'ml'
}

// Free translation API endpoint (MyMemory - 1000 words/day free)
const TRANSLATION_API = 'https://api.mymemory.translated.net/get'

/**
 * Translate text using MyMemory free API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'hi', 'ta')
 * @param {string} sourceLang - Source language code (default: 'en')
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLang, sourceLang = 'en') {
  // If target is English or same as source, return original
  if (targetLang === 'en' || targetLang === sourceLang) {
    return text
  }

  // Check cache first
  const cacheKey = `${text}_${sourceLang}_${targetLang}`
  if (TRANSLATION_CACHE.has(cacheKey)) {
    return TRANSLATION_CACHE.get(cacheKey)
  }

  try {
    // Split long text into chunks (API has character limits)
    const chunks = splitTextIntoChunks(text, 500)
    const translatedChunks = []

    for (const chunk of chunks) {
      const url = `${TRANSLATION_API}?q=${encodeURIComponent(chunk)}&langpair=${sourceLang}|${targetLang}`
      const response = await fetch(url)
      const data = await response.json()

      if (data.responseStatus === 200 && data.responseData) {
        translatedChunks.push(data.responseData.translatedText)
      } else {
        // Fallback to original text if translation fails
        translatedChunks.push(chunk)
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    const translatedText = translatedChunks.join(' ')
    
    // Cache the result
    TRANSLATION_CACHE.set(cacheKey, translatedText)
    
    return translatedText
  } catch (error) {
    console.error('Translation error:', error)
    return text // Return original text on error
  }
}

/**
 * Translate multiple texts in batch
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @param {string} sourceLang - Source language code
 * @returns {Promise<string[]>} Array of translated texts
 */
export async function translateBatch(texts, targetLang, sourceLang = 'en') {
  if (targetLang === 'en' || targetLang === sourceLang) {
    return texts
  }

  const translations = await Promise.all(
    texts.map(text => translateText(text, targetLang, sourceLang))
  )
  
  return translations
}

/**
 * Translate an object's values recursively
 * @param {Object} obj - Object with text values
 * @param {string} targetLang - Target language code
 * @param {string} sourceLang - Source language code
 * @returns {Promise<Object>} Object with translated values
 */
export async function translateObject(obj, targetLang, sourceLang = 'en') {
  if (targetLang === 'en' || targetLang === sourceLang) {
    return obj
  }

  const translated = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLang, sourceLang)
    } else if (Array.isArray(value)) {
      translated[key] = await translateBatch(value, targetLang, sourceLang)
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLang, sourceLang)
    } else {
      translated[key] = value
    }
  }
  
  return translated
}

/**
 * Split text into chunks for API limits
 */
function splitTextIntoChunks(text, maxLength) {
  if (text.length <= maxLength) {
    return [text]
  }

  const chunks = []
  const sentences = text.split(/[.!?]\s+/)
  let currentChunk = ''

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += (currentChunk ? '. ' : '') + sentence
    } else {
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = sentence
    }
  }

  if (currentChunk) chunks.push(currentChunk)
  
  return chunks
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  TRANSLATION_CACHE.clear()
}
