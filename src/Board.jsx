import React, { useState } from 'react';
import Card from './Card';
import './Board.css';

const Board = ({ G, moves }) => {
  const { indicators, currentCard, phase, currentTurn, imbalanceState, deck, ending, playedCards, adjustmentsLeft } = G;
  const [showGuide, setShowGuide] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  
  // Reset selected card when entering draw phase
  React.useEffect(() => {
    if (phase === 'draw') {
      setSelectedCardIndex(null);
    }
  }, [phase]);

  const handleCardClick = (cardIndex) => {
    if (phase === 'draw' && deck.length > 0) {
      setSelectedCardIndex(cardIndex);
      // Wait for flip animation then draw
      setTimeout(() => {
        moves.drawCard();
      }, 600);
    }
  };

  const handleChooseOption = (optionKey) => {
    if (phase === 'choose') {
      moves.chooseOption(optionKey);
    }
  };

  const handleSkipChooseOption = () => {
    if (phase === 'choose') {
      moves.skipChooseOption();
    }
  };

  const formatEffect = (value) => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  // Hiển thị tên trạng thái lệch
  const getImbalanceText = () => {
    if (imbalanceState === 'LI') return '⚠️ LỆCH LỢI ÍCH';
    if (imbalanceState === 'HTLM') return '⚠️ LỆCH HÌNH THỨC LIÊN MINH';
    if (imbalanceState === 'ODBN') return '⚠️ ỔN ĐỊNH BỀ NGOÀI';
    return '';
  };

  return (
    <div className="game-board">
      {/* Header - Game Info */}
      <div className="game-header">
        <div className="header-left">
          <div className="header-stats-row">
            <div className="stat-card">
              <span className="stat-icon">⚖️</span>
              <div className="stat-content">
                <span className="stat-label">CB</span>
                <span className="stat-value">{indicators.CB}/10</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🤝</span>
              <div className="stat-content">
                <span className="stat-label">ĐK</span>
                <span className="stat-value">{indicators.DK}/10</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🏛️</span>
              <div className="stat-content">
                <span className="stat-label">ỔN</span>
                <span className="stat-value">{indicators.ON}/10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="turn-section">
            <div className="turn-line"></div>
            <div className="turn-circle">
              <div className="turn-circle-inner">
                <span className="turn-current">{currentTurn}</span>
                <span className="turn-divider">/</span>
                <span className="turn-total">10</span>
              </div>
            </div>
            <div className="turn-line"></div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-info-group">
            <div className="info-item">
              <span className="info-icon">🎴</span>
              <span className="info-value">{deck.length}</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🔧</span>
              <span className="info-value">{adjustmentsLeft}/3</span>
            </div>
            <button className="settings-button" onClick={() => setShowGuide(true)}>
              📖
            </button>
          </div>
        </div>
      </div>

      {imbalanceState !== 'none' && (
        <div className="imbalance-banner">
          <span className="imbalance-icon">⚠️</span>
          <span className="imbalance-text">{getImbalanceText()}</span>
        </div>
      )}

      {/* Nút Tiếp tục - góc phải */}
      {phase === 'choose' && (
        <button 
          className="btn-skip-fixed-right"
          onClick={handleSkipChooseOption}
        >
          ➡️ TIẾP TỤC
        </button>
      )}

      {/* Main Game Layout - Centered */}
      <div className="game-layout">
        
        {/* Center Board - Main Game Area */}
        <div className="center-board">
          <div className="board-frame">
            <div className="board-content">
              
              {/* Card backs and options - visible in both draw and choose phase */}
              {(phase === 'draw' || phase === 'choose') && (
                <>
                  {/* Option buttons - always visible on the left */}
                  <div className="options-buttons-left">
                    {[
                      { key: 'A', name: 'ĐIỀU CHỈNH PHÂN PHỐI', effects: { CB: 2, DK: -1, ON: 0 }, color: '#9b59b6' },
                      { key: 'B', name: 'CỦNG CỐ LIÊN MINH GIAI CẤP', effects: { DK: 2, CB: -1, ON: 0 }, color: '#1abc9c' },
                      { key: 'C', name: 'ĐIỀU TIẾT Ý THỨC', effects: { CB: 1, DK: 1, ON: -1 }, color: '#e67e22' }
                    ].map((displayData) => {
                      const isClickable = currentCard && phase === 'choose' && adjustmentsLeft > 0;
                      
                      return (
                        <button
                          key={displayData.key}
                          className="option-btn-vertical"
                          style={{ backgroundColor: displayData.color }}
                          onClick={() => {
                            if (isClickable) {
                              handleChooseOption(displayData.key);
                            }
                          }}
                          disabled={!isClickable}
                        >
                          <div className="option-btn-header">
                            <span className="option-btn-letter">{displayData.key}</span>
                            <span className="option-btn-name">{displayData.name}</span>
                          </div>
                          <div className="option-btn-effects">
                            <span className={displayData.effects.CB > 0 ? 'positive' : displayData.effects.CB < 0 ? 'negative' : 'neutral'}>
                              ⚖️ {formatEffect(displayData.effects.CB)}
                            </span>
                            <span className={displayData.effects.DK > 0 ? 'positive' : displayData.effects.DK < 0 ? 'negative' : 'neutral'}>
                              🤝 {formatEffect(displayData.effects.DK)}
                            </span>
                            <span className={displayData.effects.ON > 0 ? 'positive' : displayData.effects.ON < 0 ? 'negative' : 'neutral'}>
                              🏛️ {formatEffect(displayData.effects.ON)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Center area with banner and cards */}
                  <div className={`choose-phase-center ${phase === 'draw' ? 'draw-position' : ''}`}>
                    <div className="card-selection-prompt">
                      {phase === 'draw' ? 'Người chơi chọn thẻ' : 'Chọn phương án xử lý'}
                    </div>

                    <div className="options-fan">
                    {/* Card backs only (all face down) */}
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <div 
                          key={`back-${index}`}
                          className={`card-back card-${index} ${phase === 'draw' && selectedCardIndex === index ? 'card-selected' : ''} ${phase === 'draw' ? 'card-clickable' : ''}`}
                          style={{
                            '--card-index': index
                          }}
                          onClick={() => handleCardClick(index)}
                        >
                          <div className="card-back-inner">
                            <div className="card-pattern">
                              <div className="pattern-center">◆</div>
                              <div className="pattern-corner tl">✦</div>
                              <div className="pattern-corner tr">✦</div>
                              <div className="pattern-corner bl">✦</div>
                              <div className="pattern-corner br">✦</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                </>
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
                    <Card card={card} isPlayable={false} showCost={false} />
                  </div>
                ))}
                {currentCard && phase === 'choose' && (
                  <div className="played-card-item current-playing">
                    <Card card={currentCard} isPlayable={false} showCost={false} />
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="guide-overlay" onClick={() => setShowGuide(false)}>
          <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guide-header">
              <h2>📖 HƯỚNG DẪN CHƠI</h2>
              <button className="guide-close" onClick={() => setShowGuide(false)}>✕</button>
            </div>
            
            <div className="guide-content">
              <div className="guide-section">
                <h3>📊 CHỈ SỐ</h3>
                <div className="guide-items">
                  <div className="guide-item">⚖️ <strong>Công bằng (CB)</strong> - Quan hệ lợi ích giữa lao động – tư bản – nhà nước</div>
                  <div className="guide-item">🤝 <strong>Đoàn kết (ĐK)</strong> - Mức đồng thuận giữa các giai cấp, tầng lớp</div>
                  <div className="guide-item">🏛️ <strong>Ổn định (ỔN)</strong> - Khả năng duy trì trật tự xã hội XHCN</div>
                </div>
              </div>

              <div className="guide-section">
                <h3>🎮 TURN STEPS</h3>
                <ol className="guide-steps">
                  <li className={phase === 'draw' ? 'active' : ''}><strong>DRAW:</strong> Rút thẻ tình huống</li>
                  <li className={phase === 'choose' ? 'active' : ''}><strong>CHOOSE:</strong> Chọn phương án xử lý</li>
                  <li className={phase === 'adjust' ? 'active' : ''}><strong>ADJUST:</strong> Điều chỉnh (tối đa 3 lần/game)</li>
                  <li className={phase === 'result' ? 'active' : ''}><strong>RESULT:</strong> Xem kết quả và chuyển lượt</li>
                </ol>
              </div>

              <div className="guide-section">
                <h3>🎯 NHÓM THẺ</h3>
                <div className="guide-items">
                  <div className="guide-item"><strong>Nhóm A:</strong> Khuếch đại tác động lên CB (+1 điểm)</div>
                  <div className="guide-item"><strong>Nhóm B:</strong> Khuếch đại tác động lên ĐK (+1 điểm)</div>
                  <div className="guide-item"><strong>Nhóm C:</strong> Khuếch đại tác động lên ỔN (+1 điểm)</div>
                </div>
              </div>

              <div className="guide-section">
                <h3>⚠️ TRẠNG THÁI LỆCH CƠ CẤU</h3>
                <div className="guide-items">
                  <div className="guide-item imbalance-li">
                    <strong>LỆCH LỢI ÍCH (LI):</strong> CB ≥4 và ĐK ≤1<br/>
                    • Mỗi lần tăng CB → +0<br/>
                    • Mỗi lượt: ĐK -1<br/>
                    • Thoát: CB ≤4 và ĐK ≥2
                  </div>
                  <div className="guide-item imbalance-htlm">
                    <strong>LỆCH HÌNH THỨC LIÊN MINH (HTLM):</strong> ĐK ≥4 và CB ≤1<br/>
                    • Mỗi lần tăng ĐK → +0<br/>
                    • Mỗi lượt: CB -1<br/>
                    • Thoát: CB ≥2 và ĐK ≤4
                  </div>
                  <div className="guide-item imbalance-odbn">
                    <strong>ỔN ĐỊNH BỀ NGOÀI (ODBN):</strong> ỔN ≥4 và (CB ≤1 hoặc ĐK ≤1)<br/>
                    • Không được tăng ỔN bằng điều chỉnh<br/>
                    • Mỗi lượt: CB -1 hoặc ĐK -1<br/>
                    • Thoát: CB ≥2 và ĐK ≥2
                  </div>
                </div>
              </div>

              <div className="guide-section">
                <h3>🏆 ENDINGS</h3>
                <div className="guide-items">
                  <div className="guide-item ending-perfect">
                    <strong>ENDING 1 - PHÁT TRIỂN HÀI HÒA:</strong> CB ≥4, ĐK ≥4, ỔN ≥4, không lệch
                  </div>
                  <div className="guide-item ending-stable">
                    <strong>ENDING 2 - ỔN ĐỊNH TƯƠNG ĐỐI:</strong> ỔN ≥3, CB ≥2, ĐK ≥2, không lệch
                  </div>
                  <div className="guide-item ending-formal">
                    <strong>ENDING 3 - ỔN ĐỊNH HÌNH THỨC:</strong> ỔN ≥4, đang ở trạng thái lệch
                  </div>
                  <div className="guide-item ending-crisis">
                    <strong>ENDING 4 - KHỦNG HOẢNG CƠ CẤU:</strong> ỔN = 0 hoặc CB ≤1 và ĐK ≤1
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over - Ending */}
      {ending && (
        <div className="game-over-overlay">
          <div className="game-over-message" style={{borderColor: ending.color}}>
            <h1 style={{color: ending.color}}>{ending.title}</h1>
            <div className="final-scores">
              <div className="final-score">
                <span className="score-label">⚖️ Công bằng:</span>
                <span className="score-value">{indicators.CB}/10</span>
              </div>
              <div className="final-score">
                <span className="score-label">🤝 Đoàn kết:</span>
                <span className="score-value">{indicators.DK}/10</span>
              </div>
              <div className="final-score">
                <span className="score-label">🏛️ Ổn định:</span>
                <span className="score-value">{indicators.ON}/10</span>
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
