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
                    <div className={`card-selection-prompt ${imbalanceState !== 'none' ? 'imbalance-state' : ''}`}>
                      {imbalanceState !== 'none' ? (
                        <>
                          <span className="imbalance-icon">⚠️</span>
                          {getImbalanceText().replace('⚠️ ', '')}
                        </>
                      ) : (
                        phase === 'draw' ? 'Người chơi chọn thẻ' : 'Chọn phương án xử lý'
                      )}
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
                    <Card card={card} isPlayable={false} showCost={false} showEffects={true} />
                  </div>
                ))}
                {currentCard && phase === 'choose' && (
                  <div className="played-card-item current-playing">
                    <Card card={currentCard} isPlayable={false} showCost={false} showEffects={true} />
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
                <h3>🎯 MỤC TIÊU TRÒ CHƠI</h3>
                <div className="guide-items">
                  <p>Bạn vào vai <strong>chủ thể quản lý xã hội</strong> trong thời kỳ quá độ lên CNXH. Nhiệm vụ của bạn là <strong>điều tiết các mâu thuẫn xã hội khách quan</strong> nhằm duy trì và phát triển <strong>cơ cấu xã hội cân đối</strong>, tránh rơi vào khủng hoảng.</p>
                  <p>Sau <strong>10 lượt chơi</strong>, trò chơi kết thúc và xã hội sẽ đi đến <strong>một trong bốn kết cục (Ending)</strong>.</p>
                </div>
              </div>

              <div className="guide-section">
                <h3>📊 CÁC CHỈ SỐ XÃ HỘI</h3>
                <div className="guide-items">
                  <div className="guide-item">
                    <strong>⚖️ Công bằng phân phối (CB)</strong><br/>
                    Phản ánh quan hệ lợi ích giữa lao động – tư bản – nhà nước.<br/>
                    • CB cao: lợi ích được phân phối hợp lý<br/>
                    • CB thấp: bất công, mâu thuẫn lợi ích gia tăng
                  </div>
                  <div className="guide-item">
                    <strong>🤝 Đoàn kết – Niềm tin (ĐK)</strong><br/>
                    Thể hiện mức độ đồng thuận xã hội và liên minh giai cấp.<br/>
                    • ĐK cao: xã hội đồng lòng<br/>
                    • ĐK thấp: chia rẽ, mất niềm tin
                  </div>
                  <div className="guide-item">
                    <strong>🏛️ Ổn định xã hội (ỔN)</strong><br/>
                    Khả năng duy trì trật tự xã hội XHCN.<br/>
                    • ỔN cao: xã hội ổn định<br/>
                    • ỔN thấp: rối loạn, nguy cơ khủng hoảng
                  </div>
                  <p><strong>Giới hạn:</strong> Mỗi chỉ số tối đa <strong>10 điểm</strong>. Điểm khởi đầu: <strong>CB = 3, ĐK = 3, ỔN = 3</strong></p>
                </div>
              </div>

              <div className="guide-section">
                <h3>🎮 CẤU TRÚC MỘT LƯỢT CHƠI</h3>
                <div className="guide-items">
                  <div className="guide-item">
                    <strong>Bước 1: Rút thẻ mâu thuẫn khách quan</strong><br/>
                    Thẻ đại diện cho những mâu thuẫn tất yếu trong xã hội (lợi ích, giai cấp, phân phối...). Thẻ sẽ tác động trực tiếp lên các chỉ số.
                  </div>
                  <div className="guide-item">
                    <strong>Bước 2: Kiểm tra trạng thái lệch cơ cấu</strong><br/>
                    Sau khi áp dụng hiệu ứng thẻ, kiểm tra xem xã hội có rơi vào LỆCH CƠ CẤU hay không.
                  </div>
                  <div className="guide-item">
                    <strong>Bước 3: Điều chỉnh có giới hạn (tùy chọn)</strong><br/>
                    • Mỗi lượt chỉ được điều chỉnh <strong>1 lần</strong><br/>
                    • Cả game chỉ được điều chỉnh <strong>tối đa 3 lần</strong><br/>
                    ⚠️ Chủ thể xã hội không thể can thiệp tùy tiện, chỉ nên can thiệp ở những thời điểm then chốt.
                  </div>
                </div>
              </div>

              <div className="guide-section">
                <h3>🔧 ĐIỀU CHỈNH CÓ GIỚI HẠN</h3>
                <div className="guide-items">
                  <div className="guide-item">
                    <strong style={{color: '#9b59b6'}}>A. Điều chỉnh phân phối</strong><br/>
                    Hiệu ứng: <span className="positive">CB +2</span>, <span className="negative">ĐK −1</span><br/>
                    Giải quyết bất công lợi ích nhanh chóng nhưng dễ gây phản ứng xã hội.
                  </div>
                  <div className="guide-item">
                    <strong style={{color: '#1abc9c'}}>B. Củng cố liên minh giai cấp</strong><br/>
                    Hiệu ứng: <span className="positive">ĐK +2</span>, <span className="negative">CB −1</span><br/>
                    Tăng đồng thuận xã hội nhưng phải hy sinh lợi ích vật chất.
                  </div>
                  <div className="guide-item">
                    <strong style={{color: '#e67e22'}}>C. Điều tiết ý thức</strong><br/>
                    Hiệu ứng: <span className="positive">CB +1, ĐK +1</span>, <span className="negative">ỔN −1</span><br/>
                    Thuyết phục – giáo dục, cải thiện nhận thức nhưng không tạo ra thay đổi vật chất tức thì.
                  </div>
                </div>
              </div>

              <div className="guide-section">
                <h3>⚠️ TRẠNG THÁI LỆCH CƠ CẤU</h3>
                <div className="guide-items">
                  <div className="guide-item imbalance-li">
                    <strong>LỆCH LỢI ÍCH</strong><br/>
                    <strong>Kích hoạt:</strong> CB ≥4 và ĐK ≤1<br/>
                    <strong>Hiệu ứng:</strong><br/>
                    • Mỗi lần tăng CB → +0 (không còn tác dụng)<br/>
                    • Mỗi lượt: ĐK −1<br/>
                    <strong>Thoát:</strong> CB ≤4 và ĐK ≥2<br/>
                    <em>Phân phối nghiêng về một phía, liên minh giai cấp rạn nứt.</em>
                  </div>
                  <div className="guide-item imbalance-htlm">
                    <strong>LỆCH HÌNH THỨC LIÊN MINH</strong><br/>
                    <strong>Kích hoạt:</strong> ĐK ≥4 và CB ≤1<br/>
                    <strong>Hiệu ứng:</strong><br/>
                    • Mỗi lần tăng ĐK → +0<br/>
                    • Mỗi lượt: CB −1<br/>
                    <strong>Thoát:</strong> CB ≥2 và ĐK ≤4<br/>
                    <em>Đoàn kết chỉ mang tính hình thức, lợi ích không được bảo đảm.</em>
                  </div>
                  <div className="guide-item imbalance-odbn">
                    <strong>ỔN ĐỊNH BỀ NGOÀI</strong><br/>
                    <strong>Kích hoạt:</strong> ỔN ≥4 và (CB ≤1 hoặc ĐK ≤1)<br/>
                    <strong>Hiệu ứng:</strong><br/>
                    • Mọi hành động điều chỉnh không được tăng ỔN<br/>
                    • Mỗi lượt: CB −1 hoặc ĐK −1 (trừ chỉ số đang thấp hơn)<br/>
                    <strong>Thoát:</strong> CB ≥2 và ĐK ≥2<br/>
                    <em>Trật tự xã hội được duy trì bằng biện pháp hành chính, chưa dựa trên đồng thuận thực chất.</em>
                  </div>
                  <p className="warning-text">⚠️ Khi đã rơi vào trạng thái lệch, cơ cấu xã hội <strong>không tự cân bằng</strong>. Nếu lệch kéo dài, xã hội sẽ tiến dần đến khủng hoảng.</p>
                </div>
              </div>

              <div className="guide-section">
                <h3>🏆 KẾT THÚC TRÒ CHƠI (ENDINGS)</h3>
                <div className="guide-items">
                  <div className="guide-item ending-perfect">
                    <strong>🌱 ENDING 1: PHÁT TRIỂN HÀI HÒA</strong><br/>
                    Điều kiện: CB ≥4, ĐK ≥4, ỔN ≥4, không ở trạng thái lệch<br/>
                    ➡️ Cơ cấu xã hội phát triển cân đối, liên minh giai cấp vững chắc trong thời kỳ quá độ.
                  </div>
                  <div className="guide-item ending-stable">
                    <strong>⚖️ ENDING 2: ỔN ĐỊNH TƯƠNG ĐỐI</strong><br/>
                    Điều kiện: ỔN ≥3, CB ≥2 và ĐK ≥2, không ở trạng thái lệch<br/>
                    ➡️ Xã hội ổn định nhưng mâu thuẫn chưa được giải quyết triệt để.
                  </div>
                  <div className="guide-item ending-formal">
                    <strong>🏛️ ENDING 3: ỔN ĐỊNH HÌNH THỨC</strong><br/>
                    Điều kiện: ỔN ≥4, đang ở bất kỳ trạng thái lệch nào<br/>
                    ➡️ Trật tự được duy trì chủ yếu bằng biện pháp hành chính, cơ cấu xã hội mất cân đối.
                  </div>
                  <div className="guide-item ending-crisis">
                    <strong>⚠️ ENDING 4: KHỦNG HOẢNG CƠ CẤU</strong><br/>
                    Điều kiện: ỔN = 0 tại bất kỳ thời điểm nào HOẶC CB ≤0 và ĐK ≤0 HOẶC kết thúc 10 lượt nhưng CB ≤1 và ĐK ≤1<br/>
                    ➡️ Mâu thuẫn xã hội tích tụ, liên minh giai cấp tan rã, xã hội rơi vào khủng hoảng.
                  </div>
                </div>
              </div>

              <div className="guide-section">
                <h3>💡 GỢI Ý CHIẾN LƯỢC</h3>
                <div className="guide-items">
                  <div className="guide-item">• Không tối đa hóa một chỉ số duy nhất</div>
                  <div className="guide-item">• Tránh can thiệp sớm hoặc quá thường xuyên</div>
                  <div className="guide-item">• Ưu tiên <strong>thoát trạng thái lệch</strong> hơn là tăng điểm ngắn hạn</div>
                  <div className="guide-item">• Nhớ rằng: <strong>ổn định bền vững phải dựa trên công bằng và đồng thuận</strong>, không chỉ trật tự hành chính</div>
                </div>
                <p style={{textAlign: 'center', marginTop: '20px', fontStyle: 'italic', opacity: 0.8}}>
                  Trò chơi phản ánh tính lịch sử – xã hội của quá trình xây dựng và điều tiết cơ cấu xã hội trong thời kỳ quá độ lên CNXH.
                </p>
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
