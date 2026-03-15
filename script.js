// 餐厅数据
const restaurants = [
    {
        id: 1,
        name: "老北京炸酱面馆",
        cuisine: "chinese",
        campus: "campus1",
        price: "low",
        avgPrice: 18,
        rating: 4.5,
        distance: "200m",
        specialty: ["炸酱面", "卤煮", "豆汁"],
        address: "清华东路15号",
        position: { left: "15%", top: "20%" },
        reviews: [
            { author: "清华-张同学", content: "炸酱面超级正宗，老板是北京人，味道很地道！" },
            { author: "北大-李同学", content: "性价比很高，学生党必备" }
        ]
    },
    {
        id: 2,
        name: "韩式炸鸡店",
        cuisine: "korean",
        campus: "campus2",
        price: "medium",
        avgPrice: 35,
        rating: 4.7,
        distance: "500m",
        specialty: ["炸鸡", "芝士球", "辣炒年糕"],
        address: "北大南门商业街",
        position: { left: "35%", top: "40%" },
        reviews: [
            { author: "北大-王同学", content: "炸鸡外酥里嫩，酱料很多选择！" },
            { author: "人大-赵同学", content: "周末必点，和室友一起吃超爽" }
        ]
    },
    {
        id: 3,
        name: "川味小馆",
        cuisine: "chinese",
        campus: "campus3",
        price: "medium",
        avgPrice: 28,
        rating: 4.6,
        distance: "300m",
        specialty: ["水煮鱼", "麻婆豆腐", "回锅肉"],
        address: "人大西门",
        position: { left: "55%", top: "25%" },
        reviews: [
            { author: "人大-孙同学", content: "辣度可以调，麻婆豆腐超下饭！" }
        ]
    },
    {
        id: 4,
        name: "日式拉面屋",
        cuisine: "japanese",
        campus: "campus1",
        price: "medium",
        avgPrice: 42,
        rating: 4.8,
        distance: "400m",
        specialty: ["豚骨拉面", "叉烧", "溏心蛋"],
        address: "五道口购物中心",
        position: { left: "25%", top: "60%" },
        reviews: [
            { author: "清华-周同学", content: "汤底浓郁，面条劲道，很正宗！" }
        ]
    },
    {
        id: 5,
        name: "海底捞火锅",
        cuisine: "hotpot",
        campus: "campus4",
        price: "high",
        avgPrice: 85,
        rating: 4.9,
        distance: "800m",
        specialty: ["番茄锅", "牛肉", "虾滑"],
        address: "师大路商圈",
        position: { left: "70%", top: "50%" },
        reviews: [
            { author: "师大-吴同学", content: "服务超好，学生证打折很划算！" }
        ]
    },
    {
        id: 6,
        name: "意式披萨店",
        cuisine: "western",
        campus: "campus2",
        price: "medium",
        avgPrice: 45,
        rating: 4.4,
        distance: "600m",
        specialty: ["玛格丽特披萨", "意面", "提拉米苏"],
        address: "北大东门",
        position: { left: "45%", top: "70%" },
        reviews: [
            { author: "北大-郑同学", content: "披萨现烤的，芝士拉丝很长！" }
        ]
    },
    {
        id: 7,
        name: "煎饼果子摊",
        cuisine: "snack",
        campus: "campus1",
        price: "low",
        avgPrice: 8,
        rating: 4.3,
        distance: "100m",
        specialty: ["煎饼果子", "豆浆", "油条"],
        address: "清华西门",
        position: { left: "20%", top: "35%" },
        reviews: [
            { author: "清华-钱同学", content: "早餐首选，又快又好吃！" }
        ]
    },
    {
        id: 8,
        name: "泰式料理",
        cuisine: "western",
        campus: "campus3",
        price: "medium",
        avgPrice: 38,
        rating: 4.5,
        distance: "450m",
        specialty: ["冬阴功汤", "咖喱蟹", "芒果糯米饭"],
        address: "人大南路",
        position: { left: "60%", top: "45%" },
        reviews: [
            { author: "人大-冯同学", content: "口味很正，芒果糯米饭必点！" }
        ]
    }
];

// 全局变量
let dataLayer;
let anonymousSystem;
let recommendationEngine;
let spinWheel;
let mysteryBox;
let mbtiRecommend;
let zodiacRecommend;
let calendarRecommend;
let communityForum;
let currentPage = 'home';

// DOM 元素引用
let restaurantList;
let mapElement;
let modal;
let filterPanel;
let currentFilters = {
    campus: 'all',
    cuisine: 'all', 
    price: 'all'
};

// 初始化
function init() {
    console.log('开始初始化应用...');
    
    try {
        // 获取DOM元素引用
        restaurantList = document.getElementById('restaurantList');
        mapElement = document.getElementById('map');
        modal = document.getElementById('detailModal');
        filterPanel = document.getElementById('filterPanel');
        
        console.log('DOM元素获取完成');
        
        // 初始化核心系统
        initializeSystems();
        console.log('系统初始化完成');
        
        // 显示欢迎动画（仅首次访问）
        showWelcomeAnimation();
        
        // 设置页面切换
        setupNavigation();
        console.log('导航设置完成');
        
        // 初始化首页
        initHomePage();
        console.log('首页初始化完成');
        
        console.log('应用初始化成功！');
    } catch (error) {
        console.error('初始化过程中出现错误:', error);
        // 即使出错也要确保基本功能可用
        setupBasicNavigation();
    }
}

// 基本导航功能（备用方案）
function setupBasicNavigation() {
    console.log('设置基本导航功能...');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (page) {
                showPage(page);
            }
        });
    });
}

// 简单的页面显示功能
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.style.display = 'block';
    }
}

// 初始化系统组件
function initializeSystems() {
    try {
        // 首先初始化数据层
        dataLayer = new DataAccessLayer();
        console.log('数据层初始化成功');
        
        // 初始化匿名系统
        anonymousSystem = new AnonymousSystem(dataLayer);
        console.log('匿名系统初始化成功，ID:', anonymousSystem.getAnonymousId());
        
        // 初始化推荐引擎
        recommendationEngine = new RecommendationEngine(restaurants, dataLayer);
        console.log('推荐引擎初始化成功');
        
        // 初始化社区论坛
        communityForum = new CommunityForum(anonymousSystem, dataLayer);
        console.log('社区论坛初始化成功');
        
        // 加载保存的筛选条件
        const savedFilters = dataLayer.get(dataLayer.storageKeys.FILTERS);
        if (savedFilters) {
            recommendationEngine.setFilters(savedFilters);
            console.log('已加载保存的筛选条件');
        }
    } catch (error) {
        console.error('系统初始化失败:', error);
        // 创建基本的数据层作为备用
        dataLayer = {
            get: () => null,
            set: () => {},
            storageKeys: {}
        };
    }
}

// 显示欢迎动画
function showWelcomeAnimation() {
    try {
        const welcomeOverlay = document.getElementById('welcomeOverlay');
        if (!welcomeOverlay) {
            console.log('欢迎动画元素未找到');
            return;
        }
        
        const hasVisited = dataLayer && dataLayer.get ? dataLayer.get('has_visited') : false;
        
        if (!hasVisited) {
            // 首次访问，显示欢迎动画
            console.log('显示欢迎动画');
            welcomeOverlay.style.display = 'flex';
            
            // 3秒后自动隐藏（CSS动画会在3秒后触发）
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
                if (dataLayer && dataLayer.set) {
                    dataLayer.set('has_visited', true);
                }
                console.log('欢迎动画已隐藏');
            }, 3500);
        } else {
            // 已访问过，直接隐藏
            welcomeOverlay.style.display = 'none';
            console.log('已访问过，跳过欢迎动画');
        }
    } catch (error) {
        console.error('欢迎动画处理失败:', error);
        // 确保欢迎界面不会一直显示
        const welcomeOverlay = document.getElementById('welcomeOverlay');
        if (welcomeOverlay) {
            welcomeOverlay.style.display = 'none';
        }
    }
}

// 设置导航
function setupNavigation() {
    // 导航链接点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (page) {
                switchPage(page);
            }
        });
    });
    
    // 首页logo点击
    document.getElementById('homeBtn').addEventListener('click', (e) => {
        e.preventDefault();
        switchPage('home');
    });
    
    // 快速操作按钮
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.dataset.page;
            if (page) {
                switchPage(page);
            }
        });
    });
    
    // 浮动操作按钮
    const floatingBtn = document.getElementById('floatingBtn');
    if (floatingBtn) {
        floatingBtn.addEventListener('click', () => {
            switchPage('recommend');
        });
    }
}

// 页面切换
function switchPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // 更新导航状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.style.display = 'block';
        currentPage = pageName;
        
        // 激活对应导航
        const navLink = document.querySelector(`[data-page="${pageName}"]`);
        if (navLink && navLink.classList.contains('nav-link')) {
            navLink.classList.add('active');
        }
        
        // 控制浮动按钮显示/隐藏
        const floatingBtn = document.getElementById('floatingBtn');
        if (floatingBtn) {
            if (pageName === 'recommend') {
                floatingBtn.classList.add('hidden');
            } else {
                floatingBtn.classList.remove('hidden');
            }
        }
        
        // 初始化页面内容
        initPage(pageName);
    }
}

// 初始化页面内容
function initPage(pageName) {
    switch (pageName) {
        case 'home':
            initHomePage();
            break;
        case 'recommend':
            initRecommendPage();
            break;
        case 'community':
            initCommunityPage();
            break;
        case 'map':
            initMapPage();
            break;
    }
}

// 初始化首页
function initHomePage() {
    renderRestaurants(restaurants);
    renderMapMarkers(restaurants);
    setupHomeEventListeners();
}

// 设置首页事件监听
function setupHomeEventListeners() {
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    const randomBtn = document.getElementById('randomBtn');
    const applyFilterBtn = document.getElementById('applyFilter');
    const modal = document.getElementById('detailModal');
    const postModal = document.getElementById('postModal');
    
    if (filterBtn && filterPanel) {
        filterBtn.addEventListener('click', () => {
            filterPanel.classList.toggle('active');
        });
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', showRandomRestaurant);
    }
    
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }
    
    // 设置模态框关闭事件
    setupModalEvents(modal);
    setupModalEvents(postModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
        if (e.target === postModal) {
            postModal.classList.remove('active');
        }
    });
}

// 设置模态框事件
function setupModalEvents(modal) {
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
}

// 初始化推荐页面
function initRecommendPage() {
    // 设置标签切换
    setupRecommendTabs();
    
    // 初始化各个推荐组件
    initRecommendComponents();
}

// 设置推荐页面标签切换
function setupRecommendTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchRecommendTab(tabName);
        });
    });
}

// 切换推荐标签
function switchRecommendTab(tabName) {
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // 切换内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    // 初始化对应组件
    initRecommendComponent(tabName);
}

// 初始化推荐组件
function initRecommendComponents() {
    // 默认显示转盘
    initRecommendComponent('wheel');
}

// 初始化具体推荐组件
function initRecommendComponent(type) {
    const selectedRestaurants = recommendationEngine.selectForSpinWheel(8);
    
    switch (type) {
        case 'wheel':
            if (!spinWheel) {
                spinWheel = new SpinWheel(
                    document.getElementById('spinWheel'),
                    selectedRestaurants,
                    (restaurant) => {
                        recommendationEngine.recordChoice(restaurant, 'spin_wheel');
                        showRestaurantDetail(restaurant);
                    }
                );
            }
            spinWheel.updateRestaurants(selectedRestaurants);
            spinWheel.render();
            break;
            
        case 'mystery':
            if (!mysteryBox) {
                mysteryBox = new MysteryBox(
                    document.getElementById('mysteryBox'),
                    selectedRestaurants.slice(0, 6),
                    dataLayer,
                    (restaurant) => {
                        recommendationEngine.recordChoice(restaurant, 'mystery_box');
                        showRestaurantDetail(restaurant);
                    }
                );
            }
            mysteryBox.updateRestaurants(selectedRestaurants.slice(0, 6));
            mysteryBox.render();
            break;
            
        case 'mbti':
            if (!mbtiRecommend) {
                mbtiRecommend = new MBTIRecommend(
                    document.getElementById('mbtiRecommend'),
                    restaurants,
                    showRestaurantDetail
                );
            }
            mbtiRecommend.render();
            break;
            
        case 'zodiac':
            if (!zodiacRecommend) {
                zodiacRecommend = new ZodiacRecommend(
                    document.getElementById('zodiacRecommend'),
                    restaurants,
                    showRestaurantDetail
                );
            }
            zodiacRecommend.render();
            break;
            
        case 'calendar':
            if (!calendarRecommend) {
                calendarRecommend = new CalendarRecommend(
                    document.getElementById('calendarRecommend'),
                    restaurants,
                    showRestaurantDetail
                );
            }
            calendarRecommend.render();
            break;
    }
}

// 初始化社区页面
function initCommunityPage() {
    renderCommunityPosts();
    setupCommunityEventListeners();
}

// 渲染社区帖子
function renderCommunityPosts() {
    const filters = {
        university: document.getElementById('communityUniversity')?.value || 'all',
        category: document.getElementById('communityCategory')?.value || 'all'
    };
    
    const posts = communityForum.getPosts(filters);
    const container = document.getElementById('communityContent');
    
    if (posts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">暂无动态</p>';
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <h4>${post.title}</h4>
                <div class="post-meta">
                    <span>${communityForum.getUniversityName(post.university)}</span>
                    <span>${communityForum.getCategoryName(post.category)}</span>
                    <span>${communityForum.formatTime(post.timestamp)}</span>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="post-actions">
                <button class="action-btn" onclick="likePost('${post.id}')">
                    👍 ${post.likes}
                </button>
                <button class="action-btn">
                    💬 ${post.replies}
                </button>
            </div>
        </div>
    `).join('');
}

// 设置社区事件监听
function setupCommunityEventListeners() {
    // 筛选器变化
    const universityFilter = document.getElementById('communityUniversity');
    const categoryFilter = document.getElementById('communityCategory');
    const newPostBtn = document.getElementById('newPostBtn');
    const newPostForm = document.getElementById('newPostForm');
    
    if (universityFilter) {
        universityFilter.addEventListener('change', renderCommunityPosts);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', renderCommunityPosts);
    }
    
    // 发布动态按钮
    if (newPostBtn) {
        newPostBtn.addEventListener('click', showPostModal);
    }
    
    // 发布表单提交
    if (newPostForm) {
        newPostForm.addEventListener('submit', handlePostSubmit);
    }
    
    // 设置发布动态模态框关闭事件
    const postModal = document.getElementById('postModal');
    setupModalEvents(postModal);
}

// 显示发布动态弹窗
function showPostModal() {
    const postModal = document.getElementById('postModal');
    if (postModal) {
        postModal.classList.add('active');
    }
}

// 处理发布动态
function handlePostSubmit(e) {
    e.preventDefault();
    
    const titleInput = document.getElementById('postTitle');
    const contentInput = document.getElementById('postContent');
    const categoryInput = document.getElementById('postCategory');
    const universityInput = document.getElementById('postUniversity');
    const postModal = document.getElementById('postModal');
    const newPostForm = document.getElementById('newPostForm');
    
    if (!titleInput || !contentInput || !categoryInput || !universityInput) {
        console.error('Post form elements not found');
        return;
    }
    
    const postData = {
        title: titleInput.value,
        content: contentInput.value,
        category: categoryInput.value,
        university: universityInput.value,
        tags: []
    };
    
    if (communityForum) {
        communityForum.createPost(postData);
    }
    
    // 关闭弹窗并刷新列表
    if (postModal) {
        postModal.classList.remove('active');
    }
    
    if (newPostForm) {
        newPostForm.reset();
    }
    
    renderCommunityPosts();
}

// 点赞帖子
function likePost(postId) {
    communityForum.likePost(postId);
    renderCommunityPosts();
}

// 初始化地图页面
function initMapPage() {
    renderFullMap();
}

// 渲染完整地图
function renderFullMap() {
    const fullMapContainer = document.getElementById('fullMap');
    if (!fullMapContainer) {
        console.error('Full map container not found');
        return;
    }
    
    // 清除现有的餐厅标记
    const existingMarkers = fullMapContainer.querySelectorAll('.restaurant-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // 添加餐厅标记
    restaurants.forEach(restaurant => {
        const marker = document.createElement('div');
        marker.className = 'restaurant-marker';
        marker.style.left = restaurant.position.left;
        marker.style.top = restaurant.position.top;
        marker.title = restaurant.name;
        marker.dataset.cuisine = restaurant.cuisine;
        
        // 根据菜系设置不同颜色
        const cuisineColors = {
            chinese: '#FF6B6B',
            western: '#4ECDC4', 
            japanese: '#45B7D1',
            korean: '#96CEB4',
            hotpot: '#FFEAA7',
            snack: '#DDA0DD'
        };
        
        marker.style.background = cuisineColors[restaurant.cuisine] || '#FF6B6B';
        
        marker.onclick = (e) => {
            e.stopPropagation();
            showRestaurantDetail(restaurant);
        };
        
        fullMapContainer.appendChild(marker);
    });
    
    console.log('地图页面已初始化，添加了', restaurants.length, '个餐厅标记');
}

// 渲染餐厅列表
function renderRestaurants(data) {
    if (!restaurantList) {
        restaurantList = document.getElementById('restaurantList');
    }
    
    if (!restaurantList) {
        console.error('Restaurant list element not found');
        return;
    }
    
    restaurantList.innerHTML = '';
    
    if (data.length === 0) {
        restaurantList.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">没有找到符合条件的餐厅</p>';
        return;
    }
    
    data.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        restaurantList.appendChild(card);
    });
}

// 创建餐厅卡片
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.onclick = () => showRestaurantDetail(restaurant);
    
    const cuisineMap = {
        chinese: '中餐',
        western: '西餐',
        japanese: '日料',
        korean: '韩餐',
        hotpot: '火锅',
        snack: '小吃'
    };
    
    card.innerHTML = `
        <h3>${restaurant.name}</h3>
        <div class="restaurant-tags">
            <span class="tag cuisine">${cuisineMap[restaurant.cuisine]}</span>
            <span class="tag price">人均¥${restaurant.avgPrice}</span>
        </div>
        <div class="restaurant-info">
            <div class="rating">⭐ ${restaurant.rating} 分</div>
            <div class="distance">📍 距离 ${restaurant.distance}</div>
            <div>🍽️ 特色：${restaurant.specialty.slice(0, 2).join('、')}</div>
        </div>
    `;
    
    return card;
}

// 渲染地图标记
function renderMapMarkers(data) {
    if (!mapElement) {
        mapElement = document.getElementById('map');
    }
    
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }
    
    // 清除现有标记，但保留占位符内容
    const existingMarkers = mapElement.querySelectorAll('.map-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    data.forEach(restaurant => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.style.left = restaurant.position.left;
        marker.style.top = restaurant.position.top;
        marker.title = restaurant.name;
        marker.onclick = (e) => {
            e.stopPropagation();
            showRestaurantDetail(restaurant);
        };
        mapElement.appendChild(marker);
    });
}

// 显示餐厅详情
function showRestaurantDetail(restaurant) {
    if (!modal) {
        modal = document.getElementById('detailModal');
    }
    
    const modalBody = document.getElementById('modalBody');
    
    const cuisineMap = {
        chinese: '中餐',
        western: '西餐',
        japanese: '日料',
        korean: '韩餐',
        hotpot: '火锅',
        snack: '小吃'
    };
    
    modalBody.innerHTML = `
        <div class="detail-header">
            <h2>${restaurant.name}</h2>
            <div class="restaurant-tags">
                <span class="tag cuisine">${cuisineMap[restaurant.cuisine]}</span>
                <span class="tag price">人均¥${restaurant.avgPrice}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>📊 基本信息</h4>
            <p>⭐ 评分：${restaurant.rating} 分</p>
            <p>📍 距离：${restaurant.distance}</p>
            <p>🏠 地址：${restaurant.address}</p>
        </div>
        
        <div class="detail-section">
            <h4>🍽️ 特色菜品</h4>
            <div class="specialty-list">
                ${restaurant.specialty.map(item => `<div class="specialty-item">${item}</div>`).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h4>💬 学生评价</h4>
            ${restaurant.reviews.map(review => `
                <div class="review">
                    <div class="review-author">${review.author}</div>
                    <div>${review.content}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.classList.add('active');
}

// 将函数添加到全局作用域，供其他组件调用
window.showRestaurantDetail = showRestaurantDetail;

// 随机推荐
function showRandomRestaurant() {
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    const randomRestaurant = restaurants[randomIndex];
    showRestaurantDetail(randomRestaurant);
}

// 应用筛选
function applyFilters() {
    currentFilters.campus = document.getElementById('campusFilter').value;
    currentFilters.cuisine = document.getElementById('cuisineFilter').value;
    currentFilters.price = document.getElementById('priceFilter').value;
    
    const filtered = restaurants.filter(restaurant => {
        const campusMatch = currentFilters.campus === 'all' || restaurant.campus === currentFilters.campus;
        const cuisineMatch = currentFilters.cuisine === 'all' || restaurant.cuisine === currentFilters.cuisine;
        const priceMatch = currentFilters.price === 'all' || restaurant.price === currentFilters.price;
        
        return campusMatch && cuisineMatch && priceMatch;
    });
    
    renderRestaurants(filtered);
    renderMapMarkers(filtered);
    
    if (filterPanel) {
        filterPanel.classList.remove('active');
    }
}

// 启动应用
init();

// 显示转盘
function showSpinWheel() {
    // 隐藏地图和餐厅列表
    document.querySelector('.map-container').style.display = 'none';
    document.getElementById('restaurantList').style.display = 'none';
    document.getElementById('mysteryBoxContainer').style.display = 'none';
    
    // 显示转盘容器
    const spinWheelContainer = document.getElementById('spinWheelContainer');
    spinWheelContainer.style.display = 'block';
    
    // 获取推荐餐厅
    const selectedRestaurants = recommendationEngine.selectForSpinWheel(8);
    
    // 初始化转盘
    spinWheel = new SpinWheel(
        document.getElementById('spinWheel'),
        selectedRestaurants,
        (restaurant) => {
            // 记录用户选择
            recommendationEngine.recordChoice(restaurant, 'spin_wheel');
            // 显示餐厅详情
            showRestaurantDetail(restaurant);
        }
    );
    
    spinWheel.render();
}

// 显示盲盒
function showMysteryBox() {
    // 隐藏地图和餐厅列表
    document.querySelector('.map-container').style.display = 'none';
    document.getElementById('restaurantList').style.display = 'none';
    document.getElementById('spinWheelContainer').style.display = 'none';
    
    // 显示盲盒容器
    const mysteryBoxContainer = document.getElementById('mysteryBoxContainer');
    mysteryBoxContainer.style.display = 'block';
    
    // 获取推荐餐厅
    const selectedRestaurants = recommendationEngine.selectForMysteryBox(6);
    
    // 初始化盲盒
    mysteryBox = new MysteryBox(
        document.getElementById('mysteryBox'),
        selectedRestaurants,
        dataLayer,
        (restaurant) => {
            // 记录用户选择
            recommendationEngine.recordChoice(restaurant, 'mystery_box');
            // 显示餐厅详情
            showRestaurantDetail(restaurant);
        }
    );
    
    mysteryBox.render();
}
