import React, { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import ChatBot from './pages/ChatBot'
import Contact from './pages/Contact'
import Questions from './pages/Questions'
// 1. Import your new page component
import UnderstandingAllergies from './pages/UnderstandingAllergies'
import MealPlans from './pages/MealPlans' 

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Check URL for page parameter
    const params = new URLSearchParams(window.location.search)
    return params.get('page') || 'home'
  })

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />
      case 'questions':
        return <Questions setCurrentPage={setCurrentPage} />
      case 'chatbot':
        return <ChatBot />
      case 'contact':
        return <Contact />
      // 2. Add this case to handle the new page
      // Make sure the string 'understandingAllergies' matches your Navigation.jsx exactly
      case 'understandingAllergies':
        return <UnderstandingAllergies />
      case 'mealPlans':
        return <MealPlans />
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