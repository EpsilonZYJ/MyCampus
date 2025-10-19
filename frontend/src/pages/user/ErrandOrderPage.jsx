import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "./ErrandOrderPage.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function ErrandOrderPage() {
  const [orders, setOrders] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "675ccf20b3d6f81c3ce31dc7", // 需要从登录状态获取
    title: "",
    description: "",
    pickupLocation: "",
    deliveryLocation: "",
    contactPhone: "",
    reward: "",
    notes: "",
  });

  // 获取用户的订单列表
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/errand-orders/customer/${formData.customerId}`
      );
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("获取订单失败:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/errand-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert("订单创建成功！");
        setShowCreateForm(false);
        fetchOrders();
        // 重置表单
        setFormData({
          ...formData,
          title: "",
          description: "",
          pickupLocation: "",
          deliveryLocation: "",
          contactPhone: "",
          reward: "",
          notes: "",
        });
      } else {
        alert("订单创建失败: " + result.message);
      }
    } catch (error) {
      console.error("创建订单失败:", error);
      alert("创建订单失败");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("确定要取消此订单吗？")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/errand-orders/${orderId}/cancel`,
        {
          method: "POST",
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("订单已取消");
        fetchOrders();
      }
    } catch (error) {
      console.error("取消订单失败:", error);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    const rating = prompt("请为跑腿员评分（1-5）：");
    if (!rating) return;

    const comment = prompt("请输入评价（可选）：") || "";

    try {
      const response = await fetch(
        `${API_BASE_URL}/errand-orders/${orderId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: parseFloat(rating),
            comment: comment,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("订单已完成并评价成功！");
        fetchOrders();
      }
    } catch (error) {
      console.error("完成订单失败:", error);
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
      <div className="errand-order-container">
        <div className="header">
          <h1>我的跑腿订单</h1>
          <button
            className="btn-create"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "取消" : "+ 创建新订单"}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-form-container">
            <h2>创建跑腿订单</h2>
            <form onSubmit={handleSubmit} className="create-form">
              <div className="form-group">
                <label>订单标题 *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="例如：帮我取快递"
                />
              </div>

              <div className="form-group">
                <label>详细描述 *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="请详细描述您需要跑腿员做什么"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>取件地点 *</label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    required
                    placeholder="例如：东一楼菜鸟驿站"
                  />
                </div>

                <div className="form-group">
                  <label>送达地点 *</label>
                  <input
                    type="text"
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleInputChange}
                    required
                    placeholder="例如：东十二楼301"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>联系电话 *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="您的联系电话"
                  />
                </div>

                <div className="form-group">
                  <label>跑腿费用（元）*</label>
                  <input
                    type="number"
                    name="reward"
                    value={formData.reward}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="例如：5.00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>备注信息</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="其他需要说明的信息（可选）"
                />
              </div>

              <button type="submit" className="btn-submit">
                提交订单
              </button>
            </form>
          </div>
        )}

        <div className="orders-list">
          <h2>订单列表</h2>
          {orders.length === 0 ? (
            <p className="empty-message">暂无订单</p>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
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
                        <i className="fa fa-map-marker"></i>
                        <span>
                          {order.pickupLocation} → {order.deliveryLocation}
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
                      {order.runnerName && (
                        <div className="info-item">
                          <i className="fa fa-user"></i>
                          <span>跑腿员：{order.runnerName}</span>
                        </div>
                      )}
                    </div>

                    {order.notes && (
                      <p className="notes">备注：{order.notes}</p>
                    )}
                  </div>

                  <div className="order-actions">
                    {order.status === "PENDING" && (
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        取消订单
                      </button>
                    )}
                    {order.status === "IN_PROGRESS" && (
                      <button
                        className="btn-complete"
                        onClick={() => handleCompleteOrder(order.id)}
                      >
                        确认完成
                      </button>
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
