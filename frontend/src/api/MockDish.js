// src/api/MockDish.js

let dishes = [];
let users = [];

// -------------------- 初始化数据 --------------------
const initData = async () => {
  if (dishes.length === 0 && users.length === 0) {
    try {
      const res = await fetch("/data/CreatedDish.json");
      const json = await res.json();
      dishes = json.dishes.map((d, index) => ({ ...d, id: d.id || index.toString() }));
      users = json.users;
    } catch (err) {
      console.error("加载模拟数据失败:", err);
    }
  }
};

// -------------------- Mock 菜品接口 --------------------
export const getAllDishes = async () => {
  await initData();
  return new Promise((resolve) => setTimeout(() => resolve(dishes), 200));
};

export const getDishById = async (id) => {
  await initData();
  const dish = dishes.find((d) => d.id === id);
  return new Promise((resolve) => setTimeout(() => resolve(dish || null), 200));
};

export const getDishImage = async (id) => {
  await initData();
  const dish = dishes.find((d) => d.id === id);
  return dish ? dish.imageData : "";
};

export const getDishesByCategory = async (category) => {
  await initData();
  const filtered = dishes.filter((d) => d.category === category);
  return new Promise((resolve) => setTimeout(() => resolve(filtered), 200));
};

export const getDishesByRestaurant = async (restaurant) => {
  await initData();
  const filtered = dishes.filter((d) => d.restaurant === restaurant);
  return new Promise((resolve) => setTimeout(() => resolve(filtered), 200));
};

export const searchDishes = async (keyword) => {
  await initData();
  const filtered = dishes.filter(
    (d) =>
      d.dishName.includes(keyword) ||
      d.description.includes(keyword) ||
      d.restaurant.includes(keyword)
  );
  return new Promise((resolve) => setTimeout(() => resolve(filtered), 200));
};

export const getAvailableDishes = async () => {
  await initData();
  const available = dishes.filter((d) => d.isAvailable);
  return new Promise((resolve) => setTimeout(() => resolve(available), 200));
};

export const createDish = async (dishData) => {
  await initData();
  const newDish = { ...dishData, reviewCount: 0, rating: 0, id: (dishes.length + 1).toString() };
  dishes.push(newDish);
  return new Promise((resolve) => setTimeout(() => resolve(newDish), 200));
};

export const updateDish = async (id, dishData) => {
  await initData();
  const index = dishes.findIndex((d) => d.id === id);
  if (index !== -1) {
    dishes[index] = { ...dishes[index], ...dishData };
    return new Promise((resolve) => setTimeout(() => resolve(dishes[index]), 200));
  }
  return null;
};

export const deleteDish = async (id) => {
  await initData();
  const index = dishes.findIndex((d) => d.id === id);
  if (index !== -1) {
    const deleted = dishes.splice(index, 1);
    return new Promise((resolve) => setTimeout(() => resolve(deleted[0]), 200));
  }
  return null;
};

export const updateDishRating = async (id, rating) => {
  await initData();
  const dish = dishes.find((d) => d.id === id);
  if (dish) {
    dish.rating = rating;
    return new Promise((resolve) => setTimeout(() => resolve(dish), 200));
  }
  return null;
};

// -------------------- Mock 用户接口 --------------------
export const mockLogin = async (username, password) => {
  await initData();
  const user = users.find(
    (u) => u.user_name === username && u.password === password
  );
  return new Promise((resolve) =>
    setTimeout(() => resolve(user ? { success: true, data: user } : { success: false }), 200)
  );
};

export const mockGetUserById = async (id) => {
  await initData();
  const user = users.find((u, index) => index.toString() === id);
  return new Promise((resolve) =>
    setTimeout(() => resolve(user || null), 200)
  );
};
