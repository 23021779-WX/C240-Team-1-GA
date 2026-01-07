import React from 'react'
import './Home.css'
import SampleQuestions from '../components/SampleQuestions'

function Home({ setCurrentPage }) {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to NutriGuide</h1>
          <p>Your Personal Dietary & Allergy Assistant</p>
          <p className="hero-subtitle">
            Get instant answers to your dietary and allergy-related questions with our AI-powered chatbot.
          </p>
          <button
            className="cta-button"
            onClick={() => setCurrentPage('chatbot')}
          >
            Start Chatting Now
          </button>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Allergy Detection</h3>
            <p>Learn about potential allergies and foods to avoid based on your symptoms.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3>Dietary Guidance</h3>
            <p>Get personalized dietary recommendations for your specific health needs.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Instant Support</h3>
            <p>Chat with our AI assistant anytime, anywhere for quick answers.</p>
          </div>
        </div>
      </section>

      <SampleQuestions setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default Home
