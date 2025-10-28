import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, User, Phone, Mail, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useDialog } from '../contexts/DialogContext'
import { initiateRazorpayPayment, getTestCardDetails } from '../services/razorpayService'
import TranslatedText from '../components/TranslatedText'

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const { showAlert } = useDialog()
  const navigate = useNavigate()
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  })

  const [errors, setErrors] = useState({})

  const deliveryCharge = getCartTotal() >= 500 ? 0 : 50
  const totalAmount = getCartTotal() + deliveryCharge

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      showAlert({
        title: 'Login Required',
        message: 'Please login to proceed with checkout and complete your purchase.',
        type: 'warning',
        onClose: () => navigate('/login')
      })
    }
  }, [user, navigate, showAlert])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      if (formData.paymentMethod === 'cod') {
        // Cash on Delivery - instant success
        setTimeout(() => {
          handlePaymentSuccess(null, 'COD')
        }, 1000)
      } else {
        // Real Razorpay payment
        await handleRazorpayPayment()
      }
    } catch (error) {
      console.error('Payment error:', error)
      setIsProcessing(false)
      showAlert({
        title: 'Payment Failed',
        message: error.message || 'Payment failed. Please try again.',
        type: 'error'
      })
    }
  }

  const handleRazorpayPayment = async () => {
    try {
      const orderId = 'ORD' + Date.now()
      
      // Initiate Razorpay payment
      const paymentResponse = await initiateRazorpayPayment({
        amount: totalAmount,
        currency: 'INR',
        name: 'AgroGuard AI',
        description: `Order ${orderId} - Agricultural Products`,
        orderId: orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        onSuccess: (response) => {
          console.log('Razorpay payment successful:', response)
          handlePaymentSuccess(response, 'RAZORPAY')
        },
        onFailure: (error) => {
          console.error('Razorpay payment failed:', error)
          setIsProcessing(false)
          showAlert({
            title: 'Payment Failed',
            message: 'Payment failed: ' + error.message,
            type: 'error'
          })
        }
      })
    } catch (error) {
      setIsProcessing(false)
      throw error
    }
  }

  const handlePaymentSuccess = (paymentResponse, paymentMethod) => {
    setIsProcessing(false)
    setPaymentSuccess(true)

    // Save order to localStorage (in production, save to database)
    const order = {
      id: 'ORD' + Date.now(),
      date: new Date().toISOString(),
      items: cartItems,
      total: totalAmount,
      shippingDetails: formData,
      paymentMethod: paymentMethod,
      paymentId: paymentResponse?.razorpay_payment_id || null,
      status: 'Confirmed'
    }

    const existingOrders = JSON.parse(localStorage.getItem('agroguard_orders') || '[]')
    existingOrders.push(order)
    localStorage.setItem('agroguard_orders', JSON.stringify(existingOrders))

    // Clear cart
    clearCart()

    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/marketplace')
    }, 3000)
  }

  if (cartItems.length === 0 && !paymentSuccess) {
    navigate('/cart')
    return null
  }

  // Success Screen
  if (paymentSuccess) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-2xl p-12">
              <div className="mb-6">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                <TranslatedText>Order Placed Successfully!</TranslatedText>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                <TranslatedText>Thank you for your order. We'll deliver your products soon!</TranslatedText>
              </p>
              <div className="bg-green-50 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-700 mb-2">
                  <TranslatedText>Order Total</TranslatedText>
                </p>
                <p className="text-3xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</p>
              </div>
              <p className="text-gray-600 mb-4">
                <TranslatedText>Redirecting to marketplace...</TranslatedText>
              </p>
              <div className="w-16 h-1 bg-green-500 mx-auto rounded animate-pulse"></div>
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
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span><TranslatedText>Back to Cart</TranslatedText></span>
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <TranslatedText>Checkout</TranslatedText>
            </h1>
            <p className="text-gray-600">
              <TranslatedText>Complete your order</TranslatedText>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-6 h-6 text-agro-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      <TranslatedText>Contact Information</TranslatedText>
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <TranslatedText>Full Name</TranslatedText> *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-agro-green-500 ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <TranslatedText>Email</TranslatedText> *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-agro-green-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <TranslatedText>Phone Number</TranslatedText> *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-agro-green-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="10 digit mobile number"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <MapPin className="w-6 h-6 text-agro-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      <TranslatedText>Delivery Address</TranslatedText>
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <TranslatedText>Address</TranslatedText> *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-agro-green-500 ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="House no., Building name, Street, Area"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <TranslatedText>City</TranslatedText> *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-agro-green-500 ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="City"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <TranslatedText>State</TranslatedText> *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-agro-green-500 ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="State"
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <TranslatedText>Pincode</TranslatedText> *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-agro-green-500 ${
                            errors.pincode ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="6 digit pincode"
                          maxLength="6"
                        />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <CreditCard className="w-6 h-6 text-agro-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      <TranslatedText>Payment Method</TranslatedText>
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-agro-green-600"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-900">
                          <TranslatedText>Cash on Delivery</TranslatedText>
                        </p>
                        <p className="text-sm text-gray-600">
                          <TranslatedText>Pay when you receive your order</TranslatedText>
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-agro-green-600"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-900">
                          <TranslatedText>Online Payment</TranslatedText>
                        </p>
                        <p className="text-sm text-gray-600">
                          <TranslatedText>Credit/Debit Card, UPI, Net Banking</TranslatedText>
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Test Card Information - Only for Online Payment */}
                  {formData.paymentMethod === 'online' && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-900 text-sm mb-2">
                            Test Mode - Use These Credentials:
                          </p>
                          <div className="text-xs text-blue-800 space-y-1">
                            <p><strong>Card:</strong> 4111 1111 1111 1111</p>
                            <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
                            <p><strong>CVV:</strong> Any 3 digits (e.g., 123)</p>
                            <p><strong>UPI:</strong> success@razorpay</p>
                            <p className="mt-2 text-blue-600">💡 This is Razorpay test mode. No real money will be charged.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span><TranslatedText>Processing...</TranslatedText></span>
                    </span>
                  ) : (
                    <TranslatedText>Place Order</TranslatedText>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <TranslatedText>Order Summary</TranslatedText>
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex space-x-3 pb-4 border-b">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64/10b981/ffffff?text=P'
                        }}
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                        <p className="text-sm font-semibold text-agro-green-600">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span><TranslatedText>Subtotal</TranslatedText></span>
                    <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span><TranslatedText>Delivery</TranslatedText></span>
                    <span className="font-semibold">
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600"><TranslatedText>Free</TranslatedText></span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-2xl font-bold text-gray-900">
                      <span><TranslatedText>Total</TranslatedText></span>
                      <span className="text-agro-green-600">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-900">
                    <TranslatedText>100% Secure Checkout</TranslatedText>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
