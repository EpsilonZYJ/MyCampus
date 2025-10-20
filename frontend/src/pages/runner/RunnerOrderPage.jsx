import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useUser } from "../../contexts/UserContext";
import "./RunnerOrderPage.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function RunnerOrderPage() {
  const { currentUser } = useUser();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("available"); // available 或 myOrders
  const runnerId = currentUser.id; // 使用当前用户的 ID

  useEffect(() => {
    fetchAvailableOrders();
    fetchMyOrders();
  }, [currentUser.id]);

  const fetchAvailableOrders = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/errand-orders/status/PENDING`
      );
      const result = await response.json();
      console.log('📋 可接订单响应:', result);
      // 后端返回格式: { code: 200, message: "success", data: [...] }
      if (result.code === 200 || response.ok) {
        setAvailableOrders(result.data);
      }
    } catch (error) {
      console.error("获取待接订单失败:", error);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/errand-orders/runner/${runnerId}`
      );
      const result = await response.json();
      console.log('📋 我的订单响应:', result);
      // 后端返回格式: { code: 200, message: "success", data: [...] }
      if (result.code === 200 || response.ok) {
        setMyOrders(result.data);
      }
    } catch (error) {
      console.error("获取我的订单失败:", error);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    if (!window.confirm("确定要接此订单吗？")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/errand-orders/${orderId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ runnerId }),
        }
      );
      const result = await response.json();
      // 后端返回格式: { code: 200, message: "success", data: {...} }
      if (result.code === 200 || response.ok) {
        alert("接单成功！");
        fetchAvailableOrders();
        fetchMyOrders();
      } else {
        alert("接单失败: " + result.message);
      }
    } catch (error) {
      console.error("接单失败:", error);
      alert("接单失败");
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/errand-orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const result = await response.json();
      // 后端返回格式: { code: 200, message: "success", data: {...} }
      if (result.code === 200 || response.ok) {
        alert("状态更新成功！");
        fetchMyOrders();
      }
    } catch (error) {
      console.error("更新状态失败:", error);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "待接单",
      ACCEPTED: "已接单",
      IN_PROGRESS: "配送中",
      COMPLETED: "已完成",
      CANCELLED: "已取消",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      PENDING: "status-pending",
      ACCEPTED: "status-accepted",
      IN_PROGRESS: "status-progress",
      COMPLETED: "status-completed",
      CANCELLED: "status-cancelled",
    };
    return classMap[status] || "";
  };

  return (
    <>
      <Navbar />
      <div className="runner-order-container">
        <h1>跑腿员工作台</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "available" ? "active" : ""}`}
            onClick={() => setActiveTab("available")}
          >
            待接订单 ({availableOrders.length})
          </button>
          <button
            className={`tab ${activeTab === "myOrders" ? "active" : ""}`}
            onClick={() => setActiveTab("myOrders")}
          >
            我的订单 ({myOrders.length})
          </button>
        </div>

        {activeTab === "available" && (
          <div className="orders-section">
            <h2>待接订单</h2>
            {availableOrders.length === 0 ? (
              <p className="empty-message">暂无待接订单</p>
            ) : (
              <div className="orders-grid">
                {availableOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-number">{order.orderNumber}</span>
                      <span className="reward-badge">¥{order.reward}</span>
                    </div>

                    <div className="order-content">
                      <h3>{order.title}</h3>
                      <p className="description">{order.description}</p>

                      <div className="order-info">
                        <div className="info-item">
                          <i className="fa fa-user"></i>
                          <span>客户：{order.customerName}</span>
                        </div>
                        <div className="info-item">
                          <i className="fa fa-map-marker"></i>
                          <span>
                            取：{order.pickupLocation}
                          </span>
                        </div>
                        <div className="info-item">
                          <i className="fa fa-map-marker"></i>
                          <span>
                            送：{order.deliveryLocation}
                          </span>
                        </div>
                        <div className="info-item">
                          <i className="fa fa-phone"></i>
                          <span>{order.contactPhone}</span>
                        </div>
                      </div>

                      {order.notes && (
                        <p className="notes">备注：{order.notes}</p>
                      )}
                    </div>

                    <div className="order-actions">
                      <button
                        className="btn-accept"
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        接单
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "myOrders" && (
          <div className="orders-section">
            <h2>我的订单</h2>
            {myOrders.length === 0 ? (
              <p className="empty-message">暂无订单</p>
            ) : (
              <div className="orders-grid">
                {myOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-number">{order.orderNumber}</span>
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <div className="order-content">
                      <h3>{order.title}</h3>
                      <p className="description">{order.description}</p>

                      <div className="order-info">
                        <div className="info-item">
                          <i className="fa fa-user"></i>
                          <span>客户：{order.customerName}</span>
                        </div>
                        <div className="info-item">
                          <i className="fa fa-map-marker"></i>
                          <span>
                            取：{order.pickupLocation}
                          </span>
                        </div>
                        <div className="info-item">
                          <i className="fa fa-map-marker"></i>
                          <span>
                            送：{order.deliveryLocation}
                          </span>
                        </div>
                        <div className="info-item">
                          <i className="fa fa-phone"></i>
                          <span>{order.contactPhone}</span>
                        </div>
                        <div className="info-item">
                          <i className="fa fa-money"></i>
                          <span className="reward">¥{order.reward}</span>
                        </div>
                      </div>

                      {order.notes && (
                        <p className="notes">备注：{order.notes}</p>
                      )}

                      {order.customerRating && (
                        <div className="rating-info">
                          <span>客户评分：</span>
                          <span className="rating-stars">
                            {"★".repeat(Math.floor(order.customerRating))}
                            {"☆".repeat(5 - Math.floor(order.customerRating))}
                          </span>
                          {order.customerComment && (
                            <p className="comment">"{order.customerComment}"</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="order-actions">
                      {order.status === "ACCEPTED" && (
                        <button
                          className="btn-start"
                          onClick={() =>
                            handleUpdateStatus(order.id, "IN_PROGRESS")
                          }
                        >
                          开始配送
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
