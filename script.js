// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    renderRestaurants();
    initializeMap();
    generateAIRecommendation();
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索框回车事件
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRestaurants();
        }
    });

    // 分类筛选
    document.querySelectorAll('.category-card').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterByCategory(category);
            
            // 更新活动状态
            document.querySelectorAll('.category-card').forEach(btn => 
                btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 快速筛选
    document.querySelectorAll('.quick-filter').forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            applyQuickFilter(filter);
            
            // 更新活动状态
            document.querySelectorAll('.quick-filter').forEach(btn => 
                btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 渲染餐厅列表
function renderRestaurants(filteredRestaurants = restaurants) {
    const grid = document.getElementById('restaurantsGrid');
    const restaurantsToShow = filteredRestaurants.slice(0, displayedRestaurants);
    
    grid.innerHTML = restaurantsToShow.map(restaurant => `
        <div class="restaurant-card" data-id="${restaurant.id}">
            <div class="restaurant-image" style="background-image: url('${restaurant.image}')">
                ${restaurant.distance <= 0.5 ? '<span class="restaurant-badge">近</span>' : ''}
            </div>
            <div class="restaurant-content">
                <div class="restaurant-header">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-rating">
                        <i class="fas fa-star"></i>
                        <span>${restaurant.rating}</span>
                        <span>(${restaurant.reviews})</span>
                    </div>
                </div>
                
                <div class="restaurant-info">
                    <span><i class="fas fa-tag"></i> ${restaurant.category}</span>
                    <span><i class="fas fa-walking"></i> ${restaurant.distance}km</span>
                    <span><i class="fas fa-yen-sign"></i> ¥${restaurant.price}/人</span>
                </div>
                
                <p>${restaurant.description}</p>
                
                <div class="restaurant-tags">
                    ${restaurant.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                
                <button class="btn-view" onclick="showRestaurantDetail(${restaurant.id})">
                    <i class="fas fa-info-circle"></i> 查看详情
                </button>
            </div>
        </div>
    `).join('');
}

// 搜索餐厅
function searchRestaurants() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    
    if (!keyword.trim()) {
        renderRestaurants(restaurants);
        return;
    }
    
    const filtered = restaurants.filter(r => 
        r.name.toLowerCase().includes(keyword) ||
        r.category.toLowerCase().includes(keyword) ||
        r.description.toLowerCase().includes(keyword) ||
        r.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
    
    renderRestaurants(filtered);
    displayedRestaurants = filtered.length;
}

// 分类筛选
function filterByCategory(category) {
    if (category === 'all') {
        renderRestaurants(restaurants);
    } else {
        const filtered = restaurants.filter(r => r.category === category);
        renderRestaurants(filtered);
    }
    displayedRestaurants = 6;
}

// 快速筛选
function applyQuickFilter(filter) {
    let filtered = [...restaurants];
    
    switch(filter) {
        case '附近':
            filtered = filtered.filter(r => r.distance <= 0.5);
            break;
        case '评分高':
            filtered = filtered.filter(r => r.rating >= 4.5);
            break;
        case '人均低':
            filtered = filtered.sort((a, b) => a.price - b.price);
            break;
    }
    
    renderRestaurants(filtered);
    displayedRestaurants = 6;
}

// 排序餐厅
function sortRestaurants() {
    const sortBy = document.getElementById('sortSelect').value;
    let sorted = [...restaurants];
    
    switch(sortBy) {
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'distance':
            sorted.sort((a, b) => a.distance - b.distance);
            break;
        case 'price_low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            sorted.sort((a, b) => b.price - a.price);
            break;
    }
    
    renderRestaurants(sorted);
}

// 加载更多
function loadMoreRestaurants() {
    displayedRestaurants += 6;
    renderRestaurants(restaurants.slice(0, displayedRestaurants));
}

// 显示餐厅详情
function showRestaurantDetail(id) {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;
    
    // 添加到浏览历史
    if (!userHistory.includes(id)) {
        userHistory.unshift(id);
        if (userHistory.length > 5) userHistory.pop();
    }
    
    const modal = document.getElementById('restaurantModal');
    const content = document.getElementById('restaurantDetailContent');
    
    content.innerHTML = `
        <div class="restaurant-detail">
            <div class="detail-header">
                <div class="detail-image" style="background-image: url('${restaurant.image}')"></div>
                <div class="detail-info">
                    <h2>${restaurant.name}</h2>
                    <div class="detail-rating">
                        <div class="stars">
                            ${'★'.repeat(Math.floor(restaurant.rating))}${'☆'.repeat(5 - Math.floor(restaurant.rating))}
                        </div>
                        <span>${restaurant.rating} (${restaurant.reviews}条评价)</span>
                    </div>
                    <div class="detail-meta">
                        <span><i class="fas fa-tag"></i> ${restaurant.category}</span>
                        <span><i class="fas fa-walking"></i> ${restaurant.distance}km</span>
                        <span><i class="fas fa-yen-sign"></i> ¥${restaurant.price}/人</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-content">
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> 餐厅介绍</h3>
                    <p>${restaurant.description}</p>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-clock"></i> 营业时间</h3>
                    <p>${restaurant.hours}</p>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-phone"></i> 联系方式</h3>
                    <p>${restaurant.phone}</p>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-tags"></i> 特色标签</h3>
                    <div class="detail-tags">
                        ${restaurant.tags.map(tag => `<span class="tag large">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn-action" onclick="navigateToRestaurant(${restaurant.id})">
                        <i class="fas fa-map-marker-alt"></i> 导航前往
                    </button>
                    <button class="btn-action" onclick="addToFavorites(${restaurant.id})">
                        <i class="far fa-heart"></i> 收藏
                    </button>
                    <button class="btn-action primary" onclick="makeReservation(${restaurant.id})">
                        <i class="fas fa-phone"></i> 电话预定
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // 更新地图位置
    if (map) {
        map.setView([restaurant.location.lat, restaurant.location.lng], 15);
    }
}

// 关闭餐厅详情模态框
function closeRestaurantModal() {
    document.getElementById('restaurantModal').style.display = 'none';
}

// 初始化地图
function initializeMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;
    
    // 默认位置：上海大学城附近
    const defaultLocation = [31.2304, 121.4737];
    
    map = L.map('mapContainer').setView(defaultLocation, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // 添加餐厅标记
    restaurants.forEach(restaurant => {
        const marker = L.marker([restaurant.location.lat, restaurant.location.lng])
            .addTo(map)
            .bindPopup(`
                <b>${restaurant.name}</b><br>
                ${restaurant.category}<br>
                评分: ${restaurant.rating} ⭐<br>
                距离: ${restaurant.distance}km<br>
                <button onclick="showRestaurantDetail(${restaurant.id})" 
                        style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 5px;">
                    查看详情
                </button>
            `);
    });
}

// 定位用户
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            if (map) {
                map.setView([userLat, userLng], 15);
                
                // 添加用户位置标记
                L.marker([userLat, userLng], {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: '<i class="fas fa-circle" style="color: #ff6b6b; font-size: 20px;"></i>',
                        iconSize: [20, 20]
                    })
                }).addTo(map)
                .bindPopup('您的位置')
                .openPopup();
            }
        }, () => {
            alert('无法获取您的位置，请检查浏览器权限设置。');
        });
    } else {
        alert('您的浏览器不支持地理位置功能。');
    }
}

// 导航到餐厅
function navigateToRestaurant(id) {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant || !navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const destLat = restaurant.location.lat;
        const destLng = restaurant.location.lng;
        
        // 打开百度地图导航
        const url = `https://api.map.baidu.com/direction?origin=${userLat},${userLng}&destination=${destLat},${destLng}&mode=walking&output=html`;
        window.open(url, '_blank');
    });
}

// 添加到收藏
function addToFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        alert('已从收藏中移除');
    } else {
        favorites.push(id);
        alert('已添加到收藏');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// 电话预定
function makeReservation(id) {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;
    
    if (confirm(`是否要拨打 ${restaurant.name} 的电话 ${restaurant.phone} 进行预定？`)) {
        window.location.href = `tel:${restaurant.phone}`;
    }
}

// 登录/注册模态框
function toggleLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function switchToRegister() {
    alert('注册功能开发中...');
}

// 生成AI推荐
function generateAIRecommendation() {
    const recommendationsContainer = document.getElementById('aiRecommendedRestaurants');
    const textElement = document.getElementById('aiRecommendationText');
    
    // 基于当前时间和用户历史生成推荐
    const now = new Date();
    const hour = now.getHours();
    let recommendationText = '';
    
    if (hour >= 6 && hour < 10) {
        recommendationText = '🌅 清晨的第一餐很重要，为您推荐营养早餐：';
    } else if (hour >= 10 && hour < 14) {
        recommendationText = '☀️ 午餐时间到！为您推荐人气午餐：';
    } else if (hour >= 14 && hour < 17) {
        recommendationText = '🍰 下午茶时光，为您推荐精致甜点：';
    } else if (hour >= 17 && hour < 21) {
        recommendationText = '🌙 晚餐吃什么？为您推荐适合聚餐的餐厅：';
    } else {
        recommendationText = '🌃 深夜食堂推荐，夜猫子看这里：';
    }
    
    textElement.textContent = recommendationText;
    
    // 基于用户历史推荐相似餐厅
    let recommendedIds = [...new Set(userHistory)];
    
    // 如果没有历史，随机推荐
    if (recommendedIds.length === 0) {
        recommendedIds = restaurants
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(r => r.id);
    } else {
        // 基于历史推荐相似的
        const historyCategories = restaurants
            .filter(r => recommendedIds.includes(r.id))
            .map(r => r.category);
        
        const similarRestaurants = restaurants
            .filter(r => !recommendedIds.includes(r.id))
            .filter(r => historyCategories.includes(r.category))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3 - recommendedIds.length)
            .map(r => r.id);
        
        recommendedIds = [...recommendedIds, ...similarRestaurants].slice(0, 3);
    }
    
    const recommended = restaurants.filter(r => recommendedIds.includes(r.id));
    
    recommendationsContainer.innerHTML = recommended.map(restaurant => `
        <div class="ai-recommendation-item" onclick="showRestaurantDetail(${restaurant.id})">
            <img src="${restaurant.image}" alt="${restaurant.name}">
            <div>
                <h4>${restaurant.name}</h4>
                <p>${restaurant.category} · ${restaurant.rating}⭐ · ${restaurant.distance}km</p>
                <p>${restaurant.description.substring(0, 40)}...</p>
            </div>
        </div>
    `).join('');
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    .user-location-marker {
        background: transparent;
        border: none;
    }
    
    .restaurant-detail {
        max-width: 100%;
    }
    
    .detail-header {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .detail-image {
        width: 200px;
        height: 150px;
        background-size: cover;
        background-position: center;
        border-radius: 10px;
    }
    
    .detail-info h2 {
        margin-bottom: 1rem;
        color: var(--dark);
    }
    
    .detail-rating {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .stars {
        color: #ffb300;
        font-size: 1.2rem;
    }
    
    .detail-meta {
        display: flex;
        gap: 1.5rem;
        color: var(--gray);
        margin-bottom: 1rem;
    }
    
    .detail-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .detail-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--light-gray);
    }
    
    .detail-section h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 0.5rem;
        color: var(--dark);
    }
    
    .detail-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .tag.large {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    .detail-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .btn-action {
        flex: 1;
        padding: 0.8rem;
        border: 2px solid var(--primary);
        background: white;
        color: var(--primary);
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: var(--transition);
    }
    
    .btn-action:hover {
        background: var(--primary);
        color: white;
    }
    
    .btn-action.primary {
        background: var(--primary);
        color: white;
    }
    
    .btn-action.primary:hover {
        background: var(--primary-dark);
    }
    
    .ai-recommendation-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: rgba(255,255,255,0.2);
        border-radius: 10px;
        margin-bottom: 1rem;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .ai-recommendation-item:hover {
        background: rgba(255,255,255,0.3);
        transform: translateX(5px);
    }
    
    .ai-recommendation-item img {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
    }
    
    .ai-recommendation-item h4 {
        margin-bottom: 0.5rem;
        color: white;
    }
    
    .ai-recommendation-item p {
        font-size: 0.9rem;
        opacity: 0.9;
        margin-bottom: 0.3rem;
    }
    
    @media (max-width: 768px) {
        .detail-header {
            flex-direction: column;
        }
        
        .detail-image {
            width: 100%;
            height: 200px;
        }
        
        .detail-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);

// 点击模态框外部关闭
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}