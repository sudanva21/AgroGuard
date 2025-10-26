import React, { useState, useEffect } from 'react'
import { X, Loader2, CheckCircle, AlertTriangle, Leaf, DollarSign, Calendar } from 'lucide-react'
import { getTreatmentRecommendations } from '../services/agricultureService'
import TranslatedText from './TranslatedText'

const TreatmentModal = ({ isOpen, onClose, disease, crop }) => {
  const [loading, setLoading] = useState(false)
  const [treatments, setTreatments] = useState(null)
  const [activeTab, setActiveTab] = useState('chemical')

  useEffect(() => {
    if (isOpen && disease) {
      loadTreatments()
    }
  }, [isOpen, disease])

  const loadTreatments = async () => {
    setLoading(true)
    try {
      const data = await getTreatmentRecommendations(disease, crop)
      setTreatments(data)
    } catch (error) {
      alert('Error loading treatments: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-agro-green-600 to-agro-green-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              <TranslatedText>Treatment Options</TranslatedText>
            </h2>
            <p className="text-agro-green-100">
              <TranslatedText>Recommended treatments for</TranslatedText> <strong><TranslatedText>{disease}</TranslatedText></strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-agro-green-600 animate-spin mb-4" />
              <p className="text-gray-600">
                <TranslatedText>Loading treatment recommendations...</TranslatedText>
              </p>
            </div>
          ) : treatments ? (
            <div className="p-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('chemical')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'chemical'
                      ? 'border-b-2 border-agro-green-600 text-agro-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TranslatedText>Chemical Treatments</TranslatedText>
                </button>
                <button
                  onClick={() => setActiveTab('organic')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'organic'
                      ? 'border-b-2 border-agro-green-600 text-agro-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TranslatedText>Organic Treatments</TranslatedText>
                </button>
                <button
                  onClick={() => setActiveTab('preventive')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'preventive'
                      ? 'border-b-2 border-agro-green-600 text-agro-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TranslatedText>Prevention</TranslatedText>
                </button>
              </div>

              {/* Chemical Treatments */}
              {activeTab === 'chemical' && (
                <div className="space-y-4">
                  {treatments.chemical?.map((treatment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            <TranslatedText>{treatment.name}</TranslatedText>
                          </h3>
                          {treatment.govtApproved && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              <TranslatedText>Govt. Approved</TranslatedText>
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-agro-green-600 font-bold">
                            <DollarSign className="w-4 h-4" />
                            <TranslatedText>{treatment.price}</TranslatedText>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <TranslatedText>Dosage:</TranslatedText>
                          </p>
                          <p className="text-sm text-gray-600">
                            <TranslatedText>{treatment.dosage}</TranslatedText>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <TranslatedText>Application:</TranslatedText>
                          </p>
                          <p className="text-sm text-gray-600">
                            <TranslatedText>{treatment.application}</TranslatedText>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <TranslatedText>Frequency:</TranslatedText>
                          </p>
                          <p className="text-sm text-gray-600">
                            <TranslatedText>{treatment.frequency}</TranslatedText>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <TranslatedText>Water Required:</TranslatedText>
                          </p>
                          <p className="text-sm text-gray-600">
                            <TranslatedText>{treatment.waterRequired}</TranslatedText>
                          </p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                        <p className="text-xs font-semibold text-yellow-800 mb-2">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          <TranslatedText>Safety Instructions:</TranslatedText>
                        </p>
                        <ul className="space-y-1">
                          {treatment.safety?.map((instruction, idx) => (
                            <li key={idx} className="text-xs text-yellow-800">
                              • <TranslatedText>{instruction}</TranslatedText>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Organic Treatments */}
              {activeTab === 'organic' && (
                <div className="space-y-4">
                  {treatments.organic?.map((treatment, index) => (
                    <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Leaf className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-bold text-gray-900">
                              <TranslatedText>{treatment.name}</TranslatedText>
                            </h3>
                          </div>
                          {treatment.govtApproved && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              <TranslatedText>Govt. Approved</TranslatedText>
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-green-600 font-bold">
                            <DollarSign className="w-4 h-4" />
                            <TranslatedText>{treatment.price}</TranslatedText>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <TranslatedText>Dosage:</TranslatedText>
                          </p>
                          <p className="text-sm text-gray-600">
                            <TranslatedText>{treatment.dosage}</TranslatedText>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <TranslatedText>Application:</TranslatedText>
                          </p>
                          <p className="text-sm text-gray-600">
                            <TranslatedText>{treatment.application}</TranslatedText>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <TranslatedText>Frequency:</TranslatedText>
                          </p>
                          <p className="text-sm text-gray-600">
                            <TranslatedText>{treatment.frequency}</TranslatedText>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <TranslatedText>Water Required:</TranslatedText>
                          </p>
                          <p className="text-sm text-gray-600">
                            <TranslatedText>{treatment.waterRequired}</TranslatedText>
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-100 border-l-4 border-green-600 p-3 rounded">
                        <p className="text-xs font-semibold text-green-800 mb-2">
                          <Leaf className="w-4 h-4 inline mr-1" />
                          <TranslatedText>Benefits:</TranslatedText>
                        </p>
                        <ul className="space-y-1">
                          {treatment.safety?.map((benefit, idx) => (
                            <li key={idx} className="text-xs text-green-800">
                              • <TranslatedText>{benefit}</TranslatedText>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Preventive Measures */}
              {activeTab === 'preventive' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <TranslatedText>Prevention Measures</TranslatedText>
                    </h3>
                    <ul className="space-y-3">
                      {treatments.preventive?.map((measure, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="flex-1">
                            <TranslatedText>{measure}</TranslatedText>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Additional Info */}
                  {treatments.timing && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <TranslatedText>Best Timing:</TranslatedText>
                      </p>
                      <p className="text-sm text-purple-800">
                        <TranslatedText>{treatments.timing}</TranslatedText>
                      </p>
                    </div>
                  )}

                  {treatments.preharvest && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-orange-900 mb-2">
                        <TranslatedText>Pre-Harvest Interval:</TranslatedText>
                      </p>
                      <p className="text-sm text-orange-800">
                        <TranslatedText>{treatments.preharvest}</TranslatedText>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600">
                <TranslatedText>No treatment recommendations available</TranslatedText>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            <TranslatedText>Close</TranslatedText>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TreatmentModal
