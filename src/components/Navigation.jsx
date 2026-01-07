import React from 'react'
import './Navigation.css'

function Navigation({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-section">
          <div className="logo-placeholder">
            <span className="logo-text">🥗</span>
            <span className="company-name">NutriGuide</span>
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
              className={`nav-link ${currentPage === 'chatbot' ? 'active' : ''}`}
              onClick={() => setCurrentPage('chatbot')}
            >
              Chat Bot
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => setCurrentPage('contact')}
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
