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

  useEffect(() => {
    // Check for prefilled question from sample questions
    const prefilledQuestion = localStorage.getItem('prefilledQuestion')
    if (prefilledQuestion) {
      setInputValue(prefilledQuestion)
      localStorage.removeItem('prefilledQuestion')
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputValue
    }
    setMessages([...messages, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate bot response delay and integrate with Flowwise
    setTimeout(() => {
      const botMessage = {
        type: 'bot',
        text: generateBotResponse(inputValue)
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 800)
  }

  const generateBotResponse = (userInput) => {
    // This is a placeholder function that generates responses
    // In production, this would call your Flowwise chatbot API
    
    const input = userInput.toLowerCase()

    if (input.includes('egg') && input.includes('allergy')) {
      return 'For an egg allergy, you should avoid:\n• Eggs (all forms)\n• Mayonnaise\n• Baked goods containing eggs\n• Pasta\n• Omelets and custards\n• Some salad dressings\n\nAlways check ingredient labels and inform restaurants about your allergy. 🥚'
    }

    if (input.includes('pineapple') && input.includes('itch')) {
      return 'Itching after eating pineapple tart may indicate a pineapple allergy. Here\'s what you should do:\n\n1. Stop eating immediately\n2. Monitor symptoms closely\n3. If itching is severe or spreads, take an antihistamine\n4. Seek medical attention if symptoms worsen (swelling, difficulty breathing)\n5. Consider getting an allergy test\n6. Avoid pineapple until confirmed safe\n\nDo you have any other symptoms? 🍍'
    }

    if (input.includes('symptom')) {
      return 'Common allergy symptoms include:\n• Itching or tingling in mouth\n• Swelling of lips, tongue, or throat\n• Hives or skin rash\n• Stomach cramps or nausea\n• Difficulty breathing (severe)\n\nIf you\'re experiencing severe symptoms, please seek immediate medical attention! Is there a specific symptom you\'re concerned about?'
    }

    if (input.includes('shellfish') && input.includes('allergy')) {
      return 'If you suspect a shellfish allergy:\n• Avoid all shellfish (shrimp, crab, lobster, oysters, mussels)\n• Check processed foods and Asian sauces\n• Inform restaurants about your allergy\n• Have an antihistamine available\n• Consider carrying an EpiPen if severe\n• Get tested by an allergist\n\nWould you like more information about shellfish cross-contamination?'
    }

    if (input.includes('gluten')) {
      return 'Gluten-free bread can be beneficial if you:\n• Have Celiac disease\n• Have non-celiac gluten sensitivity\n• Have a wheat allergy\n\nHowever, always check labels for:\n• Nutritional content\n• Potential additives\n• Cross-contamination risks\n\nConsult a dietitian for personalized advice! Do you have specific dietary concerns?'
    }

    if (input.includes('cross-contamin')) {
      return 'Cross-contamination is a serious concern for allergies:\n• Food can pick up allergens from shared cooking surfaces\n• Shared utensils and cutting boards pose risks\n• Airborne particles can travel\n• Always inform restaurants and hosts\n• Use separate preparation areas\n• Wash hands thoroughly after contact\n\nHow severe is your allergy? This will help determine precautions needed.'
    }

    return 'Thank you for your question! To give you the most accurate information, could you please provide more details about:\n• Your specific allergy or dietary concern?\n• Any symptoms you\'re experiencing?\n• Foods involved?\n\nI\'m here to help! 💚'
  }

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
            placeholder="Ask me about allergies, dietary needs, or food safety..."
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
          <p>⚠️ This chatbot provides general information only. Always consult with a healthcare professional for medical advice.</p>
        </div>
      </div>
    </div>
  )
}

export default ChatBot