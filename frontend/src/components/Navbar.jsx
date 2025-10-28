import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { ROLES } from "../constants/roles";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, currentRole, switchRole, hasRole, logout } = useUser();
    const [showRoleMenu, setShowRoleMenu] = useState(false);
    const [userRoles, setUserRoles] = useState([]);

    // 从后端获取用户真实的角色列表
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                // 后端返回的roles字段是数组,如 ["ROLE_STUDENT", "ROLE_RUNNER"]
                const roles = user.roles || [ROLES.STUDENT];
                setUserRoles(roles);
                console.log("[Navbar] User roles from backend:", roles);
            } catch (e) {
                console.error("[Navbar] Failed to parse user data:", e);
                setUserRoles([ROLES.STUDENT]);
            }
        }
    }, [currentUser]);

    // 根据当前激活的角色动态生成菜单
    const getMenuItems = () => {
        const items = [];

        // 只有当前角色是学生时才显示学生专属菜单
        if (currentRole === ROLES.STUDENT) {
            items.push({ key: "/", label: "美食广场", roles: [ROLES.STUDENT] });
            items.push({ key: "/errand-orders", label: "跑腿订单", roles: [ROLES.STUDENT] });
            items.push({ key: "/apply-runner", label: "申请跑腿员", roles: [ROLES.STUDENT] });
        }

        // 只有当前角色是跑腿员时才显示跑腿员工作台
        if (currentRole === ROLES.RUNNER) {
            items.push({ key: "/runner-orders", label: "跑腿员工作台", roles: [ROLES.RUNNER] });
        }

        // 只有当前角色是管理员时才显示管理员菜单
        if (currentRole === ROLES.ADMIN) {
            items.push({ key: "/admin/runners", label: "跑腿员审核", roles: [ROLES.ADMIN] });
        }

        return items;
    };

    const menuItems = getMenuItems();

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const handleRoleSwitch = (role) => {
        // 检查用户是否真的拥有这个角色
        if (!userRoles.includes(role)) {
            console.warn("[Navbar] User does not have role:", role);
            return;
        }

        switchRole(role);
        setShowRoleMenu(false);

        // 切换角色后跳转到该角色的默认页面
        if (role === ROLES.STUDENT) {
            navigate("/");
        } else if (role === ROLES.RUNNER) {
            navigate("/runner-orders");
        } else if (role === ROLES.ADMIN) {
            navigate("/admin/runners");
        }
    };

    const handleLogout = () => {
        logout();
        setShowRoleMenu(false);
        navigate("/login", { replace: true });
    };

    return (
        <header className="navbar">
            <div className="navbar-logo">MyCampus 校园服务</div>

            <nav className="navbar-menu">
                {menuItems.map((item) => (
                    <button
                        key={item.key}
                        className={`menu-item ${location.pathname === item.key ? "active" : ""
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

                        {/* 只显示用户实际拥有的角色 */}
                        {userRoles.includes(ROLES.STUDENT) && (
                            <button
                                className={`role-item ${currentRole === ROLES.STUDENT ? 'active' : ''}`}
                                onClick={() => handleRoleSwitch(ROLES.STUDENT)}
                            >
                                <i className="fa fa-user"></i>
                                <span>普通学生</span>
                            </button>
                        )}

                        {userRoles.includes(ROLES.RUNNER) && (
                            <button
                                className={`role-item ${currentRole === ROLES.RUNNER ? 'active' : ''}`}
                                onClick={() => handleRoleSwitch(ROLES.RUNNER)}
                            >
                                <i className="fa fa-bicycle"></i>
                                <span>跑腿员</span>
                            </button>
                        )}

                        {userRoles.includes(ROLES.ADMIN) && (
                            <button
                                className={`role-item ${currentRole === ROLES.ADMIN ? 'active' : ''}`}
                                onClick={() => handleRoleSwitch(ROLES.ADMIN)}
                            >
                                <i className="fa fa-shield"></i>
                                <span>管理员</span>
                            </button>
                        )}

                        <div className="role-menu-divider"></div>
                        <button
                            className="role-item logout-item"
                            onClick={handleLogout}
                        >
                            <i className="fa fa-sign-out"></i>
                            <span>退出登录</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
