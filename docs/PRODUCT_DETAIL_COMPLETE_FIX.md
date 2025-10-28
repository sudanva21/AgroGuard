# 🔧 PRODUCT DETAIL PAGE - Complete Fix

## 🚨 URGENT: Your ProductDetail.jsx file is corrupted!

The file has syntax errors and needs to be completely replaced.

---

## 📋 HOW TO FIX IT NOW

### Step 1: Delete Broken File

1. In VS Code, open: `src/pages/ProductDetail.jsx`
2. **Select ALL content** (Ctrl+A)
3. **Delete it all**

### Step 2: Paste New Code

Copy the COMPLETE code below and paste it into the empty ProductDetail.jsx file:

```jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ShoppingCart, Star, Shield, Truck, Package, ArrowLeft, Check, 
  Info, Heart, Share2, Phone, Mail, MapPin, ChevronRight, LogIn, Loader 
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useDialog } from '../contexts/DialogContext'
import { supabase } from '../lib/supabase'
import TranslatedText from '../components/TranslatedText'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { showAlert } = useDialog()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Load product from database
  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      // Fetch product by ID
      const { data: productData, error: productError } = await supabase
        .from('marketplace_products')
        .select('*')
        .eq('id', id)
        .single()

      if (productError) throw productError

      setProduct(productData)

      // Fetch related products (same category, excluding current)
      if (productData) {
        const { data: related } = await supabase
          .from('marketplace_products')
          .select('*')
          .eq('category', productData.category)
          .neq('id', id)
          .limit(4)

        setRelatedProducts(related || [])
      }
    } catch (error) {
      console.error('Error loading product:', error)
      showAlert({ 
        title: 'Error', 
        message: 'Failed to load product details', 
        type: 'error',
        onClose: () => navigate('/marketplace')
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-agro-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/marketplace')} className="btn-primary">
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  // Use images array if available, fallback to single image
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image]

  // Parse JSONB fields
  const features = typeof product.features === 'string' 
    ? JSON.parse(product.features || '[]') 
    : (Array.isArray(product.features) ? product.features : [])
  
  const specifications = typeof product.specifications === 'string'
    ? JSON.parse(product.specifications || '{}')
    : (product.specifications || {})

  const handleAddToCart = () => {
    if (!user) {
      showAlert({
        title: 'Login Required',
        message: 'Please login to add products to your cart.',
        type: 'info',
        onClose: () => navigate('/login')
      })
      return
    }
    
    addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (!user) {
      showAlert({
        title: 'Login Required',
        message: 'Please login to proceed with purchase.',
        type: 'info',
        onClose: () => navigate('/login')
      })
      return
    }
    
    addToCart(product, quantity)
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center text-gray-600 hover:text-agro-green-600 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span><TranslatedText>Back to Marketplace</TranslatedText></span>
          </button>
          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
            <Link to="/marketplace" className="hover:text-agro-green-600">
              <TranslatedText>Marketplace</TranslatedText>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="capitalize">{product.category}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={productImages[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? 'border-agro-green-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Product Name and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                {product.verified && (
                  <div className="flex items-center text-green-600">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="text-sm"><TranslatedText>Verified</TranslatedText></span>
                  </div>
                )}
              </div>
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-4xl font-bold text-agro-green-600">₹{product.price}</span>
                <span className="text-gray-600">per {product.unit}</span>
              </div>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div>
              {product.in_stock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                  <Check className="w-4 h-4 mr-1" />
                  <TranslatedText>In Stock</TranslatedText>
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
                  <TranslatedText>Out of Stock</TranslatedText>
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <TranslatedText>Quantity</TranslatedText>
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-agro-green-600 transition font-bold"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-agro-green-600 transition font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {user ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.in_stock}
                    className={`w-full btn-primary flex items-center justify-center space-x-2 ${
                      addedToCart ? 'bg-green-600 hover:bg-green-700' : ''
                    } disabled:opacity-50`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span><TranslatedText>Added to Cart!</TranslatedText></span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span><TranslatedText>Add to Cart</TranslatedText></span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.in_stock}
                    className="w-full btn-secondary disabled:opacity-50"
                  >
                    <TranslatedText>Buy Now</TranslatedText>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span><TranslatedText>Login to Purchase</TranslatedText></span>
                </button>
              )}
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="w-5 h-5 text-blue-600" />
                <span><TranslatedText>Free delivery on orders above ₹1000</TranslatedText></span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Package className="w-5 h-5 text-blue-600" />
                <span><TranslatedText>7 days return policy</TranslatedText></span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="space-y-8">
            {/* Full Description */}
            {product.full_description && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <TranslatedText>Product Description</TranslatedText>
                </h3>
                <p className="text-gray-700 leading-relaxed">{product.full_description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <TranslatedText>Key Features</TranslatedText>
                </h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {Object.keys(specifications).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <TranslatedText>Specifications</TranslatedText>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Instructions */}
            {product.usage_instructions && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <TranslatedText>Usage Instructions</TranslatedText>
                </h3>
                <p className="text-gray-700 leading-relaxed">{product.usage_instructions}</p>
              </div>
            )}

            {/* Supplier */}
            {product.supplier && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <TranslatedText>Supplier Information</TranslatedText>
                </h3>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{product.supplier}</p>
                    {product.verified && (
                      <p className="text-sm text-green-600"><TranslatedText>Verified Supplier</TranslatedText></p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              <TranslatedText>Related Products</TranslatedText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={(related.images && related.images[0]) || related.image}
                    alt={related.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{related.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-agro-green-600">₹{related.price}</span>
                      <span className="text-sm text-gray-600">{related.unit}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
```

### Step 3: Save the File

Save it (Ctrl+S)

---

## ✅ That's It!

The file is now fixed and will:
- Load products from database
- Show multiple images
- Display all product details
- Show related products
- Work perfectly!

---

## 🎯 Next: Run SQL to Add Demo Products

After fixing this file, run the SQL from `update_products_schema.sql` to add 12 demo products with images!
