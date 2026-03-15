/**
 * 数据访问层 (Data Access Layer)
 * 封装 LocalStorage 操作，提供统一的数据 CRUD 接口
 */
class DataAccessLayer {
  constructor() {
    this.storageKeys = {
      ANONYMOUS_ID: 'user_anonymous_id',
      THEME: 'user_theme',
      FILTERS: 'user_filters',
      HISTORY: 'user_history',
      POSTS: 'community_posts',
      REPLIES: 'community_replies',
      REVIEWS: 'restaurant_reviews',
      LIKES: 'user_likes',
      REPORTS: 'content_reports',
      POST_TIMESTAMPS: 'post_timestamps',
      REPLY_TIMESTAMPS: 'reply_timestamps',
      MYSTERY_BOX_DATE: 'mystery_box_date',
      MYSTERY_BOX_COUNT: 'mystery_box_count',
    };
    
    // 检查 LocalStorage 是否可用
    this.isAvailable = this._checkAvailability();
    
    // 如果不可用，使用内存存储作为降级方案
    if (!this.isAvailable) {
      console.warn('LocalStorage 不可用，使用内存存储（数据不会持久化）');
      this.memoryStorage = {};
    }
  }
  
  /**
   * 检查 LocalStorage 是否可用
   */
  _checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * 存储数据
   * @param {string} key - 存储键
   * @param {*} value - 存储值（会被 JSON 序列化）
   * @returns {boolean} - 是否成功
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      
      if (this.isAvailable) {
        localStorage.setItem(key, serialized);
      } else {
        this.memoryStorage[key] = serialized;
      }
      
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('存储空间已满');
        this._showStorageFullWarning();
        return false;
      }
      console.error('存储数据失败:', e);
      return false;
    }
  }
  
  /**
   * 获取数据
   * @param {string} key - 存储键
   * @returns {*} - 解析后的值，如果不存在返回 null
   */
  get(key) {
    try {
      let serialized;
      
      if (this.isAvailable) {
        serialized = localStorage.getItem(key);
      } else {
        serialized = this.memoryStorage[key];
      }
      
      if (serialized === null || serialized === undefined) {
        return null;
      }
      
      return JSON.parse(serialized);
    } catch (e) {
      console.error('读取数据失败:', e);
      return null;
    }
  }
  
  /**
   * 删除数据
   * @param {string} key - 存储键
   */
  remove(key) {
    try {
      if (this.isAvailable) {
        localStorage.removeItem(key);
      } else {
        delete this.memoryStorage[key];
      }
    } catch (e) {
      console.error('删除数据失败:', e);
    }
  }
  
  /**
   * 清除所有数据
   */
  clear() {
    try {
      if (this.isAvailable) {
        localStorage.clear();
      } else {
        this.memoryStorage = {};
      }
    } catch (e) {
      console.error('清除数据失败:', e);
    }
  }
  
  /**
   * 检查存储空间使用情况
   * @returns {Object} - { used: number, total: number, percentage: number }
   */
  checkStorageSpace() {
    if (!this.isAvailable) {
      return { used: 0, total: 0, percentage: 0 };
    }
    
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      
      // LocalStorage 通常限制为 5-10MB，这里假设 5MB
      const limit = 5 * 1024 * 1024;
      const percentage = (total / limit) * 100;
      
      return {
        used: total,
        total: limit,
        percentage: percentage
      };
    } catch (e) {
      console.error('检查存储空间失败:', e);
      return { used: 0, total: 0, percentage: 0 };
    }
  }
  
  /**
   * 获取存储使用情况（人类可读格式）
   * @returns {string}
   */
  getStorageUsage() {
    const { used, total, percentage } = this.checkStorageSpace();
    
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };
    
    return `已使用 ${formatBytes(used)} / ${formatBytes(total)} (${percentage.toFixed(1)}%)`;
  }
  
  /**
   * 显示存储空间已满警告
   */
  _showStorageFullWarning() {
    // 这个方法会在 UI 层被覆盖或扩展
    console.warn('存储空间已满！请清理一些数据。');
  }
  
  /**
   * 检查是否需要警告用户（使用率超过 80%）
   * @returns {boolean}
   */
  shouldWarnUser() {
    const { percentage } = this.checkStorageSpace();
    return percentage > 80;
  }
}

// 导出单例实例
const dataLayer = new DataAccessLayer();
