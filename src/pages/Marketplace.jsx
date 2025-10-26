import React, { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Search, Filter, Star, Shield, Truck, Package } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import TranslatedText from '../components/TranslatedText'

const Marketplace = () => {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const productsRef = useRef(null)
  
  // Read search query from URL params on mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
      // Scroll to products section after a short delay
      setTimeout(() => {
        if (productsRef.current) {
          productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [searchParams])

  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'seeds', name: 'Seeds', icon: Package },
    { id: 'pesticides', name: 'Pesticides', icon: Shield },
    { id: 'fertilizers', name: 'Fertilizers', icon: Package },
    { id: 'tools', name: 'Tools', icon: Package }
  ]

  // Helper function to translate category names
  const getCategoryName = (name) => name

  const products = [
    {
      id: 1,
      name: 'Hybrid Tomato Seeds (Arka Vikas)',
      category: 'seeds',
      price: 450,
      unit: '100g',
      rating: 4.5,
      reviews: 234,
      verified: true,
      inStock: true,
      image: '🌱',
      supplier: 'National Seeds Corporation',
      description: 'High-yielding hybrid variety, disease resistant'
    },
    {
      id: 2,
      name: 'Mancozeb 75% WP',
      category: 'pesticides',
      price: 450,
      unit: '1kg',
      rating: 4.7,
      reviews: 456,
      verified: true,
      inStock: true,
      image: '🧪',
      supplier: 'Bayer CropScience',
      description: 'Broad spectrum fungicide, govt approved'
    },
    {
      id: 3,
      name: 'NPK 19:19:19 Water Soluble',
      category: 'fertilizers',
      price: 850,
      unit: '5kg',
      rating: 4.6,
      reviews: 189,
      verified: true,
      inStock: true,
      image: '💧',
      supplier: 'Coromandel International',
      description: 'Complete balanced nutrition for all crops'
    },
    {
      id: 4,
      name: 'Neem Oil 1500 PPM',
      category: 'pesticides',
      price: 250,
      unit: '1L',
      rating: 4.8,
      reviews: 567,
      verified: true,
      inStock: true,
      image: '🌿',
      supplier: 'Neem India',
      description: 'Organic pest control, safe for environment'
    },
    {
      id: 5,
      name: 'Urea 46% N',
      category: 'fertilizers',
      price: 280,
      unit: '50kg',
      rating: 4.4,
      reviews: 892,
      verified: true,
      inStock: true,
      image: '⚗️',
      supplier: 'IFFCO',
      description: 'High nitrogen content, quick acting'
    },
    {
      id: 6,
      name: 'Battery Operated Sprayer 16L',
      category: 'tools',
      price: 2500,
      unit: 'piece',
      rating: 4.3,
      reviews: 145,
      verified: true,
      inStock: true,
      image: '🔧',
      supplier: 'KisanKraft',
      description: 'Rechargeable, 4-6 hours backup'
    },
    {
      id: 7,
      name: 'Wheat Seeds (HD 2967)',
      category: 'seeds',
      price: 35,
      unit: '1kg',
      rating: 4.6,
      reviews: 678,
      verified: true,
      inStock: true,
      image: '🌾',
      supplier: 'Punjab Agricultural University',
      description: 'High yielding variety, drought tolerant'
    },
    {
      id: 8,
      name: 'Vermicompost Organic',
      category: 'fertilizers',
      price: 400,
      unit: '40kg',
      rating: 4.9,
      reviews: 423,
      verified: true,
      inStock: true,
      image: '🪱',
      supplier: 'Green Gold Organics',
      description: 'Rich in beneficial microbes, improves soil'
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4"><TranslatedText>Smart Agro Marketplace</TranslatedText></h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            <TranslatedText>Buy certified seeds, quality pesticides, fertilizers, and tools from verified suppliers</TranslatedText>
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent"
                />
              </div>
              <button className="btn-primary flex items-center justify-center space-x-2 whitespace-nowrap">
                <Filter className="w-5 h-5" />
                <span><TranslatedText>Filters</TranslatedText></span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-agro-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span><TranslatedText>{category.name}</TranslatedText></span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div ref={productsRef} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Product Image */}
                <div className="bg-gradient-to-br from-agro-green-50 to-agro-green-100 h-48 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {product.image}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Verified Badge */}
                  {product.verified && (
                    <div className="flex items-center space-x-1 text-xs text-green-600 mb-2">
                      <Shield className="w-3 h-3" />
                      <span className="font-semibold"><TranslatedText>Verified Supplier</TranslatedText></span>
                    </div>
                  )}

                  {/* Product Name */}
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 h-12">
                    {product.name}
                  </h3>

                  {/* Supplier */}
                  <p className="text-xs text-gray-600 mb-2">{product.supplier}</p>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2 h-8">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-900 ml-1">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-agro-green-600">
                        ₹{product.price}
                      </p>
                      <p className="text-xs text-gray-600">per {product.unit}</p>
                    </div>
                    {product.inStock ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                        <TranslatedText>In Stock</TranslatedText>
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">
                        <TranslatedText>Out of Stock</TranslatedText>
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    disabled={!product.inStock}
                    className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span><TranslatedText>Add to Cart</TranslatedText></span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Features Banner */}
        <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="bg-agro-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-agro-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Verified Suppliers</h3>
            <p className="text-sm text-gray-600">All products from government-approved and certified suppliers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Delivery</h3>
            <p className="text-sm text-gray-600">Free delivery on orders above ₹500 to your doorstep</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality Assured</h3>
            <p className="text-sm text-gray-600">100% genuine products with quality guarantee</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marketplace
