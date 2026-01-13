import React, { useState } from 'react';
import './UnderstandingAllergies.css'; // We'll add game-specific CSS here

const AllergenDetective = () => {
  const [gameState, setGameState] = useState('start'); // start, playing, finished
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const rounds = [
    {
      target: "Dairy Allergy",
      product: "Vegan Protein Bar",
      ingredients: ["Pea Protein", "Agave Syrup", "Whey Protein", "Cocoa"],
      isSafe: false,
      reason: "Whey is a protein found in milk!"
    },
    {
      target: "Egg Allergy",
      product: "Store-bought Mayo",
      ingredients: ["Canola Oil", "Vinegar", "Lemon Juice", "Albumin"],
      isSafe: false,
      reason: "Albumin is a protein found in egg whites!"
    },
    {
      target: "Wheat Allergy",
      product: "Asian Stir-fry Sauce",
      ingredients: ["Soy Sauce", "Ginger", "Garlic", "Sesame Oil"],
      isSafe: false,
      reason: "Traditional Soy Sauce contains wheat!"
    },
    {
      target: "Nut Allergy",
      product: "Energy Bites",
      ingredients: ["Oats", "Honey", "Chia Seeds", "Sunflower Butter"],
      isSafe: true,
      reason: "Sunflower butter is a safe nut-free alternative!"
    },
    {
      target: "Shellfish Allergy",
      product: "Caesar Dressing",
      ingredients: ["Olive Oil", "Egg Yolk", "Parmesan", "Anchovies"],
      isSafe: true,
      reason: "Anchovies are fish, not shellfish. Usually safe, but be careful!"
    }
  ];

  const handleAnswer = (userSaidSafe) => {
    const round = rounds[currentRound];
    const correct = userSaidSafe === round.isSafe;

    if (correct) {
      setScore(s => s + 1);
      setFeedback({ type: 'correct', message: `Correct! ${round.reason}` });
    } else {
      setFeedback({ type: 'wrong', message: `Not quite. ${round.reason}` });
    }
  };

  const nextRound = () => {
    setFeedback(null);
    if (currentRound + 1 < rounds.length) {
      setCurrentRound(r => r + 1);
    } else {
      setGameState('finished');
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentRound(0);
    setGameState('playing');
    setFeedback(null);
  };

  return (
    <div className="game-container">
      {gameState === 'start' && (
        <div className="game-card start-screen">
          <h1>🕵️‍♂️ Allergen Detective</h1>
          <br />
          <p>Test your knowledge! Can you spot the hidden allergens in these ingredient lists?</p>
          <br />
          <button className="cta-button" onClick={() => setGameState('playing')}>Start Game</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-card">
          <div className="game-header">
            <span>Round {currentRound + 1} of {rounds.length}</span>
            <br />
            <span className="game-score">Score: {score}</span>
          </div>

          <div className="game-content">
            <p className="target-label">Target Allergy: <strong style={{ color: '#d63031' }}>{rounds[currentRound].target}</strong></p>
            <div className="product-box">
              <h3>{rounds[currentRound].product}</h3>
              <div className="ingredients-list">
                {rounds[currentRound].ingredients.map((ing, i) => (
                  <span key={i} className="ingredient-tag">{ing}</span>
                ))}
              </div>
            </div>

            {!feedback ? (
              <div className="game-actions">
                <button className="game-btn safe" onClick={() => handleAnswer(true)}>✅ It's Safe</button>
                <button className="game-btn danger" onClick={() => handleAnswer(false)}>❌ Danger!</button>
              </div>
            ) : (
              <div className={`feedback-box ${feedback.type}`}>
                <p>{feedback.message}</p>
                <button className="cta-button" onClick={nextRound}>Next Question</button>
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-card finished-screen">
          <h2>Game Over!</h2>
          <div className="final-score">{score} / {rounds.length}</div>
          <p>{score === rounds.length ? "Perfect Score! You're a pro." : "Keep practicing to keep yourself safe!"}</p>
          <button className="cta-button" onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default AllergenDetective;