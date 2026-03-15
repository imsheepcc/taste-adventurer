/**
 * 匿名系统 (Anonymous System)
 * 生成和管理用户的匿名标识符
 */
class AnonymousSystem {
  constructor(dataLayer) {
    this.dataLayer = dataLayer;
    this.anonymousId = null;
    this.init();
  }
  
  /**
   * 初始化匿名 ID
   * 从 LocalStorage 加载或生成新的 ID
   */
  init() {
    // 尝试从存储中加载现有 ID
    const storedId = this.dataLayer.get(this.dataLayer.storageKeys.ANONYMOUS_ID);
    
    if (storedId && this.validateAnonymousId(storedId)) {
      this.anonymousId = storedId;
    } else {
      // 生成新的匿名 ID
      this.anonymousId = this.generateAnonymousId();
      this.dataLayer.set(this.dataLayer.storageKeys.ANONYMOUS_ID, this.anonymousId);
    }
  }
  
  /**
   * 生成匿名 ID
   * 格式：anon_ + 哈希值
   * @returns {string}
   */
  generateAnonymousId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const hash = this._simpleHash(timestamp + random);
    return `anon_${hash}`;
  }
  
  /**
   * 简单哈希函数
   * @param {string} str - 输入字符串
   * @returns {string} - 哈希值（36 进制）
   */
  _simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  /**
   * 获取当前匿名 ID
   * @returns {string}
   */
  getAnonymousId() {
    return this.anonymousId;
  }
  
  /**
   * 验证匿名 ID 格式
   * @param {string} id - 待验证的 ID
   * @returns {boolean}
   */
  validateAnonymousId(id) {
    if (typeof id !== 'string') {
      return false;
    }
    
    // 检查格式：anon_ 开头，后跟字母数字
    const pattern = /^anon_[a-z0-9]+$/;
    return pattern.test(id);
  }
}

// 导出（需要在使用时传入 dataLayer 实例）
