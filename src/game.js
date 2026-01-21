// CHƯƠNG 5 CNXH KHOA HỌC - BOARD GAME LOGIC

// Định nghĩa 16 lá bài - mỗi lá có chỉ số effects riêng
const SITUATION_CARDS = [
  { id: 1, image: '1.png', title: 'Phân hóa thu nhập', effects: { CB: -2, DK: 0, ON: -1 } },
  { id: 2, image: '2.png', title: 'Lợi ích tư nhân', effects: { CB: -1, DK: -1, ON: 0 } },
  { id: 3, image: '3.png', title: 'Quyền lực trí thức', effects: { CB: 0, DK: 1, ON: -1 } },
  { id: 4, image: '4.png', title: 'Công nhân thất nghiệp', effects: { CB: -2, DK: -1, ON: 0 } },
  { id: 5, image: '5.png', title: 'Nông dân đô thị hóa', effects: { CB: -1, DK: 0, ON: -1 } },
  { id: 6, image: '6.png', title: 'Tầng lớp trung lưu', effects: { CB: 1, DK: 1, ON: 0 } },
  
  { id: 7, image: '1.png', title: 'Đối thoại giai cấp', effects: { CB: 0, DK: -2, ON: -1 } },
  { id: 8, image: '2.png', title: 'Đoàn kết dân tộc', effects: { CB: 1, DK: 2, ON: 0 } },
  { id: 9, image: '3.png', title: 'Liên minh công - nông', effects: { CB: 0, DK: 1, ON: 1 } },
  { id: 10, image: '4.png', title: 'Trí thức và nhân dân', effects: { CB: -1, DK: -1, ON: 0 } },
  { id: 11, image: '5.png', title: 'Đảng và quần chúng', effects: { CB: 1, DK: 1, ON: 1 } },
  
  { id: 12, image: '6.png', title: 'Tái cơ cấu kinh tế', effects: { CB: -1, DK: 0, ON: -2 } },
  { id: 13, image: '1.png', title: 'Quản lý xã hội', effects: { CB: 0, DK: 0, ON: 2 } },
  { id: 14, image: '2.png', title: 'Pháp luật và trật tự', effects: { CB: 0, DK: -1, ON: 2 } },
  { id: 15, image: '3.png', title: 'Hiện đại hóa', effects: { CB: 1, DK: 0, ON: -1 } },
  { id: 16, image: '4.png', title: 'Đô thị hóa', effects: { CB: -1, DK: -1, ON: -1 } },
];

// Xóa hàm applyGroupBonus và OPTIONS vì không còn sử dụng

// Định nghĩa 3 phương án ĐIỀU CHỈNH có giới hạn (tối đa 3 lần/game)
const ADJUSTMENTS = {
  A: { 
    name: 'Điều chỉnh phân phối', 
    effects: { CB: 2, DK: -1, ON: 0 },
    description: 'CB +2 và ĐK −1'
  },
  B: { 
    name: 'Củng cố liên minh giai cấp', 
    effects: { DK: 2, CB: -1, ON: 0 },
    description: 'ĐK +2 và CB −1'
  },
  C: { 
    name: 'Điều tiết ý thức', 
    effects: { CB: 1, DK: 1, ON: -1 },
    description: '+1 vào CB và ĐK, ỔN -1'
  },
};

// Xáo deck
function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Kiểm tra và xử lý trạng thái LỆCH LỢI ÍCH
function checkImbalanceLI(indicators) {
  return indicators.CB >= 4 && indicators.DK <= 1;
}

function applyImbalanceLI(indicators) {
  // Mỗi lượt: DK -1
  indicators.DK = Math.max(0, indicators.DK - 1);
}

function canExitImbalanceLI(indicators) {
  return indicators.CB <= 4 && indicators.DK >= 2;
}

// Kiểm tra và xử lý trạng thái LỆCH HÌNH THỨC LIÊN MINH
function checkImbalanceHTLM(indicators) {
  return indicators.DK >= 4 && indicators.CB <= 1;
}

function applyImbalanceHTLM(indicators) {
  // Mỗi lượt: CB -1
  indicators.CB = Math.max(0, indicators.CB - 1);
}

function canExitImbalanceHTLM(indicators) {
  return indicators.CB >= 2 && indicators.DK <= 4;
}

// Kiểm tra và xử lý trạng thái ỔN ĐỊNH BỀ NGOÀI
function checkImbalanceODBN(indicators) {
  return indicators.ON >= 4 && (indicators.CB <= 1 || indicators.DK <= 1);
}

function applyImbalanceODBN(indicators) {
  // Mỗi lượt: CB -1 hoặc DK -1 (ưu tiên trừ chỉ số đang thấp hơn)
  if (indicators.CB <= indicators.DK) {
    indicators.CB = Math.max(0, indicators.CB - 1);
  } else {
    indicators.DK = Math.max(0, indicators.DK - 1);
  }
}

function canExitImbalanceODBN(indicators) {
  return indicators.CB >= 2 && indicators.DK >= 2;
}

// Xác định ending theo cơ chế mới
function determineEnding(indicators, imbalanceState) {
  const { CB, DK, ON } = indicators;
  
  // Ending 4: KHỦNG HOẢNG CƠ CẤU
  if (ON === 0 || (CB <= 0 && DK <= 0) || (CB <= 1 && DK <= 1)) {
    return {
      type: 'crisis',
      title: 'ENDING 4: KHỦNG HOẢNG CƠ CẤU',
      message: 'Mâu thuẫn giai cấp – tầng lớp tích tụ không được giải quyết, liên minh tan rã, xã hội rơi vào khủng hoảng.',
      color: '#e74c3c'
    };
  }
  
  // Ending 1: PHÁT TRIỂN HÀI HÒA
  if (CB >= 4 && DK >= 4 && ON >= 4 && imbalanceState === 'none') {
    return {
      type: 'perfect',
      title: 'ENDING 1: PHÁT TRIỂN HÀI HÒA',
      message: 'Cơ cấu xã hội phát triển cân đối, liên minh giai cấp được củng cố vững chắc trong thời kỳ quá độ.',
      color: '#f1c40f'
    };
  }
  
  // Ending 3: ỔN ĐỊNH HÌNH THỨC
  if (ON >= 4 && imbalanceState !== 'none') {
    return {
      type: 'formal',
      title: 'ENDING 3: ỔN ĐỊNH HÌNH THỨC',
      message: 'Trật tự xã hội được duy trì chủ yếu bằng biện pháp hành chính, trong khi liên minh giai cấp và lợi ích xã hội còn mất cân đối.',
      color: '#e67e22'
    };
  }
  
  // Ending 2: ỔN ĐỊNH TƯƠNG ĐỐI
  if (ON >= 3 && CB >= 2 && DK >= 2 && imbalanceState === 'none') {
    return {
      type: 'stable',
      title: 'ENDING 2: ỔN ĐỊNH TƯƠNG ĐỐI',
      message: 'Xã hội duy trì ổn định, mâu thuẫn được kiểm soát nhưng chưa được giải quyết triệt để.',
      color: '#27ae60'
    };
  }
  
  // Default: KHỦNG HOẢNG CƠ CẤU
  return {
    type: 'crisis',
    title: 'ENDING 4: KHỦNG HOẢNG CƠ CẤU',
    message: 'Mâu thuẫn giai cấp – tầng lớp tích tụ không được giải quyết, liên minh tan rã, xã hội rơi vào khủng hoảng.',
    color: '#e74c3c'
  };
}

export const CardGame = {
  name: 'socialist-transition',

  setup: () => ({
    // Bộ thẻ tình huống
    deck: shuffleDeck([...SITUATION_CARDS]),
    
    // Thẻ hiện tại đang chơi
    currentCard: null,
    
    // Các thẻ đã chơi (lưu lịch sử)
    playedCards: [],
    
    // 3 chỉ số xã hội (khởi điểm = 3, max = 10)
    indicators: {
      CB: 3,  // Công bằng phân phối
      DK: 3,  // Đoàn kết - niềm tin
      ON: 3,  // Ổn định xã hội
    },
    
    // Trạng thái lệch cơ cấu: 'none', 'LI' (lợi ích), 'HTLM' (hình thức liên minh), 'ODBN' (ổn định bề ngoài)
    imbalanceState: 'none',
    
    // Số lần điều chỉnh còn lại (tối đa 3 lần trong toàn game)
    adjustmentsLeft: 3,
    
    // Đã dùng điều chỉnh trong lượt này chưa
    usedAdjustmentThisTurn: false,
    
    // Lượt chơi hiện tại (1-10)
    currentTurn: 1,
    
    // Lịch sử các lựa chọn
    history: [],
    
    // Phase của lượt: 'draw', 'choose', 'adjust', 'result'
    phase: 'draw',
    
    // Kết quả ending
    ending: null,
  }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    // Rút thẻ tình huống
    drawCard: ({ G }) => {
      if (G.phase !== 'draw') return;
      
      if (G.deck.length > 0) {
        G.currentCard = G.deck.pop();
        G.phase = 'choose';
      }
    },

    // Chọn phương án A, B, hoặc C
    chooseOption: ({ G, events }, optionKey) => {
      if (G.phase !== 'choose' || !G.currentCard) return;
      
      // Kiểm tra giới hạn điều chỉnh
      if (G.adjustmentsLeft <= 0) return;
      if (G.usedAdjustmentThisTurn) return;
      
      const option = ADJUSTMENTS[optionKey];
      const card = G.currentCard;
      
      // Tính tổng effects = card.effects + option.effects
      const totalEffects = {
        CB: (card.effects.CB || 0) + (option.effects.CB || 0),
        DK: (card.effects.DK || 0) + (option.effects.DK || 0),
        ON: (card.effects.ON || 0) + (option.effects.ON || 0),
      };
      
      // Giảm số lần điều chỉnh và đánh dấu đã dùng trong lượt này
      G.adjustmentsLeft -= 1;
      G.usedAdjustmentThisTurn = true;
      
      // Áp dụng effects lên indicators (max = 10)
      G.indicators.CB = Math.max(0, Math.min(10, G.indicators.CB + totalEffects.CB));
      G.indicators.DK = Math.max(0, Math.min(10, G.indicators.DK + totalEffects.DK));
      G.indicators.ON = Math.max(0, Math.min(10, G.indicators.ON + totalEffects.ON));
      
      // Kiểm tra nếu đang ở trạng thái lệch
      if (G.imbalanceState === 'LI' && totalEffects.CB > 0) {
        G.indicators.CB -= totalEffects.CB;
      }
      if (G.imbalanceState === 'HTLM' && totalEffects.DK > 0) {
        G.indicators.DK -= totalEffects.DK;
      }
      if (G.imbalanceState === 'ODBN' && totalEffects.ON > 0) {
        G.indicators.ON -= totalEffects.ON;
      }
      
      // Lưu thẻ vào playedCards
      G.playedCards.push(card);
      
      // Lưu lịch sử
      G.history.push({
        turn: G.currentTurn,
        card: card,
        option: optionKey,
        cardEffects: card.effects,
        optionEffects: option.effects,
        totalEffects: totalEffects,
        indicators: { ...G.indicators },
      });
      
      // Kiểm tra game over
      if (G.indicators.ON === 0) {
        G.ending = {
          type: 'crisis',
          title: 'ENDING 4: KHỦNG HOẢNG CƠ CẤU',
          message: 'ỔN ĐỊNH = 0. Xã hội rơi vào khủng hoảng!',
          color: '#e74c3c'
        };
        events.endGame();
        return;
      }
      
      // Kiểm tra các trạng thái lệch
      if (checkImbalanceLI(G.indicators)) {
        G.imbalanceState = 'LI';
      } else if (G.imbalanceState === 'LI' && canExitImbalanceLI(G.indicators)) {
        G.imbalanceState = 'none';
      }
      
      if (checkImbalanceHTLM(G.indicators)) {
        G.imbalanceState = 'HTLM';
      } else if (G.imbalanceState === 'HTLM' && canExitImbalanceHTLM(G.indicators)) {
        G.imbalanceState = 'none';
      }
      
      if (checkImbalanceODBN(G.indicators)) {
        G.imbalanceState = 'ODBN';
      } else if (G.imbalanceState === 'ODBN' && canExitImbalanceODBN(G.indicators)) {
        G.imbalanceState = 'none';
      }
      
      // Áp dụng penalty theo trạng thái lệch
      if (G.imbalanceState === 'LI') {
        applyImbalanceLI(G.indicators);
      } else if (G.imbalanceState === 'HTLM') {
        applyImbalanceHTLM(G.indicators);
      } else if (G.imbalanceState === 'ODBN') {
        applyImbalanceODBN(G.indicators);
      }
      
      // Chuyển sang lượt tiếp theo
      G.currentTurn += 1;
      G.currentCard = null;      G.usedAdjustmentThisTurn = false; // Reset cho lượt mới      G.usedAdjustmentThisTurn = false; // Reset cho lượt mới
      
      // Kiểm tra kết thúc game sau 10 lượt
      if (G.currentTurn > 10) {
        G.ending = determineEnding(G.indicators, G.imbalanceState);
        events.endGame();
      } else {
        G.phase = 'draw';
      }
    },

    // Bỏ qua chọn option (chỉ áp dụng effects của card)
    skipChooseOption: ({ G, events }) => {
      if (G.phase !== 'choose' || !G.currentCard) return;
      
      const card = G.currentCard;
      
      // Chỉ áp dụng effects của card
      G.indicators.CB = Math.max(0, Math.min(10, G.indicators.CB + (card.effects.CB || 0)));
      G.indicators.DK = Math.max(0, Math.min(10, G.indicators.DK + (card.effects.DK || 0)));
      G.indicators.ON = Math.max(0, Math.min(10, G.indicators.ON + (card.effects.ON || 0)));
      
      // Kiểm tra nếu đang ở trạng thái lệch
      if (G.imbalanceState === 'LI' && card.effects.CB > 0) {
        G.indicators.CB -= card.effects.CB;
      }
      if (G.imbalanceState === 'HTLM' && card.effects.DK > 0) {
        G.indicators.DK -= card.effects.DK;
      }
      if (G.imbalanceState === 'ODBN' && card.effects.ON > 0) {
        G.indicators.ON -= card.effects.ON;
      }
      
      // Lưu thẻ vào playedCards
      G.playedCards.push(card);
      
      // Lưu lịch sử
      G.history.push({
        turn: G.currentTurn,
        card: card,
        option: null,
        cardEffects: card.effects,
        indicators: { ...G.indicators },
      });
      
      // Kiểm tra game over
      if (G.indicators.ON === 0) {
        G.ending = {
          type: 'crisis',
          title: 'ENDING 4: KHỦNG HOẢNG CƠ CẤU',
          message: 'ỔN ĐỊNH = 0. Xã hội rơi vào khủng hoảng!',
          color: '#e74c3c'
        };
        events.endGame();
        return;
      }
      
      // Kiểm tra các trạng thái lệch
      if (checkImbalanceLI(G.indicators)) {
        G.imbalanceState = 'LI';
      } else if (G.imbalanceState === 'LI' && canExitImbalanceLI(G.indicators)) {
        G.imbalanceState = 'none';
      }
      
      if (checkImbalanceHTLM(G.indicators)) {
        G.imbalanceState = 'HTLM';
      } else if (G.imbalanceState === 'HTLM' && canExitImbalanceHTLM(G.indicators)) {
        G.imbalanceState = 'none';
      }
      
      if (checkImbalanceODBN(G.indicators)) {
        G.imbalanceState = 'ODBN';
      } else if (G.imbalanceState === 'ODBN' && canExitImbalanceODBN(G.indicators)) {
        G.imbalanceState = 'none';
      }
      
      // Áp dụng penalty theo trạng thái lệch
      if (G.imbalanceState === 'LI') {
        applyImbalanceLI(G.indicators);
      } else if (G.imbalanceState === 'HTLM') {
        applyImbalanceHTLM(G.indicators);
      } else if (G.imbalanceState === 'ODBN') {
        applyImbalanceODBN(G.indicators);
      }
      
      // Chuyển sang lượt tiếp theo
      G.currentTurn += 1;
      G.currentCard = null;
      G.usedAdjustmentThisTurn = false; // Reset cho lượt mới
      
      // Kiểm tra kết thúc game sau 10 lượt
      if (G.currentTurn > 10) {
        G.ending = determineEnding(G.indicators, G.imbalanceState);
        events.endGame();
      } else {
        G.phase = 'draw';
      }
    },

    // Sử dụng hành động điều chỉnh (tối đa 3 lần/game, 1 lần/lượt)
    useAdjustment: ({ G }, adjustmentKey) => {
      if (G.phase !== 'adjust') return;
      if (G.usedAdjustmentThisTurn) return;
      if (G.adjustmentsLeft <= 0) return;
      
      const adjustment = ADJUSTMENTS[adjustmentKey];
      const effects = adjustment.effects;
      
      // Áp dụng effects
      G.indicators.CB = Math.max(0, Math.min(10, G.indicators.CB + (effects.CB || 0)));
      G.indicators.DK = Math.max(0, Math.min(10, G.indicators.DK + (effects.DK || 0)));
      G.indicators.ON = Math.max(0, Math.min(10, G.indicators.ON + (effects.ON || 0)));
      
      // Kiểm tra nếu đang ở trạng thái lệch
      // ỔN ĐỊNH BỀ NGOÀI: Không được tăng ON bằng điều chỉnh
      if (G.imbalanceState === 'ODBN' && effects.ON > 0) {
        G.indicators.ON -= effects.ON;
      }
      
      // Giảm số lần điều chỉnh
      G.adjustmentsLeft -= 1;
      G.usedAdjustmentThisTurn = true;
      
      // Lưu lịch sử điều chỉnh
      G.history.push({
        turn: G.currentTurn,
        adjustment: adjustmentKey,
        effects: effects,
        indicators: { ...G.indicators },
      });
    },

    // Bỏ qua điều chỉnh và tiếp tục
    skipAdjustment: ({ G, events }) => {
      if (G.phase !== 'adjust') return;
      
      // Kiểm tra game over do chỉ số = 0
      if (G.indicators.ON === 0) {
        G.ending = {
          type: 'crisis',
          title: 'ENDING 4: KHỦNG HOẢNG CƠ CẤU',
          message: 'ỔN ĐỊNH = 0. Xã hội rơi vào khủng hoảng!',
          color: '#e74c3c'
        };
        events.endGame();
        return;
      }
      
      // Kiểm tra các trạng thái lệch
      // 1. Kiểm tra LỆCH LỢI ÍCH
      if (checkImbalanceLI(G.indicators)) {
        G.imbalanceState = 'LI';
      } else if (G.imbalanceState === 'LI' && canExitImbalanceLI(G.indicators)) {
        G.imbalanceState = 'none';
      }
      
      // 2. Kiểm tra LỆCH HÌNH THỨC LIÊN MINH
      if (checkImbalanceHTLM(G.indicators)) {
        G.imbalanceState = 'HTLM';
      } else if (G.imbalanceState === 'HTLM' && canExitImbalanceHTLM(G.indicators)) {
        G.imbalanceState = 'none';
      }
      
      // 3. Kiểm tra ỔN ĐỊNH BỀ NGOÀI
      if (checkImbalanceODBN(G.indicators)) {
        G.imbalanceState = 'ODBN';
      } else if (G.imbalanceState === 'ODBN' && canExitImbalanceODBN(G.indicators)) {
        G.imbalanceState = 'none';
      }
      
      // Áp dụng penalty theo trạng thái lệch
      if (G.imbalanceState === 'LI') {
        applyImbalanceLI(G.indicators);
      } else if (G.imbalanceState === 'HTLM') {
        applyImbalanceHTLM(G.indicators);
      } else if (G.imbalanceState === 'ODBN') {
        applyImbalanceODBN(G.indicators);
      }
      
      // Chuyển sang result phase
      G.phase = 'result';
    },

    // Chuyển sang lượt tiếp theo
    nextTurn: ({ G, events }) => {
      if (G.phase !== 'result') return;
      
      G.currentTurn += 1;
      G.currentCard = null;
      
      // Kiểm tra kết thúc game sau 10 lượt
      if (G.currentTurn > 10) {
        G.ending = determineEnding(G.indicators, G.imbalanceState);
        events.endGame();
      } else {
        G.phase = 'draw';
      }
    },
  },

  endIf: ({ G }) => {
    if (G.ending) {
      return { ending: G.ending };
    }
  },
};
