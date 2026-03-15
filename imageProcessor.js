/**
 * 图片处理模块 (Image Processor)
 * 处理图片上传、EXIF 移除、压缩和 Base64 转换
 */
class ImageProcessor {
  constructor() {
    this.maxWidth = 1200;
    this.quality = 0.8;
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  }
  
  /**
   * 处理图片：移除 EXIF，压缩，转 Base64
   * @param {File} file - 图片文件
   * @param {number} maxWidth - 最大宽度，默认 1200
   * @param {number} quality - 压缩质量，默认 0.8
   * @returns {Promise<string>} - Base64 字符串
   */
  async processImage(file, maxWidth = this.maxWidth, quality = this.quality) {
    try {
      // 验证文件格式
      this.validateImageFormat(file);
      
      // 验证文件大小
      this.validateImageSize(file);
      
      // 加载图片
      const img = await this.loadImage(file);
      
      // 移除 EXIF 并压缩
      const base64 = await this.removeExifAndCompress(img, maxWidth, quality);
      
      return base64;
    } catch (error) {
      console.error('图片处理失败:', error);
      throw error;
    }
  }
  
  /**
   * 验证图片格式
   * @param {File} file - 图片文件
   */
  validateImageFormat(file) {
    if (!this.supportedFormats.includes(file.type)) {
      throw new Error(`不支持的图片格式: ${file.type}。支持的格式：JPEG, PNG, GIF, WebP`);
    }
  }
  
  /**
   * 验证图片大小
   * @param {File} file - 图片文件
   */
  validateImageSize(file) {
    if (file.size > this.maxFileSize) {
      throw new Error(`图片大小超过 ${this.maxFileSize / 1024 / 1024}MB 限制`);
    }
  }
  
  /**
   * 加载图片
   * @param {File} file - 图片文件
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('图片加载失败'));
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * 移除 EXIF 数据并压缩图片
   * @param {HTMLImageElement} img - 图片对象
   * @param {number} maxWidth - 最大宽度
   * @param {number} quality - 压缩质量
   * @returns {Promise<string>} - Base64 字符串
   */
  removeExifAndCompress(img, maxWidth, quality) {
    return new Promise((resolve) => {
      // 计算缩放比例
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // 创建 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      
      // 绘制图片到 Canvas（自动移除 EXIF）
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转换为 Base64
      const base64 = canvas.toDataURL('image/jpeg', quality);
      
      resolve(base64);
    });
  }
  
  /**
   * 批量处理图片
   * @param {FileList} files - 图片文件列表
   * @param {number} maxCount - 最大数量
   * @returns {Promise<Array<string>>} - Base64 字符串数组
   */
  async processMultipleImages(files, maxCount = 5) {
    const fileArray = Array.from(files).slice(0, maxCount);
    const promises = fileArray.map(file => this.processImage(file));
    
    try {
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('批量处理图片失败:', error);
      throw error;
    }
  }
  
  /**
   * 检查图片是否包含 EXIF 数据（用于测试）
   * @param {string} base64 - Base64 字符串
   * @returns {boolean}
   */
  hasExifData(base64) {
    // 简单检查：JPEG 文件的 EXIF 数据通常在文件头部
    // 这是一个简化的检查，实际 EXIF 检测更复杂
    const marker = base64.substring(0, 50);
    return marker.includes('Exif') || marker.includes('EXIF');
  }
}
