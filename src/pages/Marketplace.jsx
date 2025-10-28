import React, { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Search, Filter, Star, Shield, Truck, Package, Check, LogIn } from 'lucide-react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import TranslatedText from '../components/TranslatedText'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useDialog } from '../contexts/DialogContext'
import { supabase } from '../lib/supabase'

const Marketplace = () => {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedToCart, setAddedToCart] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const productsRef = useRef(null)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { showAlert } = useDialog()
  const navigate = useNavigate()
  
  // Load products from database
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback: keep empty array
    } finally {
      setLoading(false)
    }
  }
  
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
                <Link to={`/product/${product.id}`} className="block bg-gradient-to-br from-agro-green-50 to-agro-green-100 h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/10b981/ffffff?text=' + encodeURIComponent(product.category)
                    }}
                  />
                </Link>

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
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 h-12 hover:text-agro-green-600 transition cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

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
                    {product.in_stock ? (
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
                  {user ? (
                    <button
                      disabled={!product.in_stock}
                      onClick={() => {
                        addToCart(product)
                        setAddedToCart(prev => ({ ...prev, [product.id]: true }))
                        setTimeout(() => {
                          setAddedToCart(prev => ({ ...prev, [product.id]: false }))
                        }, 2000)
                      }}
                      className={`w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                        addedToCart[product.id] ? 'bg-green-600 hover:bg-green-700' : ''
                      }`}
                    >
                      {addedToCart[product.id] ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span><TranslatedText>Added!</TranslatedText></span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span><TranslatedText>Add to Cart</TranslatedText></span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        showAlert({
                          title: 'Login Required',
                          message: 'Please login to add products to your cart.',
                          type: 'info',
                          onClose: () => navigate('/login')
                        })
                      }}
                      className="w-full btn-secondary flex items-center justify-center space-x-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span><TranslatedText>Login to Add to Cart</TranslatedText></span>
                    </button>
                  )}
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
