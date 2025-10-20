import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { ROLES } from "../constants/roles";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentRole, switchRole, hasRole } = useUser();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // 根据角色动态生成菜单
  const getMenuItems = () => {
    const items = [
      { key: "/", label: "美食广场", roles: [ROLES.STUDENT, ROLES.RUNNER, ROLES.ADMIN] },
    ];

    // 只有学生可以创建和管理跑腿订单
    if (hasRole(ROLES.STUDENT)) {
      items.push({ key: "/errand-orders", label: "跑腿订单", roles: [ROLES.STUDENT] });
    }

    // 跑腿员和管理员可以看到跑腿员工作台
    if (hasRole(ROLES.RUNNER) || hasRole(ROLES.ADMIN)) {
      items.push({ key: "/runner-orders", label: "跑腿员工作台", roles: [ROLES.RUNNER, ROLES.ADMIN] });
    }

    // 只有管理员可以看到跑腿员审核
    if (hasRole(ROLES.ADMIN)) {
      items.push({ key: "/admin/runners", label: "跑腿员审核", roles: [ROLES.ADMIN] });
    }

    return items;
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setShowRoleMenu(false);
    // 切换角色后跳转到首页
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">MyCampus 校园服务</div>

      <nav className="navbar-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`menu-item ${
              location.pathname === item.key ? "active" : ""
            }`}
            onClick={() => handleMenuClick(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="navbar-user">
        <div 
          className="user-info"
          onClick={() => setShowRoleMenu(!showRoleMenu)}
        >
          <i className="fa fa-user-circle"></i>
          <span>{currentUser.userName}</span>
          <i className="fa fa-caret-down"></i>
        </div>

        {showRoleMenu && (
          <div className="role-menu">
            <div className="role-menu-header">切换角色</div>
            <button
              className={`role-item ${currentRole === ROLES.STUDENT ? 'active' : ''}`}
              onClick={() => handleRoleSwitch(ROLES.STUDENT)}
            >
              <i className="fa fa-user"></i>
              <span>普通学生</span>
            </button>
            <button
              className={`role-item ${currentRole === ROLES.RUNNER ? 'active' : ''}`}
              onClick={() => handleRoleSwitch(ROLES.RUNNER)}
            >
              <i className="fa fa-bicycle"></i>
              <span>跑腿员</span>
            </button>
            <button
              className={`role-item ${currentRole === ROLES.ADMIN ? 'active' : ''}`}
              onClick={() => handleRoleSwitch(ROLES.ADMIN)}
            >
              <i className="fa fa-shield"></i>
              <span>管理员</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
