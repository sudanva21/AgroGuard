import React from 'react'
import { Link } from 'react-router-dom'
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import TranslatedText from './TranslatedText'

const Footer = () => {
  return (
    <footer className="bg-agro-green-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-agro-green-600 p-2 rounded-lg">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">AgroGuard AI</h3>
            </div>
            <p className="text-agro-green-100 text-sm mb-4">
              <TranslatedText>Where Indian soil meets intelligent care.</TranslatedText>
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-agro-green-800 p-2 rounded-full hover:bg-agro-green-700 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="bg-agro-green-800 p-2 rounded-full hover:bg-agro-green-700 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="bg-agro-green-800 p-2 rounded-full hover:bg-agro-green-700 transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="bg-agro-green-800 p-2 rounded-full hover:bg-agro-green-700 transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4"><TranslatedText>Quick Links</TranslatedText></h4>
            <ul className="space-y-2 text-agro-green-100 text-sm">
              <li><Link to="/disease-detection" className="hover:text-white transition"><TranslatedText>Disease Detection</TranslatedText></Link></li>
              <li><Link to="/treatment" className="hover:text-white transition"><TranslatedText>Treatment Guide</TranslatedText></Link></li>
              <li><Link to="/nutrient-advisory" className="hover:text-white transition"><TranslatedText>Nutrient Advisory</TranslatedText></Link></li>
              <li><Link to="/pest-alert" className="hover:text-white transition"><TranslatedText>Pest Alerts</TranslatedText></Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition"><TranslatedText>Marketplace</TranslatedText></Link></li>
              <li><Link to="/chatbot" className="hover:text-white transition"><TranslatedText>AI Chatbot</TranslatedText></Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-agro-green-100 text-sm">
              <li><a href="#" className="hover:text-white transition">Government Schemes</a></li>
              <li><a href="#" className="hover:text-white transition">Farming Tips</a></li>
              <li><a href="#" className="hover:text-white transition">Community Forum</a></li>
              <li><a href="#" className="hover:text-white transition">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-agro-green-100 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Agricultural Innovation Hub, New Delhi, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@agroguard.ai</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-agro-green-200">Available in 10+ Indian languages</p>
            </div>
          </div>
        </div>

        <div className="border-t border-agro-green-800 mt-8 pt-6 text-center text-agro-green-200 text-sm">
          <p>&copy; 2025 AgroGuard AI — Where Indian soil meets intelligent care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
