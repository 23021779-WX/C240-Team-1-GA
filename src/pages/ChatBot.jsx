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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)

  const sampleQuestions = [
    "What foods should I avoid if I have an egg allergy?",
    "Symptoms of a nut allergy?",
    "Is gluten-free bread better for me?",
    "How to check for cross-contamination?",
    "What to do if I suspect a shellfish allergy?",
    "Hidden names for dairy on labels?"
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const processMessage = useCallback(async (text) => {
    if (!text.trim()) return

    const userMessage = { type: 'user', text: text }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setIsSidebarOpen(false)

    try {
      const response = await fetch(
        "https://cloud.flowiseai.com/api/v1/prediction/617939d8-9683-4912-9217-37e0a5cec840",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text })
        }
      )

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      const botMessage = {
        type: 'bot',
        text: data.text || data.json || "I processed your request but didn't get a text response."
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: "I'm having trouble connecting to the server. Please try again later." 
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

  // Clear Chat Function
  const clearChat = () => {
    setMessages([{
      type: 'bot',
      text: "Hello! 👋 I'm your Dietary & Allergy Assistant. How can I help you today?"
    }])
    setIsSidebarOpen(false)
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
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
        <h3>Sample Questions</h3>
        <div className="sidebar-questions">
          {sampleQuestions.map((q, i) => (
            <button key={i} className="sidebar-q-btn" onClick={() => processMessage(q)}>
              {q}
            </button>
          ))}
        </div>
        
        <button className="clear-chat-btn" onClick={clearChat}>
          🗑️ Clear Conversation
        </button>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <div className="chatbot-container">
        <div className="chatbot-header">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <div className="header-text">
            <h2>Dietary Assistant</h2>
            <p>Powered by NutriGuide AI</p>
          </div>
        </div>

        <div className="safety-disclaimer">
          <span className="warning-icon">⚠️</span>
          <p>
            AI may provide inaccurate information. <strong>Always</strong> consult a medical professional for health concerns.
          </p>
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
                <div className="message-text loading"><span></span><span></span><span></span></div>
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
            placeholder="Ask me anything..."
            className="chat-input"
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading || !inputValue.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBot