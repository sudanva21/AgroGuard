import React, { useState } from 'react'
import { X, ShoppingCart, DollarSign, Shield, Package, Star, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import TranslatedText from './TranslatedText'

const ProductsModal = ({ isOpen, onClose, treatments, disease, treatmentType }) => {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (!isOpen) return null

  // Combine chemical and organic treatments
  const allProducts = treatments ? [
    ...(treatments.chemical || []).map(p => ({ ...p, type: 'chemical' })),
    ...(treatments.organic || []).map(p => ({ ...p, type: 'organic' }))
  ] : []

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-agro-green-600 to-agro-green-700 text-white p-6 flex items-center justify-between sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    <TranslatedText>Available Products</TranslatedText>
                  </h2>
                  <p className="text-agro-green-100">
                    <TranslatedText>Treatment products for</TranslatedText> <strong><TranslatedText>{disease}</TranslatedText></strong>
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
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {allProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      <TranslatedText>No products available</TranslatedText>
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allProducts.map((product, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:border-agro-green-300"
                      >
                        {/* Product Type Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            product.type === 'chemical' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.type === 'chemical' ? '💊 Chemical' : '🌿 Organic'}
                          </span>
                          {product.govtApproved && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              <TranslatedText>Approved</TranslatedText>
                            </span>
                          )}
                        </div>

                        {/* Product Name */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          <TranslatedText>{product.name}</TranslatedText>
                        </h3>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <DollarSign className="w-5 h-5 text-agro-green-600" />
                          <span className="text-2xl font-bold text-agro-green-600">
                            <TranslatedText>{product.price}</TranslatedText>
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-[80px]">
                              <TranslatedText>Dosage:</TranslatedText>
                            </span>
                            <span className="text-gray-600">
                              <TranslatedText>{product.dosage}</TranslatedText>
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-[80px]">
                              <TranslatedText>Application:</TranslatedText>
                            </span>
                            <span className="text-gray-600">
                              <TranslatedText>{product.application}</TranslatedText>
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-[80px]">
                              <TranslatedText>Frequency:</TranslatedText>
                            </span>
                            <span className="text-gray-600">
                              <TranslatedText>{product.frequency}</TranslatedText>
                            </span>
                          </div>
                        </div>

                        {/* Safety Note */}
                        {product.safety && product.safety.length > 0 && (
                          <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                            <p className="text-xs font-semibold text-yellow-900 mb-1">
                              <TranslatedText>Safety Instructions:</TranslatedText>
                            </p>
                            <ul className="text-xs text-yellow-800 space-y-1">
                              {product.safety.slice(0, 2).map((instruction, idx) => (
                                <li key={idx}>• <TranslatedText>{instruction}</TranslatedText></li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Button */}
                        <button 
                          onClick={() => {
                            // Navigate to marketplace with product search query
                            onClose() // Close modal first
                            navigate(`/marketplace?search=${encodeURIComponent(product.name)}`)
                          }}
                          className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <TranslatedText>Buy from Marketplace</TranslatedText>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Footer Info */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>💡 <TranslatedText>Tip:</TranslatedText></strong> <TranslatedText>Always read product labels and follow manufacturer instructions. Consult with agricultural experts for specific dosage recommendations.</TranslatedText>
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <TranslatedText>Showing {allProducts.length} product(s)</TranslatedText>
                </p>
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  <TranslatedText>Close</TranslatedText>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProductsModal
