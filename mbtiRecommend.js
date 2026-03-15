/**
 * MBTI美食推荐系统
 * 根据MBTI人格类型推荐适合的美食
 */
class MBTIRecommend {
  constructor(containerElement, restaurants, onSelect) {
    this.container = containerElement;
    this.restaurants = restaurants;
    this.onSelect = onSelect;
    
    // MBTI类型对应的美食偏好
    this.mbtiPreferences = {
      'INTJ': {
        name: '建筑师',
        traits: ['独立', '理性', '追求完美'],
        cuisines: ['japanese', 'western'],
        description: '你喜欢精致、有品质的美食，注重食材和制作工艺',
        keywords: ['精致', '品质', '创新']
      },
      'INTP': {
        name: '逻辑学家', 
        traits: ['好奇', '灵活', '独立思考'],
        cuisines: ['western', 'chinese'],
        description: '你对新奇的口味很感兴趣，喜欢尝试不同的美食组合',
        keywords: ['创新', '多样', '实验']
      },
      'ENTJ': {
        name: '指挥官',
        traits: ['领导力', '高效', '目标导向'],
        cuisines: ['western', 'hotpot'],
        description: '你偏爱高档餐厅，享受商务聚餐的氛围',
        keywords: ['高档', '商务', '社交']
      },
      'ENTP': {
        name: '辩论家',
        traits: ['创新', '热情', '善于交际'],
        cuisines: ['korean', 'hotpot'],
        description: '你喜欢热闹的用餐环境，享受和朋友分享美食的乐趣',
        keywords: ['热闹', '分享', '新潮']
      },
      'INFJ': {
        name: '提倡者',
        traits: ['理想主义', '有创造力', '敏感'],
        cuisines: ['japanese', 'chinese'],
        description: '你偏爱有文化内涵的美食，注重用餐的仪式感',
        keywords: ['文化', '仪式感', '健康']
      },
      'INFP': {
        name: '调停者',
        traits: ['理想主义', '忠诚', '适应性强'],
        cuisines: ['chinese', 'snack'],
        description: '你喜欢温馨的小店，偏爱有故事的传统美食',
        keywords: ['温馨', '传统', '故事']
      },
      'ENFJ': {
        name: '主人公',
        traits: ['魅力', '利他', '天生的领袖'],
        cuisines: ['hotpot', 'korean'],
        description: '你享受和朋友聚餐的时光，喜欢能促进交流的美食',
        keywords: ['聚餐', '交流', '温暖']
      },
      'ENFP': {
        name: '竞选者',
        traits: ['热情', '创造力', '社交能力强'],
        cuisines: ['korean', 'western'],
        description: '你喜欢时尚新潮的餐厅，对网红美食很感兴趣',
        keywords: ['时尚', '网红', '多彩']
      },
      'ISTJ': {
        name: '物流师',
        traits: ['实际', '负责任', '可靠'],
        cuisines: ['chinese', 'snack'],
        description: '你偏爱经典传统的美食，注重性价比和实用性',
        keywords: ['传统', '性价比', '可靠']
      },
      'ISFJ': {
        name: '守护者',
        traits: ['温暖', '负责任', '细心'],
        cuisines: ['chinese', 'japanese'],
        description: '你喜欢温馨舒适的用餐环境，偏爱营养健康的美食',
        keywords: ['温馨', '健康', '舒适']
      },
      'ESTJ': {
        name: '总经理',
        traits: ['高效', '可靠', '传统'],
        cuisines: ['chinese', 'western'],
        description: '你偏爱正式的用餐场所，喜欢经典的商务套餐',
        keywords: ['正式', '经典', '商务']
      },
      'ESFJ': {
        name: '执政官',
        traits: ['外向', '友善', '有组织性'],
        cuisines: ['hotpot', 'korean'],
        description: '你享受和朋友家人一起用餐，喜欢热闹的聚餐氛围',
        keywords: ['聚餐', '家庭', '热闹']
      },
      'ISTP': {
        name: '鉴赏家',
        traits: ['灵活', '务实', '好奇'],
        cuisines: ['japanese', 'snack'],
        description: '你对制作工艺很感兴趣，喜欢简单但精致的美食',
        keywords: ['工艺', '简单', '精致']
      },
      'ISFP': {
        name: '探险家',
        traits: ['艺术气质', '灵活', '魅力'],
        cuisines: ['western', 'japanese'],
        description: '你偏爱有艺术感的餐厅，注重美食的颜值和创意',
        keywords: ['艺术', '颜值', '创意']
      },
      'ESTP': {
        name: '企业家',
        traits: ['精力充沛', '实际', '适应性强'],
        cuisines: ['korean', 'hotpot'],
        description: '你喜欢刺激的口味，享受热闹的用餐体验',
        keywords: ['刺激', '热闹', '体验']
      },
      'ESFP': {
        name: '娱乐家',
        traits: ['外向', '友善', '自发'],
        cuisines: ['korean', 'snack'],
        description: '你喜欢有趣好玩的美食，享受和朋友分享的快乐',
        keywords: ['有趣', '分享', '快乐']
      }
    };
  }
  
  render() {
    this.container.innerHTML = `
      <div class="mbti-recommend">
        <div class="mbti-header">
          <h2>🧠 MBTI美食推荐</h2>
          <p>根据你的人格类型，为你推荐最适合的美食</p>
        </div>
        
        <div class="mbti-selector">
          <h3>请选择你的MBTI类型：</h3>
          <div class="mbti-grid">
            ${Object.entries(this.mbtiPreferences).map(([type, info]) => `
              <button class="mbti-type-btn" data-type="${type}">
                <div class="type-code">${type}</div>
                <div class="type-name">${info.name}</div>
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="mbti-result" id="mbtiResult" style="display: none;">
          <!-- 结果会在这里显示 -->
        </div>
      </div>
    `;
    
    // 绑定事件
    this.container.querySelectorAll('.mbti-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        this.showRecommendation(type);
      });
    });
  }
  
  showRecommendation(mbtiType) {
    const preference = this.mbtiPreferences[mbtiType];
    const resultDiv = document.getElementById('mbtiResult');
    
    // 根据MBTI偏好筛选餐厅
    const recommendedRestaurants = this.restaurants.filter(restaurant => 
      preference.cuisines.includes(restaurant.cuisine)
    ).slice(0, 3);
    
    resultDiv.innerHTML = `
      <div class="mbti-analysis">
        <h3>${mbtiType} - ${preference.name}</h3>
        <div class="traits">
          ${preference.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
        </div>
        <p class="description">${preference.description}</p>
        <div class="keywords">
          ${preference.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
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
}