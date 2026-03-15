/**
 * 社区论坛 (Community Forum)
 * 实现创建帖子方法（标题、内容、图片、标签）
 */
class CommunityForum {
  constructor(anonymousSystem, dataLayer) {
    this.anonymousSystem = anonymousSystem;
    this.dataLayer = dataLayer;
    this.posts = this.loadPosts();
  }
  
  loadPosts() {
    const posts = this.dataLayer.get('community_posts') || [];
    // 如果没有帖子，创建一些示例帖子
    if (posts.length === 0) {
      return this.createSamplePosts();
    }
    return posts;
  }
  
  createSamplePosts() {
    const samplePosts = [
      {
        id: 'post_1',
        title: '清华东门的炸酱面真的绝了！',
        content: '昨天去吃了老北京炸酱面馆，真的太正宗了！面条劲道，酱料浓郁，老板还是地道北京人，聊天特别有意思。强烈推荐给大家！',
        category: 'restaurant',
        university: 'tsinghua',
        anonymousId: 'anon_sample1',
        timestamp: Date.now() - 86400000,
        likes: 15,
        replies: 3,
        tags: ['炸酱面', '清华', '北京菜']
      },
      {
        id: 'post_2', 
        title: 'ENFP的我发现了完美的韩餐厅！',
        content: '作为一个ENFP，我对新鲜事物总是很好奇。今天发现北大南门的韩式炸鸡店，装修超级ins风，炸鸡也很好吃！和室友一起去，氛围特别棒~',
        category: 'mbti',
        university: 'pku',
        anonymousId: 'anon_sample2',
        timestamp: Date.now() - 172800000,
        likes: 8,
        replies: 1,
        tags: ['ENFP', '韩餐', '北大', '炸鸡']
      },
      {
        id: 'post_3',
        title: '双子座的美食探险日记',
        content: '双子座的好奇心让我总想尝试新东西！这周试了五道口的日式拉面，汤底真的很浓郁，还有溏心蛋！下次想试试他们家的其他口味~',
        category: 'zodiac',
        university: 'tsinghua',
        anonymousId: 'anon_sample3',
        timestamp: Date.now() - 259200000,
        likes: 12,
        replies: 2,
        tags: ['双子座', '日料', '拉面', '五道口']
      }
    ];
    
    this.dataLayer.set('community_posts', samplePosts);
    return samplePosts;
  }
  
  createPost(postData) {
    const post = {
      id: `post_${Date.now()}`,
      title: postData.title,
      content: postData.content,
      category: postData.category,
      university: postData.university,
      anonymousId: this.anonymousSystem.getAnonymousId(),
      timestamp: Date.now(),
      likes: 0,
      replies: 0,
      tags: postData.tags || []
    };
    
    this.posts.unshift(post);
    this.dataLayer.set('community_posts', this.posts);
    return post;
  }
  
  getPosts(filters = {}) {
    let filteredPosts = [...this.posts];
    
    if (filters.university && filters.university !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.university === filters.university);
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === filters.category);
    }
    
    return filteredPosts.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  likePost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes++;
      this.dataLayer.set('community_posts', this.posts);
    }
  }
  
  getUniversityName(code) {
    const universities = {
      'tsinghua': '清华大学',
      'pku': '北京大学', 
      'ruc': '人民大学',
      'bnu': '北京师范大学'
    };
    return universities[code] || code;
  }
  
  getCategoryName(code) {
    const categories = {
      'restaurant': '餐厅推荐',
      'cuisine': '美食类型',
      'mbti': 'MBTI美食',
      'zodiac': '星座美食'
    };
    return categories[code] || code;
  }
  
  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
    
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
}