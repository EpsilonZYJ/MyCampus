import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Row, Col, Pagination, Select, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DishCard from "../../components/Dishcard";
import "./FoodPage.css";
import {
  getAllDishes,
  getDishesByCategory,
  getDishesByRestaurant,
  searchDishes,
} from "../../api/dish";

const { Option } = Select;
const categories = ["川菜", "本帮菜", "快餐", "主食", "汤", "小吃", "主菜", "粉面", "凉菜", "家常菜", "小食", "汤类"];
const restaurants = ["百景园食堂", "东园食堂", "西园食堂", "学子餐厅", "东一食堂", "西一食堂", "西一食堂一楼", "集锦园食堂一楼", "东一食堂一楼", "西一食堂二楼清真食堂", "西二食堂二楼", "东一食堂二楼", "喻园餐厅", "西二食堂二楼", "西一民族食堂", "西一一楼", "百景园一楼", "西二一楼", "百惠园", "西二二楼"];

export default function FoodPage() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [total, setTotal] = useState(0);

  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [restaurantFilter, setRestaurantFilter] = useState(undefined);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    const data = await getAllDishes();
    setDishes(data);
    setTotal(data.length);
  };

  const handleFilter = async () => {
    let data = await getAllDishes();

    if (categoryFilter) {
      const categoryData = await getDishesByCategory(categoryFilter);
      data = data.filter((dish) =>
        categoryData.some((c) => c.id === dish.id)
      );
    }

    if (restaurantFilter) {
      const restaurantData = await getDishesByRestaurant(restaurantFilter);
      data = data.filter((dish) =>
        restaurantData.some((r) => r.id === dish.id)
      );
    }

    if (searchKeyword) {
      const keywordData = await searchDishes(searchKeyword);
      data = data.filter((dish) =>
        keywordData.some((k) => k.id === dish.id)
      );
    }

    setDishes(data);
    setTotal(data.length);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentDishes = dishes.slice(startIndex, startIndex + pageSize);

  // 导航栏 64 + 筛选栏高度约 60
  const topOffset = 64 + 40;

  return (
    <>
    <div className="food-page-container">
      <Navbar />

      {/* 筛选栏 - 固定在导航栏下方，靠右 */}
      <div
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          height: "60px",
          display: "flex",
          justifyContent: "flex-end", // 靠右
          alignItems: "center",
          paddingRight: "20px", // 右侧留空
          zIndex: 999, // 降低 z-index，确保在导航栏下拉菜单下方
          // backgroundColor: "rgba(255, 255, 255, 0.9)", // 改为半透明白色
          backdropFilter: "blur(5px)", // 添加毛玻璃效果
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {/* 分类筛选 */}
      <Select placeholder="选择分类"
        style={{ width: 150 }}
        allowClear
        value={categoryFilter}
        onChange={(value) => setCategoryFilter(value)}>
        {categories.map(category => (
          <Option key={category} value={category}>{category}</Option>
        ))}
      </Select>

      {/* 餐厅筛选 */}  
      <Select placeholder="选择餐厅"
      style={{ width: 150 }}
      allowClear
      value={restaurantFilter}
                  onChange={(value) => setRestaurantFilter(value)}>
        
        {restaurants.map(restaurant => (
          <Option key={restaurant} value={restaurant}>{restaurant}</Option>
        ))}
      </Select>

          <Input
            placeholder="搜索菜品"
            style={{ width: 200 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleFilter}
          />

          <Button type="primary" onClick={handleFilter}
          style={{ backgroundColor: "rgb(252, 140, 59)", borderColor: "rgb(252, 140, 59)" }}>
            筛选
          </Button>
        </div>
      </div>

      {/* 页面内容 - 留出筛选栏空间 */}
      <div 
        style={{
          marginTop: `${topOffset}px`,
          padding: "20px 40px",
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px', // 统一间距
          width: '100%',
          boxSizing: 'border-box', /* 确保padding包含在宽度内 */
          maxWidth: '100vw', /* 限制最大宽度为视口宽度 */
          overflow: 'hidden' /* 隐藏可能的溢出 */
        }}
      >
  {currentDishes.map((dish) => (
    <div key={dish.id}>
      <DishCard dish={dish} />
    </div>
  ))}
</div>

      {/* 翻页 - 居中固定在底部 */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          padding: "8px 16px", // 添加内边距
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      {/* 上传菜品悬浮按钮 */}
      <div
        className="fab"
        onClick={() => navigate("/upload-dish")}
        role="button"
        aria-label="上传菜品"
        
      >
        <PlusOutlined className="fab-icon" />
        <span className="fab-text">上传菜品</span>
      </div>
      </div>
    </>
  );
}
