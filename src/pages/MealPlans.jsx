import React, { useState, useEffect } from 'react'
import './MealPlans.css'

function MealPlans() {
  const [savedMealPlans, setSavedMealPlans] = useState([])

  useEffect(() => {
    // Load saved meal plans from localStorage
    const stored = localStorage.getItem('savedMealPlans')
    if (stored) {
      setSavedMealPlans(JSON.parse(stored))
    }
  }, [])

  const deleteMealPlan = (index) => {
    const updated = savedMealPlans.filter((_, i) => i !== index)
    setSavedMealPlans(updated)
    localStorage.setItem('savedMealPlans', JSON.stringify(updated))
  }

  const clearAllMealPlans = () => {
    if (window.confirm('Are you sure you want to delete all meal plans?')) {
      setSavedMealPlans([])
      localStorage.removeItem('savedMealPlans')
    }
  }

  return (
    <div className="meal-plans-page">
      <div className="meal-plans-container">
        <div className="meal-plans-header">
          <h1>My Meal Plans</h1>
          {savedMealPlans.length > 0 && (
            <button className="clear-all-button" onClick={clearAllMealPlans}>
              Clear All
            </button>
          )}
        </div>

        {savedMealPlans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h2>No Meal Plans Yet</h2>
            <p>Ask the chatbot for a meal plan and save it here!</p>
            <p className="hint">Try asking: "Create a 3-day meal plan for someone with nut allergies"</p>
          </div>
        ) : (
          <div className="meal-plans-list">
            {savedMealPlans.map((plan, index) => (
              <div key={index} className="meal-plan-card">
                <div className="meal-plan-header">
                  <div className="meal-plan-date">
                    <span className="date-icon">📅</span>
                    {new Date(plan.savedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <button 
                    className="delete-button" 
                    onClick={() => deleteMealPlan(index)}
                    title="Delete meal plan"
                  >
                    🗑️
                  </button>
                </div>
                <div className="meal-plan-content">
                  {plan.content.split('\n').map((line, i) => (
                    <div key={i} className="meal-plan-line">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MealPlans
