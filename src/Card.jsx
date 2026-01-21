import React from 'react';
import './Card.css';

const Card = ({ card, onClick, isPlayable = true, showCost = true, showEffects = false }) => {
  const cardImagePath = `/assest/${card.image}`;

  const formatEffect = (value) => {
    if (value > 0) return `+${value}`;
    if (value < 0) return `${value}`;
    return '0';
  };

  return (
    <div 
      className={`card ${isPlayable ? 'playable' : ''}`}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className="card-inner">
        <img 
          src={cardImagePath} 
          alt={card.title || card.name}
          className="card-image"
        />
        
        {/* Effect indicators on card */}
        {showEffects && card.effects && (
          <div className="card-effects-row">
            {/* CB */}
            <div className={`card-effect-item ${card.effects.CB > 0 ? 'positive' : card.effects.CB < 0 ? 'negative' : 'neutral'}`}>
              <span className="effect-icon">⚖️</span>
              <span className="effect-value">{formatEffect(card.effects.CB)}</span>
            </div>
            
            {/* DK */}
            <div className={`card-effect-item ${card.effects.DK > 0 ? 'positive' : card.effects.DK < 0 ? 'negative' : 'neutral'}`}>
              <span className="effect-icon">🤝</span>
              <span className="effect-value">{formatEffect(card.effects.DK)}</span>
            </div>
            
            {/* ON */}
            <div className={`card-effect-item ${card.effects.ON > 0 ? 'positive' : card.effects.ON < 0 ? 'negative' : 'neutral'}`}>
              <span className="effect-icon">🏛️</span>
              <span className="effect-value">{formatEffect(card.effects.ON)}</span>
            </div>
          </div>
        )}
        
        <div className="card-overlay">
          <div className="card-title">{card.title || card.name}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
