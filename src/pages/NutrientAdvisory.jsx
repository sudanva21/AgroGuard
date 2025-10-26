import React, { useState } from 'react'
import { Leaf, Droplet, TrendingUp, AlertCircle, CheckCircle, Calendar, FileText, Loader2, Download } from 'lucide-react'
import TranslatedText from '../components/TranslatedText'
import { useLanguage } from '../contexts/LanguageContext'
import { getNutrientRecommendations } from '../services/agricultureService'
import { downloadFertilizerPlanPDF } from '../utils/pdfExport'
import ScheduleTracker from '../components/ScheduleTracker'
import Toast from '../components/Toast'

const NutrientAdvisory = () => {
  const { translate, currentLangCode } = useLanguage()
  const [selectedCrop, setSelectedCrop] = useState('')
  const [growthStage, setGrowthStage] = useState('')
  const [soilType, setSoilType] = useState('')
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [nutrientPlan, setNutrientPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showScheduleTracker, setShowScheduleTracker] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Tomato', 'Potato', 'Chili', 'Onion', 'Maize', 'Soybean']
  const growthStages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity']
  const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Silt', 'Red Soil', 'Black Soil', 'Alluvial']


  const handleGetRecommendations = async () => {
    if (!selectedCrop || !growthStage || !soilType) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const recommendations = await getNutrientRecommendations(selectedCrop, growthStage, soilType)
      setNutrientPlan(recommendations)
      setShowRecommendations(true)
    } catch (err) {
      setError(err.message || 'Failed to get recommendations. Please try again.')
      setShowRecommendations(false)
    } finally {
      setIsLoading(false)
    }
  }

  const showToastMessage = (message, type = 'info') => {
    setToast({ show: true, message, type })
  }

  const handleDownloadPDF = async () => {
    if (!nutrientPlan) return
    
    setIsDownloading(true)
    try {
      // Pass translate function and language code for multi-language PDF
      await downloadFertilizerPlanPDF(nutrientPlan, selectedCrop, growthStage, soilType, translate, currentLangCode)
      const msg = await translate('PDF downloaded successfully! 📄 Check your downloads folder.')
      showToastMessage(msg, 'success')
    } catch (err) {
      console.error('PDF generation error:', err)
      const msg = await translate('Failed to generate PDF. Please try again.')
      showToastMessage(msg, 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleOpenScheduleTracker = () => {
    if (!nutrientPlan) return
    setShowScheduleTracker(true)
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4"><TranslatedText>Nutrient & Fertilizer Advisory</TranslatedText></h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            <TranslatedText>Get crop-specific nutrient recommendations to optimize soil health and maximize yield</TranslatedText>
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6"><TranslatedText>Crop Information</TranslatedText></h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <TranslatedText>Select Crop</TranslatedText> *
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent"
                >
                  <option value=""><TranslatedText>Choose...</TranslatedText></option>
                  {crops.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <TranslatedText>Growth Stage</TranslatedText> *
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent"
                >
                  <option value=""><TranslatedText>Choose...</TranslatedText></option>
                  {growthStages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <TranslatedText>Soil Type</TranslatedText> *
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent"
                >
                  <option value=""><TranslatedText>Choose...</TranslatedText></option>
                  {soilTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong><TranslatedText>Pro Tip:</TranslatedText></strong> <TranslatedText>For precise recommendations, upload your soil test report. This feature will be available soon!</TranslatedText>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-sm text-red-800">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleGetRecommendations}
              disabled={!selectedCrop || !growthStage || !soilType || isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span><TranslatedText>Analyzing...</TranslatedText></span>
                </>
              ) : (
                <span><TranslatedText>Get Nutrient Recommendations</TranslatedText></span>
              )}
            </button>
          </div>
        </div>

        {/* Recommendations */}
        {showRecommendations && nutrientPlan && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Macronutrients */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Leaf className="w-6 h-6 text-agro-green-600 mr-3" />
                <TranslatedText>Macronutrient Requirements (NPK)</TranslatedText>
              </h2>
              <div className="space-y-6">
                {nutrientPlan.macronutrients.map((nutrient, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-12 ${nutrient.color} rounded-full mr-4`}></div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{nutrient.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600"><TranslatedText>Current:</TranslatedText> <span className="font-semibold text-orange-600">{nutrient.current}</span></span>
                            <span className="text-sm text-gray-600"><TranslatedText>Required:</TranslatedText> <span className="font-semibold text-agro-green-600">{nutrient.required}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 font-semibold mb-1"><TranslatedText>Recommended Source</TranslatedText></p>
                        <p className="text-sm text-gray-900 font-semibold">{nutrient.source}</p>
                        <p className="text-sm text-gray-700 mt-1"><TranslatedText>Dosage:</TranslatedText> {nutrient.dosage}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 font-semibold mb-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <TranslatedText>Application Timing</TranslatedText>
                        </p>
                        <p className="text-sm text-gray-700">{nutrient.timing}</p>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-red-900 font-semibold mb-2"><TranslatedText>Deficiency Symptoms:</TranslatedText></p>
                      <div className="flex flex-wrap gap-2">
                        {nutrient.deficiencySymptoms.map((symptom, idx) => (
                          <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Micronutrients */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Droplet className="w-6 h-6 text-blue-600 mr-3" />
                <TranslatedText>Micronutrient Status</TranslatedText>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {nutrientPlan.micronutrients.map((nutrient, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{nutrient.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        nutrient.status === 'Deficient' ? 'bg-red-100 text-red-800' :
                        nutrient.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {nutrient.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong><TranslatedText>Recommendation:</TranslatedText></strong> {nutrient.recommendation}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      <strong><TranslatedText>Application:</TranslatedText></strong> {nutrient.application}
                    </p>
                    <p className="text-xs text-gray-500 italic">{nutrient.importance}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organic Options */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Leaf className="w-6 h-6 text-green-600 mr-3" />
                <TranslatedText>Organic Fertilizer Options</TranslatedText>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {nutrientPlan.organicOptions.map((option, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{option.name}</h3>
                    <p className="text-sm text-agro-green-700 font-semibold mb-3">{option.quantity}</p>
                    <div className="space-y-2 mb-3">
                      {option.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start text-xs text-gray-700">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 bg-white rounded p-2">
                      <strong><TranslatedText>Application:</TranslatedText></strong> {option.application}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
              <h3 className="font-bold text-yellow-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <TranslatedText>Important Warnings</TranslatedText>
              </h3>
              <ul className="space-y-2">
                {nutrientPlan.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start text-sm text-yellow-800">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span><TranslatedText>Generating PDF...</TranslatedText></span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span><TranslatedText>Download Fertilizer Plan</TranslatedText></span>
                  </>
                )}
              </button>
              <button
                onClick={handleOpenScheduleTracker}
                className="btn-secondary flex-1 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span><TranslatedText>Track Application Schedule</TranslatedText></span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showRecommendations && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2"><TranslatedText>Get Started</TranslatedText></h3>
            <p className="text-gray-600">
              <TranslatedText>Fill in your crop details above to receive personalized nutrient recommendations</TranslatedText>
            </p>
          </div>
        )}

        {/* Schedule Tracker Modal */}
        <ScheduleTracker
          nutrientPlan={nutrientPlan}
          crop={selectedCrop}
          isOpen={showScheduleTracker}
          onClose={() => setShowScheduleTracker(false)}
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

export default NutrientAdvisory
