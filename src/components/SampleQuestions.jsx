import React from 'react'
import './SampleQuestions.css'

function SampleQuestions({ setCurrentPage }) {
  const questions = [
    "What foods should I avoid if I have an egg allergy?",
    "I have just eaten a pineapple tart, and my skin started itching. What do I do?",
    "What are the symptoms of a nut allergy?",
    "Is gluten-free bread better for me?",
    "What should I do if I suspect a shellfish allergy?",
    "Can I have a reaction to cross-contaminated foods?"
  ]

  const handleQuestionClick = (question) => {
    setCurrentPage('chatbot')
    // Store the question to be pre-filled in the chat
    localStorage.setItem('prefilledQuestion', question)
  }

  return (
    <section className="sample-questions">
      <div className="sample-questions-container">
        <h2>Common Questions</h2>
        <p className="section-subtitle">Click any question below to ask our chatbot</p>

        <div className="questions-grid">
          {questions.map((question, index) => (
            <button
              key={index}
              className="question-card"
              onClick={() => handleQuestionClick(question)}
            >
              <span className="question-number">Q{index + 1}</span>
              <p>{question}</p>
              <span className="arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SampleQuestions
