# Flowwise Chatbot Integration Guide

This guide explains how to integrate your Flowwise chatbot with the NutriGuide application.

## Step-by-Step Integration

### 1. Prepare Your Flowwise Chatbot

1. Log into your Flowwise dashboard
2. Create or select your dietary/allergy chatbot
3. Configure your bot with the following intents:
   - Allergy identification
   - Food recommendations
   - Symptom assessment
   - Emergency response guidance
   - Dietary restrictions

4. Get your bot credentials:
   - **Bot ID**: Found in bot settings
   - **API Key**: Generate in authentication settings
   - **API Endpoint**: Your Flowwise API URL (usually `https://your-domain.com/api`)

### 2. Method A: REST API Integration (Recommended)

Update `src/pages/ChatBot.jsx` with the following:

```javascript
import React, { useState, useEffect, useRef } from 'react'
import './ChatBot.css'

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! 👋 I\'m your Dietary & Allergy Assistant. How can I help you today?'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Configuration
  const FLOWWISE_API_URL = import.meta.env.VITE_FLOWWISE_API_URL || 'YOUR_FLOWWISE_API_URL'
  const FLOWWISE_BOT_ID = import.meta.env.VITE_FLOWWISE_BOT_ID || 'YOUR_BOT_ID'
  const FLOWWISE_API_KEY = import.meta.env.VITE_FLOWWISE_API_KEY || 'YOUR_API_KEY'

  useEffect(() => {
    const prefilledQuestion = localStorage.getItem('prefilledQuestion')
    if (prefilledQuestion) {
      setInputValue(prefilledQuestion)
      localStorage.removeItem('prefilledQuestion')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    const userMessage = {
      type: 'user',
      text: inputValue
    }
    setMessages([...messages, userMessage])
    const userInput = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      // Call Flowwise API
      const response = await fetch(`${FLOWWISE_API_URL}/api/v1/prediction/${FLOWWISE_BOT_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FLOWWISE_API_KEY}`,
        },
        body: JSON.stringify({
          question: userInput,
          sessionId: 'user-session-' + Date.now(), // Generate unique session
          // Additional parameters specific to your Flowwise bot
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      const data = await response.json()
      
      const botMessage = {
        type: 'bot',
        text: data.text || data.answer || 'I understood your question but couldn\'t generate a response.'
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error calling Flowwise API:', error)
      const errorMessage = {
        type: 'bot',
        text: 'I apologize, but I encountered an error. Please try again or contact our support team at support@nutriguide.com'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Rest of the component remains the same...
}
```

### 3. Method B: Flowwise Embed Widget

If you prefer using Flowwise's embedded widget:

```javascript
import React, { useEffect } from 'react'
import './ChatBot.css'

function ChatBot() {
  useEffect(() => {
    // Load Flowwise embed script
    const script = document.createElement('script')
    script.src = 'https://cdn.flowiseai.com/flowiseai.min.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="chatbot-page">
      <div className="chatbot-embed">
        <iframe
          src="YOUR_FLOWWISE_EMBED_URL"
          title="NutriGuide Chatbot"
          width="100%"
          height="100%"
          frameBorder="0"
          allow="microphone; camera"
        />
      </div>
    </div>
  )
}

export default ChatBot
```

### 4. Set Environment Variables

Create a `.env` file in the project root:

```
VITE_FLOWWISE_API_URL=https://your-flowwise-domain.com
VITE_FLOWWISE_BOT_ID=your_bot_id_here
VITE_FLOWWISE_API_KEY=your_api_key_here
```

Restart your development server after adding `.env`:
```bash
npm run dev
```

### 5. Testing the Integration

1. Start the development server: `npm run dev`
2. Navigate to the Chat Bot page
3. Test with sample queries:
   - "What foods should I avoid if I have an egg allergy?"
   - "I have just eaten a pineapple tart, and my skin started itching. What do I do?"
   - "Is gluten-free bread better for me?"

## Common Flowwise API Response Formats

### Format 1: Simple Text Response
```json
{
  "text": "Your response here"
}
```

### Format 2: With Metadata
```json
{
  "answer": "Your response here",
  "sourceDocuments": [...],
  "confidenceScore": 0.95
}
```

### Format 3: Message Object
```json
{
  "message": {
    "text": "Your response here",
    "timestamp": "2024-01-06T10:00:00Z"
  }
}
```

Adjust the data extraction in the API call to match your Flowwise response format.

## Troubleshooting

### Issue: CORS Errors
**Solution**: Ensure your Flowwise API allows requests from your frontend domain. Configure CORS in your Flowwise settings.

### Issue: Authentication Failed
**Solution**: Double-check your API key and Bot ID. Make sure they're correctly set in your `.env` file.

### Issue: Empty Responses
**Solution**: Verify that your Flowwise bot is properly trained with dietary and allergy knowledge base.

### Issue: Rate Limiting
**Solution**: Implement request throttling or contact Flowwise support for higher rate limits.

## Security Best Practices

1. **Never commit API keys**: Use `.env` files and add `.env` to `.gitignore`
2. **Use HTTPS**: Always communicate with Flowwise over HTTPS
3. **Validate inputs**: Sanitize user input before sending to the API
4. **Handle errors gracefully**: Never expose sensitive error details to users
5. **Session management**: Use unique session IDs for each user conversation

## Performance Optimization

1. **Implement caching**: Cache common questions and answers
2. **Debounce API calls**: Prevent rapid successive requests
3. **Lazy load**: Load the chat component only when needed
4. **Connection pooling**: Reuse HTTP connections for multiple requests

## Advanced Configuration

### Custom User Session Data
```javascript
const sessionData = {
  userId: 'user123',
  timestamp: new Date().toISOString(),
  deviceType: 'web',
  // Add custom fields as needed
}
```

### Conversation Context
```javascript
// Store conversation history for context
const conversationHistory = messages.map(msg => ({
  role: msg.type === 'user' ? 'user' : 'assistant',
  content: msg.text
}))

// Send with request for better contextual responses
body: JSON.stringify({
  question: userInput,
  conversationHistory: conversationHistory,
  sessionId: sessionId
})
```

## Additional Resources

- [Flowwise Documentation](https://docs.flowiseai.com)
- [Flowwise API Reference](https://docs.flowiseai.com/api)
- [NutriGuide README](./README.md)

## Support

For questions or issues, reach out to:
- Email: support@nutriguide.com
- Documentation: Check the main README.md
- Flowwise Support: Visit Flowwise documentation
