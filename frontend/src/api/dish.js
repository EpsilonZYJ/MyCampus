import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// -------------------- 已有接口 --------------------
// 获取所有菜品
export const getAllDishes = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/dishes`);
    return res.data?.data || [];
  } catch (err) {
    console.error("获取菜品失败", err);
    return [];
  }
};

// 获取单个菜品详情
export const getDishById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/dishes/${id}`);
    return res.data?.data || null;
  } catch (err) {
    console.error(`获取菜品 ${id} 详情失败`, err);
    return null;
  }
};

// 获取菜品图片 URL
export const getDishImage = (id) => `${API_BASE_URL}/api/dishes/${id}/image`;

// 根据分类获取菜品
export const getDishesByCategory = async (category) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/dishes/category/${category}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`获取分类 ${category} 菜品失败`, err);
    return [];
  }
};

// 根据餐厅获取菜品
export const getDishesByRestaurant = async (restaurant) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/dishes/location/${restaurant}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`获取餐厅 ${restaurant} 菜品失败`, err);
    return [];
  }
};

// 模糊搜索菜品
export const searchDishes = async (keyword) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/dishes/search?keyword=${keyword}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`搜索菜品 ${keyword} 失败`, err);
    return [];
  }
};

// 获取可供应菜品
export const getAvailableDishes = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/dishes/available`);
    return res.data?.data || [];
  } catch (err) {
    console.error("获取可供应菜品失败", err);
    return [];
  }
};

// -------------------- 新增接口 --------------------

// 创建菜品（带图片）
export const createDish = async (dishData) => {
  try {
    // 不要手动设置Content-Type，让axios自动处理
    const res = await axios.post(`${API_BASE_URL}/api/dishes`, dishData);
    return res.data?.data || null;
  } catch (err) {
    console.error("上传菜品失败", err);
    return null;
  }
};

// 更新菜品（支持图片）
export const updateDish = async (id, dishData) => {
  try {
    // 不要手动设置Content-Type，让axios自动处理
    const res = await axios.put(`${API_BASE_URL}/api/dishes/${id}`, dishData);
    return res.data?.data || null;
  } catch (err) {
    console.error(`更新菜品 ${id} 失败`, err);
    return null;
  }
};

// 删除菜品
export const deleteDish = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/api/dishes/${id}`);
    return res.data?.data || null;
  } catch (err) {
    console.error(`删除菜品 ${id} 失败`, err);
    return null;
  }
};

// 更新菜品评分
export const updateDishRating = async (id, rating) => {
  try {
    // 直接传递rating对象作为JSON数据
    const res = await axios.post(`${API_BASE_URL}/api/dishes/${id}/rating`, { rating });
    return res.data?.data || null;
  } catch (err) {
    console.error(`更新菜品评分 ${id} 失败`, err);
    return null;
  }
};
