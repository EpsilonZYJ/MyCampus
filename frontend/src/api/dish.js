import axios from "axios";

// 获取所有菜品
export const getAllDishes = async () => {
  try {
    const res = await axios.get("/api/dishes");
    return res.data?.data || []; // 保证返回数组
  } catch (err) {
    console.error("获取菜品失败", err);
    return [];
  }
};

// 获取单个菜品详情
export const getDishById = async (id) => {
  try {
    const res = await axios.get(`/api/dishes/${id}`);
    return res.data?.data || null;
  } catch (err) {
    console.error(`获取菜品 ${id} 详情失败`, err);
    return null;
  }
};

// 获取菜品图片
export const getDishImage = (id) => `/api/dishes/${id}/image`;

// 根据分类获取菜品
export const getDishesByCategory = async (category) => {
  try {
    const res = await axios.get(`/api/dishes/category/${category}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`获取分类 ${category} 菜品失败`, err);
    return [];
  }
};

// 根据餐厅获取菜品
export const getDishesByRestaurant = async (restaurant) => {
  try {
    const res = await axios.get(`/api/dishes/location/${restaurant}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`获取餐厅 ${restaurant} 菜品失败`, err);
    return [];
  }
};

// 模糊搜索菜品
export const searchDishes = async (keyword) => {
  try {
    const res = await axios.get(`/api/dishes/search?keyword=${keyword}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`搜索菜品 ${keyword} 失败`, err);
    return [];
  }
};

// 获取可供应菜品
export const getAvailableDishes = async () => {
  try {
    const res = await axios.get(`/api/dishes/available`);
    return res.data?.data || [];
  } catch (err) {
    console.error("获取可供应菜品失败", err);
    return [];
  }
};
