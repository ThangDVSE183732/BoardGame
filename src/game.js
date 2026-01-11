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
  
  // Nhóm B: khuếch đại tác động LM
  if (card.group === 'B' && effects.LM !== 0) {
    bonusEffects.LM += effects.LM > 0 ? 1 : -1;
  }
  
  // Nhóm C: khuếch đại tác động ON
  if (card.group === 'C' && effects.ON !== 0) {
    bonusEffects.ON += effects.ON > 0 ? 1 : -1;
  }
  
  return bonusEffects;
}

// Kiểm tra trạng thái trận pháp lệch
function checkImbalance(indicators) {
  const { LM, CB, ON } = indicators;
  const values = [LM, CB, ON];
  
  const highValues = values.filter(v => v >= 5);
  const lowValues = values.filter(v => v <= 2);
  
  // Nếu có 1 chỉ số >= 5 và 2 chỉ số <= 2
  return highValues.length === 1 && lowValues.length === 2;
}

// Áp dụng penalty trận pháp lệch
function applyImbalancePenalty(indicators) {
  const { LM, CB, ON } = indicators;
  const maxValue = Math.max(LM, CB, ON);
  
  if (LM === maxValue) indicators.LM = Math.max(0, indicators.LM - 1);
  else if (CB === maxValue) indicators.CB = Math.max(0, indicators.CB - 1);
  else if (ON === maxValue) indicators.ON = Math.max(0, indicators.ON - 1);
}

// Kiểm tra điều kiện thoát trận pháp lệch
function canExitImbalance(indicators) {
  const { LM, CB, ON } = indicators;
  return LM >= 3 && CB >= 3 && ON >= 3;
}

// Xác định ending
function determineEnding(indicators) {
  const { LM, CB, ON } = indicators;
  const values = [LM, CB, ON];
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const diff = maxValue - minValue;
  
  // Ending hoàn hảo
  if (minValue >= 5 && diff <= 1) {
    return {
      type: 'perfect',
      title: 'HOÀN HẢO - PHÁT TRIỂN HÀI HÒA',
      message: 'Xã hội phát triển cân bằng, hài hòa trên mọi phương diện. Mô hình quá độ lên chủ nghĩa xã hội đạt hiệu quả cao nhất!',
      color: '#f1c40f'
    };
  }
  
  // Ending thắng
  if (minValue >= 4 && maxValue <= 6) {
    return {
      type: 'win',
      title: 'THẮNG LỢI - CƠ CẤU XÃ HỘI CÂN BẰNG',
      message: 'Cơ cấu xã hội được duy trì ở mức cân bằng tốt. Quá trình quá độ diễn ra thuận lợi.',
      color: '#27ae60'
    };
  }
  
  // Ending trung bình
  if (minValue >= 3) {
    return {
      type: 'average',
      title: 'ỔN ĐỊNH - ỔN ĐỊNH CẦM CHỪNG',
      message: 'Xã hội duy trì được sự ổn định cơ bản nhưng còn nhiều bất cập. Cần tiếp tục cải thiện.',
      color: '#95a5a6'
    };
  }
  
  // Thất bại
  return {
    type: 'lose',
    title: 'THẤT BẠI - MẤT CÂN BẰNG',
    message: 'Cơ cấu xã hội mất cân bằng nghiêm trọng. Quá trình quá độ gặp nhiều khó khăn.',
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
    
    // 3 chỉ số xã hội (khởi điểm = 5)
    indicators: {
      LM: 5,  // Liên minh xã hội
      CB: 5,  // Cân bằng lợi ích
      ON: 5,  // Ổn định cơ cấu
    },
    
    // Trạng thái trận pháp lệch
    isImbalanced: false,
    
    // Lượt chơi hiện tại (1-10)
    currentTurn: 1,
    
    // Lịch sử các lựa chọn
    history: [],
    
    // Phase của lượt: 'draw', 'choose', 'result'
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
      
      const option = OPTIONS[optionKey];
      const card = G.currentCard;
      
      // Tính toán effects với hệ số nhóm
      const effects = applyGroupBonus(card, option.effects);
      
      // Áp dụng effects lên indicators
      G.indicators.LM = Math.max(0, Math.min(7, G.indicators.LM + effects.LM));
      G.indicators.CB = Math.max(0, Math.min(7, G.indicators.CB + effects.CB));
      G.indicators.ON = Math.max(0, Math.min(7, G.indicators.ON + effects.ON));
      
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
      
      // Kiểm tra game over do chỉ số = 0
      if (G.indicators.LM === 0 || G.indicators.CB === 0 || G.indicators.ON === 0) {
        G.ending = {
          type: 'lose',
          title: 'THẤT BẠI - SỤP ĐỔ',
          message: 'Một trong các chỉ số xã hội giảm về 0. Xã hội rơi vào khủng hoảng!',
          color: '#e74c3c'
        };
        events.endGame();
        return;
      }
      
      // Kiểm tra trận pháp lệch
      if (checkImbalance(G.indicators)) {
        G.isImbalanced = true;
      }
      
      // Áp dụng penalty nếu đang trong trạng thái lệch
      if (G.isImbalanced) {
        applyImbalancePenalty(G.indicators);
        
        // Kiểm tra điều kiện thoát
        if (canExitImbalance(G.indicators)) {
          G.isImbalanced = false;
        }
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
        G.ending = determineEnding(G.indicators);
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
