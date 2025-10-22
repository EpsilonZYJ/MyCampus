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
} from "../../api/MockDish";

const { Option } = Select;

export default function FoodPage() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [total, setTotal] = useState(0);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState("");
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
  const topOffset = 64 + 60;

  return (
    <>
      <Navbar />

      {/* 筛选栏 - 固定在导航栏下方，靠右 */}
      <div
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "#ffffff", // 整条白色背景
          display: "flex",
          justifyContent: "flex-end", // 靠右
          alignItems: "center",
          paddingRight: "20px", // 右侧留空
          zIndex: 999, // 降低 z-index，确保在导航栏下拉菜单下方
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <Select
            placeholder="选择分类"
            style={{ width: 150 }}
            allowClear
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value)}
          >
            <Option value="川菜">川菜</Option>
            <Option value="粤菜">粤菜</Option>
            <Option value="湘菜">湘菜</Option>
            <Option value="鲁菜">鲁菜</Option>
          </Select>

          <Select
            placeholder="选择餐厅"
            style={{ width: 150 }}
            allowClear
            value={restaurantFilter}
            onChange={(value) => setRestaurantFilter(value)}
          >
            <Option value="东一食堂">东一食堂</Option>
            <Option value="东三食堂">东三食堂</Option>
            <Option value="百景园食堂">百景园食堂</Option>
          </Select>

          <Input
            placeholder="搜索菜品"
            style={{ width: 200 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleFilter}
          />

          <Button type="primary" onClick={handleFilter}>
            筛选
          </Button>
        </div>
      </div>

      {/* 页面内容 - 留出筛选栏空间 */}
      <div 
  style={{
    marginTop: `${topOffset}px`,
    padding: "20px",
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px 60px',  // 这个 gap 会同时控制水平和垂直间距
    width: '100%'
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
    </>
  );
}
