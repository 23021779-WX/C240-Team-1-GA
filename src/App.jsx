import React, { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import ChatBot from './pages/ChatBot'
import Contact from './pages/Contact'
// 1. Import your new page component
import UnderstandingAllergies from './pages/UnderstandingAllergies' 

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />
      case 'chatbot':
        return <ChatBot />
      case 'contact':
        return <Contact />
      // 2. Add this case to handle the new page
      // Make sure the string 'understandingAllergies' matches your Navigation.jsx exactly
      case 'understandingAllergies':
        return <UnderstandingAllergies />
      default:
        return <Home setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="app">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App