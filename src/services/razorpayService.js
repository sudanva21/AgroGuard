// Razorpay Payment Service
// This handles all Razorpay payment interactions

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

/**
 * Initialize and display Razorpay checkout
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in rupees (will be converted to paise)
 * @param {string} options.currency - Currency code (default: INR)
 * @param {string} options.name - Business name
 * @param {string} options.description - Order description
 * @param {string} options.orderId - Order ID for reference
 * @param {Object} options.prefill - Customer details to prefill
 * @param {Function} options.onSuccess - Callback on successful payment
 * @param {Function} options.onFailure - Callback on payment failure
 */
export const initiateRazorpayPayment = (options) => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded. Please check your internet connection.'))
      return
    }

    // Check if API key is configured
    if (!RAZORPAY_KEY_ID) {
      reject(new Error('Razorpay API key not configured. Please add VITE_RAZORPAY_KEY_ID to .env file.'))
      return
    }

    const {
      amount,
      currency = 'INR',
      name = 'AgroGuard AI',
      description = 'Agricultural Products Purchase',
      orderId,
      prefill = {},
      onSuccess,
      onFailure
    } = options

    // Convert rupees to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100)

    const razorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: currency,
      name: name,
      description: description,
      order_id: orderId, // Optional - for server-side order creation
      image: '/favicon.svg', // Your company logo
      
      // Prefill customer details
      prefill: {
        name: prefill.name || '',
        email: prefill.email || '',
        contact: prefill.phone || ''
      },

      // Notes for reference
      notes: {
        order_id: orderId,
        timestamp: new Date().toISOString()
      },

      // Theme customization
      theme: {
        color: '#10b981' // Agro-green color
      },

      // Modal configuration
      modal: {
        ondismiss: function() {
          // User closed the payment modal without completing payment
          const error = new Error('Payment cancelled by user')
          if (onFailure) {
            onFailure(error)
          }
          reject(error)
        }
      },

      // Payment success handler
      handler: function(response) {
        // response contains:
        // - razorpay_payment_id
        // - razorpay_order_id (if order was created)
        // - razorpay_signature (if order was created)
        
        console.log('Payment successful:', response)
        
        if (onSuccess) {
          onSuccess(response)
        }
        
        resolve(response)
      }
    }

    // Create Razorpay instance and open checkout
    const razorpayInstance = new window.Razorpay(razorpayOptions)
    
    // Error handler for payment failures
    razorpayInstance.on('payment.failed', function(response) {
      console.error('Payment failed:', response.error)
      
      const error = new Error(response.error.description || 'Payment failed')
      error.code = response.error.code
      error.metadata = response.error.metadata
      
      if (onFailure) {
        onFailure(error)
      }
      
      reject(error)
    })

    // Open the checkout modal
    razorpayInstance.open()
  })
}

/**
 * Verify payment on client side (basic validation)
 * Note: For production, always verify payment on server side
 * @param {Object} paymentData - Payment response from Razorpay
 */
export const verifyPayment = (paymentData) => {
  // Basic validation
  if (!paymentData || !paymentData.razorpay_payment_id) {
    return {
      success: false,
      message: 'Invalid payment data'
    }
  }

  // In production, you should verify the signature on server side
  // using Razorpay's signature verification
  
  return {
    success: true,
    message: 'Payment verified successfully',
    paymentId: paymentData.razorpay_payment_id
  }
}

/**
 * Get test card details for testing
 * These cards can be used in test mode
 */
export const getTestCardDetails = () => {
  return {
    successCard: {
      number: '4111 1111 1111 1111',
      expiry: 'Any future date',
      cvv: 'Any 3 digits',
      name: 'Test User'
    },
    failureCard: {
      number: '4000 0000 0000 0002',
      expiry: 'Any future date',
      cvv: 'Any 3 digits',
      name: 'Test User'
    },
    upiId: 'success@razorpay',
    netBanking: 'All test banks available'
  }
}

/**
 * Check if Razorpay is properly configured
 */
export const isRazorpayConfigured = () => {
  return !!(RAZORPAY_KEY_ID && window.Razorpay)
}

export default {
  initiateRazorpayPayment,
  verifyPayment,
  getTestCardDetails,
  isRazorpayConfigured
}
