/**
 * 黄历美食推荐系统
 * 根据传统黄历和五行理论推荐适合的美食
 */
class CalendarRecommend {
  constructor(containerElement, restaurants, onSelect) {
    this.container = containerElement;
    this.restaurants = restaurants;
    this.onSelect = onSelect;
    
    // 五行对应的美食属性
    this.wuxingFood = {
      '金': {
        color: '白色',
        flavors: ['辛', '甘'],
        cuisines: ['western', 'japanese'],
        foods: ['白萝卜', '银耳', '豆腐', '牛奶'],
        description: '金属性食物有助于润肺养气，适合秋季食用'
      },
      '木': {
        color: '绿色',
        flavors: ['酸', '甘'],
        cuisines: ['chinese', 'japanese'],
        foods: ['青菜', '柠檬', '绿茶', '春笋'],
        description: '木属性食物有助于养肝明目，适合春季食用'
      },
      '水': {
        color: '黑色',
        flavors: ['咸', '甘'],
        cuisines: ['chinese', 'japanese'],
        foods: ['黑豆', '海带', '黑芝麻', '紫菜'],
        description: '水属性食物有助于补肾益精，适合冬季食用'
      },
      '火': {
        color: '红色',
        flavors: ['苦', '辛'],
        cuisines: ['korean', 'hotpot'],
        foods: ['红枣', '胡萝卜', '辣椒', '西红柿'],
        description: '火属性食物有助于养心安神，适合夏季食用'
      },
      '土': {
        color: '黄色',
        flavors: ['甘', '淡'],
        cuisines: ['chinese', 'snack'],
        foods: ['小米', '南瓜', '土豆', '玉米'],
        description: '土属性食物有助于健脾养胃，四季皆宜'
      }
    };
    
    // 二十四节气
    this.solarTerms = [
      { name: '立春', date: [2, 4], wuxing: '木', description: '万物复苏，宜食温补' },
      { name: '雨水', date: [2, 19], wuxing: '木', description: '春雨润物，宜食养肝' },
      { name: '惊蛰', date: [3, 6], wuxing: '木', description: '阳气上升，宜食清淡' },
      { name: '春分', date: [3, 21], wuxing: '木', description: '阴阳平衡，宜食平和' },
      { name: '清明', date: [4, 5], wuxing: '木', description: '清气上升，宜食时蔬' },
      { name: '谷雨', date: [4, 20], wuxing: '土', description: '雨生百谷，宜食养脾' },
      { name: '立夏', date: [5, 6], wuxing: '火', description: '夏季开始，宜食养心' },
      { name: '小满', date: [5, 21], wuxing: '火', description: '麦粒饱满，宜食清热' },
      { name: '芒种', date: [6, 6], wuxing: '火', description: '忙于收种，宜食补气' },
      { name: '夏至', date: [6, 21], wuxing: '火', description: '阳气最盛，宜食清凉' },
      { name: '小暑', date: [7, 7], wuxing: '火', description: '暑热渐盛，宜食消暑' },
      { name: '大暑', date: [7, 23], wuxing: '土', description: '最热时节，宜食清淡' },
      { name: '立秋', date: [8, 8], wuxing: '金', description: '秋季开始，宜食润燥' },
      { name: '处暑', date: [8, 23], wuxing: '金', description: '暑气渐消，宜食养肺' },
      { name: '白露', date: [9, 8], wuxing: '金', description: '露水渐白，宜食温润' },
      { name: '秋分', date: [9, 23], wuxing: '金', description: '昼夜等长，宜食平补' },
      { name: '寒露', date: [10, 8], wuxing: '金', description: '露水转寒，宜食温补' },
      { name: '霜降', date: [10, 24], wuxing: '土', description: '霜始降临，宜食健脾' },
      { name: '立冬', date: [11, 8], wuxing: '水', description: '冬季开始，宜食温阳' },
      { name: '小雪', date: [11, 22], wuxing: '水', description: '雪花飞舞，宜食补肾' },
      { name: '大雪', date: [12, 7], wuxing: '水', description: '雪量增大，宜食温热' },
      { name: '冬至', date: [12, 22], wuxing: '水', description: '阴气最盛，宜食大补' },
      { name: '小寒', date: [1, 6], wuxing: '水', description: '寒气渐盛，宜食温阳' },
      { name: '大寒', date: [1, 20], wuxing: '土', description: '最寒时节，宜食温补' }
    ];
  }
  
  render() {
    const today = new Date();
    const currentTerm = this.getCurrentSolarTerm(today);
    const todayWuxing = this.getTodayWuxing(today);
    const luckyTime = this.getLuckyTime(today);
    
    this.container.innerHTML = `
      <div class="calendar-recommend">
        <div class="calendar-header">
          <h2>📅 黄历美食推荐</h2>
          <p>根据传统黄历和五行理论，为你推荐今日适宜的美食</p>
        </div>
        
        <div class="today-info">
          <div class="date-info">
            <h3>📅 ${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日</h3>
            <p>农历：${this.getLunarDate(today)}</p>
          </div>
          
          <div class="solar-term">
            <h4>🌸 当前节气：${currentTerm.name}</h4>
            <p>${currentTerm.description}</p>
          </div>
          
          <div class="wuxing-info">
            <h4>⚡ 今日五行：${todayWuxing}</h4>
            <p>${this.wuxingFood[todayWuxing].description}</p>
          </div>
          
          <div class="lucky-time">
            <h4>🕐 最佳用餐时间：${luckyTime}</h4>
          </div>
        </div>
        
        <div class="wuxing-recommendation">
          <h3>🍽️ 今日推荐美食属性</h3>
          <div class="wuxing-card">
            <div class="wuxing-symbol">${todayWuxing}</div>
            <div class="wuxing-details">
              <div class="wuxing-color">主色：${this.wuxingFood[todayWuxing].color}</div>
              <div class="wuxing-flavors">口味：${this.wuxingFood[todayWuxing].flavors.join('、')}</div>
              <div class="wuxing-foods">
                推荐食材：${this.wuxingFood[todayWuxing].foods.join('、')}
              </div>
            </div>
          </div>
        </div>
        
        <div class="recommended-restaurants">
          <h3>🏪 推荐餐厅</h3>
          <div class="restaurant-grid" id="calendarRestaurants">
            <!-- 动态生成 -->
          </div>
        </div>
        
        <div class="fortune-advice">
          <h3>💡 今日饮食建议</h3>
          <div class="advice-content">
            ${this.getTodayAdvice(todayWuxing, currentTerm)}
          </div>
        </div>
        
        <button class="btn-primary" onclick="location.reload()">🔄 重新测算</button>
      </div>
    `;
    
    this.showRecommendedRestaurants(todayWuxing);
  }
  
  getCurrentSolarTerm(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 简化的节气计算，实际应该更精确
    for (let term of this.solarTerms) {
      const [termMonth, termDay] = term.date;
      if (month === termMonth && day >= termDay) {
        return term;
      }
      if (month === termMonth + 1 && day < termDay) {
        return term;
      }
    }
    
    // 默认返回当前季节对应的节气
    if (month >= 3 && month <= 5) return this.solarTerms.find(t => t.name === '春分');
    if (month >= 6 && month <= 8) return this.solarTerms.find(t => t.name === '夏至');
    if (month >= 9 && month <= 11) return this.solarTerms.find(t => t.name === '秋分');
    return this.solarTerms.find(t => t.name === '冬至');
  }
  
  getTodayWuxing(date) {
    // 根据日期计算今日五行（简化算法）
    const day = date.getDate();
    const wuxingCycle = ['金', '木', '水', '火', '土'];
    return wuxingCycle[day % 5];
  }
  
  getLuckyTime(date) {
    const times = [
      '早上7-9点（辰时）',
      '上午9-11点（巳时）',
      '中午11-13点（午时）',
      '下午13-15点（未时）',
      '下午15-17点（申时）',
      '傍晚17-19点（酉时）'
    ];
    
    const day = date.getDate();
    return times[day % times.length];
  }
  
  getLunarDate(date) {
    // 简化的农历日期显示
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', 
                        '七月', '八月', '九月', '十月', '冬月', '腊月'];
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    
    // 简化计算，实际应该使用专业的农历转换算法
    const month = date.getMonth();
    const day = date.getDate();
    
    return `${lunarMonths[month]}${lunarDays[day - 1]}`;
  }
  
  showRecommendedRestaurants(wuxing) {
    const container = document.getElementById('calendarRestaurants');
    const wuxingCuisines = this.wuxingFood[wuxing].cuisines;
    
    const recommendedRestaurants = this.restaurants.filter(restaurant => 
      wuxingCuisines.includes(restaurant.cuisine)
    ).slice(0, 3);
    
    container.innerHTML = recommendedRestaurants.map(restaurant => `
      <div class="mini-restaurant-card" onclick="window.showRestaurantDetail && window.showRestaurantDetail(${JSON.stringify(restaurant).replace(/"/g, '&quot;')})">
        <h5>${restaurant.name}</h5>
        <div class="mini-rating">⭐ ${restaurant.rating}</div>
        <div class="mini-price">¥${restaurant.avgPrice}</div>
        <div class="mini-specialty">${restaurant.specialty[0]}</div>
        <div class="wuxing-match">五行：${wuxing}</div>
      </div>
    `).join('');
  }
  
  getTodayAdvice(wuxing, solarTerm) {
    const advices = {
      '金': [
        '今日宜食白色食物，如银耳、白萝卜，有助润肺养气',
        '避免过于油腻的食物，选择清淡的烹饪方式',
        '可适当食用坚果类食物，补充营养'
      ],
      '木': [
        '今日宜食绿色蔬菜，如菠菜、青菜，有助养肝明目',
        '可适当食用酸味食物，如柠檬、醋，帮助消化',
        '避免过于辛辣的食物，以免伤肝'
      ],
      '水': [
        '今日宜食黑色食物，如黑豆、黑芝麻，有助补肾益精',
        '可适当食用咸味食物，但不宜过量',
        '多喝温水，保持身体水分平衡'
      ],
      '火': [
        '今日宜食红色食物，如红枣、胡萝卜，有助养心安神',
        '可适当食用苦味食物，如苦瓜，清热降火',
        '避免过于寒凉的食物，以免伤阳气'
      ],
      '土': [
        '今日宜食黄色食物，如小米、南瓜，有助健脾养胃',
        '选择温和的食物，避免过于刺激的口味',
        '规律饮食，定时定量，养护脾胃'
      ]
    };
    
    const wuxingAdvice = advices[wuxing];
    const seasonAdvice = `${solarTerm.name}时节，${solarTerm.description.toLowerCase()}`;
    
    return `
      <div class="advice-item">
        <h4>🌟 五行建议：</h4>
        <ul>
          ${wuxingAdvice.map(advice => `<li>${advice}</li>`).join('')}
        </ul>
      </div>
      <div class="advice-item">
        <h4>🌸 节气建议：</h4>
        <p>${seasonAdvice}</p>
      </div>
    `;
  }
}