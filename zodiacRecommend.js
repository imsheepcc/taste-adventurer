/**
 * 星座美食推荐系统
 * 根据十二星座特性推荐适合的美食
 */
class ZodiacRecommend {
  constructor(containerElement, restaurants, onSelect) {
    this.container = containerElement;
    this.restaurants = restaurants;
    this.onSelect = onSelect;
    
    // 十二星座对应的美食偏好
    this.zodiacPreferences = {
      'aries': {
        name: '白羊座',
        element: '火象',
        dates: '3.21-4.19',
        traits: ['热情', '冲动', '喜欢刺激'],
        cuisines: ['korean', 'hotpot'],
        flavors: ['辣', '刺激', '热烈'],
        description: '白羊座喜欢刺激的口味，偏爱辣味和热气腾腾的美食',
        luckyFood: '韩式炸鸡',
        emoji: '♈'
      },
      'taurus': {
        name: '金牛座',
        element: '土象',
        dates: '4.20-5.20',
        traits: ['稳重', '享受', '重视品质'],
        cuisines: ['western', 'chinese'],
        flavors: ['醇厚', '经典', '高品质'],
        description: '金牛座注重食物的品质和口感，偏爱经典美味',
        luckyFood: '牛排',
        emoji: '♉'
      },
      'gemini': {
        name: '双子座',
        element: '风象',
        dates: '5.21-6.21',
        traits: ['好奇', '多变', '喜欢新鲜'],
        cuisines: ['japanese', 'western'],
        flavors: ['多样', '新奇', '轻盈'],
        description: '双子座喜欢尝试各种不同的美食，偏爱精致多样的料理',
        luckyFood: '日式料理',
        emoji: '♊'
      },
      'cancer': {
        name: '巨蟹座',
        element: '水象',
        dates: '6.22-7.22',
        traits: ['温柔', '恋家', '重视情感'],
        cuisines: ['chinese', 'snack'],
        flavors: ['温暖', '家常', '怀旧'],
        description: '巨蟹座偏爱温暖的家常菜，喜欢有情感寄托的美食',
        luckyFood: '家常菜',
        emoji: '♋'
      },
      'leo': {
        name: '狮子座',
        element: '火象',
        dates: '7.23-8.22',
        traits: ['自信', '华丽', '喜欢被关注'],
        cuisines: ['western', 'hotpot'],
        flavors: ['华丽', '丰盛', '高档'],
        description: '狮子座喜欢华丽丰盛的美食，偏爱高档餐厅的用餐体验',
        luckyFood: '法式大餐',
        emoji: '♌'
      },
      'virgo': {
        name: '处女座',
        element: '土象',
        dates: '8.23-9.22',
        traits: ['完美主义', '注重健康', '挑剔'],
        cuisines: ['japanese', 'chinese'],
        flavors: ['清淡', '健康', '精致'],
        description: '处女座注重食物的健康和精致，偏爱清淡营养的料理',
        luckyFood: '日式定食',
        emoji: '♍'
      },
      'libra': {
        name: '天秤座',
        element: '风象',
        dates: '9.23-10.23',
        traits: ['优雅', '平衡', '重视美感'],
        cuisines: ['western', 'japanese'],
        flavors: ['优雅', '平衡', '美观'],
        description: '天秤座重视美食的颜值和优雅，偏爱精美的摆盘',
        luckyFood: '法式甜点',
        emoji: '♎'
      },
      'scorpio': {
        name: '天蝎座',
        element: '水象',
        dates: '10.24-11.22',
        traits: ['神秘', '强烈', '喜欢深度'],
        cuisines: ['chinese', 'japanese'],
        flavors: ['浓郁', '神秘', '层次丰富'],
        description: '天蝎座喜欢口味浓郁、层次丰富的美食',
        luckyFood: '川菜',
        emoji: '♏'
      },
      'sagittarius': {
        name: '射手座',
        element: '火象',
        dates: '11.23-12.21',
        traits: ['自由', '冒险', '乐观'],
        cuisines: ['western', 'korean'],
        flavors: ['异域', '冒险', '自由'],
        description: '射手座喜欢尝试异域风情的美食，享受美食带来的冒险感',
        luckyFood: '异国料理',
        emoji: '♐'
      },
      'capricorn': {
        name: '摩羯座',
        element: '土象',
        dates: '12.22-1.19',
        traits: ['务实', '传统', '有耐心'],
        cuisines: ['chinese', 'western'],
        flavors: ['传统', '实在', '经典'],
        description: '摩羯座偏爱传统经典的美食，注重实用和营养',
        luckyFood: '传统中餐',
        emoji: '♑'
      },
      'aquarius': {
        name: '水瓶座',
        element: '风象',
        dates: '1.20-2.18',
        traits: ['创新', '独特', '前卫'],
        cuisines: ['western', 'japanese'],
        flavors: ['创新', '独特', '前卫'],
        description: '水瓶座喜欢创新独特的美食，对新奇的料理很感兴趣',
        luckyFood: '分子料理',
        emoji: '♒'
      },
      'pisces': {
        name: '双鱼座',
        element: '水象',
        dates: '2.19-3.20',
        traits: ['浪漫', '梦幻', '敏感'],
        cuisines: ['japanese', 'western'],
        flavors: ['浪漫', '梦幻', '温柔'],
        description: '双鱼座偏爱浪漫梦幻的美食，喜欢有故事的料理',
        luckyFood: '法式甜点',
        emoji: '♓'
      }
    };
  }
  
  render() {
    this.container.innerHTML = `
      <div class="zodiac-recommend">
        <div class="zodiac-header">
          <h2>⭐ 星座美食推荐</h2>
          <p>根据你的星座特性，为你推荐最适合的美食</p>
        </div>
        
        <div class="zodiac-selector">
          <h3>请选择你的星座：</h3>
          <div class="zodiac-grid">
            ${Object.entries(this.zodiacPreferences).map(([sign, info]) => `
              <button class="zodiac-btn" data-sign="${sign}">
                <div class="zodiac-emoji">${info.emoji}</div>
                <div class="zodiac-name">${info.name}</div>
                <div class="zodiac-dates">${info.dates}</div>
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="zodiac-result" id="zodiacResult" style="display: none;">
          <!-- 结果会在这里显示 -->
        </div>
      </div>
    `;
    
    // 绑定事件
    this.container.querySelectorAll('.zodiac-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sign = e.currentTarget.dataset.sign;
        this.showRecommendation(sign);
      });
    });
  }
  
  showRecommendation(zodiacSign) {
    const preference = this.zodiacPreferences[zodiacSign];
    const resultDiv = document.getElementById('zodiacResult');
    
    // 根据星座偏好筛选餐厅
    const recommendedRestaurants = this.restaurants.filter(restaurant => 
      preference.cuisines.includes(restaurant.cuisine)
    ).slice(0, 3);
    
    // 获取今日运势
    const todayLuck = this.getTodayLuck(zodiacSign);
    
    resultDiv.innerHTML = `
      <div class="zodiac-analysis">
        <div class="zodiac-info">
          <h3>${preference.emoji} ${preference.name}</h3>
          <div class="zodiac-meta">
            <span class="element-tag">${preference.element}星座</span>
            <span class="dates-tag">${preference.dates}</span>
          </div>
        </div>
        
        <div class="traits-section">
          <h4>性格特点：</h4>
          <div class="traits">
            ${preference.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
          </div>
        </div>
        
        <div class="flavor-section">
          <h4>口味偏好：</h4>
          <div class="flavors">
            ${preference.flavors.map(flavor => `<span class="flavor-tag">${flavor}</span>`).join('')}
          </div>
        </div>
        
        <p class="description">${preference.description}</p>
        
        <div class="lucky-food">
          <h4>🍀 幸运美食：${preference.luckyFood}</h4>
        </div>
        
        <div class="today-luck">
          <h4>📅 今日美食运势：</h4>
          <p>${todayLuck}</p>
        </div>
      </div>
      
      <div class="recommended-restaurants">
        <h4>🍽️ 为你推荐的餐厅：</h4>
        <div class="restaurant-grid">
          ${recommendedRestaurants.map(restaurant => `
            <div class="mini-restaurant-card" onclick="window.showRestaurantDetail && window.showRestaurantDetail(${JSON.stringify(restaurant).replace(/"/g, '&quot;')})">
              <h5>${restaurant.name}</h5>
              <div class="mini-rating">⭐ ${restaurant.rating}</div>
              <div class="mini-price">¥${restaurant.avgPrice}</div>
              <div class="mini-specialty">${restaurant.specialty[0]}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <button class="btn-primary" onclick="this.parentElement.style.display='none'">重新选择</button>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth' });
  }
  
  getTodayLuck(zodiacSign) {
    const luckMessages = {
      'aries': ['今天适合尝试辣味美食，会带来好运气！', '火象星座的你今天特别适合吃火锅哦~'],
      'taurus': ['今天适合享受高品质的美食，犒赏一下自己吧！', '土象星座的稳重让你今天特别适合品尝经典菜品'],
      'gemini': ['今天的好奇心特别强，试试新的料理吧！', '风象星座的你今天适合尝试多样化的美食'],
      'cancer': ['今天特别想念家的味道，来点家常菜吧！', '水象星座的温柔让你今天特别适合温暖的汤品'],
      'leo': ['今天适合去高档餐厅，享受被服务的感觉！', '火象星座的华丽今天特别闪耀，适合精致美食'],
      'virgo': ['今天特别注重健康，选择清淡营养的食物吧！', '土象星座的完美主义让你今天特别挑剔，选最好的！'],
      'libra': ['今天的审美在线，选择颜值高的美食吧！', '风象星座的优雅让你今天特别适合精美的料理'],
      'scorpio': ['今天适合品尝口味浓郁的美食，满足你的深度需求！', '水象星座的神秘让你今天特别适合有层次的口味'],
      'sagittarius': ['今天的冒险精神爆棚，试试异域美食吧！', '火象星座的自由让你今天特别适合探索新口味'],
      'capricorn': ['今天适合选择传统经典的美食，稳妥又美味！', '土象星座的务实让你今天特别适合实在的好菜'],
      'aquarius': ['今天的创新思维活跃，试试前卫的料理吧！', '风象星座的独特让你今天特别适合创意美食'],
      'pisces': ['今天特别浪漫，选择有故事的美食吧！', '水象星座的梦幻让你今天特别适合温柔的甜品']
    };
    
    const messages = luckMessages[zodiacSign] || ['今天是美食的好日子！'];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}