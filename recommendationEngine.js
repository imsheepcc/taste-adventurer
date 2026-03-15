/**
 * 推荐引擎 (Recommendation Engine)
 * 根据筛选条件和用户偏好推荐餐厅
 */
class RecommendationEngine {
  constructor(allRestaurants, dataLayer) {
    this.allRestaurants = allRestaurants;
    this.dataLayer = dataLayer;
    this.filters = {
      priceRange: null,    // '0-10' | '10-20' | '20+'
      distance: null,      // '500m' | '1km' | '2km'
      cuisine: null,       // '中餐' | '西餐' | '日韩料理' 等
      minRating: null      // 最低评分
    };
    this.userHistory = this.loadHistory();
  }
  
  /**
   * 加载用户历史记录
   */
  loadHistory() {
    const history = this.dataLayer.get(this.dataLayer.storageKeys.HISTORY);
    return history || [];
  }
  
  /**
   * 保存用户历史记录
   */
  saveHistory() {
    this.dataLayer.set(this.dataLayer.storageKeys.HISTORY, this.userHistory);
  }
  
  /**
   * 设置筛选条件
   * @param {Object} filters - 筛选条件对象
   */
  setFilters(filters) {
    this.filters = { ...this.filters, ...filters };
    
    // 持久化筛选条件
    this.dataLayer.set(this.dataLayer.storageKeys.FILTERS, this.filters);
  }
  
  /**
   * 获取符合条件的餐厅
   * @returns {Array} - 符合筛选条件的餐厅列表
   */
  getFilteredRestaurants() {
    return this.allRestaurants.filter(restaurant => {
      // 价格筛选
      if (this.filters.priceRange) {
        if (!this.matchPriceRange(restaurant.avgPrice, this.filters.priceRange)) {
          return false;
        }
      }
      
      // 距离筛选
      if (this.filters.distance) {
        if (!this.matchDistance(restaurant.distance, this.filters.distance)) {
          return false;
        }
      }
      
      // 菜系筛选
      if (this.filters.cuisine) {
        const cuisineMap = {
          '中餐': 'chinese',
          '西餐': 'western',
          '日韩料理': ['japanese', 'korean'],
          '火锅': 'hotpot',
          '小吃': 'snack'
        };
        
        const targetCuisine = cuisineMap[this.filters.cuisine];
        if (Array.isArray(targetCuisine)) {
          if (!targetCuisine.includes(restaurant.cuisine)) {
            return false;
          }
        } else {
          if (restaurant.cuisine !== targetCuisine) {
            return false;
          }
        }
      }
      
      // 评分筛选
      if (this.filters.minRating) {
        if (restaurant.rating < this.filters.minRating) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  /**
   * 匹配价格区间
   */
  matchPriceRange(avgPrice, range) {
    switch (range) {
      case '0-10':
        return avgPrice <= 10;
      case '10-20':
        return avgPrice > 10 && avgPrice <= 20;
      case '20+':
        return avgPrice > 20;
      default:
        return true;
    }
  }
  
  /**
   * 匹配距离
   */
  matchDistance(distanceStr, maxDistance) {
    const distance = parseInt(distanceStr);
    const max = parseInt(maxDistance);
    
    if (maxDistance.includes('km')) {
      return distance <= max * 1000;
    } else {
      return distance <= max;
    }
  }
  
  /**
   * 基于历史偏好计算权重
   * @param {Array} restaurants - 餐厅列表
   * @returns {Array} - 带权重的餐厅列表
   */
  calculateWeights(restaurants) {
    // 统计用户历史偏好的菜系
    const cuisinePreference = {};
    this.userHistory.forEach(record => {
      const restaurant = this.allRestaurants.find(r => r.id === record.restaurantId);
      if (restaurant) {
        cuisinePreference[restaurant.cuisine] = (cuisinePreference[restaurant.cuisine] || 0) + 1;
      }
    });
    
    // 计算每个餐厅的权重
    return restaurants.map(restaurant => {
      let weight = 1.0; // 基础权重
      
      // 历史偏好加权
      if (cuisinePreference[restaurant.cuisine]) {
        weight += 0.5 * cuisinePreference[restaurant.cuisine];
      }
      
      // 评分加权
      weight += (restaurant.rating - 3) * 0.4; // 3分为基准
      
      // 距离加权（距离越近权重越高）
      const distance = parseInt(restaurant.distance);
      if (distance <= 500) {
        weight += 0.3;
      } else if (distance <= 1000) {
        weight += 0.2;
      } else if (distance <= 2000) {
        weight += 0.1;
      }
      
      return { ...restaurant, weight };
    });
  }
  
  /**
   * 加权随机选择
   * @param {Array} weightedRestaurants - 带权重的餐厅列表
   * @param {number} count - 选择数量
   * @returns {Array} - 选中的餐厅列表
   */
  weightedRandomSelect(weightedRestaurants, count) {
    const selected = [];
    const available = [...weightedRestaurants];
    
    for (let i = 0; i < count && available.length > 0; i++) {
      // 计算总权重
      const totalWeight = available.reduce((sum, r) => sum + r.weight, 0);
      
      // 随机选择
      let random = Math.random() * totalWeight;
      let selectedIndex = 0;
      
      for (let j = 0; j < available.length; j++) {
        random -= available[j].weight;
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }
      
      selected.push(available[selectedIndex]);
      available.splice(selectedIndex, 1);
    }
    
    return selected;
  }
  
  /**
   * 为转盘选择餐厅（至少 8 个）
   * @param {number} count - 餐厅数量，默认 8
   * @returns {Array} - 选中的餐厅列表
   */
  selectForSpinWheel(count = 8) {
    const filtered = this.getFilteredRestaurants();
    
    if (filtered.length < count) {
      console.warn(`符合条件的餐厅不足 ${count} 个，返回所有符合条件的餐厅`);
      return filtered;
    }
    
    const weighted = this.calculateWeights(filtered);
    return this.weightedRandomSelect(weighted, count);
  }
  
  /**
   * 为盲盒选择餐厅（至少 6 个）
   * @param {number} count - 餐厅数量，默认 6
   * @returns {Array} - 选中的餐厅列表
   */
  selectForMysteryBox(count = 6) {
    const filtered = this.getFilteredRestaurants();
    
    if (filtered.length < count) {
      console.warn(`符合条件的餐厅不足 ${count} 个，返回所有符合条件的餐厅`);
      return filtered;
    }
    
    const weighted = this.calculateWeights(filtered);
    return this.weightedRandomSelect(weighted, count);
  }
  
  /**
   * 记录用户选择
   * @param {Object} restaurant - 选中的餐厅
   * @param {string} source - 来源 ('spin_wheel' | 'mystery_box')
   */
  recordChoice(restaurant, source) {
    this.userHistory.push({
      restaurantId: restaurant.id,
      timestamp: Date.now(),
      source: source
    });
    
    // 限制历史记录数量（最多保留 50 条）
    if (this.userHistory.length > 50) {
      this.userHistory = this.userHistory.slice(-50);
    }
    
    this.saveHistory();
  }
}
