import React from 'react';
import './Card.css';

const Card = ({ card, onClick, isPlayable = true, showCost = true }) => {
  const cardImagePath = `/assest/${card.image}`;

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
        <div className="card-overlay">
          <div className="card-title">{card.title || card.name}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
