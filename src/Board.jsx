import React from 'react';
import Card from './Card';
import './Board.css';

const Board = ({ G, moves }) => {
  const { indicators, currentCard, phase, currentTurn, isImbalanced, deck, ending, playedCards } = G;

  const handleDrawCard = () => {
    if (phase === 'draw') {
      moves.drawCard();
    }
  };

  const handleChooseOption = (optionKey) => {
    if (phase === 'choose') {
      moves.chooseOption(optionKey);
    }
  };

  const handleNextTurn = () => {
    if (phase === 'result') {
      moves.nextTurn();
    }
  };

  // Options data
  const options = {
    A: { 
      name: 'Dung hòa', 
      effects: { LM: 1, CB: 1, ON: -1 },
      description: 'Tạo sự hòa giải giữa các bên',
      color: '#3498db'
    },
    B: { 
      name: 'Ưu tiên', 
      effects: { LM: -1, CB: 2, ON: 0 },
      description: 'Ưu tiên giải quyết lợi ích một nhóm',
      color: '#f39c12'
    },
    C: { 
      name: 'Áp đặt', 
      effects: { LM: -1, CB: -1, ON: 2 },
      description: 'Áp đặt quyết định từ trên xuống',
      color: '#e74c3c'
    },
  };

  // Tính toán bonus cho options dựa vào nhóm thẻ
  const getOptionEffects = (optionKey) => {
    if (!currentCard) return options[optionKey].effects;
    
    const baseEffects = { ...options[optionKey].effects };
    const card = currentCard;
    
    // Áp dụng hệ số nhóm thẻ
    if (card.group === 'A' && baseEffects.CB !== 0) {
      baseEffects.CB += baseEffects.CB > 0 ? 1 : -1;
    }
    if (card.group === 'B' && baseEffects.LM !== 0) {
      baseEffects.LM += baseEffects.LM > 0 ? 1 : -1;
    }
    if (card.group === 'C' && baseEffects.ON !== 0) {
      baseEffects.ON += baseEffects.ON > 0 ? 1 : -1;
    }
    
    return baseEffects;
  };

  const formatEffect = (value) => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  return (
    <div className="game-board">
      {/* Header - Game Info */}
      <div className="game-header">
        <div className="turn-info">
          <h1>🏛️ CHUYỂN ĐỔI XÃ HỘI CHỦ NGHĨA</h1>
          <div className="turn-display">
            <span className="turn-number">Lượt {currentTurn}/10</span>
            {isImbalanced && (
              <span className="imbalance-warning">⚠️ TRẬN PHÁP LỆCH</span>
            )}
          </div>
        </div>
        
        <div className="deck-info">
          <div className="deck-icon">🎴</div>
          <div>Còn lại: {deck.length} thẻ</div>
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Center Board + Right Sidebar */}
      <div className="game-layout">
        {/* Left Sidebar - Deck Area */}
        <div className="left-sidebar">
          <div className="deck-area">
            <h3>BỘ BÀI</h3>
            <div className="deck-stack">
              {deck.length > 0 ? (
                <>
                  <div className="card-back-large">
                    <span className="deck-count">{deck.length}</span>
                    <span className="deck-icon-large">🎴</span>
                  </div>
                  {phase === 'draw' && (
                    <button 
                      className="btn-draw-inline"
                      onClick={handleDrawCard}
                    >
                      Rút thẻ
                    </button>
                  )}
                </>
              ) : (
                <div className="deck-empty">Hết bài</div>
              )}
            </div>
          </div>
        </div>

        {/* Center Board - Main Game Area */}
        <div className="center-board">
          <div className="board-frame">
            <div className="board-content">
              
              {/* Draw Phase */}
              {phase === 'draw' && (
                <div className="draw-phase-center">
                  <div className="phase-icon">🎴</div>
                  <h2>Rút thẻ tình huống</h2>
                  <p>Nhấn nút "Rút thẻ" bên trái để bắt đầu lượt chơi</p>
                </div>
              )}

              {/* Choose Phase */}
              {phase === 'choose' && currentCard && (
                <div className="choose-phase-center">
                  <div className="situation-header">
                    <span className="group-badge">Nhóm {currentCard.group}</span>
                    <h2>{currentCard.title}</h2>
                    <p className="situation-desc">{currentCard.description}</p>
                  </div>

                  <div className="options-grid">
                    {['A', 'B', 'C'].map(key => {
                      const option = options[key];
                      const effects = getOptionEffects(key);
                      
                      return (
                        <div 
                          key={key} 
                          className="option-card-compact"
                          onClick={() => handleChooseOption(key)}
                          style={{borderColor: option.color}}
                        >
                          <div className="option-header-compact" style={{backgroundColor: option.color}}>
                            <span className="option-letter">{key}</span>
                            <span className="option-name">{option.name}</span>
                          </div>
                          <div className="option-effects-compact">
                            <span className={effects.LM > 0 ? 'positive' : effects.LM < 0 ? 'negative' : 'neutral'}>
                              🤝 {formatEffect(effects.LM)}
                            </span>
                            <span className={effects.CB > 0 ? 'positive' : effects.CB < 0 ? 'negative' : 'neutral'}>
                              ⚖️ {formatEffect(effects.CB)}
                            </span>
                            <span className={effects.ON > 0 ? 'positive' : effects.ON < 0 ? 'negative' : 'neutral'}>
                              🏛️ {formatEffect(effects.ON)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Result Phase */}
              {phase === 'result' && (
                <div className="result-phase-center">
                  <div className="phase-icon">✅</div>
                  <h2>Quyết định đã được thực hiện</h2>
                  <p>Các chỉ số xã hội đã được cập nhật</p>
                  {isImbalanced && (
                    <div className="imbalance-alert-compact">
                      <strong>⚠️ Trận pháp lệch!</strong>
                      <p>Chỉ số cao nhất sẽ giảm 1 điểm mỗi lượt</p>
                    </div>
                  )}
                  <button 
                    className="btn btn-next"
                    onClick={handleNextTurn}
                  >
                    {currentTurn < 10 ? '➡️ Lượt tiếp theo' : '🏁 Xem kết quả'}
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Current Card Horizontal - Below Board */}
          {(playedCards && playedCards.length > 0) || (currentCard && phase === 'choose') ? (
            <div className="current-card-horizontal">
              <div className="current-card-label">Lịch sử thẻ ({playedCards.length + (currentCard && phase === 'choose' ? 1 : 0)})</div>
              <div className="played-cards-container">
                {playedCards.map((card, index) => (
                  <div key={index} className="played-card-item">
                    <div className="card-badge-tiny">{card.group}</div>
                    <Card card={card} isPlayable={false} showCost={false} />
                  </div>
                ))}
                {currentCard && phase === 'choose' && (
                  <div className="played-card-item current-playing">
                    <div className="card-badge-tiny">{currentCard.group}</div>
                    <Card card={currentCard} isPlayable={false} showCost={false} />
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Sidebar - Info Panels */}
        <div className="right-sidebar">
          <div className="info-box">
            <h4>📊 SYMBOLS</h4>
            <div className="symbol-list">
              <div className="symbol-item">🤝 Liên minh</div>
              <div className="symbol-item">⚖️ Cân bằng</div>
              <div className="symbol-item">🏛️ Ổn định</div>
            </div>
          </div>

          <div className="info-box">
            <h4>📖 TURN STEPS</h4>
            <ol className="steps-list">
              <li className={phase === 'draw' ? 'active' : ''}>
                <strong>DRAW:</strong> Rút thẻ
              </li>
              <li className={phase === 'choose' ? 'active' : ''}>
                <strong>CHOOSE:</strong> Chọn phương án
              </li>
              <li className={phase === 'result' ? 'active' : ''}>
                <strong>RESULT:</strong> Xem kết quả
              </li>
            </ol>
          </div>

          <div className="info-box">
            <h4>🎯 NHÓM THẺ</h4>
            <div className="group-info">
              <div><strong>A:</strong> Khuếch đại CB</div>
              <div><strong>B:</strong> Khuếch đại LM</div>
              <div><strong>C:</strong> Khuếch đại ON</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Indicators Area */}
      <div className="bottom-indicators">
        <div className="indicators-row">
          <div className="indicator">
            <div className="indicator-header">
              <span className="indicator-icon">🤝</span>
              <span className="indicator-name">LIÊN MINH</span>
            </div>
            <div className="indicator-bar-container">
              <div className="indicator-bar" style={{width: `${(indicators.LM / 7) * 100}%`, backgroundColor: '#3498db'}}>
                <span className="indicator-value">{indicators.LM}/7</span>
              </div>
            </div>
          </div>

          <div className="indicator">
            <div className="indicator-header">
              <span className="indicator-icon">⚖️</span>
              <span className="indicator-name">CÂN BẰNG</span>
            </div>
            <div className="indicator-bar-container">
              <div className="indicator-bar" style={{width: `${(indicators.CB / 7) * 100}%`, backgroundColor: '#27ae60'}}>
                <span className="indicator-value">{indicators.CB}/7</span>
              </div>
            </div>
          </div>

          <div className="indicator">
            <div className="indicator-header">
              <span className="indicator-icon">🏛️</span>
              <span className="indicator-name">ỔN ĐỊNH</span>
            </div>
            <div className="indicator-bar-container">
              <div className="indicator-bar" style={{width: `${(indicators.ON / 7) * 100}%`, backgroundColor: '#e67e22'}}>
                <span className="indicator-value">{indicators.ON}/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over - Ending */}
      {ending && (
        <div className="game-over-overlay">
          <div className="game-over-message" style={{borderColor: ending.color}}>
            <h1 style={{color: ending.color}}>{ending.title}</h1>
            <div className="final-scores">
              <div className="final-score">
                <span className="score-label">🤝 Liên minh:</span>
                <span className="score-value">{indicators.LM}/7</span>
              </div>
              <div className="final-score">
                <span className="score-label">⚖️ Cân bằng:</span>
                <span className="score-value">{indicators.CB}/7</span>
              </div>
              <div className="final-score">
                <span className="score-label">🏛️ Ổn định:</span>
                <span className="score-value">{indicators.ON}/7</span>
              </div>
            </div>
            <p className="ending-message">{ending.message}</p>
            <button 
              className="btn btn-restart"
              onClick={() => window.location.reload()}
            >
              🔄 Chơi lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
