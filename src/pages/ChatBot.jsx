import React, { useState, useEffect, useRef, useCallback } from 'react'
import './ChatBot.css'

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! I am Nom Nom. I am here to help you eat safely and feel your best. What are we looking at today?"
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [questionHistory, setQuestionHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef(null)

  const sampleQuestions = [
    "CREATE A 3-DAY MEAL PLAN",
    "CHECK FOR HIDDEN NUT ALLERGENS",
    "HIGH PROTEIN DINNER IDEAS",
    "SCAN INGREDIENTS LIST"
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
    setShowHistory(false)

    // Add to history
    setQuestionHistory(prev => {
      const newHistory = [text, ...prev.filter(q => q !== text)]
      return newHistory.slice(0, 10) // Keep only last 10 questions
    })

    try {
      const response = await fetch(
        "https://cloud.flowiseai.com/api/v1/prediction/4cb1a442-92b0-4fd7-9509-62b00935446d",
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
      text: "Hi! I am Nom Nom. I am here to help you eat safely and feel your best. What are we looking at today?"
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
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="header-content">
            <h1>NOM BOT</h1>
          </div>
          <div className="header-buttons">
            <button 
              className="history-button" 
              onClick={() => setShowHistory(!showHistory)}
            >
              <span>📝</span> History
            </button>
            <button className="reset-button" onClick={clearChat}>
              Reset
            </button>
          </div>
        </div>

        {showHistory && questionHistory.length > 0 && (
          <div className="history-dropdown">
            <h3>Previously Asked Questions</h3>
            <div className="history-list">
              {questionHistory.map((question, index) => (
                <button
                  key={index}
                  className="history-item"
                  onClick={() => {
                    setInputValue(question)
                    setShowHistory(false)
                  }}
                >
                  <span className="history-icon">↩</span>
                  <span className="history-text">{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showHistory && questionHistory.length === 0 && (
          <div className="history-dropdown">
            <p className="no-history">No questions asked yet</p>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message message-${message.type}`}>
              {message.type === 'bot' && <div className="message-avatar">🤖</div>}
              <div className="message-bubble">
                {message.text.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ))}
          {messages.length === 1 && (
            <div className="starter-prompts">
              <div className="prompts-grid">
                {sampleQuestions.map((q, i) => (
                  <button
                    key={i}
                    className="starter-prompt-btn"
                    onClick={() => processMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isLoading && (
            <div className="message message-bot">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble loading">
                <span></span><span></span><span></span>
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