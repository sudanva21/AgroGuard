import React, { useState, useRef, useEffect } from 'react'
import { Upload, Camera, MessageSquare, Search, AlertCircle, CheckCircle, Info, Loader2, Mic, MicOff, X, Image as ImageIcon, Save, FileText } from 'lucide-react'
import { detectDisease } from '../services/agricultureService'
import { detectDiseaseViaN8N } from '../services/n8nDiseaseService'
import { saveReport } from '../services/reportService'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import TranslatedText from '../components/TranslatedText'
import TreatmentModal from '../components/TreatmentModal'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

const DiseaseDetection = () => {
  const { translate, currentLangCode } = useLanguage()
  const { user } = useAuth()
  const [detectionMethod, setDetectionMethod] = useState('symptoms')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [symptoms, setSymptoms] = useState({
    leafColor: '',
    leafSpots: '',
    leafTexture: '',
    stemCondition: '',
    fruitCondition: '',
    otherSymptoms: ''
  })
  const [result, setResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)
  
  // State for translated options
  const [translatedCrops, setTranslatedCrops] = useState([])
  const [translatedSymptomOptions, setTranslatedSymptomOptions] = useState({})
  const [translatedLabels, setTranslatedLabels] = useState({})
  const [translatedPlaceholder, setTranslatedPlaceholder] = useState('Describe any other symptoms you notice...')
  
  // State for treatment modal and save report
  const [showTreatmentModal, setShowTreatmentModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedReportId, setSavedReportId] = useState(null)
  
  // State for toast notifications and dialogs
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: () => {} })

  const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Tomato', 'Potato', 'Chili', 'Onion', 'Maize', 'Soybean']

  const symptomOptions = {
    leafColor: ['Normal Green', 'Yellow/Chlorotic', 'Brown/Dead', 'Purple/Red', 'White/Pale', 'Dark Green'],
    leafSpots: ['No Spots', 'Small Brown Spots', 'Large Brown Patches', 'Yellow Spots', 'White Powdery Coating', 'Black Spots'],
    leafTexture: ['Normal', 'Curled/Twisted', 'Wilted', 'Dry/Crispy', 'Sticky/Wet', 'Holes/Eaten'],
    stemCondition: ['Healthy', 'Rotting', 'Discolored', 'Cracked', 'Weak/Falling', 'Borer Damage'],
    fruitCondition: ['Healthy', 'Spotted', 'Rotting', 'Deformed', 'Discolored', 'Not Applicable']
  }

  const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'te-IN', name: 'Telugu' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'mr-IN', name: 'Marathi' },
    { code: 'gu-IN', name: 'Gujarati' },
    { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' },
    { code: 'pa-IN', name: 'Punjabi' },
    { code: 'bn-IN', name: 'Bengali' }
  ]

  // Helper functions for notifications
  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type })
  }

  const showConfirm = (message, onConfirm) => {
    setConfirmDialog({ isOpen: true, message, onConfirm })
  }

  // Translate all dropdown options when language changes
  useEffect(() => {
    const translateAllOptions = async () => {
      if (currentLangCode === 'en') {
        // If English, use original values
        setTranslatedCrops(crops)
        setTranslatedSymptomOptions(symptomOptions)
        setTranslatedLabels({
          'Choose a crop...': 'Choose a crop...',
          'Select...': 'Select...',
          'Leaf Color': 'Leaf Color',
          'Leaf Spots': 'Leaf Spots',
          'Leaf Texture': 'Leaf Texture',
          'Stem Condition': 'Stem Condition',
          'Fruit Condition': 'Fruit Condition'
        })
        return
      }

      try {
        // Translate crops
        const cropsTranslations = await Promise.all(
          crops.map(crop => translate(crop))
        )
        setTranslatedCrops(cropsTranslations)

        // Translate symptom options
        const translatedOptions = {}
        for (const [key, options] of Object.entries(symptomOptions)) {
          const translations = await Promise.all(
            options.map(option => translate(option))
          )
          translatedOptions[key] = translations
        }
        setTranslatedSymptomOptions(translatedOptions)

        // Translate labels
        const labels = {
          'Choose a crop...': await translate('Choose a crop...'),
          'Select...': await translate('Select...'),
          'Leaf Color': await translate('Leaf Color'),
          'Leaf Spots': await translate('Leaf Spots'),
          'Leaf Texture': await translate('Leaf Texture'),
          'Stem Condition': await translate('Stem Condition'),
          'Fruit Condition': await translate('Fruit Condition')
        }
        setTranslatedLabels(labels)
        
        // Translate placeholder
        const placeholder = await translate('Describe any other symptoms you notice...')
        setTranslatedPlaceholder(placeholder)
      } catch (error) {
        console.error('Translation error:', error)
        // Fallback to English if translation fails
        setTranslatedCrops(crops)
        setTranslatedSymptomOptions(symptomOptions)
        setTranslatedPlaceholder('Describe any other symptoms you notice...')
      }
    }

    translateAllOptions()
  }, [currentLangCode, translate])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          }
        }
        if (finalTranscript) {
          setVoiceText(prev => prev + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
        showToast('Speech recognition error. Please try again.', 'error')
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const validImages = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} is too large. Max size is 5MB.`, 'warning')
        return false
      }
      return file.type.startsWith('image/')
    })

    setUploadedImages(prev => [...prev, ...validImages].slice(0, 3)) // Max 3 images
  }

  // Remove image
  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // Analyze image automatically
  const handleAnalyzeImage = async () => {
    if (uploadedImages.length === 0) {
      showToast('Please upload at least one image', 'warning')
      return
    }

    setIsAnalyzing(true)
    try {
      const detectionResult = await detectDiseaseViaN8N(uploadedImages[0], selectedCrop)
      setResult(detectionResult)
      showToast('Analysis complete! Results powered by N8N workflow.', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to analyze image. Please try again.', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Voice recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      showToast('Speech recognition is not supported in your browser. Please use Chrome or Edge.', 'info')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.lang = selectedLanguage
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  // Analyze voice description
  const handleAnalyzeVoice = async () => {
    if (!voiceText.trim()) {
      showToast('Please record your description first', 'warning')
      return
    }

    setIsAnalyzing(true)
    try {
      const symptomData = {
        ...symptoms,
        otherSymptoms: voiceText
      }
      const detectionResult = await detectDisease(selectedCrop, symptomData)
      setResult(detectionResult)
    } catch (error) {
      showToast(error.message || 'Failed to analyze disease. Please try again.', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setSavedReportId(null)
    
    try {
      const detectionResult = await detectDisease(selectedCrop, symptoms)
      setResult(detectionResult)
    } catch (error) {
      showToast(error.message || 'Failed to analyze disease. Please try again.', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Handle save report
  const handleSaveReport = async () => {
    if (!user) {
      showToast('Please login to save reports', 'info')
      return
    }

    if (!result) {
      showToast('No report to save', 'warning')
      return
    }

    setIsSaving(true)
    try {
      const reportData = {
        crop: selectedCrop,
        method: detectionMethod,
        disease: result.disease,
        scientificName: result.scientificName,
        severity: result.severity,
        confidence: result.confidence,
        description: result.description,
        urgency: result.urgency,
        symptoms: result.symptoms,
        causes: result.causes,
        inputSymptoms: symptoms,
        imageUrl: uploadedImages.length > 0 ? URL.createObjectURL(uploadedImages[0]) : null
      }

      const { data, error } = await saveReport(reportData)
      
      if (error) {
        showToast('Error saving report: ' + error, 'error')
      } else {
        setSavedReportId(data.id)
        showToast('Report saved successfully! 🎉', 'success')
      }
    } catch (error) {
      showToast('Failed to save report: ' + error.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle view treatment options
  const handleViewTreatment = () => {
    if (!result) return
    setShowTreatmentModal(true)
  }

  return (
    <div className="py-12 bg-gray-50/70 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <TranslatedText>Disease Detection</TranslatedText>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            <TranslatedText>Identify crop diseases quickly and accurately using AI-powered analysis</TranslatedText>
          </p>
        </div>

        {/* Detection Method Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setDetectionMethod('symptoms')}
              className={`p-6 rounded-xl border-2 transition-all ${
                detectionMethod === 'symptoms'
                  ? 'border-agro-green-600 bg-agro-green-50'
                  : 'border-gray-200 bg-white hover:border-agro-green-300'
              }`}
            >
              <MessageSquare className="w-8 h-8 text-agro-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                <TranslatedText>Describe Symptoms</TranslatedText>
              </h3>
              <p className="text-sm text-gray-600">
                <TranslatedText>Answer guided questions</TranslatedText>
              </p>
            </button>
            <button
              onClick={() => setDetectionMethod('image')}
              className={`p-6 rounded-xl border-2 transition-all ${
                detectionMethod === 'image'
                  ? 'border-agro-green-600 bg-agro-green-50'
                  : 'border-gray-200 bg-white hover:border-agro-green-300'
              }`}
            >
              <Upload className="w-8 h-8 text-agro-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                <TranslatedText>Upload Image</TranslatedText>
              </h3>
              <p className="text-sm text-gray-600">
                <TranslatedText>Upload crop photos</TranslatedText>
              </p>
            </button>
            <button
              onClick={() => setDetectionMethod('voice')}
              className={`p-6 rounded-xl border-2 transition-all ${
                detectionMethod === 'voice'
                  ? 'border-agro-green-600 bg-agro-green-50'
                  : 'border-gray-200 bg-white hover:border-agro-green-300'
              }`}
            >
              <Camera className="w-8 h-8 text-agro-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                <TranslatedText>Voice Description</TranslatedText>
              </h3>
              <p className="text-sm text-gray-600">
                <TranslatedText>Speak in your language</TranslatedText>
              </p>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Crop Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <TranslatedText>Select Your Crop *</TranslatedText>
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent"
              >
                <option value="">{translatedLabels['Choose a crop...'] || 'Choose a crop...'}</option>
                {crops.map((crop, index) => (
                  <option key={crop} value={crop}>
                    {translatedCrops[index] || crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Symptom-Based Detection */}
            {detectionMethod === 'symptoms' && selectedCrop && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  <TranslatedText>Describe What You See</TranslatedText>
                </h3>
                
                {Object.keys(symptomOptions).map((key) => {
                  const labelKey = key.replace(/([A-Z])/g, ' $1').trim()
                  const labelMap = {
                    'leaf Color': 'Leaf Color',
                    'leaf Spots': 'Leaf Spots',
                    'leaf Texture': 'Leaf Texture',
                    'stem Condition': 'Stem Condition',
                    'fruit Condition': 'Fruit Condition'
                  }
                  const displayLabel = labelMap[labelKey] || labelKey
                  
                  return (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <TranslatedText>{displayLabel}</TranslatedText>
                      </label>
                      <select
                        value={symptoms[key]}
                        onChange={(e) => setSymptoms({ ...symptoms, [key]: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent"
                      >
                        <option value="">{translatedLabels['Select...'] || 'Select...'}</option>
                        {symptomOptions[key].map((option, index) => (
                          <option key={option} value={option}>
                            {translatedSymptomOptions[key]?.[index] || option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                })}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TranslatedText>Other Observations (Optional)</TranslatedText>
                  </label>
                  <textarea
                    value={symptoms.otherSymptoms}
                    onChange={(e) => setSymptoms({ ...symptoms, otherSymptoms: e.target.value })}
                    rows="4"
                    placeholder={translatedPlaceholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !symptoms.leafColor}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span><TranslatedText>Analyze Disease</TranslatedText></span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Image Upload */}
            {detectionMethod === 'image' && selectedCrop && (
              <div className="space-y-6">
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-agro-green-500 transition-colors">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <TranslatedText>Upload Crop Images</TranslatedText>
                  </h3>
                  <p className="text-gray-600 mb-6">
                    <TranslatedText>Upload clear photos of affected leaves, stems, or fruits</TranslatedText>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-primary inline-block cursor-pointer"
                  >
                    <TranslatedText>Choose Images</TranslatedText>
                  </label>
                  <p className="text-sm text-gray-500 mt-4">
                    <TranslatedText>Supports JPG, PNG (Max 5MB, up to 3 images)</TranslatedText>
                  </p>
                </div>

                {/* Image Previews */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      <TranslatedText>Uploaded Images</TranslatedText> ({uploadedImages.length}/3)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                            {(file.size / 1024).toFixed(0)} KB
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleAnalyzeImage}
                      disabled={isAnalyzing}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span><TranslatedText>Analyzing Image with AI Vision...</TranslatedText></span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5" />
                          <span><TranslatedText>Analyze Image</TranslatedText></span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> For best results, take clear, well-lit photos showing the affected parts of the plant. Multiple angles help improve accuracy.
                  </p>
                </div>
              </div>
            )}

            {/* Voice Description */}
            {detectionMethod === 'voice' && selectedCrop && (
              <div className="space-y-6">
                <div className="text-center py-8 border-2 border-gray-300 rounded-lg">
                  <Mic className={`w-16 h-16 mx-auto mb-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <TranslatedText>Voice Description</TranslatedText>
                  </h3>
                  <p className="text-gray-600 mb-6">
                    <TranslatedText>Describe the problem in your preferred language</TranslatedText>
                  </p>
                  
                  {/* Language Selection */}
                  <div className="max-w-xs mx-auto mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <TranslatedText>Select Language</TranslatedText>
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      disabled={isRecording}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 disabled:opacity-50"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={toggleRecording}
                    className={`${
                      isRecording ? 'bg-red-600 hover:bg-red-700' : 'btn-primary'
                    } px-8 py-3 rounded-lg text-white font-semibold flex items-center space-x-2 mx-auto`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        <span><TranslatedText>Stop Recording</TranslatedText></span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        <span><TranslatedText>Start Recording</TranslatedText></span>
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    <TranslatedText>Supports 10+ Indian languages + English</TranslatedText>
                  </p>
                </div>

                {/* Voice Text Display */}
                {voiceText && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      <TranslatedText>Your Description:</TranslatedText>
                    </h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
                      <p className="text-gray-800">{voiceText}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setVoiceText('')}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                      >
                        <TranslatedText>Clear</TranslatedText>
                      </button>
                      <button
                        onClick={handleAnalyzeVoice}
                        disabled={isAnalyzing}
                        className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-5 h-5" />
                            <span><TranslatedText>Analyze Description</TranslatedText></span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> Describe symptoms clearly - mention leaf color changes, spots, wilting, or any unusual patterns you see on the plant.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  <TranslatedText>Detection Results</TranslatedText>
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600"><TranslatedText>Confidence:</TranslatedText></span>
                  <span className="text-lg font-bold text-agro-green-600">{result.confidence}</span>
                </div>
              </div>

              {/* Disease Info */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-red-900 mb-1">
                      <TranslatedText>{result.disease}</TranslatedText>
                    </h3>
                    <p className="text-sm text-red-700 italic mb-2">
                      <TranslatedText>{result.scientificName}</TranslatedText>
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                        <TranslatedText>Severity:</TranslatedText> <TranslatedText>{result.severity}</TranslatedText>
                      </span>
                      <span className="text-red-700 font-semibold"><TranslatedText>{result.urgency}</TranslatedText></span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                <TranslatedText>{result.description}</TranslatedText>
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 text-blue-600 mr-2" />
                    <TranslatedText>Common Symptoms</TranslatedText>
                  </h4>
                  <ul className="space-y-2">
                    {result.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-agro-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <TranslatedText>{symptom}</TranslatedText>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 text-orange-600 mr-2" />
                    <TranslatedText>Favorable Conditions</TranslatedText>
                  </h4>
                  <ul className="space-y-2">
                    {result.causes.map((cause, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <TranslatedText>{cause}</TranslatedText>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleViewTreatment}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  <TranslatedText>View Treatment Options</TranslatedText>
                </button>
                <button 
                  onClick={handleSaveReport}
                  disabled={isSaving || savedReportId}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <TranslatedText>Saving...</TranslatedText>
                    </>
                  ) : savedReportId ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <TranslatedText>Saved</TranslatedText>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <TranslatedText>Save Report</TranslatedText>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Treatment Modal */}
        <TreatmentModal
          isOpen={showTreatmentModal}
          onClose={() => setShowTreatmentModal(false)}
          disease={result?.disease}
          crop={selectedCrop}
        />
        
        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
        
        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          message={confirmDialog.message}
          title="Confirm Action"
          type="warning"
        />
      </div>
    </div>
  )
}

export default DiseaseDetection
