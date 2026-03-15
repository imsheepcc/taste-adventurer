/**
 * 转盘抽奖组件 (Spin Wheel)
 * 提供趣味性的餐厅推荐方式
 */
class SpinWheel {
  constructor(containerElement, restaurants, onSelect) {
    this.container = containerElement;
    this.restaurants = restaurants; // 至少 8 个餐厅
    this.onSelect = onSelect; // 选中餐厅后的回调
    this.isSpinning = false;
    this.selectedRestaurant = null;
    this.wheelElement = null;
    this.pointerElement = null;
  }
  
  /**
   * 渲染转盘
   */
  render() {
    if (this.restaurants.length < 8) {
      this.container.innerHTML = '<p style="text-align: center; color: #666;">餐厅数量不足，请调整筛选条件</p>';
      return;
    }
    
    this.container.innerHTML = `
      <div class="spin-wheel-container">
        <div class="wheel-wrapper">
          <div class="wheel" id="wheel"></div>
          <div class="wheel-pointer">▼</div>
        </div>
        <button class="btn-spin" id="spinBtn">🎰 开始抽奖</button>
        <button class="btn-respin" id="respinBtn" style="display: none;">🔄 再转一次</button>
        <div class="selected-result" id="selectedResult" style="display: none;"></div>
      </div>
    `;
    
    this.wheelElement = document.getElementById('wheel');
    this.renderWheelSections();
    
    // 绑定事件
    document.getElementById('spinBtn').addEventListener('click', () => this.spin());
    document.getElementById('respinBtn').addEventListener('click', () => this.respin());
  }
  
  /**
   * 渲染转盘扇形区域
   */
  renderWheelSections() {
    const sectionCount = this.restaurants.length;
    const anglePerSection = 360 / sectionCount;
    
    this.wheelElement.innerHTML = '';
    
    this.restaurants.forEach((restaurant, index) => {
      const section = document.createElement('div');
      section.className = 'wheel-section';
      section.style.transform = `rotate(${anglePerSection * index}deg)`;
      
      const colors = ['#FF6B9D', '#FFA07A', '#FFD700', '#4ECDC4', '#A29BFE', '#FD79A8', '#6C5CE7', '#FF7675'];
      section.style.background = colors[index % colors.length];
      
      const label = document.createElement('div');
      label.className = 'wheel-label';
      label.textContent = restaurant.name;
      label.style.transform = `rotate(${anglePerSection / 2}deg) translateY(-80px)`;
      
      section.appendChild(label);
      this.wheelElement.appendChild(section);
    });
  }
  
  /**
   * 开始旋转动画
   */
  spin() {
    if (this.isSpinning) {
      return;
    }
    
    this.isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('selectedResult').style.display = 'none';
    document.getElementById('respinBtn').style.display = 'none';
    
    // 随机选择一个餐厅
    const selectedIndex = Math.floor(Math.random() * this.restaurants.length);
    this.selectedRestaurant = this.restaurants[selectedIndex];
    
    // 计算旋转角度
    const anglePerSection = 360 / this.restaurants.length;
    const targetAngle = 360 - (anglePerSection * selectedIndex + anglePerSection / 2);
    
    // 随机旋转圈数（5-8 圈）
    const spins = 5 + Math.floor(Math.random() * 4);
    const totalRotation = spins * 360 + targetAngle;
    
    // 随机旋转时长（2-4 秒）
    const duration = 2000 + Math.random() * 2000;
    
    // 应用旋转动画
    this.wheelElement.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    this.wheelElement.style.transform = `rotate(${totalRotation}deg)`;
    
    // 动画结束后显示结果
    setTimeout(() => {
      this.stopAt(selectedIndex);
    }, duration);
  }
  
  /**
   * 停止并选中餐厅
   * @param {number} restaurantIndex - 餐厅索引
   */
  stopAt(restaurantIndex) {
    this.isSpinning = false;
    this.selectedRestaurant = this.restaurants[restaurantIndex];
    
    // 显示结果
    this.showSelectedResult();
    
    // 显示"再转一次"按钮
    document.getElementById('respinBtn').style.display = 'inline-block';
    document.getElementById('spinBtn').disabled = false;
  }
  
  /**
   * 显示选中的餐厅结果
   */
  showSelectedResult() {
    const resultDiv = document.getElementById('selectedResult');
    resultDiv.style.display = 'block';
    
    resultDiv.innerHTML = `
      <div class="result-card">
        <h3>🎉 恭喜！抽中了</h3>
        <h2>${this.selectedRestaurant.name}</h2>
        <p>⭐ ${this.selectedRestaurant.rating} 分 | 📍 ${this.selectedRestaurant.distance}</p>
        <p>💰 人均 ¥${this.selectedRestaurant.avgPrice}</p>
        <button class="btn-detail" id="viewDetailBtn">查看详情</button>
      </div>
    `;
    
    // 绑定查看详情按钮
    document.getElementById('viewDetailBtn').addEventListener('click', () => {
      if (this.onSelect) {
        this.onSelect(this.selectedRestaurant);
      }
    });
  }
  
  /**
   * 重新旋转
   */
  respin() {
    // 重置转盘角度
    this.wheelElement.style.transition = 'none';
    this.wheelElement.style.transform = 'rotate(0deg)';
    
    // 强制重绘
    this.wheelElement.offsetHeight;
    
    // 重新开始
    setTimeout(() => {
      this.spin();
    }, 100);
  }
  
  /**
   * 更新餐厅列表
   * @param {Array} restaurants - 新的餐厅列表
   */
  updateRestaurants(restaurants) {
    this.restaurants = restaurants;
    this.render();
  }
}
