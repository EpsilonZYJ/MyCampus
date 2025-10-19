import React from "react";
import { Layout, Menu, Dropdown, Button } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const { Header } = Layout;

const Navbar = () => {
const navigate = useNavigate();
const location = useLocation();

// 菜单配置
const menuItems = [
  { key: "/", label: "首页" },
  { key: "/about", label: "关于我们" },
  { key: "/contact", label: "联系我们" },
];

const handleMenuClick = (e) => {
  navigate(e.key);
};

const userMenu = (
  <Menu
    items={[
      { key: "profile", label: "个人中心" },
      { key: "settings", label: "设置" },
      { type: "divider" },
      { key: "logout", label: "退出登录" },
    ]}
  />
);

return (
  <Header className="navbar">
    <div className="navbar-logo">MyWebsite</div>

    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={handleMenuClick}
      className="navbar-menu"
    />

    <Dropdown overlay={userMenu} placement="bottomRight">
      <Button type="text" icon={<UserOutlined />} className="navbar-user">
        用户 <DownOutlined />
      </Button>
    </Dropdown>
  </Header>
);
};

export default Navbar;
