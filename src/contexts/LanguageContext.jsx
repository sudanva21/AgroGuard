import React, { createContext, useContext, useState, useCallback } from 'react'
import { translateText, translateBatch, translateObject, LANGUAGE_CODES } from '../services/translationService'

const LanguageContext = createContext({})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('English')
  const [isTranslating, setIsTranslating] = useState(false)

  const currentLangCode = LANGUAGE_CODES[currentLanguage] || 'en'

  /**
   * Translate a single text string
   */
  const translate = useCallback(async (text) => {
    if (!text || currentLangCode === 'en') return text
    
    try {
      return await translateText(text, currentLangCode, 'en')
    } catch (error) {
      console.error('Translation failed:', error)
      return text
    }
  }, [currentLangCode])

  /**
   * Translate multiple texts
   */
  const translateMultiple = useCallback(async (texts) => {
    if (!texts || texts.length === 0 || currentLangCode === 'en') return texts
    
    try {
      return await translateBatch(texts, currentLangCode, 'en')
    } catch (error) {
      console.error('Batch translation failed:', error)
      return texts
    }
  }, [currentLangCode])

  /**
   * Translate an entire object
   */
  const translateObj = useCallback(async (obj) => {
    if (!obj || currentLangCode === 'en') return obj
    
    try {
      return await translateObject(obj, currentLangCode, 'en')
    } catch (error) {
      console.error('Object translation failed:', error)
      return obj
    }
  }, [currentLangCode])

  /**
   * Change language
   */
  const changeLanguage = useCallback((language) => {
    setIsTranslating(true)
    setCurrentLanguage(language)
    // Store in localStorage
    localStorage.setItem('preferredLanguage', language)
    setTimeout(() => setIsTranslating(false), 500)
  }, [])

  /**
   * Hook for translating text in components
   */
  const useTranslate = (text) => {
    const [translatedText, setTranslatedText] = useState(text)

    React.useEffect(() => {
      if (currentLangCode === 'en') {
        setTranslatedText(text)
        return
      }

      let isMounted = true

      translate(text).then(result => {
        if (isMounted) {
          setTranslatedText(result)
        }
      })

      return () => {
        isMounted = false
      }
    }, [text, currentLangCode])

    return translatedText
  }

  // Load saved language preference on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage && LANGUAGE_CODES[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const value = {
    currentLanguage,
    currentLangCode,
    changeLanguage,
    translate,
    translateMultiple,
    translateObj,
    useTranslate,
    isTranslating
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
