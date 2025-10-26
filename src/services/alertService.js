// Alert Service for FREE SMS and WhatsApp notifications
// Uses multiple free services as fallbacks

// Import Supabase for storing alert subscriptions
import { supabase } from '../lib/supabase'

// Fast2SMS API (Free tier: 50 SMS/day)
const FAST2SMS_API_KEY = import.meta.env.VITE_FAST2SMS_API_KEY
const FAST2SMS_URL = 'https://www.fast2sms.com/dev/bulkV2'

// Twilio (Free trial credits)
const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER
const TWILIO_WHATSAPP_NUMBER = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER

/**
 * Subscribe user to pest alerts
 */
export async function subscribeToPestAlerts(userId, location, crop, phoneNumber) {
  try {
    // Store subscription in Supabase
    const { data, error } = await supabase
      .from('pest_alert_subscriptions')
      .upsert({
        user_id: userId,
        location: location,
        crop: crop,
        phone_number: phoneNumber,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) throw error

    // Send confirmation message
    await sendSMS(phoneNumber, 
      `AgroGuard AI: Pest alerts activated for ${crop} in ${location}. You will receive early warnings 3-7 days before outbreaks. Stay protected! 🌾`
    )

    return { success: true, subscription: data }
  } catch (error) {
    console.error('Subscription error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Unsubscribe from pest alerts
 */
export async function unsubscribeFromPestAlerts(userId) {
  try {
    const { error } = await supabase
      .from('pest_alert_subscriptions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get user's alert subscription
 */
export async function getAlertSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('pest_alert_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Get subscription error:', error)
    return null
  }
}

/**
 * Send SMS using Supabase Edge Function (DEPLOYED!)
 */
async function sendSMS(phoneNumber, message) {
  const cleanNumber = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '')
  
  try {
    console.log('📱 Sending SMS via Edge Function...')
    
    // Call Edge Function (now deployed!)
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: { 
        phoneNumber: cleanNumber, 
        message: message,
        type: 'sms'
      }
    })

    if (error) {
      console.error('Edge Function error:', error)
      throw error
    }

    if (data && data.success) {
      console.log('✅ SMS sent successfully via', data.provider)
      return { 
        success: true, 
        provider: data.provider,
        note: 'Message sent automatically!'
      }
    } else {
      console.warn('⚠️ SMS queued in database:', data?.error)
      await storeUnsentAlert(cleanNumber, message, 'SMS')
      return {
        success: false,
        provider: data?.provider || 'Database',
        error: data?.error || 'SMS service not configured'
      }
    }
  } catch (error) {
    console.error('SMS send failed:', error)
    // Fallback: store in database
    await storeUnsentAlert(cleanNumber, message, 'SMS')
    return { 
      success: false, 
      error: 'SMS service unavailable. Alert stored in database.' 
    }
  }
}

/**
 * Send WhatsApp using Supabase Edge Function (DEPLOYED!)
 */
export async function sendWhatsApp(phoneNumber, message) {
  const cleanNumber = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '')
  
  if (cleanNumber.length !== 10) {
    return { success: false, error: 'Invalid phone number' }
  }

  try {
    console.log('💬 Sending WhatsApp via Edge Function...')
    
    // Call Edge Function (now deployed!)
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: { 
        phoneNumber: cleanNumber, 
        message: message,
        type: 'whatsapp'
      }
    })

    if (error) {
      console.error('WhatsApp Edge Function error:', error)
      throw error
    }

    if (data && data.success) {
      console.log('✅ WhatsApp sent successfully via', data.provider)
      return { 
        success: true, 
        provider: data.provider,
        note: 'WhatsApp message sent automatically!'
      }
    } else {
      console.warn('⚠️ WhatsApp queued:', data?.error)
      // Fallback: generate WhatsApp link
      const whatsappLink = generateWhatsAppLink(cleanNumber, message)
      await storeUnsentAlert(cleanNumber, message, 'WhatsApp', whatsappLink)
      return {
        success: false,
        provider: 'WhatsApp Link',
        link: whatsappLink,
        error: data?.error || 'WhatsApp API not configured'
      }
    }
  } catch (error) {
    console.error('WhatsApp send failed:', error)
    // Fallback: generate WhatsApp link
    const whatsappLink = generateWhatsAppLink(cleanNumber, message)
    await storeUnsentAlert(cleanNumber, message, 'WhatsApp', whatsappLink)
    return { 
      success: false, 
      link: whatsappLink,
      error: 'WhatsApp service unavailable. Link generated.' 
    }
  }
}

/**
 * Send pest outbreak alert to user
 */
export async function sendPestAlert(subscription, pestInfo) {
  const { phone_number, crop, location } = subscription
  
  const message = `
🚨 AgroGuard Pest Alert!

Pest: ${pestInfo.name}
Crop: ${crop}
Location: ${location}
Risk: ${pestInfo.riskLevel}
Expected: ${pestInfo.expectedDate}

⚠️ Action Threshold: ${pestInfo.threshold}

🛡️ Preventive Actions:
${pestInfo.preventive.slice(0, 3).map((action, i) => `${i + 1}. ${action}`).join('\n')}

Take action now to protect your crop!
- AgroGuard AI
  `.trim()

  // Send both SMS and WhatsApp
  const smsResult = await sendSMS(phone_number, message)
  const whatsappResult = await sendWhatsApp(phone_number, message)

  // Log alert in database
  await logAlert(subscription.user_id, pestInfo.name, pestInfo.riskLevel, message)

  return {
    sms: smsResult,
    whatsapp: whatsappResult
  }
}

/**
 * Store unsent alert in database for manual processing
 */
async function storeUnsentAlert(phoneNumber, message, type, link = null) {
  try {
    await supabase
      .from('unsent_alerts')
      .insert({
        phone_number: phoneNumber,
        message: message,
        alert_type: type,
        link: link,
        status: 'pending',
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to store unsent alert:', error)
  }
}

/**
 * Log alert in database
 */
async function logAlert(userId, pestName, riskLevel, message) {
  try {
    await supabase
      .from('alert_logs')
      .insert({
        user_id: userId,
        pest_name: pestName,
        risk_level: riskLevel,
        message: message,
        sent_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to log alert:', error)
  }
}

/**
 * Check and send alerts for all active subscriptions
 * This function would typically be called by a cron job or scheduled task
 */
export async function checkAndSendAlerts(predictions, subscription) {
  const highRiskPests = predictions.filter(p => p.riskLevel === 'High')
  
  if (highRiskPests.length > 0) {
    // Send alert for the highest risk pest
    const topPest = highRiskPests[0]
    await sendPestAlert(subscription, topPest)
    return true
  }
  
  return false
}

/**
 * Generate WhatsApp web link for sharing
 */
export function generateWhatsAppLink(phoneNumber, message) {
  const cleanNumber = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '')
  return `https://wa.me/91${cleanNumber}?text=${encodeURIComponent(message)}`
}

/**
 * Test alert function (for demo purposes)
 */
export async function sendTestAlert(phoneNumber) {
  const testMessage = 'AgroGuard AI Test Alert: Your pest alert system is working! 🌾'
  
  const smsResult = await sendSMS(phoneNumber, testMessage)
  const whatsappResult = await sendWhatsApp(phoneNumber, testMessage)
  
  return {
    sms: smsResult,
    whatsapp: whatsappResult
  }
}
