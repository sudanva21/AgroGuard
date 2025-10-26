import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Send, Mic, Languages, Bot, User, Loader } from 'lucide-react'
import TranslatedText from '../components/TranslatedText'
import { useLanguage } from '../contexts/LanguageContext'
import { getAIResponse } from '../lib/aiService'

const Chatbot = () => {
  const { translate, currentLanguage, changeLanguage } = useLanguage()
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Namaste! I am your AgroGuard AI Assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [translatedMessages, setTranslatedMessages] = useState([])
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const languages = ['English', 'हिंदी', 'मराठी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'বাংলা', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'മലയാളം']

  // Language code mapping for speech recognition
  const languageCodeMap = {
    'English': 'en-IN',
    'हिंदी': 'hi-IN',
    'मराठी': 'mr-IN',
    'தமிழ்': 'ta-IN',
    'తెలుగు': 'te-IN',
    'ಕನ್ನಡ': 'kn-IN',
    'বাংলা': 'bn-IN',
    'ગુજરાતી': 'gu-IN',
    'ਪੰਜਾਬੀ': 'pa-IN',
    'മലയാളം': 'ml-IN'
  }

  const quickQuestions = [
    'How to identify tomato blight?',
    'Best fertilizer for rice?',
    'When to apply pesticides?',
    'Organic pest control methods',
    'Soil pH management tips',
    'Government farming schemes'
  ]

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  // Use useLayoutEffect to scroll after DOM updates
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  // Translate messages when language changes
  useEffect(() => {
    const translateAllMessages = async () => {
      const translated = await Promise.all(
        messages.map(async (msg) => ({
          ...msg,
          text: await translate(msg.text)
        }))
      )
      setTranslatedMessages(translated)
    }
    translateAllMessages()
  }, [messages, currentLanguage])

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return

    const userMessage = {
      type: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputText('')
    setIsTyping(true)

    try {
      // Get real AI response from Groq
      const responseText = await getAIResponse(inputText, messages)
      
      const botResponse = {
        type: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const errorResponse = {
        type: 'bot',
        text: 'I apologize, I\'m having trouble connecting right now. Please try again in a moment.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInputText(question)
  }

  const handleVoiceInput = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert('Sorry, your browser does not support voice input. Please try Chrome, Edge, or Safari.')
      return
    }

    // If already listening, stop
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    // Create new recognition instance
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    // Configure recognition
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = languageCodeMap[currentLanguage] || 'en-IN'

    // Handle successful recognition
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInputText(transcript)
      setIsListening(false)
    }

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.')
      } else if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in browser settings.')
      } else {
        alert('Voice recognition error. Please try again.')
      }
    }

    // Handle end of recognition
    recognition.onend = () => {
      setIsListening(false)
    }

    // Start listening
    try {
      recognition.start()
      setIsListening(true)
    } catch (error) {
      console.error('Error starting recognition:', error)
      setIsListening(false)
    }
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4"><TranslatedText>AI Farming Assistant</TranslatedText></h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            <TranslatedText>Ask questions in your language, get instant farming advice 24/7</TranslatedText>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Language Selector */}
          <div className="bg-white rounded-t-xl shadow-lg p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-agro-green-600" />
              <span className="font-semibold text-gray-900"><TranslatedText>AgroGuard Assistant</TranslatedText></span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div className="flex items-center space-x-2">
              <Languages className="w-5 h-5 text-gray-600" />
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-agro-green-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-white shadow-lg p-6 h-96 overflow-y-auto">
            <div className="space-y-4">
              {(translatedMessages.length > 0 ? translatedMessages : messages).map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-agro-green-600' : 'bg-gray-200'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-agro-green-600" />
                      )}
                    </div>
                    <div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-agro-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">{message.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-agro-green-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <Loader className="w-5 h-5 text-gray-600 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Questions */}
          <div className="bg-white shadow-lg p-4 border-t">
            <p className="text-xs text-gray-600 mb-2 font-semibold"><TranslatedText>Quick Questions:</TranslatedText></p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-agro-green-50 text-agro-green-700 px-3 py-1 rounded-full hover:bg-agro-green-100 transition"
                >
                  <TranslatedText>{question}</TranslatedText>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white rounded-b-xl shadow-lg p-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleVoiceInput}
                className={`p-2 transition ${
                  isListening 
                    ? 'text-red-600 animate-pulse bg-red-50 rounded-lg' 
                    : 'text-gray-600 hover:text-agro-green-600'
                }`}
                title={isListening ? 'Listening... Click to stop' : 'Click to speak'}
              >
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={currentLanguage === 'English' ? 'Type your farming question...' : 'Type your question...'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="bg-agro-green-600 hover:bg-agro-green-700 text-white p-2 rounded-lg transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              <TranslatedText>AI responses are for guidance only. Consult local agricultural experts for critical decisions.</TranslatedText>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <Languages className="w-8 h-8 text-agro-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1"><TranslatedText>10+ Languages</TranslatedText></h3>
            <p className="text-xs text-gray-600"><TranslatedText>Chat in your preferred language</TranslatedText></p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <Mic className="w-8 h-8 text-agro-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1"><TranslatedText>Voice Support</TranslatedText></h3>
            <p className="text-xs text-gray-600"><TranslatedText>Speak your questions naturally</TranslatedText></p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <Bot className="w-8 h-8 text-agro-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1"><TranslatedText>24/7 Available</TranslatedText></h3>
            <p className="text-xs text-gray-600"><TranslatedText>Get help anytime, anywhere</TranslatedText></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
