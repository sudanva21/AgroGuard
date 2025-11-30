import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Component that automatically translates its children text
 * Usage: <TranslatedText>Hello World</TranslatedText>
 */
const TranslatedText = ({ children, className, as: Component = 'span' }) => {
  const { translate, currentLangCode, isTranslating } = useLanguage()
  const [translatedText, setTranslatedText] = useState(children)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!children || typeof children !== 'string') {
      setTranslatedText(children)
      return
    }

    if (currentLangCode === 'en') {
      setTranslatedText(children)
      return
    }

    let isMounted = true
    setLoading(true)

    translate(children)
      .then(result => {
        if (isMounted) {
          setTranslatedText(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedText(children)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [children, currentLangCode, translate])

  if (Component === React.Fragment || Component === 'text') {
    return loading && isTranslating ? children : translatedText
  }

  return (
    <Component className={className}>
      {loading && isTranslating ? (
        <span className="opacity-50">{children}</span>
      ) : (
        translatedText
      )}
    </Component>
  )
}

export default TranslatedText
