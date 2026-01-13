import React, { useState, useEffect, useRef, useCallback } from 'react'
import './ChatBot.css'

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! 👋 I'm your Dietary & Allergy Assistant. How can I help you today?"
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])


  const processMessage = useCallback(async (text) => {
    if (!text.trim()) return

    const userMessage = { type: 'user', text: text }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(
        "https://cloud.flowiseai.com/api/v1/prediction/617939d8-9683-4912-9217-37e0a5cec840",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: text
          })
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const botMessage = {
        type: 'bot',
        text: data.text || data.json || "I processed your request but didn't get a text response."
      }

      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error("Flowwise Error:", error)
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: "I'm having trouble connecting to the server. Please check your connection or try again later." 
      }])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const textToSend = inputValue
    setInputValue('')
    processMessage(textToSend)
  }

  useEffect(() => {
    const prefilledQuestion = localStorage.getItem('prefilledQuestion')
    if (prefilledQuestion) {
      localStorage.removeItem('prefilledQuestion')
      processMessage(prefilledQuestion)
    }
  }, [processMessage])

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h2>Dietary & Allergy Chat Assistant</h2>
          <p>Powered by NutriGuide AI</p>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message message-${message.type}`}>
              <div className="message-content">
                <span className="message-icon">
                  {message.type === 'bot' ? '🤖' : '👤'}
                </span>
                <div className="message-text">
                  {message.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message message-bot">
              <div className="message-content">
                <span className="message-icon">🤖</span>
                <div className="message-text loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about allergies, dietary needs..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isLoading || !inputValue.trim()}
          >
            Send
          </button>
        </form>

        <div className="chatbot-footer">
          <p>⚠️ This chatbot provides general information only. Always consult with a healthcare professional.</p>
        </div>
      </div>
    </div>
  )
}

export default ChatBot