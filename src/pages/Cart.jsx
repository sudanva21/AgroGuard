import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useDialog } from '../contexts/DialogContext'
import TranslatedText from '../components/TranslatedText'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const { showAlert, showConfirm } = useDialog()
  const navigate = useNavigate()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      showAlert({
        title: 'Login Required',
        message: 'Please login to view your cart and manage your items.',
        type: 'warning',
        onClose: () => navigate('/login')
      })
    }
  }, [user, navigate, showAlert])

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout')
    }
  }

  const handleClearCart = async () => {
    const confirmed = await showConfirm({
      title: 'Clear Cart?',
      message: 'Are you sure you want to remove all items from your cart? This action cannot be undone.',
      type: 'warning',
      confirmText: 'Yes, Clear Cart',
      cancelText: 'Cancel'
    })
    if (confirmed) {
      clearCart()
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                <TranslatedText>Your Cart is Empty</TranslatedText>
              </h2>
              <p className="text-gray-600 mb-8">
                <TranslatedText>Start adding some quality agricultural products to your cart!</TranslatedText>
              </p>
              <Link to="/marketplace" className="btn-primary inline-flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span><TranslatedText>Browse Marketplace</TranslatedText></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <TranslatedText>Shopping Cart</TranslatedText>
            </h1>
            <p className="text-gray-600">
              <TranslatedText>Review your items before checkout</TranslatedText>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/128/10b981/ffffff?text=Product'
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">{item.supplier}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-agro-green-100 hover:bg-agro-green-200 transition"
                            >
                              <Plus className="w-4 h-4 text-agro-green-700" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">
                              ₹{item.price} per {item.unit}
                            </p>
                            <p className="text-2xl font-bold text-agro-green-600">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={handleClearCart}
                className="w-full py-3 text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 rounded-lg transition"
              >
                <TranslatedText>Clear Cart</TranslatedText>
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <TranslatedText>Order Summary</TranslatedText>
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span><TranslatedText>Subtotal</TranslatedText></span>
                    <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span><TranslatedText>Delivery</TranslatedText></span>
                    <span className="font-semibold text-green-600">
                      {getCartTotal() >= 500 ? (
                        <TranslatedText>Free</TranslatedText>
                      ) : (
                        '₹50'
                      )}
                    </span>
                  </div>
                  {getCartTotal() < 500 && (
                    <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                      <TranslatedText>Add ₹{(500 - getCartTotal()).toFixed(2)} more for free delivery!</TranslatedText>
                    </p>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span><TranslatedText>Total</TranslatedText></span>
                      <span className="text-agro-green-600">
                        ₹{(getCartTotal() + (getCartTotal() >= 500 ? 0 : 50)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg"
                >
                  <span><TranslatedText>Proceed to Checkout</TranslatedText></span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <Link 
                  to="/marketplace" 
                  className="block text-center mt-4 text-agro-green-600 hover:text-agro-green-700 font-semibold"
                >
                  <TranslatedText>Continue Shopping</TranslatedText>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="bg-green-100 p-2 rounded">
                      <ShoppingCart className="w-4 h-4 text-green-600" />
                    </div>
                    <span><TranslatedText>Secure Checkout</TranslatedText></span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="bg-blue-100 p-2 rounded">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                    </div>
                    <span><TranslatedText>Quality Guaranteed</TranslatedText></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
