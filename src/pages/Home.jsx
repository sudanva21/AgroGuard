import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Pill, Leaf, MessageCircle, ShoppingCart, AlertTriangle, Users, TrendingUp, Shield, Award } from 'lucide-react'
import TranslatedText from '../components/TranslatedText'
import { useLanguage } from '../contexts/LanguageContext'

const Home = () => {
  const { translateObj, currentLangCode } = useLanguage()
  const [translatedFeatures, setTranslatedFeatures] = useState([])
  const [translatedStats, setTranslatedStats] = useState([])
  
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Disease Detection",
      description: "AI-powered symptom analysis to identify crop diseases quickly and accurately",
      link: "/disease-detection",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: <Pill className="w-8 h-8" />,
      title: "Treatment Guide",
      description: "Get precise pesticide recommendations with dosage and safety guidelines",
      link: "/treatment",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Nutrient Advisory",
      description: "Optimize soil health with crop-specific fertilizer and nutrient plans",
      link: "/nutrient-advisory",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Chatbot",
      description: "Ask questions in your language, get instant farming advice 24/7",
      link: "/chatbot",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Marketplace",
      description: "Buy certified seeds, pesticides, and tools from verified suppliers",
      link: "/marketplace",
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Pest Alerts",
      description: "Early warning system for pest outbreaks based on weather data",
      link: "/pest-alert",
      color: "bg-yellow-50 text-yellow-600"
    }
  ]

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "50,000+", label: "Farmers Helped" },
    { icon: <TrendingUp className="w-6 h-6" />, value: "35%", label: "Yield Improvement" },
    { icon: <Shield className="w-6 h-6" />, value: "95%", label: "Accuracy Rate" },
    { icon: <Award className="w-6 h-6" />, value: "10+", label: "Languages Supported" }
  ]

  // Translate features and stats when language changes
  useEffect(() => {
    const translateData = async () => {
      if (currentLangCode === 'en') {
        setTranslatedFeatures(features)
        setTranslatedStats(stats)
        return
      }

      const featuresTranslated = await Promise.all(
        features.map(async (feature) => ({
          ...feature,
          title: await translateObj({ text: feature.title }).then(r => r.text),
          description: await translateObj({ text: feature.description }).then(r => r.text)
        }))
      )

      const statsTranslated = await Promise.all(
        stats.map(async (stat) => ({
          ...stat,
          label: await translateObj({ text: stat.label }).then(r => r.text)
        }))
      )

      setTranslatedFeatures(featuresTranslated)
      setTranslatedStats(statsTranslated)
    }

    translateData()
  }, [currentLangCode])

  const displayFeatures = translatedFeatures.length > 0 ? translatedFeatures : features
  const displayStats = translatedStats.length > 0 ? translatedStats : stats

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-agro-green-700/95 to-agro-green-700/90 backdrop-blur-md text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AgroGuard AI
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-agro-green-100">
              <TranslatedText>Smart Disease Detection, Smarter Farming Decisions</TranslatedText>
            </p>
            <p className="text-lg mb-8 text-agro-green-50 max-w-2xl mx-auto">
              <TranslatedText>Empowering Indian farmers with AI-powered crop disease detection, treatment guidance, and smart farming solutions in 10+ regional languages</TranslatedText>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/disease-detection" className="bg-white text-agro-green-700 hover:bg-agro-green-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                <TranslatedText>Start Disease Detection</TranslatedText>
              </Link>
              <Link to="/chatbot" className="bg-agro-green-700 hover:bg-agro-green-600 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white transition-all duration-200">
                <TranslatedText>Talk to AI Assistant</TranslatedText>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-agro-green-100 text-agro-green-600 rounded-full mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-agro-green-700 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title"><TranslatedText>Comprehensive Farming Solutions</TranslatedText></h2>
            <p className="section-subtitle">
              <TranslatedText>Everything you need to protect your crops and maximize yield</TranslatedText>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFeatures.map((feature, index) => (
              <Link key={index} to={feature.link} className="card hover:scale-105 group">
                <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-agro-green-600 transition">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">How AgroGuard AI Works</h2>
            <p className="section-subtitle">
              Simple steps to protect your crops and improve farming
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-agro-green-100 text-agro-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Describe Symptoms</h3>
              <p className="text-sm text-gray-600">Tell us what you see on your crops through text, voice, or images</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-agro-green-100 text-agro-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">Our AI identifies the disease and severity level instantly</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-agro-green-100 text-agro-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Treatment Plan</h3>
              <p className="text-sm text-gray-600">Receive detailed pesticide and nutrient recommendations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-agro-green-100 text-agro-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Take Action</h3>
              <p className="text-sm text-gray-600">Buy products from marketplace and apply treatment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Feature Highlight */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 text-white rounded-full mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pest Outbreak Early Warning System
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Our innovative system uses weather and crop data to predict pest outbreaks in your area before they happen. Get SMS/WhatsApp alerts and preventive action advice to protect your crops.
            </p>
            <Link to="/pest-alert" className="btn-primary inline-block">
              Enable Pest Alerts
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-agro-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-agro-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers already using AgroGuard AI to protect their crops and increase yields
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/disease-detection" className="bg-white text-agro-green-700 hover:bg-agro-green-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg">
              Get Started Free
            </Link>
            <Link to="/chatbot" className="bg-transparent hover:bg-agro-green-600 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white transition-all duration-200">
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
