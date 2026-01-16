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
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [pendingMealPlan, setPendingMealPlan] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editText, setEditText] = useState('')
  const [showToast, setShowToast] = useState(false)
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
      console.log('Sending to Flowise:', text)
      
      // Use configured Flowise host/id from window.flywiseConfig when available
      if (window.flywiseConfig) {
        try {
          const response = await fetch(`${window.flywiseConfig.apiHost}/api/v1/prediction/${window.flywiseConfig.chatflowid}`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
              question: text
            })
          })

          const data = await response.json()
          const responseText = data.text || data.message || "I processed your request."
          
          // Handle quota/limit or not found gracefully
          if (!data || (data.success === false && data.message)) {
            const msg = data.message.toLowerCase()
            if (msg.includes('limit') || msg.includes('quota')) {
              setMessages(prev => [...prev, { 
                type: 'bot', 
                text: `⚠️ Prediction limit reached on Flowise Cloud. Please try again later or switch to your Render instance.`
              }])
              setIsLoading(false)
              return
            }
          }
          
          // Check if it's a meal plan
          const lowerText = responseText.toLowerCase()
          const hasMealStructure = (lowerText.includes('breakfast') && lowerText.includes('lunch') && lowerText.includes('dinner'))
          const hasDayStructure = (lowerText.includes('day 1') && lowerText.includes('day 2')) || 
                                  (lowerText.includes('day 1') && lowerText.includes('day 3'))
          const isLongEnough = responseText.length > 200
          const isNotQuestion = !lowerText.includes('?') || lowerText.split('?').length <= 2
          
          const isMealPlan = (hasMealStructure || hasDayStructure) && isLongEnough && isNotQuestion
          
          const botMessage = {
            type: 'bot',
            text: responseText,
            isMealPlan: isMealPlan,
            mealPlanContent: isMealPlan ? responseText : null
          }
          setMessages(prev => [...prev, botMessage])
          setIsLoading(false)
          return
        } catch (libError) {
          console.error('Flowise embed library error:', libError)
          throw libError
        }
      }
      
      // Fallback to direct API call
      const chatflowId = (window.flywiseConfig?.chatflowid) || "5adbce9b-ad32-4f17-b9e5-10dbc8f77d8f"
      const configuredHost = window.flywiseConfig?.apiHost
      const apiHost = (configuredHost && configuredHost.startsWith('http')) ? configuredHost : "/flowise"
      const apiUrl = `${apiHost}/api/v1/prediction/${chatflowId}`
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({ 
          question: text
        })
      })

      console.log('Flowise response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Flowise error response:', errorText)
        console.error('Flowise URL:', apiUrl)
        
        // Temporary mock fallback if chatflow isn't found
        if (errorText.toLowerCase().includes('not found')) {
          const mockPlan = `Here’s a balanced 3-day meal plan:

Day 1
• Breakfast: Greek yogurt with blueberries and chia seeds
• Lunch: Grilled chicken salad (spinach, quinoa, cucumber, olive oil)
• Snack: Apple slices with sunflower seed butter
• Dinner: Baked salmon, sweet potato, steamed broccoli

Day 2
• Breakfast: Oatmeal with banana, cinnamon, and pumpkin seeds
• Lunch: Turkey and avocado wrap (whole wheat), side carrot sticks
• Snack: Rice cakes with hummus
• Dinner: Stir-fry tofu with brown rice and mixed veggies

Day 3
• Breakfast: Smoothie (spinach, pineapple, mango, oat milk)
• Lunch: Lentil soup with side salad (olive oil & lemon)
• Snack: Pear
• Dinner: Grilled shrimp, quinoa, roasted asparagus

Notes: No nuts included. Swap proteins as needed and adjust portions to your goals.`
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: mockPlan,
            isMealPlan: true,
            mealPlanContent: mockPlan
          }])
          setIsLoading(false)
          return
        }
        
        // Show the actual error to the user
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: `⚠️ Flowise Server Error (${response.status})\n\nThe chatflow is returning an error. This usually means:\n\n1. The chatflow ID might be incorrect or expired\n2. The chatflow isn't deployed in your Flowise dashboard\n3. There's a configuration issue in the chatflow\n\nError details: ${errorText.substring(0, 200)}\n\nPlease check your Flowise dashboard at https://cloud.flowiseai.com and verify:\n- The chatflow exists\n- It's deployed (green status)\n- The ID matches: ${chatflowId}`
        }])
        setIsLoading(false)
        return
      }

      const data = await response.json()
      console.log('Flowise response data:', data)
      
      // Handle different response formats from Flowise
      const responseText = data.text || data.message || data.json?.text || "I processed your request but didn't get a text response."
      
      const botMessage = {
        type: 'bot',
        text: typeof responseText === 'string' ? responseText : JSON.stringify(responseText)
      }
      setMessages(prev => [...prev, botMessage])
      
      // Check if the response is an actual meal plan
      const lowerText = botMessage.text.toLowerCase()
      const hasMealStructure = (lowerText.includes('breakfast') && lowerText.includes('lunch') && lowerText.includes('dinner'))
      const hasDayStructure = (lowerText.includes('day 1') && lowerText.includes('day 2')) || 
                              (lowerText.includes('day 1') && lowerText.includes('day 3'))
      const isLongEnough = botMessage.text.length > 200
      const isNotQuestion = !lowerText.includes('?') || lowerText.split('?').length <= 2
      
      if ((hasMealStructure || hasDayStructure) && isLongEnough && isNotQuestion) {
        setPendingMealPlan(botMessage.text)
        setShowSaveModal(true)
      }
    } catch (error) {
      console.error('Flowise API error:', error)
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `❌ Connection Error\n\nUnable to reach the Flowise server. Please make sure:\n\n1. Your Flowise server is running (cloud or render)\n2. The chatflow ID is correct: ${window.flywiseConfig?.chatflowid || chatflowId}\n3. The chatflow is deployed in your Flowise dashboard\n\nError: ${error.message}`
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

  // Save Meal Plan Function
  const saveMealPlan = () => {
    if (!pendingMealPlan) return
    
    const existingPlans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]')
    const newPlan = {
      content: pendingMealPlan,
      savedAt: new Date().toISOString()
    }
    existingPlans.unshift(newPlan) // Add to beginning
    localStorage.setItem('savedMealPlans', JSON.stringify(existingPlans))
    
    setShowSaveModal(false)
    setPendingMealPlan(null)
    
    // Show toast notification
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const dismissModal = () => {
    setShowSaveModal(false)
    setPendingMealPlan(null)
  }

  // Edit Message Functions
  const startEditing = (index, text) => {
    setEditingIndex(index)
    setEditText(text)
  }

  const cancelEditing = () => {
    setEditingIndex(null)
    setEditText('')
  }

  const submitEdit = async (index) => {
    if (!editText.trim()) return

    // Remove all messages after the edited message
    const newMessages = messages.slice(0, index)
    setMessages(newMessages)
    setEditingIndex(null)
    setEditText('')
    
    // Process the edited message
    await processMessage(editText)
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
              {message.type === 'bot' && (
                <div className="message-avatar">
                  <img src="/nomnom-logo.png" alt="Nom Nom Bot" className="bot-avatar-img" />
                </div>
              )}
              {editingIndex === index ? (
                <div className="edit-message-container">
                  <textarea
                    className="edit-message-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        submitEdit(index)
                      }
                      if (e.key === 'Escape') {
                        cancelEditing()
                      }
                    }}
                    autoFocus
                  />
                  <div className="edit-message-buttons">
                    <button className="edit-save-btn" onClick={() => submitEdit(index)}>
                      ✓ Save
                    </button>
                    <button className="edit-cancel-btn" onClick={cancelEditing}>
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="message-bubble">
                  {message.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  {message.type === 'user' && (
                    <button 
                      className="edit-button" 
                      onClick={() => startEditing(index, message.text)}
                      title="Edit message"
                    >
                      ✏️
                    </button>
                  )}
                  {message.isMealPlan && message.type === 'bot' && (
                    <button 
                      className="save-meal-plan-button"
                      onClick={() => {
                        setPendingMealPlan(message.mealPlanContent)
                        setShowSaveModal(true)
                      }}
                      title="Save this meal plan"
                    >
                      💾 Save Meal Plan
                    </button>
                  )}
                </div>
              )}
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
              <div className="message-avatar">
                <img src="/nomnom-logo.png" alt="Nom Nom Bot" className="bot-avatar-img" />
              </div>
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

      {/* Save Meal Plan Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={dismissModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>💾 Save Meal Plan?</h2>
            <p>Would you like to save this meal plan to your collection?</p>
            <div className="modal-buttons">
              <button className="modal-btn save-btn" onClick={saveMealPlan}>
                Yes, Save It!
              </button>
              <button className="modal-btn cancel-btn" onClick={dismissModal}>
                No, Thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <span className="toast-icon">✓</span>
          <span className="toast-message">Meal plan saved! View in "My Meal Plans"</span>
        </div>
      )}
    </div>
  )
}

export default ChatBot