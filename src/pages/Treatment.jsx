import React, { useState, useEffect } from 'react'
import { Pill, Leaf, Shield, AlertTriangle, CheckCircle, ShoppingCart, Download, Clock, Loader2 } from 'lucide-react'
import { getTreatmentRecommendations, getCommonDiseases } from '../services/agricultureService'
import { downloadTreatmentPDF } from '../services/pdfService'
import ProductsModal from '../components/ProductsModal'
import Toast from '../components/Toast'
import TranslatedText from '../components/TranslatedText'
import { useLanguage } from '../contexts/LanguageContext'

const Treatment = () => {
  const [selectedDisease, setSelectedDisease] = useState('')
  const [treatmentType, setTreatmentType] = useState('chemical')
  const [diseases, setDiseases] = useState([])
  const [currentTreatment, setCurrentTreatment] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDiseaseListLoading, setIsDiseaseListLoading] = useState(true)
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
  const { translate, currentLangCode } = useLanguage()
  
  // State for translated disease options
  const [translatedDiseases, setTranslatedDiseases] = useState([])
  const [isTranslatingDiseases, setIsTranslatingDiseases] = useState(false)

  // Load disease list on component mount
  useEffect(() => {
    const loadDiseases = async () => {
      try {
        const diseaseList = await getCommonDiseases()
        setDiseases(diseaseList)
      } catch (error) {
        console.error('Error loading diseases:', error)
        // Fallback to default list
        setDiseases([
          'Late Blight', 'Early Blight', 'Powdery Mildew', 'Downy Mildew',
          'Leaf Spot', 'Root Rot', 'Bacterial Wilt', 'Fusarium Wilt',
          'Anthracnose', 'Rust', 'Mosaic Virus', 'Bacterial Leaf Blight',
          'Stem Rot', 'Leaf Curl', 'Blast Disease'
        ])
      } finally {
        setIsDiseaseListLoading(false)
      }
    }
    loadDiseases()
  }, [])
  
  // Translate disease options when language changes
  useEffect(() => {
    const translateDiseases = async () => {
      if (!diseases || diseases.length === 0) return
      
      setIsTranslatingDiseases(true)
      try {
        const translations = await Promise.all(
          diseases.map(async (disease) => {
            const translated = await translate(disease)
            return { original: disease, translated }
          })
        )
        setTranslatedDiseases(translations)
      } catch (error) {
        console.error('Error translating diseases:', error)
        // Fallback to original disease names
        setTranslatedDiseases(diseases.map(d => ({ original: d, translated: d })))
      } finally {
        setIsTranslatingDiseases(false)
      }
    }
    
    translateDiseases()
  }, [diseases, currentLangCode, translate])

  // Load treatment data when disease is selected
  useEffect(() => {
    const loadTreatment = async () => {
      if (!selectedDisease) {
        setCurrentTreatment(null)
        return
      }
      
      setIsLoading(true)
      try {
        const treatment = await getTreatmentRecommendations(selectedDisease)
        setCurrentTreatment(treatment)
      } catch (error) {
        console.error('Error loading treatment:', error)
        showToast(error.message || 'Failed to load treatment recommendations. Please try again.', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    loadTreatment()
  }, [selectedDisease])

  // Toast notification helper
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type })
  }

  // Handle PDF download with translation
  const handleDownloadPDF = async () => {
    if (!currentTreatment || !selectedDisease) {
      const msg = await translate('No treatment data to download')
      showToast(msg, 'warning')
      return
    }

    try {
      // Pass current language and translate function to PDF service
      await downloadTreatmentPDF(currentTreatment, selectedDisease, treatmentType, translate, currentLangCode)
      const msg = await translate('Treatment plan downloaded successfully! 📄')
      showToast(msg, 'success')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      const msg = await translate('Failed to download PDF. Please try again.')
      showToast(msg, 'error')
    }
  }

  // Handle view products
  const handleViewProducts = async () => {
    if (!currentTreatment) {
      const msg = await translate('No treatment data available')
      showToast(msg, 'warning')
      return
    }
    setIsProductsModalOpen(true)
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <TranslatedText>Treatment & Pesticide Guide</TranslatedText>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            <TranslatedText>Get precise pesticide recommendations with dosage, safety guidelines, and government-approved products</TranslatedText>
          </p>
        </div>

        {/* Disease Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <TranslatedText>Select Detected Disease</TranslatedText>
            </label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              disabled={isDiseaseListLoading || isTranslatingDiseases}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent text-lg disabled:opacity-50"
            >
              <option value="">
                {isDiseaseListLoading ? 'Loading diseases...' : (isTranslatingDiseases ? 'Translating...' : 'Choose a disease...')}
              </option>
              {translatedDiseases.map((disease) => (
                <option key={disease.original} value={disease.original}>
                  {disease.translated}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <Loader2 className="w-12 h-12 text-agro-green-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">
              <TranslatedText>Loading treatment recommendations...</TranslatedText>
            </p>
          </div>
        )}

        {/* Treatment Options */}
        {!isLoading && currentTreatment && (
          <div className="max-w-6xl mx-auto">
            {/* Treatment Type Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg shadow-md p-2 inline-flex">
                <button
                  onClick={() => setTreatmentType('chemical')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    treatmentType === 'chemical'
                      ? 'bg-agro-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Pill className="w-5 h-5 inline mr-2" />
                  <TranslatedText>Chemical Control</TranslatedText>
                </button>
                <button
                  onClick={() => setTreatmentType('organic')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    treatmentType === 'organic'
                      ? 'bg-agro-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Leaf className="w-5 h-5 inline mr-2" />
                  <TranslatedText>Organic Control</TranslatedText>
                </button>
              </div>
            </div>

            {/* Important Info Banner */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">
                    <TranslatedText>Application Timing</TranslatedText>
                  </h3>
                  <p className="text-sm text-yellow-800">
                    <TranslatedText>{currentTreatment.timing}</TranslatedText>
                  </p>
                  <p className="text-sm text-yellow-800 mt-2">
                    <strong><TranslatedText>Pre-harvest Interval:</TranslatedText></strong> <TranslatedText>{currentTreatment.preharvest}</TranslatedText>
                  </p>
                </div>
              </div>
            </div>

            {/* Pesticide Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {currentTreatment[treatmentType].map((pesticide, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        <TranslatedText>{pesticide.name}</TranslatedText>
                      </h3>
                      <p className="text-2xl font-bold text-agro-green-600">
                        <TranslatedText>{pesticide.price}</TranslatedText>
                      </p>
                    </div>
                    {pesticide.govtApproved && (
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        <TranslatedText>Govt Approved</TranslatedText>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Pill className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          <TranslatedText>Dosage</TranslatedText>
                        </p>
                        <p className="text-sm text-gray-900">
                          <TranslatedText>{pesticide.dosage}</TranslatedText>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <Leaf className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          <TranslatedText>Application Method</TranslatedText>
                        </p>
                        <p className="text-sm text-gray-900">
                          <TranslatedText>{pesticide.application}</TranslatedText>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          <TranslatedText>Frequency</TranslatedText>
                        </p>
                        <p className="text-sm text-gray-900">
                          <TranslatedText>{pesticide.frequency}</TranslatedText>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-cyan-100 p-2 rounded-lg mr-3">
                        <AlertTriangle className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          <TranslatedText>Water Required</TranslatedText>
                        </p>
                        <p className="text-sm text-gray-900">
                          <TranslatedText>{pesticide.waterRequired}</TranslatedText>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Safety Guidelines */}
                  <div className="bg-red-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-900 mb-2 text-sm flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      <TranslatedText>Safety Guidelines</TranslatedText>
                    </h4>
                    <ul className="space-y-1">
                      {pesticide.safety.map((guideline, idx) => (
                        <li key={idx} className="text-xs text-red-800 flex items-start">
                          <CheckCircle className="w-3 h-3 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          <TranslatedText>{guideline}</TranslatedText>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full btn-primary flex items-center justify-center space-x-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span><TranslatedText>Buy from Marketplace</TranslatedText></span>
                  </button>
                </div>
              ))}
            </div>

            {/* Preventive Measures */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-agro-green-600 mr-3" />
                <TranslatedText>Preventive & Cultural Practices</TranslatedText>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {currentTreatment.preventive.map((practice, index) => (
                  <div key={index} className="flex items-start bg-agro-green-50 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 text-agro-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <TranslatedText>{practice}</TranslatedText>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleDownloadPDF}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span><TranslatedText>Download Treatment Plan</TranslatedText></span>
              </button>
              <button 
                onClick={handleViewProducts}
                className="btn-secondary flex-1 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span><TranslatedText>View All Products</TranslatedText></span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedDisease && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <TranslatedText>Select a Disease</TranslatedText>
            </h3>
            <p className="text-gray-600">
              <TranslatedText>Choose a disease from the dropdown above to view treatment recommendations</TranslatedText>
            </p>
          </div>
        )}

        {/* Products Modal */}
        <ProductsModal
          isOpen={isProductsModalOpen}
          onClose={() => setIsProductsModalOpen(false)}
          treatments={currentTreatment}
          disease={selectedDisease}
          treatmentType={treatmentType}
        />

        {/* Toast Notifications */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </div>
  )
}

export default Treatment
