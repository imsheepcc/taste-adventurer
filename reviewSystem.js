/**
 * 评价系统 (Review System)
 * 管理餐厅评价，包括匿名评价、频率限制、异常检测
 */
class ReviewSystem {
  constructor(anonymousSystem, contentModeration, dataLayer) {
    this.anonymousSystem = anonymousSystem;
    this.contentModeration = contentModeration;
    this.dataLayer = dataLayer;
  }
  
  /**
   * 提交评价
   * @param {string} restaurantId - 餐厅 ID
   * @param {number} rating - 评分 (1-5)
   * @param {string} content - 评价内容
   * @param {Array<string>} images - 图片 Base64 数组
   * @returns {Object} - { success: boolean, message: string, reviewId: string }
   */
  submitReview(restaurantId, rating, content, images = []) {
    // 验证评分范围
    if (rating < 1 || rating > 5) {
      return {
        success: false,
        message: '评分必须在 1-5 之间'
      };
    }
    
    // 验证图片数量
    if (images.length > 3) {
      return {
        success: false,
        message: '最多只能上传 3 张图片'
      };
    }
    
    // 检查本月是否已评价
    if (this.hasReviewedThisMonth(restaurantId)) {
      return {
        success: false,
        message: '本月已评价过该餐厅，请下月再来'
      };
    }
    
    // 内容审核
    const moderationResult = this.contentModeration.moderate(content);
    if (!moderationResult.passed) {
      return {
        success: false,
        message: moderationResult.reason
      };
    }
    
    // 创建评价
    const review = {
      id: this.generateId(),
      restaurantId: restaurantId,
      anonymousId: this.anonymousSystem.getAnonymousId(),
      rating: rating,
      content: content,
      images: images,
      timestamp: Date.now(),
      editedTimestamp: null,
      hasEdited: false,
      likes: 0,
      isSuspicious: false
    };
    
    // 保存评价
    const reviews = this.getAllReviews();
    reviews.push(review);
    this.dataLayer.set(this.dataLayer.storageKeys.REVIEWS, reviews);
    
    // 检测异常评价模式
    this.detectAnomalousPattern(restaurantId);
    
    return {
      success: true,
      message: '评价提交成功',
      reviewId: review.id
    };
  }
  
  /**
   * 获取餐厅的所有评价
   * @param {string} restaurantId - 餐厅 ID
   * @param {string} sortBy - 排序方式 ('time' | 'likes')
   * @returns {Array} - 评价列表
   */
  getReviews(restaurantId, sortBy = 'time') {
    const allReviews = this.getAllReviews();
    let reviews = allReviews.filter(r => r.restaurantId === restaurantId);
    
    // 排序
    if (sortBy === 'time') {
      reviews.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'likes') {
      reviews.sort((a, b) => b.likes - a.likes);
    }
    
    return reviews;
  }
  
  /**
   * 编辑评价（仅允许一次）
   * @param {string} reviewId - 评价 ID
   * @param {string} newContent - 新内容
   * @returns {Object} - { success: boolean, message: string }
   */
  editReview(reviewId, newContent) {
    const reviews = this.getAllReviews();
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
      return {
        success: false,
        message: '评价不存在'
      };
    }
    
    // 检查是否是本人的评价
    if (review.anonymousId !== this.anonymousSystem.getAnonymousId()) {
      return {
        success: false,
        message: '只能编辑自己的评价'
      };
    }
    
    // 检查是否已编辑过
    if (review.hasEdited) {
      return {
        success: false,
        message: '评价只能编辑一次'
      };
    }
    
    // 内容审核
    const moderationResult = this.contentModeration.moderate(newContent);
    if (!moderationResult.passed) {
      return {
        success: false,
        message: moderationResult.reason
      };
    }
    
    // 更新评价
    review.content = newContent;
    review.editedTimestamp = Date.now();
    review.hasEdited = true;
    
    this.dataLayer.set(this.dataLayer.storageKeys.REVIEWS, reviews);
    
    return {
      success: true,
      message: '评价编辑成功'
    };
  }
  
  /**
   * 检查用户是否已评价过该餐厅（本月）
   * @param {string} restaurantId - 餐厅 ID
   * @returns {boolean}
   */
  hasReviewedThisMonth(restaurantId) {
    const reviews = this.getAllReviews();
    const anonymousId = this.anonymousSystem.getAnonymousId();
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return reviews.some(review => {
      if (review.restaurantId !== restaurantId || review.anonymousId !== anonymousId) {
        return false;
      }
      
      const reviewDate = new Date(review.timestamp);
      return reviewDate.getMonth() === currentMonth && reviewDate.getFullYear() === currentYear;
    });
  }
  
  /**
   * 计算餐厅平均评分
   * @param {string} restaurantId - 餐厅 ID
   * @returns {number} - 平均评分
   */
  calculateAverageRating(restaurantId) {
    const reviews = this.getReviews(restaurantId);
    
    if (reviews.length === 0) {
      return 0;
    }
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // 保留一位小数
  }
  
  /**
   * 统计评价时间分布
   * @param {string} restaurantId - 餐厅 ID
   * @param {number} days - 天数
   * @returns {number} - 指定天数内的评价数量
   */
  getReviewCountInDays(restaurantId, days) {
    const reviews = this.getReviews(restaurantId);
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    return reviews.filter(review => review.timestamp >= cutoffTime).length;
  }
  
  /**
   * 检测异常评价模式
   * @param {string} restaurantId - 餐厅 ID
   * @returns {boolean} - 是否检测到异常
   */
  detectAnomalousPattern(restaurantId) {
    const reviews = this.getReviews(restaurantId);
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    
    // 统计 24 小时内的 5 星评价
    const recentFiveStars = reviews.filter(review => 
      review.timestamp >= last24Hours && review.rating === 5
    );
    
    if (recentFiveStars.length > 10) {
      // 标记这些评价为可疑
      const allReviews = this.getAllReviews();
      recentFiveStars.forEach(suspiciousReview => {
        const review = allReviews.find(r => r.id === suspiciousReview.id);
        if (review) {
          review.isSuspicious = true;
        }
      });
      
      this.dataLayer.set(this.dataLayer.storageKeys.REVIEWS, allReviews);
      return true;
    }
    
    return false;
  }
  
  /**
   * 获取所有评价
   * @returns {Array}
   */
  getAllReviews() {
    return this.dataLayer.get(this.dataLayer.storageKeys.REVIEWS) || [];
  }
  
  /**
   * 生成唯一 ID
   * @returns {string}
   */
  generateId() {
    return `review_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
