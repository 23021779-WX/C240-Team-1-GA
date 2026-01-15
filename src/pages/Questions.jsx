import React from 'react'
import './Questions.css'

function Questions({ setCurrentPage }) {
  const handleFeatureClick = (question) => {
    localStorage.setItem('prefilledQuestion', question)
    setCurrentPage('chatbot')
  }

  return (
    <div className="wellness-tools-page">
      <section className="wellness-tools">
        <div className="tools-header">
          <h1>Tools for Wellness</h1>
          <p className="wellness-subtitle">NEURAL INTELLIGENCE PROTOCOLS</p>
        </div>
        <div className="tools-container">
          <div className="tool-card">
            <div className="tool-icon">📋</div>
            <h3>The Planner</h3>
            <p>Bespoke weekly menu curation prioritizing your specific dietary needs.</p>
            <button 
              className="tool-btn"
              onClick={() => handleFeatureClick('Create a 3-day meal plan for me')}
            >
              DEPLOY AI
            </button>
          </div>

          <div className="tool-card">
            <div className="tool-icon">🔍</div>
            <h3>The Scanner</h3>
            <p>Instantly decode ingredient labels to detect hidden allergen threats.</p>
            <button 
              className="tool-btn"
              onClick={() => handleFeatureClick('Check for hidden nut allergens in this ingredient list')}
            >
              DEPLOY AI
            </button>
          </div>

          <div className="tool-card">
            <div className="tool-icon">🎯</div>
            <h3>The Goal</h3>
            <p>High-performance protein discovery optimized for your lifestyle.</p>
            <button 
              className="tool-btn"
              onClick={() => handleFeatureClick('High protein dinner ideas')}
            >
              DEPLOY AI
            </button>
          </div>
        </div>
      </section>

      <section className="wellness-info">
        <div className="info-content">
          <h2>Confidently Curated.</h2>
          <p>Precision intelligence applied to every culinary choice.</p>
          <div className="info-badges">
            <span className="badge">PURE HEALTH</span>
            <span className="badge">VERIFIED</span>
          </div>
          <h4>STRATEGIC WELLNESS</h4>
        </div>
      </section>
    </div>
  )
}

export default Questions
