import React from 'react'
import './Navigation.css'

function Navigation({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-section" onClick={() => setCurrentPage('home')} style={{cursor: 'pointer'}}>
          <div className="logo-placeholder">
            <img 
              src="/nomnom-logo.png" 
              height="40"
              width='40'
              alt="NomNom Bot Logo" 
              className="nav-logo-img" 
            />
            <span className="company-name">NOM NOM</span>
          </div>
        </div>

        <ul className="nav-menu">
          <li>
            <button
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              Home
            </button>
          </li> 

          <li>
            <button
              className={`nav-link ${currentPage === 'questions' ? 'active' : ''}`}
              onClick={() => setCurrentPage('questions')}
            >
              Wellness Tools
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${currentPage === 'chatbot' ? 'active' : ''}`}
              onClick={() => setCurrentPage('chatbot')}
            >
              Chat Bot
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'understandingAllergies' ? 'active' : ''}`}
              onClick={() => setCurrentPage('understandingAllergies')}
            >
              Allergen Game
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation