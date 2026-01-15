import React from 'react'
import './WellnessTools.css'

function WellnessTools({ setCurrentPage }) {
  const handleFeatureClick = (question) => {
    localStorage.setItem('prefilledQuestion', question)
    setCurrentPage('chatbot')
  }

  return (
    <div className="wellness-tools-page">
      <div className="wellness-hero">
        <h1>Tools for Wellness</h1>
        <p>Explore our AI-powered tools designed to help you navigate dietary needs and allergies</p>
      </div>
      
      <div className="wellness-content">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Allergy Detection</h3>
            <p>Learn about potential allergies and foods to avoid based on your symptoms.</p>
            <button 
              className="feature-card-btn"
              onClick={() => handleFeatureClick('What are the symptoms of a nut allergy?')}
            >
              Ask About Allergies
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3>Dietary Guidance</h3>
            <p>Get personalized dietary recommendations for your specific health needs.</p>
            <button 
              className="feature-card-btn"
              onClick={() => handleFeatureClick('What are safe food substitutes for common allergies?')}
            >
              Get Recommendations
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Instant Support</h3>
            <p>Chat with our AI assistant anytime, anywhere for quick answers.</p>
            <button 
              className="feature-card-btn"
              onClick={() => setCurrentPage('chatbot')}
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WellnessTools
