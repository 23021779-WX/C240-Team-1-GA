import React, { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import ChatBot from './pages/ChatBot'
import Contact from './pages/Contact'

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
