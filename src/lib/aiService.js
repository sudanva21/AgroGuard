import Groq from 'groq-sdk'

// Initialize Groq client with API key from environment
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
})

/**
 * Get AI response from Groq API
 * @param {string} userMessage - The user's question
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - AI response text
 */
export async function getAIResponse(userMessage, conversationHistory = []) {
  try {
    // System prompt that defines the AI assistant's role and expertise
    const systemPrompt = `You are AgroGuard AI, an expert agricultural assistant for Indian farmers. 
    
Your expertise includes:
- Crop diseases identification and treatment
- Pest management and organic solutions
- Fertilizer recommendations (NPK ratios, application timing)
- Soil health and pH management
- Government farming schemes (PM-KISAN, Soil Health Card, Fasal Bima Yojana)
- Best farming practices for Indian agriculture
- Weather-based farming advice

Guidelines:
- Provide practical, actionable advice suitable for Indian farming conditions
- Use metric measurements (kg/ha, ml/liter)
- Mention specific pesticide/fertilizer brands when relevant
- Be concise but thorough (2-4 sentences)
- Always prioritize farmer safety
- Suggest consulting local agricultural experts for critical decisions
- Respond in a friendly, supportive tone

If unsure, acknowledge limitations and suggest alternatives.`

    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ]

    // Make API call to Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Fast and intelligent model
      messages: messages,
      temperature: 0.7, // Balanced creativity and consistency
      max_tokens: 500, // Reasonable response length
      top_p: 0.9,
      stream: false
    })

    // Extract and return the response
    const response = completion.choices[0]?.message?.content || 
      'I apologize, I encountered an issue. Please try asking your question again.'

    return response

  } catch (error) {
    console.error('AI Service Error:', error)
    
    // Provide user-friendly error messages
    if (error.message?.includes('API key')) {
      return 'AI service is not properly configured. Please check your API settings.'
    } else if (error.message?.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.'
    } else {
      return 'I\'m having trouble connecting right now. Please try again in a moment.'
    }
  }
}

/**
 * Stream AI response from Groq API (for future implementation)
 * @param {string} userMessage - The user's question
 * @param {Function} onChunk - Callback for each response chunk
 */
export async function streamAIResponse(userMessage, onChunk) {
  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an expert agricultural assistant.' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true
    })

    let fullResponse = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      fullResponse += content
      onChunk(content)
    }

    return fullResponse

  } catch (error) {
    console.error('Streaming Error:', error)
    throw error
  }
}
