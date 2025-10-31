import React, { useState } from "react";
import { Modal, Rate, Button, message } from "antd";
import { updateDishRating, getDishImage } from "../api/dish";
import "./DishCard.css";

export default function DishCard({ dish, onUpdate }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmitRating = async () => {
    if (userRating === 0) {
      message.warning("请先选择评分！");
      return;
    }
    setSubmitting(true);
    const updatedDish = await updateDishRating(dish.id, userRating);
    if (updatedDish) {
      message.success("评分提交成功！");
      setUserRating(0);
      setIsModalVisible(false);
      onUpdate && onUpdate(updatedDish); // 可选：父组件更新列表
    } else {
      message.error("评分提交失败");
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* 菜品卡片 */}
      <div className="dish-card" onClick={() => setIsModalVisible(true)}>
        <img src={getDishImage(dish.id)} alt={dish.dishName} />
        <div className="dish-card-name">
          {dish.restaurant
            ? `${dish.restaurant} - ${dish.dishName}`
            : dish.dishName}
        </div>
        <div className="dish-card-rating">
    ⭐ {dish.rating?.toFixed(1) ?? "暂无评分"}
        </div>
      </div>

      {/* 弹窗 */}
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        title={`${dish.restaurant || "未知食堂"} - ${dish.dishName}`}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={getDishImage(dish.id)}
            alt={dish.dishName}
            style={{
              width: "100%",
              maxHeight: "250px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
          <p>分类：{dish.category || "未分类"}</p>
          <p>餐厅：{dish.restaurant || "未知"}</p>
          <p>描述：{dish.description || "暂无"}</p>

          {/* 当前平均分 */}
          <p style={{ marginTop: "12px" }}>
            当前评分：
            <strong style={{ color: "#faad14" }}>
              {dish.rating?.toFixed(1) || 0} 星
            </strong>
          </p>

          {/* 用户评分 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "8px",
            }}
          >
            <span style={{ marginRight: 8, fontWeight: 500 }}>点击评分：</span>
            <Rate allowHalf value={userRating} onChange={setUserRating} />
            <span style={{ marginLeft: 8, color: "#faad14", fontWeight: 500 }}>
              {userRating ? `${userRating.toFixed(1)} 星` : "未评分"}
            </span>
          </div>

          {/* 提交评分按钮 */}
          <Button
            type="primary"
            onClick={handleSubmitRating}
            loading={submitting}
            style={{ marginTop: 12 ,backgroundColor: "rgb(252, 140, 59)", borderColor: "rgb(252, 140, 59)" }}
            
          >
            提交评分
          </Button>
        </div>
      </Modal>
    </>
  );
}
