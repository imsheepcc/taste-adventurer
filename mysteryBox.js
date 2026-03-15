/**
 * 盲盒推荐组件 (Mystery Box)
 * 提供盲盒式的餐厅推荐体验
 */
class MysteryBox {
  constructor(containerElement, restaurants, dataLayer, onReveal) {
    this.container = containerElement;
    this.restaurants = restaurants; // 至少 6 个餐厅
    this.dataLayer = dataLayer;
    this.onReveal = onReveal; // 揭示餐厅后的回调
    this.dailyLimit = 3;
    this.openedToday = 0;
    this.boxes = [];
    this.openedBoxes = [];
    
    this.loadDailyState();
  }
  
  /**
   * 加载每日状态
   */
  loadDailyState() {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = this.dataLayer.get(this.dataLayer.storageKeys.MYSTERY_BOX_DATE);
    const savedCount = this.dataLayer.get(this.dataLayer.storageKeys.MYSTERY_BOX_COUNT);
    
    if (savedDate === today) {
      this.openedToday = savedCount || 0;
    } else {
      // 新的一天，重置计数
      this.openedToday = 0;
      this.dataLayer.set(this.dataLayer.storageKeys.MYSTERY_BOX_DATE, today);
      this.dataLayer.set(this.dataLayer.storageKeys.MYSTERY_BOX_COUNT, 0);
    }
  }
  
  /**
   * 保存每日状态
   */
  saveDailyState() {
    const today = new Date().toISOString().split('T')[0];
    this.dataLayer.set(this.dataLayer.storageKeys.MYSTERY_BOX_DATE, today);
    this.dataLayer.set(this.dataLayer.storageKeys.MYSTERY_BOX_COUNT, this.openedToday);
  }
  
  /**
   * 渲染盲盒网格
   */
  render() {
    if (this.restaurants.length < 6) {
      this.container.innerHTML = '<p style="text-align: center; color: #666;">餐厅数量不足，请调整筛选条件</p>';
      return;
    }
    
    const remaining = this.dailyLimit - this.openedToday;
    
    this.container.innerHTML = `
      <div class="mystery-box-container">
        <div class="mystery-header">
          <h2>🎁 神秘盲盒</h2>
          <p class="daily-limit">今日剩余机会：<span class="remaining-count">${remaining}</span> / ${this.dailyLimit}</p>
        </div>
        <div class="box-grid" id="boxGrid"></div>
        <button class="btn-reset" id="resetBtn">🔄 重置盲盒</button>
      </div>
    `;
    
    this.renderBoxes();
    
    // 绑定重置按钮
    document.getElementById('resetBtn').addEventListener('click', () => this.reset());
  }
  
  /**
   * 渲染盲盒
   */
  renderBoxes() {
    const boxGrid = document.getElementById('boxGrid');
    boxGrid.innerHTML = '';
    
    // 取前 6 个餐厅
    this.boxes = this.restaurants.slice(0, 6);
    
    this.boxes.forEach((restaurant, index) => {
      const boxElement = document.createElement('div');
      boxElement.className = 'mystery-box';
      boxElement.dataset.index = index;
      
      if (this.openedBoxes.includes(index)) {
        // 已开启的盲盒
        boxElement.classList.add('opened');
        boxElement.innerHTML = `
          <div class="box-content revealed">
            <div class="restaurant-name">${restaurant.name}</div>
            <div class="restaurant-rating">⭐ ${restaurant.rating}</div>
            <div class="restaurant-price">¥${restaurant.avgPrice}</div>
          </div>
        `;
      } else {
        // 未开启的盲盒
        boxElement.innerHTML = `
          <div class="box-content">
            <div class="box-front">
              <div class="box-icon">🎁</div>
              <div class="box-text">点击开启</div>
            </div>
            <div class="box-back">
              <div class="restaurant-name">${restaurant.name}</div>
              <div class="restaurant-rating">⭐ ${restaurant.rating}</div>
              <div class="restaurant-price">¥${restaurant.avgPrice}</div>
            </div>
          </div>
        `;
        
        boxElement.addEventListener('click', () => this.openBox(index));
      }
      
      boxGrid.appendChild(boxElement);
    });
  }
  
  /**
   * 打开盲盒
   * @param {number} boxIndex - 盲盒索引
   */
  openBox(boxIndex) {
    // 检查每日限制
    if (!this.checkDailyLimit()) {
      alert('今日开启次数已用完，明天再来吧！');
      return;
    }
    
    // 检查是否已开启
    if (this.openedBoxes.includes(boxIndex)) {
      return;
    }
    
    const boxElement = document.querySelector(`.mystery-box[data-index="${boxIndex}"]`);
    const restaurant = this.boxes[boxIndex];
    
    // 添加开启动画
    boxElement.classList.add('opening');
    
    // 动画结束后揭示餐厅
    setTimeout(() => {
      this.revealRestaurant(boxIndex, restaurant);
    }, 600);
  }
  
  /**
   * 揭示餐厅
   * @param {number} boxIndex - 盲盒索引
   * @param {Object} restaurant - 餐厅对象
   */
  revealRestaurant(boxIndex, restaurant) {
    const boxElement = document.querySelector(`.mystery-box[data-index="${boxIndex}"]`);
    boxElement.classList.remove('opening');
    boxElement.classList.add('opened');
    
    // 记录已开启
    this.openedBoxes.push(boxIndex);
    this.openedToday++;
    this.saveDailyState();
    
    // 更新剩余次数显示
    const remaining = this.dailyLimit - this.openedToday;
    document.querySelector('.remaining-count').textContent = remaining;
    
    // 显示详情按钮
    setTimeout(() => {
      const content = boxElement.querySelector('.box-content');
      const detailBtn = document.createElement('button');
      detailBtn.className = 'btn-box-detail';
      detailBtn.textContent = '查看详情';
      detailBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onReveal) {
          this.onReveal(restaurant);
        }
      });
      content.appendChild(detailBtn);
    }, 300);
  }
  
  /**
   * 检查每日限制
   * @returns {boolean}
   */
  checkDailyLimit() {
    return this.openedToday < this.dailyLimit;
  }
  
  /**
   * 重置盲盒
   */
  reset() {
    this.openedBoxes = [];
    this.renderBoxes();
  }
  
  /**
   * 更新餐厅列表
   * @param {Array} restaurants - 新的餐厅列表
   */
  updateRestaurants(restaurants) {
    this.restaurants = restaurants;
    this.openedBoxes = [];
    this.render();
  }
}
