import axios from "axios";

/* -------------------- 余额和交易模块接口封装 -------------------- */

// 充值余额（测试用）
export const rechargeBalance = async (userId, amount) => {
  try {
    console.log("发送充值请求:", { userId, amount });
    const res = await axios.post(`/api/users/${userId}/balance/add`, { amount });
    console.log("充值请求响应:", res);
    console.log("响应状态码:", res.status);
    console.log("响应数据:", res.data);
    console.log("响应数据类型:", typeof res.data);
    console.log("提取的用户数据:", res.data?.data);
    return { success: true, data: res.data?.data };
  } catch (err) {
    console.error("充值请求失败:", err);
    console.error("错误响应:", err.response);
    console.error("错误响应数据:", err.response?.data);
    console.error("错误响应状态:", err.response?.status);
    console.error("错误消息:", err.message);
    return {
      success: false,
      message: err.response?.data?.message || err.response?.data || err.message || "充值失败"
    };
  }
};

// 用户间转账
export const transferBalance = async (fromUserId, toUserId, amount) => {
  try {
    const res = await axios.post(`/api/users/${fromUserId}/transfer`, {
      toUserId,
      amount
    });
    return { success: true, data: res.data?.data };
  } catch (err) {
    console.error("转账失败:", err);
    return {
      success: false,
      message: err.response?.data?.message || err.message || "转账失败"
    };
  }
};

// 用户申请提现
export const withdrawBalance = async (userId, amount) => {
  try {
    const res = await axios.post(`/api/users/${userId}/withdraw`, { amount });
    return { success: true, data: res.data?.data };
  } catch (err) {
    console.error("提现申请失败:", err);
    return {
      success: false,
      message: err.response?.data?.message || err.message || "提现申请失败"
    };
  }
};

// 根据交易ID查询
export const getTransactionById = async (transactionId) => {
  try {
    const res = await axios.get(`/api/transactions/${transactionId}`);
    return res.data?.data || null;
  } catch (err) {
    console.error(`获取交易 ${transactionId} 失败:`, err);
    return null;
  }
};

// 根据流水号查询
export const getTransactionByNumber = async (transactionNumber) => {
  try {
    const res = await axios.get(`/api/transactions/number/${transactionNumber}`);
    return res.data?.data || null;
  } catch (err) {
    console.error(`获取交易流水号 ${transactionNumber} 失败:`, err);
    return null;
  }
};

// 查询用户所有交易记录
export const getUserTransactions = async (userId) => {
  try {
    const res = await axios.get(`/api/transactions/user/${userId}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`获取用户 ${userId} 交易记录失败:`, err);
    return [];
  }
};

// 按类型查询交易记录
export const getTransactionsByType = async (userId, type) => {
  try {
    const res = await axios.get(`/api/transactions/user/${userId}/type/${type}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`获取用户 ${userId} ${type} 类型交易失败:`, err);
    return [];
  }
};

// 按状态查询交易记录
export const getTransactionsByStatus = async (userId, status) => {
  try {
    const res = await axios.get(`/api/transactions/user/${userId}/status/${status}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`获取用户 ${userId} ${status} 状态交易失败:`, err);
    return [];
  }
};

// 按时间范围查询交易记录
export const getTransactionsByDateRange = async (userId, startTime, endTime) => {
  try {
    const res = await axios.get(
      `/api/transactions/user/${userId}/date-range`,
      {
        params: { startTime, endTime }
      }
    );
    return res.data?.data || [];
  } catch (err) {
    console.error(`获取用户 ${userId} 时间范围交易失败:`, err);
    return [];
  }
};

// 查询订单相关交易记录
export const getOrderTransactions = async (orderId) => {
  try {
    const res = await axios.get(`/api/transactions/order/${orderId}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`获取订单 ${orderId} 交易记录失败:`, err);
    return [];
  }
};

// 管理员：查询所有待审核提现申请
export const getPendingWithdrawals = async () => {
  try {
    const res = await axios.get(`/api/transactions/withdrawals/pending`);
    return res.data?.data || [];
  } catch (err) {
    console.error("获取待审核提现列表失败:", err);
    return [];
  }
};

// 管理员：审核提现申请
export const approveWithdrawal = async (transactionId, approved, remark = "") => {
  try {
    const res = await axios.post(
      `/api/transactions/${transactionId}/approve-withdrawal`,
      { approved, remark }
    );
    return { success: true, data: res.data?.data };
  } catch (err) {
    console.error("审核提现申请失败:", err);
    return {
      success: false,
      message: err.response?.data?.message || err.message || "审核失败"
    };
  }
};

