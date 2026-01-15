import React, { useRef, useState, useEffect } from 'react'
import './Home.css'
import SampleQuestions from '../components/SampleQuestions'

function Home({ setCurrentPage }) {
  const questionsRef = useRef(null)
  const [showButton, setShowButton] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowButton(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (questionsRef.current) {
      observer.observe(questionsRef.current)
    }

    return () => {
      if (questionsRef.current) {
        observer.unobserve(questionsRef.current)
      }
    }
  }, [])

  const scrollToQuestions = () => {
    questionsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home">
      <button 
        className={`floating-questions-btn ${!showButton ? 'hidden' : ''}`} 
        onClick={scrollToQuestions}
      >
        <span>↓</span>
        <span className="btn-text">Common Questions</span>
      </button>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">99.9% Safety Accuracy</div>
            <h1>Eat with Confidence.</h1>
            <p className="hero-subtitle">
              Premium allergy safety and bespoke meal curation. Let our intelligence layer verify every bite.
            </p>
            <button
              className="cta-button"
              onClick={() => setCurrentPage('chatbot')}
            >
              ACCESS ASSISTANT
            </button>
          </div>

          <div className="hero-visual">
            <img
              src="/hero-foods.jpg"
              alt="Fresh ingredients representing safe, curated meals"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="curated-section">
        <div className="curated-content">
          <h2>Confidently Curated.</h2>
          <p>Precision intelligence applied to every culinary choice.</p>
        </div>
      </section>

      <section className="safe-selection">
        <h2 className="section-title">The Art of Safe Selection</h2>
        <p className="section-description">
          We've eliminated the anxiety of ingredient verification. Our system curates bespoke weekly menus that strictly honor your dietary safety profile.
        </p>
        <div className="features-grid">
          <div className="feature-item">
            <h4>VERIFICATION</h4>
            <p>Multi-layer safety checks for every recipe in your library.</p>
          </div>
          <div className="feature-item">
            <h4>OPTIMIZATION</h4>
            <p>Nutrient density scaled to your activity level and goals.</p>
          </div>
        </div>
        <button 
          className="cta-button"
          onClick={() => setCurrentPage('chatbot')}
        >
          START PLANNING
        </button>
      </section>

      <div ref={questionsRef}>
        <SampleQuestions setCurrentPage={setCurrentPage} />
      </div>
    </div>
  )
}

export default Home
