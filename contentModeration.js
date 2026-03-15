/**
 * 内容审核模块 (Content Moderation)
 * 检测敏感词、联系方式，处理举报
 */
class ContentModeration {
  constructor() {
    // 敏感词列表（示例）
    this.sensitiveWords = [
      '广告', '推广', '加我', '代购', '刷单',
      '兼职', '招聘', '贷款', '赌博', '色情'
    ];
    
    // 联系方式正则表达式
    this.contactPatterns = [
      { pattern: /1[3-9]\d{9}/, name: '手机号' },
      { pattern: /\d{5,}/, name: 'QQ号' },
      { pattern: /微信[:：]?\s*[\w\-]+/i, name: '微信号' },
      { pattern: /WeChat[:：]?\s*[\w\-]+/i, name: 'WeChat' },
      { pattern: /@[\w\-]+/, name: '社交账号' }
    ];
    
    // 举报阈值
    this.reportThreshold = 3;
  }
  
  /**
   * 检测敏感词
   * @param {string} text - 待检测文本
   * @returns {Object} - { detected: boolean, words: Array }
   */
  detectSensitiveWords(text) {
    const detectedWords = [];
    
    this.sensitiveWords.forEach(word => {
      if (text.includes(word)) {
        detectedWords.push(word);
      }
    });
    
    return {
      detected: detectedWords.length > 0,
      words: detectedWords
    };
  }
  
  /**
   * 检测联系方式
   * @param {string} text - 待检测文本
   * @returns {Object} - { detected: boolean, types: Array }
   */
  detectContactInfo(text) {
    const detectedTypes = [];
    
    this.contactPatterns.forEach(({ pattern, name }) => {
      if (pattern.test(text)) {
        detectedTypes.push(name);
      }
    });
    
    return {
      detected: detectedTypes.length > 0,
      types: detectedTypes
    };
  }
  
  /**
   * 综合审核
   * @param {string} content - 待审核内容
   * @returns {Object} - { passed: boolean, reason: string, details: Object }
   */
  moderate(content) {
    if (!content || typeof content !== 'string') {
      return {
        passed: false,
        reason: '内容不能为空',
        details: {}
      };
    }
    
    // 检测联系方式
    const contactResult = this.detectContactInfo(content);
    if (contactResult.detected) {
      return {
        passed: false,
        reason: '内容包含联系方式，已被拦截',
        details: {
          type: 'contact',
          detected: contactResult.types
        }
      };
    }
    
    // 检测敏感词
    const sensitiveResult = this.detectSensitiveWords(content);
    if (sensitiveResult.detected) {
      return {
        passed: false,
        reason: '内容包含敏感词汇，已被标记',
        details: {
          type: 'sensitive',
          detected: sensitiveResult.words
        }
      };
    }
    
    return {
      passed: true,
      reason: '审核通过',
      details: {}
    };
  }
  
  /**
   * 处理举报
   * @param {string} contentId - 内容 ID
   * @param {number} reportCount - 当前举报次数
   * @returns {Object} - { shouldHide: boolean, message: string }
   */
  handleReport(contentId, reportCount) {
    if (reportCount >= this.reportThreshold) {
      return {
        shouldHide: true,
        message: `内容已被举报 ${reportCount} 次，自动隐藏并标记为待审核`
      };
    }
    
    return {
      shouldHide: false,
      message: `举报已记录（${reportCount}/${this.reportThreshold}）`
    };
  }
  
  /**
   * 添加敏感词
   * @param {string} word - 敏感词
   */
  addSensitiveWord(word) {
    if (!this.sensitiveWords.includes(word)) {
      this.sensitiveWords.push(word);
    }
  }
  
  /**
   * 移除敏感词
   * @param {string} word - 敏感词
   */
  removeSensitiveWord(word) {
    const index = this.sensitiveWords.indexOf(word);
    if (index > -1) {
      this.sensitiveWords.splice(index, 1);
    }
  }
  
  /**
   * 获取敏感词列表
   * @returns {Array}
   */
  getSensitiveWords() {
    return [...this.sensitiveWords];
  }
}
