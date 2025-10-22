// src/api/MockUser.js
let users = [];

// -------------------- 初始化模拟数据 --------------------
const initData = async () => {
  if (users.length === 0) {
    try {
      const res = await fetch("/data/CreatedDish.json"); // 假设其中也含有用户模拟数据
      const json = await res.json();
      users = json.users || [
        {
          id: "1",
          userName: "admin",
          password: "123456",
          role: "ADMIN",
          balance: 100.0,
          addresses: [],
          runnerProfile: { status: "OFFLINE", idCardNumber: "", studentIDCardurl: "" },
        },
        {
          id: "2",
          userName: "user",
          password: "123456",
          role: "USER",
          balance: 50.0,
          addresses: [],
          runnerProfile: { status: "OFFLINE", idCardNumber: "", studentIDCardurl: "" },
        },
      ];
    } catch (err) {
      console.error("加载用户模拟数据失败:", err);
    }
  }
};

// 模拟网络延迟
const delay = (res) => new Promise((resolve) => setTimeout(() => resolve(res), 300));

// -------------------- 用户注册 --------------------
export const registerUser = async (userRegisterRequest) => {
  await initData();
  const exists = users.find((u) => u.userName === userRegisterRequest.userName);
  if (exists) return delay({ success: false, message: "用户名已存在" });

  const newUser = {
    id: (users.length + 1).toString(),
    ...userRegisterRequest,
    balance: 0,
    addresses: [],
    runnerProfile: { status: "OFFLINE" },
  };
  users.push(newUser);
  return delay({ success: true, data: newUser });
};

// -------------------- 用户登录 --------------------
export const mockLogin = async (userName, password) => {
  await initData();
  const user = users.find((u) => u.userName === userName && u.password === password);
  if (user) {
    const token = btoa(`${userName}:${Date.now()}`); // 简单模拟 token
    return delay({
      success: true,
      data: { token, user },
    });
  }
  return delay({ success: false, message: "用户名或密码错误" });
};

// -------------------- 获取用户信息 --------------------
export const getUserById = async (id) => {
  await initData();
  const user = users.find((u) => u.id === id);
  return delay(user ? { success: true, data: user } : { success: false, message: "用户不存在" });
};

// -------------------- 更新用户信息 --------------------
export const updateUser = async (id, updates) => {
  await initData();
  const user = users.find((u) => u.id === id);
  if (!user) return delay({ success: false, message: "用户不存在" });

  Object.assign(user, updates);
  return delay({ success: true, data: user });
};

// -------------------- 地址相关 --------------------
export const addAddress = async (userId, address) => {
  await initData();
  const user = users.find((u) => u.id === userId);
  if (!user) return delay({ success: false, message: "用户不存在" });

  const newAddress = { id: Date.now().toString(), ...address };
  user.addresses.push(newAddress);
  return delay({ success: true, data: user });
};

export const updateAddress = async (userId, addressId, updates) => {
  await initData();
  const user = users.find((u) => u.id === userId);
  if (!user) return delay({ success: false, message: "用户不存在" });

  const addr = user.addresses.find((a) => a.id === addressId);
  if (!addr) return delay({ success: false, message: "地址不存在" });

  Object.assign(addr, updates);
  return delay({ success: true, data: user });
};

export const deleteAddress = async (userId, addressId) => {
  await initData();
  const user = users.find((u) => u.id === userId);
  if (!user) return delay({ success: false, message: "用户不存在" });

  user.addresses = user.addresses.filter((a) => a.id !== addressId);
  return delay({ success: true, data: user });
};

// -------------------- 跑腿员功能 --------------------
export const becomeRunner = async (userId, idCardNumber, studentIDCardurl) => {
  await initData();
  const user = users.find((u) => u.id === userId);
  if (!user) return delay({ success: false, message: "用户不存在" });

  user.runnerProfile = {
    idCardNumber,
    studentIDCardurl,
    status: "PENDING",
  };
  return delay({ success: true, data: user });
};

export const updateRunnerStatus = async (userId, status) => {
  await initData();
  const user = users.find((u) => u.id === userId);
  if (!user) return delay({ success: false, message: "用户不存在" });

  if (!user.runnerProfile) user.runnerProfile = {};
  user.runnerProfile.status = status;
  return delay({ success: true, data: user });
};

// -------------------- 余额操作 --------------------
export const addBalance = async (userId, amount) => {
  await initData();
  const user = users.find((u) => u.id === userId);
  if (!user) return delay({ success: false, message: "用户不存在" });

  user.balance += Number(amount);
  return delay({ success: true, data: user });
};

export const deductBalance = async (userId, amount) => {
  await initData();
  const user = users.find((u) => u.id === userId);
  if (!user) return delay({ success: false, message: "用户不存在" });

  if (user.balance < amount)
    return delay({ success: false, message: "余额不足" });

  user.balance -= Number(amount);
  return delay({ success: true, data: user });
};
