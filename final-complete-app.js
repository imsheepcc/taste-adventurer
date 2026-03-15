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
                    if (pageName === 'about') {
                        floatingBtn.style.display = 'flex'; // 在首页显示浮动按钮
                    } else if (pageName === 'recommend') {
                        floatingBtn.style.display = 'none'; // 在推荐页面隐藏
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
                'about': '首页',
                'home': '美食发现',
                'recommend': '趣味推荐',
                'community': '美食社区',
                'map': '地图探索'
            };
            return titles[pageName] || pageName;
        }

        // 初始化页面内容
        function initializePage(pageName) {
            switch (pageName) {
                case 'about':
                    // 产品介绍页面（首页）不需要特殊初始化
                    break;
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
                <div style="margin-bottom: 20px;">
                    <h2>${restaurant.name}</h2>
                    <div class="restaurant-tags">
                        <span class="tag cuisine">${cuisineMap[restaurant.cuisine]}</span>
                        <span class="tag price">人均¥${restaurant.avgPrice}</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4>📊 基本信息</h4>
                    <p>⭐ 评分：${restaurant.rating} 分</p>
                    <p>📍 距离：${restaurant.distance}</p>
                    <p>🏠 地址：${restaurant.address}</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4>🍽️ 特色菜品</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${restaurant.specialty.map(item => `<div style="background: #f8f9fa; padding: 8px 15px; border-radius: 8px; border-left: 3px solid #ff6b6b;">${item}</div>`).join('')}
                    </div>
                </div>
                
                <div>
                    <h4>💬 学生评价</h4>
                    ${restaurant.reviews.map(review => `
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                            <div style="font-weight: 600; color: #667eea; margin-bottom: 5px;">${review.author}</div>
                            <div>${review.content}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            document.getElementById('detailModal').style.display = 'flex';
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
            console.log('切换推荐标签:', tabName);
            
            // 更新按钮状态
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = 'rgba(255, 255, 255, 0.2)';
                btn.style.color = 'white';
            });
            
            const activeBtn = document.querySelector(`[onclick="switchRecommendTab('${tabName}')"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.style.background = 'var(--primary-color)';
                activeBtn.style.color = 'var(--text-color)';
            }
            
            // 切换内容
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            const activeTab = document.getElementById(tabName + 'Tab');
            if (activeTab) {
                activeTab.classList.add('active');
                activeTab.style.display = 'block';
            }
        }
        // 转盘功能
        function initializeSpinWheel() {
            const wheel = document.getElementById('wheel');
            if (!wheel) return;
            
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#98FB98'];
            const selectedRestaurants = restaurants.slice(0, 8);
            
            // 创建转盘扇形区域
            wheel.innerHTML = '<div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-size: 30px; z-index: 10; color: #FF6B9D;">🔽</div>' + 
                selectedRestaurants.map((restaurant, index) => {
                    const angle = (360 / selectedRestaurants.length) * index;
                    const nextAngle = (360 / selectedRestaurants.length) * (index + 1);
                    return `
                        <div class="wheel-section" style="
                            position: absolute;
                            width: 50%;
                            height: 50%;
                            top: 50%;
                            left: 50%;
                            transform-origin: 0 0;
                            transform: rotate(${angle}deg);
                            background: ${colors[index % colors.length]};
                            clip-path: polygon(0 0, 100% 0, ${Math.cos((nextAngle - angle) * Math.PI / 180) * 100}% ${Math.sin((nextAngle - angle) * Math.PI / 180) * 100}%);
                            border: 2px solid white;
                        ">
                            <div style="
                                position: absolute;
                                color: white;
                                font-weight: bold;
                                font-size: 11px;
                                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
                                white-space: nowrap;
                                pointer-events: none;
                                transform: rotate(${(nextAngle - angle) / 2}deg);
                                left: 60%;
                                top: 15%;
                                transform-origin: 0 0;
                            ">${restaurant.name.length > 6 ? restaurant.name.substring(0, 6) + '...' : restaurant.name}</div>
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
                    <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); max-width: 400px; margin: 0 auto;">
                        <h3 style="color: var(--primary-color); margin-bottom: 10px; font-size: 1.2em;">🎉 推荐结果</h3>
                        <h2 style="color: var(--text-color); margin-bottom: 15px; font-size: 2em;">${selectedRestaurant.name}</h2>
                        <p style="color: #666; margin: 10px 0; font-size: 1.1em;">⭐ ${selectedRestaurant.rating} 分</p>
                        <p style="color: #666; margin: 10px 0; font-size: 1.1em;">💰 人均¥${selectedRestaurant.avgPrice}</p>
                        <p style="color: #666; margin: 10px 0; font-size: 1.1em;">🍽️ ${selectedRestaurant.specialty[0]}</p>
                        <button onclick="showRestaurantDetail(${selectedRestaurant.id})" style="margin-top: 20px; padding: 12px 30px; background: var(--primary-color); color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 1em; font-weight: 600; transition: all 0.3s;">查看详情</button>
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
                <div id="box-${index}" onclick="openMysteryBox(${index}, ${restaurant.id})" style="perspective: 1000px; cursor: pointer; height: 200px;">
                    <div style="position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d;">
                        <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; box-shadow: 0 4px 15px rgba(255, 209, 0, 0.3); background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); color: white;">
                            <div style="font-size: 3em; margin-bottom: 10px; animation: bounce 2s ease-in-out infinite;">🎁</div>
                            <div style="font-size: 1.1em; font-weight: 600;">神秘美食</div>
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
                    <div style="background: white; border-radius: 20px; box-shadow: 0 4px 15px rgba(255, 209, 0, 0.3); padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; height: 100%;">
                        <div style="font-size: 1.3em; font-weight: bold; color: #333; margin-bottom: 10px;">${restaurant.name}</div>
                        <div style="font-size: 1.1em; color: #FFA726; margin-bottom: 5px;">⭐ ${restaurant.rating} 分</div>
                        <div style="font-size: 1.1em; color: #4CAF50; margin-bottom: 15px;">💰 人均¥${restaurant.avgPrice}</div>
                        <button onclick="showRestaurantDetail(${restaurant.id})" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: 600; margin-top: 10px; transition: all 0.3s;">查看详情</button>
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
                <button onclick="showMBTIRecommendation('${type}')" style="padding: 15px 10px; border: 2px solid var(--primary-color); border-radius: 15px; background: white; cursor: pointer; transition: all 0.3s; text-align: center;">
                    <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 5px;">${type}</div>
                    <div style="font-size: 0.9em; opacity: 0.8;">${info.name}</div>
                </button>
            `).join('');
        }

        function showMBTIRecommendation(mbtiType) {
            const mbtiTypes = {
                'INTJ': { name: '建筑师', cuisines: ['japanese', 'western'], description: '你喜欢精致、有品质的美食，注重食材和制作工艺' },
                'INTP': { name: '逻辑学家', cuisines: ['western', 'chinese'], description: '你对新奇的口味很感兴趣，喜欢尝试不同的美食组合' },
                'ENTJ': { name: '指挥官', cuisines: ['western', 'hotpot'], description: '你偏爱高档餐厅，享受商务聚餐的氛围' },
                'ENTP': { name: '辩论家', cuisines: ['korean', 'hotpot'], description: '你喜欢热闹的用餐环境，享受和朋友分享美食的乐趣' },
                'INFJ': { name: '提倡者', cuisines: ['japanese', 'chinese'], description: '你偏爱有文化内涵的美食，注重用餐的仪式感' },
                'INFP': { name: '调停者', cuisines: ['chinese', 'snack'], description: '你喜欢温馨舒适的用餐环境，偏爱家常美食' },
                'ENFJ': { name: '主人公', cuisines: ['hotpot', 'korean'], description: '你享受和朋友聚餐的快乐时光，偏爱分享式美食' },
                'ENFP': { name: '竞选者', cuisines: ['korean', 'western'], description: '你喜欢尝试新奇有趣的美食，享受探索的乐趣' },
                'ISTJ': { name: '物流师', cuisines: ['chinese', 'snack'], description: '你偏爱传统经典的美食，注重性价比和实用性' },
                'ISFJ': { name: '守护者', cuisines: ['chinese', 'japanese'], description: '你喜欢温和清淡的口味，注重营养健康' },
                'ESTJ': { name: '总经理', cuisines: ['chinese', 'western'], description: '你偏爱正式的用餐环境，喜欢有品质保证的餐厅' },
                'ESFJ': { name: '执政官', cuisines: ['hotpot', 'korean'], description: '你享受和他人分享美食的快乐，偏爱热闹的用餐氛围' },
                'ISTP': { name: '鉴赏家', cuisines: ['japanese', 'snack'], description: '你对美食的制作工艺很感兴趣，偏爱精工细作的料理' },
                'ISFP': { name: '探险家', cuisines: ['western', 'japanese'], description: '你喜欢有艺术感的美食呈现，注重视觉和味觉的双重享受' },
                'ESTP': { name: '企业家', cuisines: ['korean', 'hotpot'], description: '你喜欢刺激有趣的口味，享受和朋友聚餐的热闹氛围' },
                'ESFP': { name: '娱乐家', cuisines: ['korean', 'snack'], description: '你喜欢轻松愉快的用餐体验，偏爱有趣好玩的美食' }
            };
            
            const preference = mbtiTypes[mbtiType];
            const recommendedRestaurants = restaurants.filter(restaurant => 
                preference.cuisines.includes(restaurant.cuisine)
            ).slice(0, 3);
            
            const resultDiv = document.getElementById('mbtiResult');
            resultDiv.innerHTML = `
                <div style="background: #f8f9fa; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: left;">
                    <h3 style="color: var(--primary-color); margin-bottom: 15px;">${mbtiType} - ${preference.name}</h3>
                    <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">${preference.description}</p>
                </div>
                
                <div>
                    <h4>🍽️ 为你推荐的餐厅：</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                        ${recommendedRestaurants.map(restaurant => `
                            <div onclick="showRestaurantDetail(${restaurant.id})" style="background: white; border-radius: 10px; padding: 15px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; transition: all 0.3s;">
                                <h5 style="color: #333; margin-bottom: 8px; font-size: 1.1em;">${restaurant.name}</h5>
                                <div style="color: #FFA726; font-weight: 600; margin: 5px 0;">⭐ ${restaurant.rating}</div>
                                <div style="color: #4CAF50; font-weight: 600; margin: 5px 0;">¥${restaurant.avgPrice}</div>
                                <div style="color: #666; font-size: 0.9em;">${restaurant.specialty[0]}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <button onclick="document.getElementById('mbtiResult').innerHTML=''" style="margin: 20px auto; display: block; padding: 12px 25px; background: var(--primary-color); color: #333; border: none; border-radius: 20px; cursor: pointer; font-weight: 600;">重新选择</button>
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
                <button onclick="showZodiacRecommendation('${sign}')" style="padding: 15px 10px; border: 2px solid var(--primary-color); border-radius: 15px; background: white; cursor: pointer; transition: all 0.3s; text-align: center;">
                    <div style="font-size: 2em; margin-bottom: 5px;">${info.emoji}</div>
                    <div style="font-weight: bold; margin-bottom: 3px;">${info.name}</div>
                    <div style="font-size: 0.8em; opacity: 0.7;">${info.dates}</div>
                </button>
            `).join('');
        }

        function showZodiacRecommendation(zodiacSign) {
            const zodiacSigns = {
                'aries': { name: '白羊座', emoji: '♈', description: '白羊座喜欢刺激的口味，偏爱辣味和热气腾腾的美食', cuisines: ['korean', 'hotpot'] },
                'taurus': { name: '金牛座', emoji: '♉', description: '金牛座注重食物的品质和口感，偏爱经典美味', cuisines: ['western', 'chinese'] },
                'gemini': { name: '双子座', emoji: '♊', description: '双子座喜欢尝试各种不同的美食，偏爱精致多样的料理', cuisines: ['japanese', 'western'] },
                'cancer': { name: '巨蟹座', emoji: '♋', description: '巨蟹座偏爱温馨的家常菜，注重食物的温暖感', cuisines: ['chinese', 'snack'] },
                'leo': { name: '狮子座', emoji: '♌', description: '狮子座喜欢豪华的用餐体验，偏爱有仪式感的美食', cuisines: ['western', 'hotpot'] },
                'virgo': { name: '处女座', emoji: '♍', description: '处女座注重食物的健康和营养，偏爱精工细作的料理', cuisines: ['japanese', 'chinese'] },
                'libra': { name: '天秤座', emoji: '♎', description: '天秤座追求美感和平衡，偏爱精美的料理呈现', cuisines: ['western', 'japanese'] },
                'scorpio': { name: '天蝎座', emoji: '♏', description: '天蝎座喜欢浓郁深沉的口味，偏爱有层次感的美食', cuisines: ['chinese', 'japanese'] },
                'sagittarius': { name: '射手座', emoji: '♐', description: '射手座喜欢异国风情的美食，享受探索不同文化的料理', cuisines: ['western', 'korean'] },
                'capricorn': { name: '摩羯座', emoji: '♑', description: '摩羯座偏爱传统经典的美食，注重品质和传承', cuisines: ['chinese', 'western'] },
                'aquarius': { name: '水瓶座', emoji: '♒', description: '水瓶座喜欢创新独特的美食，偏爱有创意的料理', cuisines: ['western', 'japanese'] },
                'pisces': { name: '双鱼座', emoji: '♓', description: '双鱼座偏爱浪漫温柔的用餐氛围，喜欢精致的美食', cuisines: ['japanese', 'western'] }
            };
            
            const preference = zodiacSigns[zodiacSign];
            const recommendedRestaurants = restaurants.filter(restaurant => 
                preference.cuisines.includes(restaurant.cuisine)
            ).slice(0, 3);
            
            const resultDiv = document.getElementById('zodiacResult');
            resultDiv.innerHTML = `
                <div style="background: #f8f9fa; border-radius: 15px; padding: 20px; margin: 20px 0; text-align: left;">
                    <h3 style="color: var(--primary-color); margin-bottom: 15px;">${preference.emoji} ${preference.name}</h3>
                    <p style="color: #666; margin-bottom: 15px; line-height: 1.6;">${preference.description}</p>
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 10px;">
                        <h4 style="color: #2e7d32; margin-bottom: 8px;">📅 今日美食运势：</h4>
                        <p style="color: #1b5e20; margin: 0; line-height: 1.5;">今天特别适合尝试新的美食，会带来好运气！</p>
                    </div>
                </div>
                
                <div>
                    <h4>🍽️ 为你推荐的餐厅：</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                        ${recommendedRestaurants.map(restaurant => `
                            <div onclick="showRestaurantDetail(${restaurant.id})" style="background: white; border-radius: 10px; padding: 15px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; transition: all 0.3s;">
                                <h5 style="color: #333; margin-bottom: 8px; font-size: 1.1em;">${restaurant.name}</h5>
                                <div style="color: #FFA726; font-weight: 600; margin: 5px 0;">⭐ ${restaurant.rating}</div>
                                <div style="color: #4CAF50; font-weight: 600; margin: 5px 0;">¥${restaurant.avgPrice}</div>
                                <div style="color: #666; font-size: 0.9em;">${restaurant.specialty[0]}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <button onclick="document.getElementById('zodiacResult').innerHTML=''" style="margin: 20px auto; display: block; padding: 12px 25px; background: var(--primary-color); color: #333; border: none; border-radius: 20px; cursor: pointer; font-weight: 600;">重新选择</button>
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
                <h3 style="color: var(--primary-color); margin-bottom: 15px;">📅 ${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日</h3>
                <div style="margin: 15px 0;">
                    <h4 style="color: #333; margin-bottom: 5px;">⚡ 今日五行：${wuxing}</h4>
                    <p style="color: #666; margin: 0;">根据五行理论，今日适宜食用相应属性的美食</p>
                </div>
                <div style="margin: 15px 0;">
                    <h4 style="color: #333; margin-bottom: 5px;">🕐 最佳用餐时间：中午11-13点（午时）</h4>
                </div>
            `;
            
            const recommendedRestaurants = restaurants.filter(restaurant => 
                wuxingCuisines[wuxing].includes(restaurant.cuisine)
            ).slice(0, 3);
            
            calendarRestaurants.innerHTML = `
                <h4>🍽️ 今日推荐餐厅：</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                    ${recommendedRestaurants.map(restaurant => `
                        <div onclick="showRestaurantDetail(${restaurant.id})" style="background: white; border-radius: 10px; padding: 15px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; transition: all 0.3s;">
                            <h5 style="color: #333; margin-bottom: 8px; font-size: 1.1em;">${restaurant.name}</h5>
                            <div style="color: #FFA726; font-weight: 600; margin: 5px 0;">⭐ ${restaurant.rating}</div>
                            <div style="color: #4CAF50; font-weight: 600; margin: 5px 0;">¥${restaurant.avgPrice}</div>
                            <div style="color: #666; font-size: 0.9em;">${restaurant.specialty[0]}</div>
                            <div style="background: var(--primary-color); color: white; padding: 3px 8px; border-radius: 10px; font-size: 0.8em; font-weight: 600; margin-top: 5px;">五行：${wuxing}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

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
                },
                {
                    id: 'post_4',
                    title: '人大西门川菜馆的水煮鱼太香了',
                    content: '今天和朋友去川味小馆吃水煮鱼，真的是又麻又辣又香！老板说可以调辣度，我们点的中辣已经很过瘾了。麻婆豆腐也超级下饭！',
                    category: 'restaurant',
                    university: 'ruc',
                    timestamp: Date.now() - 345600000,
                    likes: 20,
                    replies: 5,
                    tags: ['川菜', '水煮鱼', '人大', '麻辣']
                },
                {
                    id: 'post_5',
                    title: '师大附近的海底捞学生优惠真香',
                    content: '昨天去师大路的海底捞，用学生证打了折，性价比超高！服务还是一如既往的好，番茄锅底很清爽，牛肉和虾滑都很新鲜。',
                    category: 'restaurant',
                    university: 'bnu',
                    timestamp: Date.now() - 432000000,
                    likes: 18,
                    replies: 4,
                    tags: ['火锅', '海底捞', '师大', '学生优惠']
                },
                {
                    id: 'post_6',
                    title: 'INTJ推荐：五道口的日式拉面屋',
                    content: '作为INTJ，我对食物的品质要求比较高。这家日式拉面屋的豚骨汤底熬制得很用心，面条也很有嚼劲，叉烧肥瘦相间，溏心蛋完美。环境安静，适合一个人用餐思考。',
                    category: 'mbti',
                    university: 'tsinghua',
                    timestamp: Date.now() - 518400000,
                    likes: 14,
                    replies: 2,
                    tags: ['INTJ', '日料', '拉面', '品质']
                },
                {
                    id: 'post_7',
                    title: '白羊座今天运气爆棚！发现了新的泰式料理',
                    content: '今天星座运势说白羊座适合尝试新事物，果然在人大南路发现了一家超棒的泰式料理！冬阴功汤酸辣开胃，咖喱蟹也很香，芒果糯米饭甜度刚好！',
                    category: 'zodiac',
                    university: 'ruc',
                    timestamp: Date.now() - 604800000,
                    likes: 16,
                    replies: 3,
                    tags: ['白羊座', '泰式料理', '人大', '新发现']
                },
                {
                    id: 'post_8',
                    title: '北大东门的意式披萨店环境超棒',
                    content: '和朋友约会去了北大东门的意式披萨店，装修很有情调，玛格丽特披萨芝士拉丝超长，意面也很正宗。提拉米苏是必点甜品！',
                    category: 'restaurant',
                    university: 'pku',
                    timestamp: Date.now() - 691200000,
                    likes: 11,
                    replies: 2,
                    tags: ['意式', '披萨', '北大', '约会']
                },
                {
                    id: 'post_9',
                    title: 'ISFJ的温柔美食推荐：清华西门煎饼果子',
                    content: '作为ISFJ，我喜欢温暖简单的美食。清华西门的煎饼果子摊虽然简单，但是老板人很好，每天早上都会笑着打招呼。煎饼现做的，配豆浆特别香~',
                    category: 'mbti',
                    university: 'tsinghua',
                    timestamp: Date.now() - 777600000,
                    likes: 9,
                    replies: 1,
                    tags: ['ISFJ', '煎饼果子', '清华', '温暖']
                },
                {
                    id: 'post_10',
                    title: '金牛座的我终于找到了心仪的西餐厅',
                    content: '金牛座对美食品质要求很高，这家意式披萨店真的没让我失望！食材新鲜，制作精细，价格也合理。已经决定成为常客了！',
                    category: 'zodiac',
                    university: 'pku',
                    timestamp: Date.now() - 864000000,
                    likes: 13,
                    replies: 4,
                    tags: ['金牛座', '西餐', '品质', '北大']
                },
                {
                    id: 'post_11',
                    title: '深夜食堂：师大路的小吃一条街',
                    content: '昨晚和室友去师大路逛小吃街，烤串、煎饼、奶茶应有尽有！价格便宜量又足，学生党的天堂。推荐那家烤冷面，老板手艺很棒！',
                    category: 'cuisine',
                    university: 'bnu',
                    timestamp: Date.now() - 950400000,
                    likes: 22,
                    replies: 6,
                    tags: ['小吃街', '师大', '深夜', '烤串']
                },
                {
                    id: 'post_12',
                    title: 'ESTP的火锅聚会攻略',
                    content: '作为ESTP，最喜欢和朋友们一起热热闹闹吃火锅！海底捞的服务真的没话说，而且学生证有优惠。推荐番茄锅底，不会太辣但很鲜美！',
                    category: 'mbti',
                    university: 'bnu',
                    timestamp: Date.now() - 1036800000,
                    likes: 17,
                    replies: 3,
                    tags: ['ESTP', '火锅', '聚会', '海底捞']
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
            const timeFilter = document.getElementById('communityTime')?.value || 'all';
            
            let filteredPosts = communityPosts;
            
            if (universityFilter !== 'all') {
                filteredPosts = filteredPosts.filter(post => post.university === universityFilter);
            }
            
            if (categoryFilter !== 'all') {
                filteredPosts = filteredPosts.filter(post => post.category === categoryFilter);
            }
            
            if (timeFilter !== 'all') {
                const now = Date.now();
                const timeRanges = {
                    'today': 24 * 60 * 60 * 1000,
                    'week': 7 * 24 * 60 * 60 * 1000,
                    'month': 30 * 24 * 60 * 60 * 1000
                };
                filteredPosts = filteredPosts.filter(post => (now - post.timestamp) <= timeRanges[timeFilter]);
            }
            
            const container = document.getElementById('communityContent');
            if (!container) return;
            
            if (filteredPosts.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666;">暂无符合条件的动态</p>';
                return;
            }
            
            container.innerHTML = filteredPosts.map(post => `
                <div style="background: white; border-radius: 15px; padding: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: all 0.3s;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4>${post.title}</h4>
                        <div style="display: flex; gap: 15px; font-size: 0.9em; color: #666;">
                            <span>${getUniversityName(post.university)}</span>
                            <span>${getCategoryName(post.category)}</span>
                            <span>${formatTime(post.timestamp)}</span>
                        </div>
                    </div>
                    <div style="margin-bottom: 15px; line-height: 1.6;">${post.content}</div>
                    <div style="display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;">
                        ${post.tags.map(tag => `<span style="background: var(--primary-color); color: white; padding: 5px 12px; border-radius: 15px; font-size: 0.9em; font-weight: 600;">${tag}</span>`).join('')}
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button onclick="likePost('${post.id}')" style="background: none; border: none; color: #666; cursor: pointer; padding: 5px 10px; border-radius: 15px; transition: all 0.3s;">👍 ${post.likes}</button>
                        <button style="background: none; border: none; color: #666; cursor: pointer; padding: 5px 10px; border-radius: 15px;">💬 ${post.replies}</button>
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
            document.getElementById('postModal').style.display = 'flex';
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
            
            alert('动态发布成功！');
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
                marker.style.position = 'absolute';
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
                marker.style.width = '30px';
                marker.style.height = '30px';
                marker.style.borderRadius = '50% 50% 50% 0';
                marker.style.transform = 'rotate(-45deg)';
                marker.style.cursor = 'pointer';
                marker.style.transition = 'all 0.3s';
                marker.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)';
                marker.style.zIndex = '10';
                marker.style.animation = 'bounce 2s ease-in-out infinite';
                
                marker.onclick = (e) => {
                    e.stopPropagation();
                    showRestaurantDetail(restaurant.id);
                };
                
                fullMapContainer.appendChild(marker);
            });
        }

        // 关闭模态框
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }