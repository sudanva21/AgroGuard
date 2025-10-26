// Supabase Edge Function for sending SMS/WhatsApp
// This runs on server, so no CORS issues!

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber, message, type } = await req.json()
    
    // Get API keys from environment
    const FAST2SMS_API_KEY = Deno.env.get('FAST2SMS_API_KEY')
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')
    const TWILIO_WHATSAPP_NUMBER = Deno.env.get('TWILIO_WHATSAPP_NUMBER')
    
    const cleanNumber = phoneNumber.replace(/\D/g, '')
    let result = { success: false, provider: 'none', error: '' }

    // Try Fast2SMS first (for Indian numbers)
    if (FAST2SMS_API_KEY && cleanNumber.length === 10) {
      try {
        console.log('Attempting Fast2SMS...')
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'q',
            message: message,
            language: 'english',
            flash: 0,
            numbers: cleanNumber
          })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Fast2SMS Success:', data)
          result = { success: true, provider: 'Fast2SMS', data }
        } else {
          const errorData = await response.json()
          console.error('Fast2SMS Error:', errorData)
          result.error = JSON.stringify(errorData)
        }
      } catch (error) {
        console.error('Fast2SMS Exception:', error)
        result.error = error.message
      }
    }

    // If Fast2SMS failed or not configured, try Twilio
    if (!result.success && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      try {
        console.log('Attempting Twilio...')
        const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
        
        // Determine if SMS or WhatsApp
        const fromNumber = type === 'whatsapp' && TWILIO_WHATSAPP_NUMBER 
          ? TWILIO_WHATSAPP_NUMBER 
          : TWILIO_PHONE_NUMBER
        const toNumber = type === 'whatsapp' 
          ? `whatsapp:+91${cleanNumber}` 
          : `+91${cleanNumber}`
        
        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: fromNumber,
            To: toNumber,
            Body: message
          })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Twilio Success:', data)
          result = { 
            success: true, 
            provider: type === 'whatsapp' ? 'Twilio WhatsApp' : 'Twilio SMS', 
            data 
          }
        } else {
          const errorData = await response.json()
          console.error('Twilio Error:', errorData)
          result.error = JSON.stringify(errorData)
        }
      } catch (error) {
        console.error('Twilio Exception:', error)
        result.error = error.message
      }
    }

    // If all failed, store in database for manual processing
    if (!result.success) {
      console.log('All SMS services failed. Storing in database...')
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      await supabase.from('unsent_alerts').insert({
        phone_number: cleanNumber,
        message: message,
        alert_type: type || 'SMS',
        status: 'pending',
        created_at: new Date().toISOString()
      })
      
      result = {
        success: false,
        provider: 'Database',
        error: 'SMS services not configured. Alert stored in database.'
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    )
  }
})
