import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UnauthorizedPage from "../pages/UnauthorizedPage";

/**
 * 受保护路由组件
 * @param {ReactNode} children - 子组件
 * @param {Array<string>} allowedRoles - 允许访问的角色列表,如果不提供则仅检查登录状态
 */
export default function ProtectedRoute({ children, allowedRoles = null }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        return !!(token && user);
    });

    const [currentRole, setCurrentRole] = useState(() => {
        return localStorage.getItem("currentRole");
    });

    useEffect(() => {
        // 监听 storage 事件,实时响应登出操作和角色切换
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                const token = localStorage.getItem("token");
                const user = localStorage.getItem("user");
                const newAuthState = !!(token && user);

                console.log("[ProtectedRoute] Auth state changed:", newAuthState);
                setIsAuthenticated(newAuthState);
            }

            if (e.key === 'currentRole') {
                const newRole = localStorage.getItem("currentRole");
                console.log("[ProtectedRoute] Role changed:", newRole);
                setCurrentRole(newRole);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // 定期检查认证状态和角色（作为备用方案）
        const intervalId = setInterval(() => {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");
            const currentAuthState = !!(token && user);
            const role = localStorage.getItem("currentRole");

            if (currentAuthState !== isAuthenticated) {
                console.log("[ProtectedRoute] Auth state check - updating:", currentAuthState);
                setIsAuthenticated(currentAuthState);
            }

            if (role !== currentRole) {
                console.log("[ProtectedRoute] Role check - updating:", role);
                setCurrentRole(role);
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [isAuthenticated, currentRole]);

    // 1. 如果没有登录信息 → 跳转到 /login
    if (!isAuthenticated) {
        console.log("[ProtectedRoute] User not authenticated - redirecting to login");
        return <Navigate to="/login" replace />;
    }

    // 2. 如果指定了角色要求,检查当前角色是否有权限
    if (allowedRoles && allowedRoles.length > 0) {
        if (!currentRole || !allowedRoles.includes(currentRole)) {
            console.log("[ProtectedRoute] Access denied - Current role:", currentRole, "Required roles:", allowedRoles);
            // 显示无权限页面,而不是重定向
            return <UnauthorizedPage requiredRoles={allowedRoles} />;
        }
    }

    // 3. 否则,正常渲染子组件
    return children;
}
