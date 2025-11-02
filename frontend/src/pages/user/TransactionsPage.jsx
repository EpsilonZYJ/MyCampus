import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useUser } from "../../contexts/UserContext";
import {
  getUserTransactions,
  getTransactionsByType,
  getTransactionsByStatus,
  getTransactionsByDateRange
} from "../../api/balance";
import "./TransactionsPage.css";

export default function TransactionsPage() {
  const { currentUser } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 筛选条件
  const [filters, setFilters] = useState({
    type: "ALL",
    status: "ALL",
    startDate: "",
    endDate: ""
  });

  // 交易类型映射
  const typeMap = {
    RECHARGE: "充值",
    TRANSFER_IN: "转入",
    TRANSFER_OUT: "转出",
    PAYMENT: "支付",
    REFUND: "退款",
    WITHDRAWAL: "提现",
    EARNING: "收益"
  };

  // 交易状态映射
  const statusMap = {
    PENDING: "待处理",
    COMPLETED: "已完成",
    FAILED: "失败",
    CANCELLED: "已取消"
  };

  // 获取交易记录
  useEffect(() => {
    fetchTransactions();
  }, [currentUser.id]);

  // 应用筛选
  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getUserTransactions(currentUser.id);
      setTransactions(data);
    } catch (error) {
      console.error("获取交易记录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // 按类型筛选
    if (filters.type !== "ALL") {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // 按状态筛选
    if (filters.status !== "ALL") {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // 按日期范围筛选
    if (filters.startDate) {
      const startTime = new Date(filters.startDate).getTime();
      filtered = filtered.filter(t => new Date(t.createdAt).getTime() >= startTime);
    }

    if (filters.endDate) {
      const endTime = new Date(filters.endDate).getTime() + 86400000; // 加一天
      filtered = filtered.filter(t => new Date(t.createdAt).getTime() < endTime);
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({
      type: "ALL",
      status: "ALL",
      startDate: "",
      endDate: ""
    });
  };

  const getTypeClass = (type) => {
    const classMap = {
      RECHARGE: "type-recharge",
      TRANSFER_IN: "type-transfer-in",
      TRANSFER_OUT: "type-transfer-out",
      PAYMENT: "type-payment",
      REFUND: "type-refund",
      WITHDRAWAL: "type-withdrawal",
      EARNING: "type-earning"
    };
    return classMap[type] || "";
  };

  const getStatusClass = (status) => {
    const classMap = {
      PENDING: "status-pending",
      COMPLETED: "status-completed",
      FAILED: "status-failed",
      CANCELLED: "status-cancelled"
    };
    return classMap[status] || "";
  };

  const getAmountClass = (type) => {
    // 收入类型显示绿色，支出类型显示红色
    const incomeTypes = ["RECHARGE", "TRANSFER_IN", "REFUND", "EARNING"];
    return incomeTypes.includes(type) ? "amount-income" : "amount-expense";
  };

  const getAmountPrefix = (type) => {
    const incomeTypes = ["RECHARGE", "TRANSFER_IN", "REFUND", "EARNING"];
    return incomeTypes.includes(type) ? "+" : "-";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // 统计信息
  const getStatistics = () => {
    const income = filteredTransactions
      .filter(t => ["RECHARGE", "TRANSFER_IN", "REFUND", "EARNING"].includes(t.type) && t.status === "COMPLETED")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter(t => ["TRANSFER_OUT", "PAYMENT", "WITHDRAWAL"].includes(t.type) && t.status === "COMPLETED")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense };
  };

  const stats = getStatistics();

  return (
    <>
      <Navbar />
      <div className="transactions-container">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <div className="icon-wrapper">
                <i className="fa fa-history"></i>
              </div>
              <div className="title-text">
                <h1>交易记录</h1>
                <p className="subtitle">查看您的所有交易明细</p>
              </div>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="stats-cards">
          <div className="stat-card income">
            <div className="stat-icon">
              <i className="fa fa-arrow-down"></i>
            </div>
            <div className="stat-info">
              <div className="stat-label">总收入</div>
              <div className="stat-value">¥{stats.income.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card expense">
            <div className="stat-icon">
              <i className="fa fa-arrow-up"></i>
            </div>
            <div className="stat-info">
              <div className="stat-label">总支出</div>
              <div className="stat-value">¥{stats.expense.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card net">
            <div className="stat-icon">
              <i className="fa fa-calculator"></i>
            </div>
            <div className="stat-info">
              <div className="stat-label">净收益</div>
              <div className="stat-value">
                ¥{(stats.income - stats.expense).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="filters-container">
          <div className="filters-header">
            <h3>筛选条件</h3>
            <button className="btn-reset" onClick={resetFilters}>
              <i className="fa fa-refresh"></i>
              重置
            </button>
          </div>
          <div className="filters-grid">
            <div className="filter-group">
              <label>交易类型</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="ALL">全部类型</option>
                <option value="RECHARGE">充值</option>
                <option value="TRANSFER_IN">转入</option>
                <option value="TRANSFER_OUT">转出</option>
                <option value="PAYMENT">支付</option>
                <option value="REFUND">退款</option>
                <option value="WITHDRAWAL">提现</option>
                <option value="EARNING">收益</option>
              </select>
            </div>

            <div className="filter-group">
              <label>交易状态</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="ALL">全部状态</option>
                <option value="PENDING">待处理</option>
                <option value="COMPLETED">已完成</option>
                <option value="FAILED">失败</option>
                <option value="CANCELLED">已取消</option>
              </select>
            </div>

            <div className="filter-group">
              <label>开始日期</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>结束日期</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 交易列表 */}
        <div className="transactions-list">
          <div className="list-header">
            <h3>交易明细</h3>
            <span className="count">共 {filteredTransactions.length} 条记录</span>
          </div>

          {loading ? (
            <div className="loading-container">
              <i className="fa fa-spinner fa-spin"></i>
              <p>加载中...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-container">
              <i className="fa fa-inbox"></i>
              <p>暂无交易记录</p>
            </div>
          ) : (
            <div className="transactions-table">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-row">
                  <div className="transaction-main">
                    <div className="transaction-type">
                      <span className={`type-badge ${getTypeClass(transaction.type)}`}>
                        {typeMap[transaction.type]}
                      </span>
                      <span className={`status-badge ${getStatusClass(transaction.status)}`}>
                        {statusMap[transaction.status]}
                      </span>
                    </div>
                    <div className="transaction-info">
                      <div className="transaction-number">
                        流水号：{transaction.transactionNumber}
                      </div>
                      <div className="transaction-time">
                        {formatDate(transaction.createdAt)}
                      </div>
                      {transaction.description && (
                        <div className="transaction-desc">
                          {transaction.description}
                        </div>
                      )}
                      {transaction.remark && (
                        <div className="transaction-remark">
                          备注：{transaction.remark}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <span className={`amount ${getAmountClass(transaction.type)}`}>
                      {getAmountPrefix(transaction.type)}¥{transaction.amount.toFixed(2)}
                    </span>
                    {transaction.balanceAfter !== undefined && (
                      <span className="balance-after">
                        余额：¥{transaction.balanceAfter.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


