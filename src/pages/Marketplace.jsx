import React, { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Search, Filter, Star, Shield, Truck, Package, Check } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import TranslatedText from '../components/TranslatedText'
import { useCart } from '../contexts/CartContext'

const Marketplace = () => {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedToCart, setAddedToCart] = useState({})
  const productsRef = useRef(null)
  const { addToCart } = useCart()
  
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
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
      supplier: 'National Seeds Corporation',
      description: 'High-yielding hybrid variety, disease resistant'
    },
    {
      id: 2,
      name: 'Mancozeb 75% WP Fungicide',
      category: 'pesticides',
      price: 450,
      unit: '1kg',
      rating: 4.7,
      reviews: 456,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=300&fit=crop',
      supplier: 'Neem India',
      description: 'Organic pest control, safe for environment'
    },
    {
      id: 5,
      name: 'Urea 46% N Fertilizer',
      category: 'fertilizers',
      price: 280,
      unit: '50kg',
      rating: 4.4,
      reviews: 892,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      supplier: 'Green Gold Organics',
      description: 'Rich in beneficial microbes, improves soil'
    },
    {
      id: 9,
      name: 'Hybrid Corn Seeds (Pioneer)',
      category: 'seeds',
      price: 650,
      unit: '500g',
      rating: 4.7,
      reviews: 321,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1551453062-41d3e6adc9e6?w=400&h=300&fit=crop',
      supplier: 'Pioneer Seeds',
      description: 'High yield, excellent disease resistance'
    },
    {
      id: 10,
      name: 'Bio-Pesticide (Trichoderma)',
      category: 'pesticides',
      price: 350,
      unit: '1kg',
      rating: 4.5,
      reviews: 276,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1601575434663-7350b6ccaaa3?w=400&h=300&fit=crop',
      supplier: 'BioControl India',
      description: 'Biological fungicide, eco-friendly solution'
    },
    {
      id: 11,
      name: 'Drip Irrigation Kit',
      category: 'tools',
      price: 3500,
      unit: 'set',
      rating: 4.6,
      reviews: 198,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop',
      supplier: 'Jain Irrigation',
      description: 'Complete drip system for 1 acre'
    },
    {
      id: 12,
      name: 'Rice Seeds (Pusa Basmati)',
      category: 'seeds',
      price: 120,
      unit: '1kg',
      rating: 4.8,
      reviews: 542,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      supplier: 'IARI Delhi',
      description: 'Premium basmati variety, aromatic'
    },
    {
      id: 13,
      name: 'Humic Acid Liquid',
      category: 'fertilizers',
      price: 550,
      unit: '1L',
      rating: 4.7,
      reviews: 167,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1599255723323-8f70f3ac48e2?w=400&h=300&fit=crop',
      supplier: 'Agro Solutions',
      description: 'Enhances soil health and nutrient uptake'
    },
    {
      id: 14,
      name: 'Garden Pruning Shears',
      category: 'tools',
      price: 450,
      unit: 'piece',
      rating: 4.4,
      reviews: 89,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1617634667039-8e3033a9b9d0?w=400&h=300&fit=crop',
      supplier: 'Gardening Pro',
      description: 'Sharp stainless steel, ergonomic handle'
    },
    {
      id: 15,
      name: 'Sulphur 80% WDG',
      category: 'pesticides',
      price: 380,
      unit: '1kg',
      rating: 4.6,
      reviews: 234,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop',
      supplier: 'UPL Limited',
      description: 'Controls powdery mildew, safe for crops'
    },
    {
      id: 16,
      name: 'Vegetable Seeds Combo Pack',
      category: 'seeds',
      price: 299,
      unit: 'pack',
      rating: 4.5,
      reviews: 412,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&h=300&fit=crop',
      supplier: 'Garden Delight',
      description: '10 varieties pack - seasonal vegetables'
    },
    {
      id: 17,
      name: 'Potash Fertilizer (MOP)',
      category: 'fertilizers',
      price: 720,
      unit: '25kg',
      rating: 4.5,
      reviews: 345,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      supplier: 'ICL Fertilizers',
      description: 'Improves fruit quality and disease resistance'
    },
    {
      id: 18,
      name: 'Solar Insect Trap',
      category: 'tools',
      price: 1800,
      unit: 'piece',
      rating: 4.7,
      reviews: 156,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      supplier: 'EcoTech Solutions',
      description: 'Chemical-free pest control, solar powered'
    },
    {
      id: 19,
      name: 'Micronutrient Mix',
      category: 'fertilizers',
      price: 420,
      unit: '1kg',
      rating: 4.8,
      reviews: 267,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400&h=300&fit=crop',
      supplier: 'Nutrient Plus',
      description: 'Complete micronutrient formula - Zn, Fe, Mn, Cu'
    },
    {
      id: 20,
      name: 'Mulching Paper Roll',
      category: 'tools',
      price: 890,
      unit: '100m',
      rating: 4.3,
      reviews: 92,
      verified: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1580328291854-f10e0b1cfed2?w=400&h=300&fit=crop',
      supplier: 'Agro Plastic Ltd',
      description: 'Biodegradable, controls weeds, retains moisture'
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
                <div className="bg-gradient-to-br from-agro-green-50 to-agro-green-100 h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/10b981/ffffff?text=' + encodeURIComponent(product.category)
                    }}
                  />
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
