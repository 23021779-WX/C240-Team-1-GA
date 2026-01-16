import React, { useState, useEffect } from 'react'
import './MealPlans.css'

function MealPlans() {
  const [savedMealPlans, setSavedMealPlans] = useState([])
  const [activeMealTab, setActiveMealTab] = useState({})
  const [showFoodModal, setShowFoodModal] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)

  useEffect(() => {
    // Load saved meal plans from localStorage
    const stored = localStorage.getItem('savedMealPlans')
    if (stored) {
      setSavedMealPlans(JSON.parse(stored))
    }
  }, [])

  const openFoodInfo = (foodName) => {
    setSelectedFood(foodName)
    setShowFoodModal(true)
  }

  const closeFoodModal = () => {
    setShowFoodModal(false)
    setSelectedFood(null)
  }

  const askNomBotAboutFood = (foodName) => {
    const question = `Why is ${foodName} good for me and what are its health benefits?`
    localStorage.setItem('prefilledQuestion', question)
    window.location.href = '/nom-bot'
  }

  const togglePlanExpansion = (index) => {
    setActiveMealTab(prev => ({
      ...prev,
      [index]: prev[index] ? null : 'breakfast'
    }))
  }

  const parseMealPlan = (content) => {
    const mealCategories = {}
    let mealPlanNote = ''

    console.log('Parsing meal plan, content length:', content.length)

    const cleanLine = (text) => {
      return text
        .replace(/^[-*•\u2022]+\s*/, '') // remove bullet chars
        .replace(/^:\s*/, '') // remove leading colon
        .replace(/^\*\*/, '') // leading bold markers
        .replace(/\*\*$/, '') // trailing bold markers
        .trim()
    }

    // Extract note FIRST if it exists
    const noteMatch = content.match(/Note:\s*([\s\S]+?)(?=Day\s+2|$)/i)
    if (noteMatch) {
      mealPlanNote = noteMatch[1].trim()
    }

    // First try: split by newlines (for formatted responses)
    const lines = content.split('\n')
    let currentMeal = null
    let foundMeals = false
    let currentDay = 1

    lines.forEach((line) => {
      const trimmedLine = line.trim()
      
      if (!trimmedLine) return
      
      // Skip note lines
      if (trimmedLine.match(/^Note:/i)) return

      // Stop parsing once we reach Day 2+ to avoid mixing days into one card
      const dayMatch = trimmedLine.match(/^Day\s+(\d+)/i)
      if (dayMatch) {
        const dayNum = parseInt(dayMatch[1], 10)
        if (!isNaN(dayNum) && dayNum > 1) {
          currentMeal = null
          return
        }
        currentDay = dayNum || 1
        currentMeal = null
        return
      }
      
      // Check for meal headers: "Breakfast:", "Lunch:", "Dinner:", "Snack:"
      const mealMatch = trimmedLine.match(/^(breakfast|lunch|dinner|snack)[:\s-]+(.+)$/i)
      
      if (mealMatch) {
        foundMeals = true
        currentMeal = mealMatch[1].toLowerCase()
        if (!mealCategories[currentMeal]) {
          mealCategories[currentMeal] = []
        }
        
        // Get the full dish with attributes (everything after "Lunch: " or "Dinner: ")
        const dishPart = mealMatch[2].trim()
        // Extract just the dish name (everything before the opening parenthesis)
        const dishName = dishPart.split('(')[0].trim()
        
        if (dishName) {
          mealCategories[currentMeal].push(dishName)
        }
      } else if (currentMeal && trimmedLine && !trimmedLine.match(/^(breakfast|lunch|dinner|snack|day\s+\d+)/i)) {
        // Skip lines that are just attributes or part of previous dish
        const cleanedLine = cleanLine(trimmedLine)
        const isDishLine = !cleanedLine.match(/^[A-Z][A-Z]/) && !cleanedLine.match(/^(high|low|rich|lean|omega)/i)
        if (isDishLine) {
          const dishName = cleanedLine.split('(')[0].trim()
          if (dishName && dishName.length > 3) {
            mealCategories[currentMeal].push(dishName)
          }
        }
      }
    })

    // If newline parsing didn't work, try inline parsing (split by meal keywords)
    if (!foundMeals) {
      console.log('Trying inline parsing...')
      
      // Find all meal positions
      const breakfastIdx = content.toLowerCase().indexOf('breakfast')
      const lunchIdx = content.toLowerCase().indexOf('lunch')
      const dinnerIdx = content.toLowerCase().indexOf('dinner')
      const snackIdx = content.toLowerCase().indexOf('snack')
      const noteIdx = content.toLowerCase().indexOf('note:')

      // Cut at Note: or Day 2 - whichever comes first
      const day2Idx = content.toLowerCase().indexOf('day 2')
      const cutPoints = [noteIdx, day2Idx].filter(idx => idx !== -1)
      const sliceEnd = cutPoints.length > 0 ? Math.min(...cutPoints) : content.length

      if (breakfastIdx !== -1) {
        const nextMealIdx = Math.min(
          lunchIdx !== -1 ? lunchIdx : Infinity,
          dinnerIdx !== -1 ? dinnerIdx : Infinity,
          snackIdx !== -1 ? snackIdx : Infinity
        )
        const breakfastContent = nextMealIdx === Infinity 

          ? content.substring(breakfastIdx + 9, sliceEnd)
          : content.substring(breakfastIdx + 9, Math.min(nextMealIdx, sliceEnd))
        
        const items = breakfastContent.split(/Snack:|lunch|dinner/i)[0].trim()
        if (items) {
          mealCategories.breakfast = items.split(/[,•\-]/).map(item => {
            const cleaned = cleanLine(item)
            return cleaned.replace(/\s*\([^)]*\).*$/i, '').trim()
          }).filter(Boolean)
        }
      }

      if (lunchIdx !== -1) {
        const nextMealIdx = Math.min(
          dinnerIdx !== -1 ? dinnerIdx : Infinity,
          snackIdx !== -1 ? snackIdx : Infinity
        )
        const lunchContent = nextMealIdx === Infinity 
          ? content.substring(lunchIdx + 5, sliceEnd)
          : content.substring(lunchIdx + 5, Math.min(nextMealIdx, sliceEnd))
        
        const items = lunchContent.split(/Snack:|dinner|note:/i)[0].trim()
        if (items) {
          mealCategories.lunch = items.split(/[,•\-]/).map(item => {
            const cleaned = cleanLine(item)
            return cleaned.replace(/\s*\([^)]*\).*$/i, '').trim()
          }).filter(Boolean)
        }
      }

      if (dinnerIdx !== -1) {
        const nextMealIdx = snackIdx !== -1 ? snackIdx : Infinity
        const dinnerContent = nextMealIdx === Infinity 
          ? content.substring(dinnerIdx + 6, sliceEnd)
          : content.substring(dinnerIdx + 6, Math.min(nextMealIdx, sliceEnd))
        
        let dinnerText = dinnerContent.split(/Snack:|breakfast|lunch|note:|notes:/i)[0].trim()
        
        if (dinnerText) {
          let dinners = dinnerText.split(',').map(item => {
            const cleaned = cleanLine(item).trim()
            return cleaned
          }).filter(item => item && item.length > 2)
          mealCategories.dinner = dinners
        }
      }

      if (snackIdx !== -1) {
        const snackContent = content.substring(snackIdx + 5, sliceEnd)
        let snackText = snackContent.split(/breakfast|lunch|dinner|note:|notes:/i)[0].trim()
        
        if (snackText) {
          let snacks = snackText.split(',').map(item => {
            const cleaned = cleanLine(item).trim()
            return cleaned
          }).filter(item => item && item.length > 2)
          mealCategories.snack = snacks
        }
      }
    }

    console.log('Final parsed meals:', mealCategories)
    return { meals: mealCategories, note: mealPlanNote }
  }

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
            {savedMealPlans.map((plan, index) => {
              const parsedPlan = parseMealPlan(plan.content)
              const mealCategories = parsedPlan.meals
              const noteText = parsedPlan.note
              const activeMeal = activeMealTab[index]
              const isExpanded = activeMeal !== undefined && activeMeal !== null
              
              return (
                <div key={index} className="meal-plan-card">
                  <div className="meal-plan-header">
                    <div className="meal-plan-info">
                      <span className="date-icon">📅</span>
                      <div className="meal-plan-date">
                        {new Date(plan.savedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        <span className="meal-plan-time">
                          {new Date(plan.savedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="delete-button" 
                      onClick={() => deleteMealPlan(index)}
                      title="Delete meal plan"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Meal Cards - Click to expand */}
                  <div className="meals-list">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => {
                      const isActive = activeMeal === meal
                      const hasMeals = mealCategories[meal] && mealCategories[meal].length > 0
                      
                      if (!hasMeals) return null
                      
                      const mealText = mealCategories[meal].join(', ')
                      
                      return (
                        <div key={meal} className="meal-card-wrapper">
                          <button
                            className={`meal-card ${isActive ? 'active' : ''}`}
                            onClick={() => setActiveMealTab(prev => ({
                              ...prev,
                              [index]: activeMeal === meal ? null : meal
                            }))}
                          >
                            <div className="meal-card-header">
                              <span className="meal-card-icon">
                                {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : meal === 'dinner' ? '🌙' : '🍎'}
                              </span>
                              <div className="meal-card-info">
                                <h3 className="meal-card-title">{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
                              </div>
                            </div>
                            <span className="expand-icon">{isActive ? '▼' : '▶'}</span>
                          </button>

                          {/* Expanded meal content */}
                          {isActive && (
                            <div className="meal-content-box">
                              <p className="meal-text">{mealText}</p>
                              <button 
                                className="ask-about-meal-btn"
                                onClick={() => openFoodInfo(meal)}
                                title="Ask about this meal"
                              >
                                💡 Learn More
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Fallback for unparseable content */}
                  {isExpanded && activeMeal && !mealCategories[activeMeal] && (
                    <div className="meal-details">
                      <p className="no-data-text">No details available for this meal</p>
                    </div>
                  )}

                  {/* Note section at bottom */}
                  {noteText && (
                    <div className="meal-plan-note">
                      <p><strong>Note:</strong> {noteText}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Food Info Modal */}
      {showFoodModal && selectedFood && (
        <div className="modal-overlay" onClick={closeFoodModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Why is {selectedFood} good for you?</h2>
              <button className="modal-close" onClick={closeFoodModal}>✕</button>
            </div>
            <div className="modal-body">
              <p>Click below to ask Nom Bot about the health benefits of <strong>{selectedFood}</strong></p>
            </div>
            <div className="modal-footer">
              <button 
                className="ask-button"
                onClick={() => {
                  askNomBotAboutFood(selectedFood)
                }}
              >
                Ask Nom Bot 🤖
              </button>
              <button 
                className="cancel-button"
                onClick={closeFoodModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPlans
