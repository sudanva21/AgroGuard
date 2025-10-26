import React, { useState, useEffect } from 'react'
import { AlertTriangle, MapPin, Bell, Cloud, Thermometer, Droplets, Wind, CheckCircle, Phone, Loader2, MessageSquare, X, Info } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import TranslatedText from '../components/TranslatedText'
import { predictPestOutbreaks, getSupportedCrops } from '../services/pestPredictionService'
import { subscribeToPestAlerts, getAlertSubscription, unsubscribeFromPestAlerts, sendTestAlert } from '../services/alertService'

const PestAlert = () => {
  const { translate, currentLangCode } = useLanguage()
  const { user } = useAuth()
  
  const [location, setLocation] = useState('')
  const [crop, setCrop] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState(null)
  
  // Loading and data states
  const [isLoading, setIsLoading] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictions, setPredictions] = useState([])
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  
  // Translation states
  const [translatedCrops, setTranslatedCrops] = useState([])
  const [translatedStates, setTranslatedStates] = useState([])
  const [translatedLabels, setTranslatedLabels] = useState({})

  const crops = getSupportedCrops()
  
  const states = [
    'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
    'Telangana', 'Uttar Pradesh', 'West Bengal'
  ]

  // Load user's existing subscription on mount
  useEffect(() => {
    if (user) {
      loadSubscription()
    }
  }, [user])

  // Load subscription data
  const loadSubscription = async () => {
    try {
      const subscription = await getAlertSubscription(user.id)
      if (subscription) {
        setCurrentSubscription(subscription)
        setLocation(subscription.location)
        setCrop(subscription.crop)
        setPhoneNumber(subscription.phone_number)
        setAlertsEnabled(true)
        
        // Automatically fetch predictions for subscribed crop and location
        fetchPredictions(subscription.location, subscription.crop)
      }
    } catch (error) {
      console.error('Failed to load subscription:', error)
    }
  }

  // Fetch pest predictions
  const fetchPredictions = async (selectedLocation, selectedCrop) => {
    if (!selectedLocation || !selectedCrop) return
    
    setIsPredicting(true)
    setError(null)
    
    try {
      const results = await predictPestOutbreaks(selectedLocation, selectedCrop)
      setPredictions(results)
    } catch (error) {
      console.error('Prediction error:', error)
      setError('Failed to fetch pest predictions. Please try again.')
    } finally {
      setIsPredicting(false)
    }
  }

  // Enable/Subscribe to alerts
  const handleEnableAlerts = async () => {
    if (!location || !crop || !phoneNumber) {
      setError('Please fill in all fields')
      return
    }

    // Validate phone number
    const cleanNumber = phoneNumber.replace(/\D/g, '')
    if (cleanNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const result = await subscribeToPestAlerts(user.id, location, crop, phoneNumber)
      
      if (result.success) {
        setAlertsEnabled(true)
        setCurrentSubscription(result.subscription)
        setSuccessMessage('✅ Alerts enabled successfully! Confirmation SMS/WhatsApp sent automatically to your number.')
        
        // Fetch predictions for the selected location and crop
        fetchPredictions(location, crop)
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000)
      } else {
        setError(result.error || 'Failed to enable alerts. Please try again.')
      }
    } catch (error) {
      console.error('Enable alerts error:', error)
      setError('Failed to enable alerts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Disable alerts
  const handleDisableAlerts = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await unsubscribeFromPestAlerts(user.id)
      
      if (result.success) {
        setAlertsEnabled(false)
        setCurrentSubscription(null)
        setSuccessMessage('Alerts disabled successfully.')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError(result.error || 'Failed to disable alerts.')
      }
    } catch (error) {
      console.error('Disable alerts error:', error)
      setError('Failed to disable alerts.')
    } finally {
      setIsLoading(false)
    }
  }

  // Send test alert automatically
  const handleTestAlert = async () => {
    if (!phoneNumber) return
    
    setIsLoading(true)
    try {
      const result = await sendTestAlert(phoneNumber)
      if (result.sms?.success || result.whatsapp?.success) {
        setSuccessMessage('✅ Test alert sent successfully! Check your phone.')
      } else {
        setSuccessMessage('⚠️ Test alert queued. Check console for details.')
      }
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setError('Failed to send test alert.')
    } finally {
      setIsLoading(false)
    }
  }

  // Translate options when language changes
  useEffect(() => {
    const translateOptions = async () => {
      if (currentLangCode === 'en') {
        setTranslatedCrops(crops)
        setTranslatedStates(states)
        setTranslatedLabels({
          'Select State...': 'Select State...',
          'Select Crop...': 'Select Crop...',
          'Your Location': 'Your Location',
          'Your Crop': 'Your Crop',
          'Mobile Number': 'Mobile Number'
        })
        return
      }

      try {
        const [translatedCropsArray, translatedStatesArray, translatedLabelsObj] = await Promise.all([
          Promise.all(crops.map(c => translate(c))),
          Promise.all(states.map(s => translate(s))),
          translate('Select State...').then(s1 =>
            translate('Select Crop...').then(s2 =>
              translate('Your Location').then(l =>
                translate('Your Crop').then(c =>
                  translate('Mobile Number').then(m => ({
                    'Select State...': s1,
                    'Select Crop...': s2,
                    'Your Location': l,
                    'Your Crop': c,
                    'Mobile Number': m
                  }))
                )
              )
            )
          )
        ])

        setTranslatedCrops(translatedCropsArray)
        setTranslatedStates(translatedStatesArray)
        setTranslatedLabels(translatedLabelsObj)
      } catch (error) {
        console.error('Translation error:', error)
        setTranslatedCrops(crops)
        setTranslatedStates(states)
      }
    }

    translateOptions()
  }, [currentLangCode, translate])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-900'
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900'
      case 'low':
        return 'bg-blue-100 border-blue-500 text-blue-900'
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900'
    }
  }

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-white'
      case 'low':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <TranslatedText>Pest Outbreak Early Warning System</TranslatedText>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            <TranslatedText>Get real-time alerts about potential pest outbreaks in your area based on weather and crop data</TranslatedText>
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-green-800">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover:text-green-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Alert Subscription */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-agro-green-600 to-agro-green-700 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Bell className="w-6 h-6 mr-3" />
              <TranslatedText>Enable Pest Alerts for Your Farm</TranslatedText>
            </h2>
            
            {!alertsEnabled ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <TranslatedText>{translatedLabels['Your Location'] || 'Your Location'} *</TranslatedText>
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                      disabled={isLoading}
                    >
                      <option value="">{translatedLabels['Select State...'] || 'Select State...'}</option>
                      {states.map((state, idx) => (
                        <option key={state} value={state}>
                          {translatedStates[idx] || state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <TranslatedText>{translatedLabels['Your Crop'] || 'Your Crop'} *</TranslatedText>
                    </label>
                    <select
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                      disabled={isLoading}
                    >
                      <option value="">{translatedLabels['Select Crop...'] || 'Select Crop...'}</option>
                      {crops.map((c, idx) => (
                        <option key={c} value={c}>
                          {translatedCrops[idx] || c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <TranslatedText>{translatedLabels['Mobile Number'] || 'Mobile Number'} *</TranslatedText>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <button
                  onClick={handleEnableAlerts}
                  disabled={!location || !crop || !phoneNumber || isLoading}
                  className="w-full bg-white text-agro-green-700 hover:bg-agro-green-50 font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      <TranslatedText>Processing...</TranslatedText>
                    </>
                  ) : (
                    <TranslatedText>Enable SMS & WhatsApp Alerts</TranslatedText>
                  )}
                </button>
                <p className="text-sm text-agro-green-100 text-center">
                  <TranslatedText>Free service • Get alerts 3-7 days before expected outbreak</TranslatedText>
                </p>
              </div>
            ) : (
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-8 h-8" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">
                      <TranslatedText>Alerts Enabled Successfully!</TranslatedText>
                    </h3>
                    <p className="text-agro-green-100">
                      <TranslatedText>You will receive alerts for</TranslatedText> {crop} <TranslatedText>in</TranslatedText> {location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span><TranslatedText>Notifications will be sent to:</TranslatedText> {phoneNumber}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleTestAlert}
                    disabled={isLoading}
                    className="flex-1 bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                  >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    <TranslatedText>Send Test Alert</TranslatedText>
                  </button>
                  <button
                    onClick={handleDisableAlerts}
                    disabled={isLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                  >
                    <TranslatedText>Disable Alerts</TranslatedText>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Alerts */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText>Current Pest Outbreak Warnings</TranslatedText>
            {location && crop && (
              <span className="text-base font-normal text-gray-600 ml-3">
                <TranslatedText>for</TranslatedText> {crop} <TranslatedText>in</TranslatedText> {location}
              </span>
            )}
          </h2>
          
          {isPredicting ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-agro-green-600 animate-spin mr-3" />
              <p className="text-gray-600">
                <TranslatedText>Analyzing weather patterns and predicting pest outbreaks...</TranslatedText>
              </p>
            </div>
          ) : predictions.length > 0 ? (
            <div className="space-y-6">
              {predictions.map((alert, index) => (
                <div
                  key={index}
                  className={`border-l-4 rounded-lg shadow-lg overflow-hidden ${getSeverityColor(alert.severity)}`}
                >
                  <div className="bg-white p-6">
                    {/* Alert Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">
                            <TranslatedText>{alert.name}</TranslatedText>
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(alert.severity)}`}>
                            <TranslatedText>{alert.riskLevel} Risk</TranslatedText>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{location}</span>
                          </div>
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span><TranslatedText>Expected:</TranslatedText> <TranslatedText>{alert.expectedDate}</TranslatedText></span>
                          </div>
                          <div className="font-semibold text-agro-green-700">
                            <TranslatedText>Crop:</TranslatedText> {crop}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <TranslatedText>{alert.description}</TranslatedText>
                      </p>
                    </div>

                    {/* Weather Conditions */}
                    {alert.currentWeather && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                          <TranslatedText>Current Weather Conditions</TranslatedText>
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <Thermometer className="w-4 h-4 text-red-500 mr-2" />
                            <div>
                              <p className="text-gray-600"><TranslatedText>Temperature</TranslatedText></p>
                              <p className="font-semibold text-gray-900">{alert.currentWeather.temp}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                            <div>
                              <p className="text-gray-600"><TranslatedText>Humidity</TranslatedText></p>
                              <p className="font-semibold text-gray-900">{alert.currentWeather.humidity}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Wind className="w-4 h-4 text-gray-500 mr-2" />
                            <div>
                              <p className="text-gray-600"><TranslatedText>Rainfall</TranslatedText></p>
                              <p className="font-semibold text-gray-900">
                                <TranslatedText>{alert.currentWeather.rainfall}</TranslatedText>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preventive Actions */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        <TranslatedText>Recommended Preventive Actions:</TranslatedText>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {alert.preventive.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-start bg-agro-green-50 rounded-lg p-3">
                            <CheckCircle className="w-4 h-4 text-agro-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                              <TranslatedText>{action}</TranslatedText>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Threshold */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-900">
                        <strong><TranslatedText>Action Threshold:</TranslatedText></strong> <TranslatedText>{alert.threshold}</TranslatedText>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                <TranslatedText>No Pest Alerts Available</TranslatedText>
              </h3>
              <p className="text-gray-600 mb-6">
                <TranslatedText>Select your location and crop to get real-time pest outbreak predictions</TranslatedText>
              </p>
              {!alertsEnabled && (
                <p className="text-sm text-gray-500">
                  <TranslatedText>Enable alerts above to receive SMS and WhatsApp notifications</TranslatedText>
                </p>
              )}
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              <TranslatedText>How Early Warning System Works</TranslatedText>
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  <TranslatedText>Real Weather Data</TranslatedText>
                </h3>
                <p className="text-sm text-gray-600">
                  <TranslatedText>Live weather data from OpenWeatherMap API analyzed for your location</TranslatedText>
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  <TranslatedText>Scientific Analysis</TranslatedText>
                </h3>
                <p className="text-sm text-gray-600">
                  <TranslatedText>Pest patterns based on ICAR and FAO agricultural research data</TranslatedText>
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  <TranslatedText>Free SMS & WhatsApp</TranslatedText>
                </h3>
                <p className="text-sm text-gray-600">
                  <TranslatedText>Alerts sent 3-7 days before expected outbreak via free messaging APIs</TranslatedText>
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  <TranslatedText>Preventive Action</TranslatedText>
                </h3>
                <p className="text-sm text-gray-600">
                  <TranslatedText>Take action before pests damage your crops and reduce losses</TranslatedText>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources Info */}
        <div className="max-w-6xl mx-auto mt-8 mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              <TranslatedText>Data Sources & Free APIs Used</TranslatedText>
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <strong><TranslatedText>Weather Data:</TranslatedText></strong> OpenWeatherMap Free API
              </div>
              <div>
                <strong><TranslatedText>Pest Research:</TranslatedText></strong> ICAR, FAO, Agricultural Universities
              </div>
              <div>
                <strong><TranslatedText>SMS Alerts:</TranslatedText></strong> Fast2SMS / Twilio Free Tier
              </div>
              <div>
                <strong><TranslatedText>WhatsApp:</TranslatedText></strong> Twilio WhatsApp Sandbox (Free)
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              <TranslatedText>All services are 100% free with no hidden costs. Data is updated in real-time.</TranslatedText>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PestAlert
