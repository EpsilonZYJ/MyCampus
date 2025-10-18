//frontend\src\components\Sidebar.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // 引入样式文件

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const toggleNav = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* 左上角按钮 */}
      <button className={`btn-nav ${open ? "animated" : ""}`} onClick={toggleNav}>
        <div className="bar arrow-top-r"></div>
        <div className="bar arrow-middle-r"></div>
        <div className="bar arrow-bottom-r"></div>
      </button>

      {/* 侧边栏 */}
      <div
        className={`nav-container ${open ? "showNav" : "hideNav"}`}
      >
        <ul className="nav-list">
          <li className="list-item">
            <Link to="/user/home">
              <i className="fa fa-home"></i>
            </Link>
          </li>
          <li className="list-item">
            <Link to="/user/food">
              <i className="fa fa-cutlery"></i>
            </Link>
          </li>
          <li className="list-item">
            <Link to="/user/orders">
              <i className="fa fa-truck"></i>
            </Link>
          </li>
          <li className="list-item">
            <Link to="/user/profile">
              <i className="fa fa-user"></i>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
