// 大学城美食地图 - 完整版应用
// 所有功能集成在一个文件中，确保稳定性

console.log('🍜 美食地图应用开始加载...');

// ==================== 数据定义 ====================

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
let currentPage = 'home';
let currentFilters = { campus: 'all', cuisine: 'all', price: 'all' };
let communityPosts = [];
let mysteryBoxCount = 3;
let wheelSpinning = false;
// ==================== 核心功能 ====================

// 页面切换
function switchPage(pageName) {
    console.log('切换到页面:', pageName);
    
    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // 更新导航状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // 激活对应导航
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.textContent.includes(getPageTitle(pageName))) {
                link.classList.add('active');
            }
        });
        
        // 控制浮动按钮
        const floatingBtn = document.querySelector('.floating-action-btn');
        if (floatingBtn) {
            if (pageName === 'recommend') {
                floatingBtn.style.display = 'none';
            } else {
                floatingBtn.style.display = 'flex';
            }
        }
        
        // 初始化页面内容
        initializePage(pageName);
    }
}

// 获取页面标题
function getPageTitle(pageName) {
    const titles = {
        'home': '首页',
        'recommend': '趣味推荐',
        'community': '美食社区',
        'map': '地图探索'
    };
    return titles[pageName] || pageName;
}

// 初始化页面内容
function initializePage(pageName) {
    switch (pageName) {
        case 'home':
            renderRestaurants();
            renderMapMarkers();
            break;
        case 'recommend':
            initializeRecommendPage();
            break;
        case 'community':
            renderCommunityPosts();
            break;
        case 'map':
            renderFullMapMarkers();
            break;
    }
}
// ==================== 首页功能 ====================

// 渲染餐厅列表
function renderRestaurants(filteredData = null) {
    const restaurantList = document.getElementById('restaurantList');
    if (!restaurantList) return;
    
    const data = filteredData || restaurants;
    const cuisineMap = {
        chinese: '中餐',
        western: '西餐',
        japanese: '日料',
        korean: '韩餐',
        hotpot: '火锅',
        snack: '小吃'
    };
    
    if (data.length === 0) {
        restaurantList.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">没有找到符合条件的餐厅</p>';
        return;
    }
    
    restaurantList.innerHTML = data.map(restaurant => `
        <div class="restaurant-card" onclick="showRestaurantDetail(${restaurant.id})">
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
        </div>
    `).join('');
}

// 渲染地图标记
function renderMapMarkers(filteredData = null) {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // 清除现有标记
    const existingMarkers = mapElement.querySelectorAll('.map-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    const data = filteredData || restaurants;
    data.forEach(restaurant => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.style.left = restaurant.position.left;
        marker.style.top = restaurant.position.top;
        marker.title = restaurant.name;
        marker.onclick = (e) => {
            e.stopPropagation();
            showRestaurantDetail(restaurant.id);
        };
        mapElement.appendChild(marker);
    });
}

// 显示餐厅详情
function showRestaurantDetail(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    const cuisineMap = {
        chinese: '中餐',
        western: '西餐',
        japanese: '日料',
        korean: '韩餐',
        hotpot: '火锅',
        snack: '小吃'
    };
    
    const modalBody = document.getElementById('modalBody');
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
    
    document.getElementById('detailModal').classList.add('active');
}
// 随机推荐
function randomRecommend() {
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    const randomRestaurant = restaurants[randomIndex];
    showRestaurantDetail(randomRestaurant.id);
}

// 切换筛选面板
function toggleFilter() {
    const filterPanel = document.getElementById('filterPanel');
    if (filterPanel) {
        filterPanel.classList.toggle('active');
    }
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
    
    const filterPanel = document.getElementById('filterPanel');
    if (filterPanel) {
        filterPanel.classList.remove('active');
    }
}

// ==================== 推荐页面功能 ====================

// 初始化推荐页面
function initializeRecommendPage() {
    initializeSpinWheel();
    initializeMysteryBoxes();
    initializeMBTIGrid();
    initializeZodiacGrid();
    initializeCalendarRecommend();
}

// 切换推荐标签
function switchRecommendTab(tabName) {
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchRecommendTab('${tabName}')"]`).classList.add('active');
    
    // 切换内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// 转盘功能
function initializeSpinWheel() {
    const wheel = document.getElementById('wheel');
    if (!wheel) return;
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#98FB98'];
    const selectedRestaurants = restaurants.slice(0, 8);
    
    wheel.innerHTML = '<div class="wheel-pointer">🔽</div>' + 
        selectedRestaurants.map((restaurant, index) => {
            const angle = (360 / selectedRestaurants.length) * index;
            return `
                <div class="wheel-section" style="
                    transform: rotate(${angle}deg);
                    background: ${colors[index % colors.length]};
                ">
                    <div class="wheel-label" style="
                        transform: rotate(${90 - angle}deg);
                        left: 70%;
                        top: 10px;
                    ">${restaurant.name}</div>
                </div>
            `;
        }).join('');
}

function spinWheel() {
    if (wheelSpinning) return;
    
    wheelSpinning = true;
    const wheel = document.getElementById('wheel');
    const resultDiv = document.getElementById('wheelResult');
    
    const spins = Math.floor(Math.random() * 5) + 5; // 5-10圈
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = spins * 360 + finalAngle;
    
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    wheel.style.transition = 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)';
    
    setTimeout(() => {
        const selectedIndex = Math.floor((360 - finalAngle) / (360 / 8)) % 8;
        const selectedRestaurant = restaurants[selectedIndex];
        
        resultDiv.innerHTML = `
            <div class="result-card">
                <h3>🎉 推荐结果</h3>
                <h2>${selectedRestaurant.name}</h2>
                <p>⭐ ${selectedRestaurant.rating} 分</p>
                <p>💰 人均¥${selectedRestaurant.avgPrice}</p>
                <p>🍽️ ${selectedRestaurant.specialty[0]}</p>
                <button class="btn-detail" onclick="showRestaurantDetail(${selectedRestaurant.id})">查看详情</button>
            </div>
        `;
        
        wheelSpinning = false;
        wheel.style.transition = '';
    }, 3000);
}
// 盲盒功能
function initializeMysteryBoxes() {
    const boxGrid = document.getElementById('mysteryBoxes');
    if (!boxGrid) return;
    
    const selectedRestaurants = restaurants.slice(0, 6);
    
    boxGrid.innerHTML = selectedRestaurants.map((restaurant, index) => `
        <div class="mystery-box" id="box-${index}" onclick="openMysteryBox(${index}, ${restaurant.id})">
            <div class="box-content">
                <div class="box-front">
                    <div class="box-icon">🎁</div>
                    <div class="box-text">神秘美食</div>
                </div>
            </div>
        </div>
    `).join('');
    
    updateMysteryBoxCount();
}

function openMysteryBox(boxIndex, restaurantId) {
    if (mysteryBoxCount <= 0) {
        alert('今日开启次数已用完，明天再来吧！');
        return;
    }
    
    const box = document.getElementById(`box-${boxIndex}`);
    if (box.classList.contains('opened')) return;
    
    const restaurant = restaurants.find(r => r.id === restaurantId);
    
    box.classList.add('opening');
    mysteryBoxCount--;
    updateMysteryBoxCount();
    
    setTimeout(() => {
        box.classList.add('opened');
        box.innerHTML = `
            <div class="box-content revealed">
                <div class="restaurant-name">${restaurant.name}</div>
                <div class="restaurant-rating">⭐ ${restaurant.rating} 分</div>
                <div class="restaurant-price">💰 人均¥${restaurant.avgPrice}</div>
                <button class="btn-box-detail" onclick="showRestaurantDetail(${restaurant.id})">查看详情</button>
            </div>
        `;
    }, 600);
}

function updateMysteryBoxCount() {
    const countElement = document.getElementById('remainingCount');
    if (countElement) {
        countElement.textContent = mysteryBoxCount;
    }
}

function resetMysteryBoxes() {
    mysteryBoxCount = 3;
    updateMysteryBoxCount();
    initializeMysteryBoxes();
}

// MBTI推荐功能
function initializeMBTIGrid() {
    const mbtiTypes = {
        'INTJ': { name: '建筑师', cuisines: ['japanese', 'western'] },
        'INTP': { name: '逻辑学家', cuisines: ['western', 'chinese'] },
        'ENTJ': { name: '指挥官', cuisines: ['western', 'hotpot'] },
        'ENTP': { name: '辩论家', cuisines: ['korean', 'hotpot'] },
        'INFJ': { name: '提倡者', cuisines: ['japanese', 'chinese'] },
        'INFP': { name: '调停者', cuisines: ['chinese', 'snack'] },
        'ENFJ': { name: '主人公', cuisines: ['hotpot', 'korean'] },
        'ENFP': { name: '竞选者', cuisines: ['korean', 'western'] },
        'ISTJ': { name: '物流师', cuisines: ['chinese', 'snack'] },
        'ISFJ': { name: '守护者', cuisines: ['chinese', 'japanese'] },
        'ESTJ': { name: '总经理', cuisines: ['chinese', 'western'] },
        'ESFJ': { name: '执政官', cuisines: ['hotpot', 'korean'] },
        'ISTP': { name: '鉴赏家', cuisines: ['japanese', 'snack'] },
        'ISFP': { name: '探险家', cuisines: ['western', 'japanese'] },
        'ESTP': { name: '企业家', cuisines: ['korean', 'hotpot'] },
        'ESFP': { name: '娱乐家', cuisines: ['korean', 'snack'] }
    };
    
    const mbtiGrid = document.getElementById('mbtiGrid');
    if (!mbtiGrid) return;
    
    mbtiGrid.innerHTML = Object.entries(mbtiTypes).map(([type, info]) => `
        <button class="mbti-type-btn" onclick="showMBTIRecommendation('${type}')">
            <div class="type-code">${type}</div>
            <div class="type-name">${info.name}</div>
        </button>
    `).join('');
}

function showMBTIRecommendation(mbtiType) {
    const mbtiTypes = {
        'INTJ': { name: '建筑师', cuisines: ['japanese', 'western'], description: '你喜欢精致、有品质的美食，注重食材和制作工艺' },
        'INTP': { name: '逻辑学家', cuisines: ['western', 'chinese'], description: '你对新奇的口味很感兴趣，喜欢尝试不同的美食组合' },
        'ENTJ': { name: '指挥官', cuisines: ['western', 'hotpot'], description: '你偏爱高档餐厅，享受商务聚餐的氛围' },
        'ENTP': { name: '辩论家', cuisines: ['korean', 'hotpot'], description: '你喜欢热闹的用餐环境，享受和朋友分享美食的乐趣' }
        // 简化版本，实际应用中可以包含所有16种类型
    };
    
    const preference = mbtiTypes[mbtiType] || mbtiTypes['INTJ'];
    const recommendedRestaurants = restaurants.filter(restaurant => 
        preference.cuisines.includes(restaurant.cuisine)
    ).slice(0, 3);
    
    const resultDiv = document.getElementById('mbtiResult');
    resultDiv.innerHTML = `
        <div class="mbti-analysis">
            <h3>${mbtiType} - ${preference.name}</h3>
            <p class="description">${preference.description}</p>
        </div>
        
        <div class="recommended-restaurants">
            <h4>🍽️ 为你推荐的餐厅：</h4>
            <div class="restaurant-grid">
                ${recommendedRestaurants.map(restaurant => `
                    <div class="mini-restaurant-card" onclick="showRestaurantDetail(${restaurant.id})">
                        <h5>${restaurant.name}</h5>
                        <div class="mini-rating">⭐ ${restaurant.rating}</div>
                        <div class="mini-price">¥${restaurant.avgPrice}</div>
                        <div class="mini-specialty">${restaurant.specialty[0]}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <button class="btn-primary" onclick="document.getElementById('mbtiResult').innerHTML=''">重新选择</button>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}
// 星座推荐功能
function initializeZodiacGrid() {
    const zodiacSigns = {
        'aries': { name: '白羊座', emoji: '♈', dates: '3.21-4.19', cuisines: ['korean', 'hotpot'] },
        'taurus': { name: '金牛座', emoji: '♉', dates: '4.20-5.20', cuisines: ['western', 'chinese'] },
        'gemini': { name: '双子座', emoji: '♊', dates: '5.21-6.21', cuisines: ['japanese', 'western'] },
        'cancer': { name: '巨蟹座', emoji: '♋', dates: '6.22-7.22', cuisines: ['chinese', 'snack'] },
        'leo': { name: '狮子座', emoji: '♌', dates: '7.23-8.22', cuisines: ['western', 'hotpot'] },
        'virgo': { name: '处女座', emoji: '♍', dates: '8.23-9.22', cuisines: ['japanese', 'chinese'] },
        'libra': { name: '天秤座', emoji: '♎', dates: '9.23-10.23', cuisines: ['western', 'japanese'] },
        'scorpio': { name: '天蝎座', emoji: '♏', dates: '10.24-11.22', cuisines: ['chinese', 'japanese'] },
        'sagittarius': { name: '射手座', emoji: '♐', dates: '11.23-12.21', cuisines: ['western', 'korean'] },
        'capricorn': { name: '摩羯座', emoji: '♑', dates: '12.22-1.19', cuisines: ['chinese', 'western'] },
        'aquarius': { name: '水瓶座', emoji: '♒', dates: '1.20-2.18', cuisines: ['western', 'japanese'] },
        'pisces': { name: '双鱼座', emoji: '♓', dates: '2.19-3.20', cuisines: ['japanese', 'western'] }
    };
    
    const zodiacGrid = document.getElementById('zodiacGrid');
    if (!zodiacGrid) return;
    
    zodiacGrid.innerHTML = Object.entries(zodiacSigns).map(([sign, info]) => `
        <button class="zodiac-btn" onclick="showZodiacRecommendation('${sign}')">
            <div class="zodiac-emoji">${info.emoji}</div>
            <div class="zodiac-name">${info.name}</div>
            <div class="zodiac-dates">${info.dates}</div>
        </button>
    `).join('');
}

function showZodiacRecommendation(zodiacSign) {
    const zodiacSigns = {
        'aries': { name: '白羊座', emoji: '♈', description: '白羊座喜欢刺激的口味，偏爱辣味和热气腾腾的美食', cuisines: ['korean', 'hotpot'] },
        'taurus': { name: '金牛座', emoji: '♉', description: '金牛座注重食物的品质和口感，偏爱经典美味', cuisines: ['western', 'chinese'] },
        'gemini': { name: '双子座', emoji: '♊', description: '双子座喜欢尝试各种不同的美食，偏爱精致多样的料理', cuisines: ['japanese', 'western'] }
        // 简化版本
    };
    
    const preference = zodiacSigns[zodiacSign] || zodiacSigns['aries'];
    const recommendedRestaurants = restaurants.filter(restaurant => 
        preference.cuisines.includes(restaurant.cuisine)
    ).slice(0, 3);
    
    const resultDiv = document.getElementById('zodiacResult');
    resultDiv.innerHTML = `
        <div class="zodiac-analysis">
            <h3>${preference.emoji} ${preference.name}</h3>
            <p class="description">${preference.description}</p>
            <div class="today-luck">
                <h4>📅 今日美食运势：</h4>
                <p>今天特别适合尝试新的美食，会带来好运气！</p>
            </div>
        </div>
        
        <div class="recommended-restaurants">
            <h4>🍽️ 为你推荐的餐厅：</h4>
            <div class="restaurant-grid">
                ${recommendedRestaurants.map(restaurant => `
                    <div class="mini-restaurant-card" onclick="showRestaurantDetail(${restaurant.id})">
                        <h5>${restaurant.name}</h5>
                        <div class="mini-rating">⭐ ${restaurant.rating}</div>
                        <div class="mini-price">¥${restaurant.avgPrice}</div>
                        <div class="mini-specialty">${restaurant.specialty[0]}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <button class="btn-primary" onclick="document.getElementById('zodiacResult').innerHTML=''">重新选择</button>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// 黄历推荐功能
function initializeCalendarRecommend() {
    const today = new Date();
    const todayInfo = document.getElementById('todayInfo');
    const calendarRestaurants = document.getElementById('calendarRestaurants');
    
    if (!todayInfo || !calendarRestaurants) return;
    
    const wuxing = ['金', '木', '水', '火', '土'][today.getDate() % 5];
    const wuxingCuisines = {
        '金': ['western', 'japanese'],
        '木': ['chinese', 'japanese'],
        '水': ['chinese', 'japanese'],
        '火': ['korean', 'hotpot'],
        '土': ['chinese', 'snack']
    };
    
    todayInfo.innerHTML = `
        <div class="today-info">
            <h3>📅 ${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日</h3>
            <div class="wuxing-info">
                <h4>⚡ 今日五行：${wuxing}</h4>
                <p>根据五行理论，今日适宜食用相应属性的美食</p>
            </div>
            <div class="lucky-time">
                <h4>🕐 最佳用餐时间：中午11-13点（午时）</h4>
            </div>
        </div>
    `;
    
    const recommendedRestaurants = restaurants.filter(restaurant => 
        wuxingCuisines[wuxing].includes(restaurant.cuisine)
    ).slice(0, 3);
    
    calendarRestaurants.innerHTML = `
        <h4>🍽️ 今日推荐餐厅：</h4>
        <div class="restaurant-grid">
            ${recommendedRestaurants.map(restaurant => `
                <div class="mini-restaurant-card" onclick="showRestaurantDetail(${restaurant.id})">
                    <h5>${restaurant.name}</h5>
                    <div class="mini-rating">⭐ ${restaurant.rating}</div>
                    <div class="mini-price">¥${restaurant.avgPrice}</div>
                    <div class="mini-specialty">${restaurant.specialty[0]}</div>
                    <div class="wuxing-match">五行：${wuxing}</div>
                </div>
            `).join('')}
        </div>
    `;
}
// ==================== 社区功能 ====================

// 初始化社区帖子
function initializeCommunityPosts() {
    communityPosts = [
        {
            id: 'post_1',
            title: '清华东门的炸酱面真的绝了！',
            content: '昨天去吃了老北京炸酱面馆，真的太正宗了！面条劲道，酱料浓郁，老板还是地道北京人，聊天特别有意思。强烈推荐给大家！',
            category: 'restaurant',
            university: 'tsinghua',
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
            timestamp: Date.now() - 259200000,
            likes: 12,
            replies: 2,
            tags: ['双子座', '日料', '拉面', '五道口']
        }
    ];
}

// 渲染社区帖子
function renderCommunityPosts() {
    if (communityPosts.length === 0) {
        initializeCommunityPosts();
    }
    
    const universityFilter = document.getElementById('communityUniversity')?.value || 'all';
    const categoryFilter = document.getElementById('communityCategory')?.value || 'all';
    
    let filteredPosts = communityPosts;
    
    if (universityFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.university === universityFilter);
    }
    
    if (categoryFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === categoryFilter);
    }
    
    const container = document.getElementById('communityContent');
    if (!container) return;
    
    if (filteredPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">暂无符合条件的动态</p>';
        return;
    }
    
    container.innerHTML = filteredPosts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <h4>${post.title}</h4>
                <div class="post-meta">
                    <span>${getUniversityName(post.university)}</span>
                    <span>${getCategoryName(post.category)}</span>
                    <span>${formatTime(post.timestamp)}</span>
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

// 筛选社区帖子
function filterCommunityPosts() {
    renderCommunityPosts();
}

// 显示发布动态弹窗
function showPostModal() {
    document.getElementById('postModal').classList.add('active');
}

// 提交帖子
function submitPost(event) {
    event.preventDefault();
    
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;
    const university = document.getElementById('postUniversity').value;
    
    const newPost = {
        id: `post_${Date.now()}`,
        title,
        content,
        category,
        university,
        timestamp: Date.now(),
        likes: 0,
        replies: 0,
        tags: []
    };
    
    communityPosts.unshift(newPost);
    
    // 关闭弹窗并刷新列表
    closeModal('postModal');
    document.getElementById('newPostForm').reset();
    renderCommunityPosts();
}

// 点赞帖子
function likePost(postId) {
    const post = communityPosts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        renderCommunityPosts();
    }
}

// 辅助函数
function getUniversityName(code) {
    const universities = {
        'tsinghua': '清华大学',
        'pku': '北京大学',
        'ruc': '人民大学',
        'bnu': '北京师范大学'
    };
    return universities[code] || code;
}

function getCategoryName(code) {
    const categories = {
        'restaurant': '餐厅推荐',
        'cuisine': '美食类型',
        'mbti': 'MBTI美食',
        'zodiac': '星座美食'
    };
    return categories[code] || code;
}

function formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
    
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
}
// ==================== 地图页面功能 ====================

// 渲染完整地图标记
function renderFullMapMarkers() {
    const fullMapContainer = document.getElementById('fullMap');
    if (!fullMapContainer) return;
    
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
            showRestaurantDetail(restaurant.id);
        };
        
        fullMapContainer.appendChild(marker);
    });
}

// ==================== 通用功能 ====================

// 关闭模态框
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// 欢迎动画
function showWelcomeAnimation() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const hasVisited = localStorage.getItem('has_visited');
    
    if (!hasVisited) {
        // 首次访问，显示欢迎动画
        welcomeOverlay.style.display = 'flex';
        
        // 3.5秒后自动隐藏
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
            localStorage.setItem('has_visited', 'true');
        }, 3500);
    } else {
        // 已访问过，直接隐藏
        welcomeOverlay.style.display = 'none';
    }
}

// ==================== 应用初始化 ====================

// 应用初始化
function initializeApp() {
    console.log('🚀 开始初始化应用...');
    
    try {
        // 显示欢迎动画
        showWelcomeAnimation();
        
        // 初始化首页
        renderRestaurants();
        renderMapMarkers();
        
        // 设置模态框点击外部关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
        
        console.log('✅ 应用初始化完成');
    } catch (error) {
        console.error('❌ 应用初始化失败:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM加载完成');
    initializeApp();
});

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
});

console.log('🍜 美食地图应用脚本加载完成');