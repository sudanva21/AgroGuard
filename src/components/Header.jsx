import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Sprout, Languages, LogOut, User, Globe, ShoppingCart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import TranslatedText from './TranslatedText'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { getCartCount } = useCart()
  const { currentLanguage, changeLanguage, isTranslating } = useLanguage()
  const navigate = useNavigate()
  const cartCount = getCartCount()

  const languages = ['English', 'हिंदी', 'मराठी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'বাংলা', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'മലയാളം']

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const handleLanguageChange = (lang) => {
    changeLanguage(lang)
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-agro-green-600 p-2 rounded-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-agro-green-700">AgroGuard AI</h1>
              <p className="text-xs text-gray-600 hidden sm:block">
                <TranslatedText>Smart Farming Decisions</TranslatedText>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-agro-green-600 font-medium transition"><TranslatedText>Home</TranslatedText></Link>
            <Link to="/marketplace" className="text-gray-700 hover:text-agro-green-600 font-medium transition"><TranslatedText>Marketplace</TranslatedText></Link>
            <Link to="/nutrient-advisory" className="text-gray-700 hover:text-agro-green-600 font-medium transition"><TranslatedText>Nutrients</TranslatedText></Link>
            {user && (
              <>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <Link to="/disease-detection" className="text-gray-700 hover:text-agro-green-600 font-medium transition"><TranslatedText>Disease Detection</TranslatedText></Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Link to="/treatment" className="text-gray-700 hover:text-agro-green-600 font-medium transition"><TranslatedText>Treatment</TranslatedText></Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Link to="/pest-alert" className="text-gray-700 hover:text-agro-green-600 font-medium transition"><TranslatedText>Pest Alerts</TranslatedText></Link>
                </motion.div>
              </>
            )}
          </nav>

          {/* Cart Icon, Language Selector & Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Cart Icon - Only for logged in users */}
            {user && (
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-agro-green-600 transition">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-agro-green-600 transition">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{currentLanguage}</span>
                {isTranslating && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-agro-green-600"></div>}
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-agro-green-50 first:rounded-t-lg last:rounded-b-lg ${
                      currentLanguage === lang ? 'bg-agro-green-100 font-semibold' : ''
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            
            {user ? (
              <>
                <Link to="/chatbot" className="btn-primary">
                  <TranslatedText>Ask AI Assistant</TranslatedText>
                </Link>
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 bg-agro-green-50 hover:bg-agro-green-100 rounded-lg transition"
                  >
                    <User className="w-4 h-4 text-agro-green-600" />
                    <span className="text-sm font-medium text-agro-green-700">{user.email?.split('@')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium"><TranslatedText>Logout</TranslatedText></span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-agro-green-700 hover:text-agro-green-800 font-semibold transition">
                  <TranslatedText>Login</TranslatedText>
                </Link>
                <Link to="/register" className="btn-primary">
                  <TranslatedText>Register</TranslatedText>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Cart Icon & Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Cart Icon - Only for logged in users */}
            {user && (
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-agro-green-600 transition">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-agro-green-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-agro-green-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}><TranslatedText>Home</TranslatedText></Link>
              <Link to="/marketplace" className="text-gray-700 hover:text-agro-green-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}><TranslatedText>Marketplace</TranslatedText></Link>
              <Link to="/nutrient-advisory" className="text-gray-700 hover:text-agro-green-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}><TranslatedText>Nutrients</TranslatedText></Link>
              
              {user ? (
                <>
                  <Link to="/disease-detection" className="text-gray-700 hover:text-agro-green-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}><TranslatedText>Disease Detection</TranslatedText></Link>
                  <Link to="/treatment" className="text-gray-700 hover:text-agro-green-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}><TranslatedText>Treatment</TranslatedText></Link>
                  <Link to="/pest-alert" className="text-gray-700 hover:text-agro-green-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}><TranslatedText>Pest Alerts</TranslatedText></Link>
                  <Link to="/chatbot" className="btn-primary text-center mt-2" onClick={() => setIsMenuOpen(false)}><TranslatedText>Ask AI Assistant</TranslatedText></Link>
                  
                  <div className="pt-3 border-t">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 px-3 py-2 bg-agro-green-50 hover:bg-agro-green-100 rounded-lg mb-3 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-agro-green-600" />
                      <span className="text-sm font-medium text-agro-green-700">{user.email}</span>
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium"><TranslatedText>Logout</TranslatedText></span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-center" onClick={() => setIsMenuOpen(false)}><TranslatedText>Login</TranslatedText></Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}><TranslatedText>Register</TranslatedText></Link>
                </>
              )}
              
              <select 
                value={currentLanguage} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
