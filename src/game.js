// CHƯƠNG 5 CNXH KHOA HỌC - BOARD GAME LOGIC

// Định nghĩa 20 thẻ tình huống chia thành 3 nhóm
const SITUATION_CARDS = [
  // NHÓM A: Giai cấp và tầng lớp xã hội (tác động mạnh đến CB)
  { id: 1, group: 'A', image: '1.png', title: 'Phân hóa thu nhập', description: 'Khoảng cách giàu nghèo gia tăng trong xã hội.' },
  { id: 2, group: 'A', image: '2.png', title: 'Lợi ích tư nhân', description: 'Xuất hiện nhóm lợi ích mạnh trong kinh tế.' },
  { id: 3, group: 'A', image: '3.png', title: 'Quyền lực trí thức', description: 'Tầng lớp trí thức yêu cầu quyền tự chủ cao hơn.' },
  { id: 4, group: 'A', image: '4.png', title: 'Công nhân thất nghiệp', description: 'Tỷ lệ thất nghiệp trong công nhân tăng cao.' },
  { id: 5, group: 'A', image: '5.png', title: 'Nông dân đô thị hóa', description: 'Làn sóng di cư từ nông thôn ra thành thị.' },
  { id: 6, group: 'A', image: '6.png', title: 'Tầng lớp trung lưu', description: 'Sự hình thành tầng lớp trung lưu mới.' },
  { id: 7, group: 'A', image: '1.png', title: 'Phúc lợi xã hội', description: 'Yêu cầu tăng cường chính sách phúc lợi xã hội.' },
  
  // NHÓM B: Liên minh giai cấp (tác động mạnh đến LM)
  { id: 8, group: 'B', image: '2.png', title: 'Đối t화 giai cấp', description: 'Mâu thuẫn giữa công nhân và doanh nhân gia tăng.' },
  { id: 9, group: 'B', image: '3.png', title: 'Đoàn kết dân tộc', description: 'Cần tăng cường đoàn kết giữa các dân tộc.' },
  { id: 10, group: 'B', image: '4.png', title: 'Liên minh công - nông', description: 'Mối liên kết giữa công nhân và nông dân yếu đi.' },
  { id: 11, group: 'B', image: '5.png', title: 'Trí thức và nhân dân', description: 'Khoảng cách giữa trí thức và đại chúng.' },
  { id: 12, group: 'B', image: '6.png', title: 'Đảng và quần chúng', description: 'Mối liên hệ giữa đảng và nhân dân cần củng cố.' },
  { id: 13, group: 'B', image: '1.png', title: 'Tổ chức chính trị - xã hội', description: 'Vai trò của các tổ chức quần chúng cần được tăng cường.' },
  { id: 14, group: 'B', image: '2.png', title: 'Đồng thuận xã hội', description: 'Cần xây dựng sự đồng thuận trong xã hội.' },
  
  // NHÓM C: Cơ cấu xã hội tổng hợp (tác động mạnh đến ON)
  { id: 15, group: 'C', image: '3.png', title: 'Tái cơ cấu kinh tế', description: 'Chuyển đổi mô hình kinh tế ảnh hưởng cơ cấu xã hội.' },
  { id: 16, group: 'C', image: '4.png', title: 'Quản lý xã hội', description: 'Hệ thống quản lý xã hội cần được hiện đại hóa.' },
  { id: 17, group: 'C', image: '5.png', title: 'Pháp luật và trật tự', description: 'Yêu cầu tăng cường pháp quyền và kỷ cương.' },
  { id: 18, group: 'C', image: '6.png', title: 'Dịch vụ công', description: 'Nhu cầu về dịch vụ công tăng cao.' },
  { id: 19, group: 'C', image: '1.png', title: 'Hiện đại hóa', description: 'Quá trình hiện đại hóa đang tác động mạnh.' },
  { id: 20, group: 'C', image: '2.png', title: 'Đô thị hóa', description: 'Tốc độ đô thị hóa nhanh đòi hỏi điều chỉnh.' },
];

// Định nghĩa 3 phương án cố định cho mọi thẻ
const OPTIONS = {
  A: { 
    name: 'Dung hòa', 
    effects: { LM: 1, CB: 1, ON: -1 },
    description: 'Tạo sự hòa giải giữa các bên, tăng liên minh và cân bằng nhưng giảm ổn định.'
  },
  B: { 
    name: 'Ưu tiên', 
    effects: { LM: -1, CB: 2, ON: 0 },
    description: 'Ưu tiên giải quyết lợi ích một nhóm, tăng cân bằng nhưng giảm liên minh.'
  },
  C: { 
    name: 'Áp đặt', 
    effects: { LM: -1, CB: -1, ON: 2 },
    description: 'Áp đặt quyết định từ trên xuống, tăng ổn định nhưng giảm liên minh và cân bằng.'
  },
};

// Định nghĩa 3 phương án ĐIỀU CHỈNH có giới hạn (tối đa 3 lần/game)
const ADJUSTMENTS = {
  A: { 
    name: 'Điều chỉnh phân phối', 
    effects: { CB: 2, DK: -1, ON: 0 },
    description: 'Giải quyết lợi ích nhưng dễ gây phản ứng xã hội'
  },
  B: { 
    name: 'Củng cố liên minh giai cấp', 
    effects: { DK: 2, CB: -1, ON: 0 },
    description: 'Tăng đồng thuận nhưng phải hy sinh lợi ích'
  },
  C: { 
    name: 'Điều tiết ý thức', 
    effects: { CB: 1, DK: 1, ON: -1 },
    description: 'Thuyết phục – giáo dục nhưng không tạo ra thay đổi vật chất tức thì'
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


// Áp dụng hệ số nhóm thẻ
function applyGroupBonus(card, effects) {
  const bonusEffects = { ...effects };
  
  // Nhóm A: khuếch đại tác động CB
  if (card.group === 'A' && effects.CB !== 0) {
    bonusEffects.CB += effects.CB > 0 ? 1 : -1;
  }
  
  // Nhóm B: khuếch đại tác động DK
  if (card.group === 'B' && effects.DK !== 0) {
    bonusEffects.DK += effects.DK > 0 ? 1 : -1;
  }
  
  // Nhóm C: khuếch đại tác động ON
  if (card.group === 'C' && effects.ON !== 0) {
    bonusEffects.ON += effects.ON > 0 ? 1 : -1;
  }
  
  return bonusEffects;
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
  if (ON === 0 || (CB === 0 && DK === 0) || (CB <= 1 && DK <= 1)) {
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
    
    // Lượt chơi hiện tại (1-12)
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
    chooseOption: ({ G }, optionKey) => {
      if (G.phase !== 'choose' || !G.currentCard) return;
      
      const option = OPTIONS[optionKey];
      const card = G.currentCard;
      
      // Tính toán effects với hệ số nhóm
      const effects = applyGroupBonus(card, option.effects);
      
      // Áp dụng effects lên indicators (max = 10)
      G.indicators.CB = Math.max(0, Math.min(10, G.indicators.CB + (effects.CB || 0)));
      G.indicators.DK = Math.max(0, Math.min(10, G.indicators.DK + (effects.DK || 0)));
      G.indicators.ON = Math.max(0, Math.min(10, G.indicators.ON + (effects.ON || 0)));
      
      // Kiểm tra nếu đang ở trạng thái lệch
      // LỆCH LỢI ÍCH: Mỗi lần tăng CB sẽ thành +0
      if (G.imbalanceState === 'LI' && effects.CB > 0) {
        G.indicators.CB -= effects.CB;
      }
      // LỆCH HÌNH THỨC LIÊN MINH: Mỗi lần tăng DK sẽ thành +0
      if (G.imbalanceState === 'HTLM' && effects.DK > 0) {
        G.indicators.DK -= effects.DK;
      }
      // ỔN ĐỊNH BỀ NGOÀI: Không được tăng ON
      if (G.imbalanceState === 'ODBN' && effects.ON > 0) {
        G.indicators.ON -= effects.ON;
      }
      
      // Lưu thẻ vào playedCards
      G.playedCards.push(card);
      
      // Lưu lịch sử
      G.history.push({
        turn: G.currentTurn,
        card: card,
        option: optionKey,
        effects: effects,
        indicators: { ...G.indicators },
      });
      
      // Reset flag điều chỉnh cho lượt này
      G.usedAdjustmentThisTurn = false;
      
      // Chuyển sang phase adjust (cho phép điều chỉnh)
      G.phase = 'adjust';
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
      
      // Kiểm tra kết thúc game sau 12 lượt
      if (G.currentTurn > 12) {
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
