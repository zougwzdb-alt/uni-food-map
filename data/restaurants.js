// 餐厅数据
const restaurants = [
    {
        id: 1,
        name: "川味人家",
        category: "川湘菜",
        rating: 4.8,
        reviews: 1289,
        distance: 0.5,
        price: 45,
        description: "正宗川菜，麻辣鲜香，水煮鱼和辣子鸡堪称一绝，适合聚餐。",
        image: "https://images.unsplash.com/photo-1555939594-888f5d7a3d9c?auto=format&fit=crop&w=600&q=80",
        tags: ["麻辣", "聚餐", "学生价"],
        location: { lat: 31.2304, lng: 121.4737 },
        hours: "10:00-22:00",
        phone: "138-0013-8000"
    },
    {
        id: 2,
        name: "校园披萨屋",
        category: "西餐",
        rating: 4.5,
        reviews: 876,
        distance: 0.3,
        price: 60,
        description: "现烤手工披萨，芝士浓郁，适合学生聚餐和小型派对。",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
        tags: ["披萨", "学生特惠", "外卖快"],
        location: { lat: 31.231, lng: 121.474 },
        hours: "11:00-23:00",
        phone: "138-0013-8001"
    },
    {
        id: 3,
        name: "深夜食堂",
        category: "日韩料理",
        rating: 4.9,
        reviews: 2105,
        distance: 0.8,
        price: 55,
        description: "营业到凌晨三点，日式拉面和寿司是招牌，深夜学习者的食堂。",
        image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=600&q=80",
        tags: ["深夜营业", "拉面", "夜宵"],
        location: { lat: 31.229, lng: 121.475 },
        hours: "18:00-03:00",
        phone: "138-0013-8002"
    },
    {
        id: 4,
        name: "蜜雪冰城",
        category: "甜品",
        rating: 4.6,
        reviews: 3456,
        distance: 0.2,
        price: 15,
        description: "高性价比奶茶和冰淇淋，学生党的最爱，排队也要买。",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80",
        tags: ["奶茶", "冰淇淋", "性价比"],
        location: { lat: 31.2308, lng: 121.473 },
        hours: "09:00-22:00",
        phone: "138-0013-8003"
    },
    {
        id: 5,
        name: "重庆老火锅",
        category: "火锅烧烤",
        rating: 4.7,
        reviews: 1567,
        distance: 1.2,
        price: 80,
        description: "地道重庆火锅，牛油锅底香辣过瘾，适合宿舍团建聚餐。",
        image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?auto=format&fit=crop&w=600&q=80",
        tags: ["火锅", "聚餐", "辣"],
        location: { lat: 31.232, lng: 121.476 },
        hours: "11:00-00:00",
        phone: "138-0013-8004"
    },
    {
        id: 6,
        name: "早安咖啡",
        category: "早餐",
        rating: 4.4,
        reviews: 987,
        distance: 0.4,
        price: 25,
        description: "现磨咖啡配三明治，适合早课前的能量补充，有学生套餐。",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
        tags: ["早餐", "咖啡", "快速"],
        location: { lat: 31.2302, lng: 121.472 },
        hours: "07:00-20:00",
        phone: "138-0013-8005"
    },
    {
        id: 7,
        name: "麦当劳",
        category: "快餐",
        rating: 4.3,
        reviews: 4321,
        distance: 0.6,
        price: 35,
        description: "24小时营业，标准快餐，赶时间的最佳选择。",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        tags: ["24小时", "快捷", "套餐"],
        location: { lat: 31.2315, lng: 121.4745 },
        hours: "24小时",
        phone: "138-0013-8006"
    },
    {
        id: 8,
        name: "韩式烤肉店",
        category: "日韩料理",
        rating: 4.8,
        reviews: 1234,
        distance: 1.5,
        price: 75,
        description: "正宗韩式烤肉，肉品新鲜，小菜无限量，聚会好去处。",
        image: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=600&q=80",
        tags: ["烤肉", "韩式", "聚餐"],
        location: { lat: 31.233, lng: 121.477 },
        hours: "11:00-22:00",
        phone: "138-0013-8007"
    }
];

// 用户浏览历史（模拟）
let userHistory = [1, 3, 5];
let currentFilter = 'all';
let displayedRestaurants = 6;
let map = null;