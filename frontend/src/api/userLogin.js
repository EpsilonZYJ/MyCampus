import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

/* -------------------- 用户模块接口封装 -------------------- */

// 用户注册
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/users/register`, userData);
    return res.data?.data || null;
  } catch (err) {
    console.error("用户注册失败:", err);
    return null;
  }
};

// 用户登录
export const loginUser = async (userName, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/users/login`, { userName, password });
    return { success: true, data: res.data?.data }; // 后端返回 token 和 user 信息
  } catch (err) {
    console.error("用户登录失败:", err);
    // 返回错误信息
    return { 
      success: false, 
      message: err.response?.data?.message || err.message || "登录失败",
      error: err.response?.data || err
    };
  }
};

// 根据 ID 获取用户信息
export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/users/${id}`);
    return res.data?.data || null;
  } catch (err) {
    console.error(`获取用户 ${id} 信息失败:`, err);
    return null;
  }
};

// 更新用户信息
export const updateUser = async (id, userUpdates) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/api/users/${id}`, userUpdates);
    return res.data?.data || null;
  } catch (err) {
    console.error(`更新用户 ${id} 信息失败:`, err);
    return null;
  }
};

// 添加收货地址
export const addUserAddress = async (userId, address) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/users/${userId}/addresses`, address);
    return res.data?.data || null;
  } catch (err) {
    console.error(`为用户 ${userId} 添加地址失败:`, err);
    return null;
  }
};

// 更新用户地址
export const updateUserAddress = async (userId, addressId, addressUpdates) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/api/users/${userId}/addresses/${addressId}`,
      addressUpdates
    );
    return res.data?.data || null;
  } catch (err) {
    console.error(`更新用户 ${userId} 地址失败:`, err);
    return null;
  }
};

// 删除用户地址
export const deleteUserAddress = async (userId, addressId) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/api/users/${userId}/addresses/${addressId}`);
    return res.data?.data || null;
  } catch (err) {
    console.error(`删除用户 ${userId} 地址失败:`, err);
    return null;
  }
};

// 申请成为跑腿员
export const becomeRunner = async (userId, idCardNumber, studentIDCardurl) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/users/${userId}/become-runner`, {
      idCardNumber,
      studentIDCardurl,
    });
    return res.data?.data || null;
  } catch (err) {
    console.error(`用户 ${userId} 申请跑腿员失败:`, err);
    return null;
  }
};

// 更新跑腿员在线状态
export const updateRunnerStatus = async (userId, status) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/api/users/${userId}/runner/status`, { status });
    return res.data?.data || null;
  } catch (err) {
    console.error(`更新跑腿员 ${userId} 状态失败:`, err);
    return null;
  }
};

// 增加余额（充值）
export const addUserBalance = async (userId, amount) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/users/${userId}/balance/add`, { amount });
    return res.data?.data || null;
  } catch (err) {
    console.error(`为用户 ${userId} 充值失败:`, err);
    return null;
  }
};

// 扣除余额（消费）
export const deductUserBalance = async (userId, amount) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/users/${userId}/balance/deduct`, { amount });
    return res.data?.data || null;
  } catch (err) {
    console.error(`扣除用户 ${userId} 余额失败:`, err);
    return null;
  }
};
