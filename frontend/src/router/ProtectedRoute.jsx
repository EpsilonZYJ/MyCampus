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
    
    const [userRoles, setUserRoles] = useState(() => {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                return parsedUser.roles || [];
            } catch (e) {
                console.error("[ProtectedRoute] Failed to parse user roles:", e);
            }
        }
        return [];
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
                
                // 更新用户角色信息
                if (user) {
                    try {
                        const parsedUser = JSON.parse(user);
                        const roles = parsedUser.roles || [];
                        console.log("[ProtectedRoute] User roles updated on token change:", roles);
                        setUserRoles(roles);
                    } catch (e) {
                        console.error("[ProtectedRoute] Failed to parse user roles:", e);
                    }
                }
            }

            if (e.key === 'currentRole') {
                const newRole = localStorage.getItem("currentRole");
                console.log("[ProtectedRoute] Role changed:", newRole);
                setCurrentRole(newRole);
            }
            
            if (e.key === 'user') {
                const user = localStorage.getItem("user");
                if (user) {
                    try {
                        const parsedUser = JSON.parse(user);
                        const roles = parsedUser.roles || [];
                        console.log("[ProtectedRoute] User roles updated:", roles);
                        setUserRoles(roles);
                    } catch (e) {
                        console.error("[ProtectedRoute] Failed to parse user roles:", e);
                    }
                }
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
            
            // 定期更新用户角色信息
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    const roles = parsedUser.roles || [];
                    if (!roles.every(r => userRoles.includes(r)) || !userRoles.every(r => roles.includes(r))) {
                        console.log("[ProtectedRoute] Role check - updating user roles:", roles);
                        setUserRoles(roles);
                    }
                } catch (e) {
                    console.error("[ProtectedRoute] Failed to parse user roles during interval check:", e);
                }
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

    // 2. 如果指定了角色要求,检查用户是否拥有所需角色
    if (allowedRoles && allowedRoles.length > 0) {
        // 检查两种情况：
        // 1. 当前激活的角色是否在允许列表中
        // 2. 用户是否拥有允许列表中的任意一个角色（即使当前没有激活该角色）
        const hasAccess = 
            (currentRole && allowedRoles.includes(currentRole)) || 
            allowedRoles.some(role => userRoles.includes(role));
        
        if (!hasAccess) {
            console.log("[ProtectedRoute] Access denied - Current role:", currentRole, 
                        "User actual roles:", userRoles, "Required roles:", allowedRoles);
            // 显示无权限页面,而不是重定向
            return <UnauthorizedPage requiredRoles={allowedRoles} />;
        }
    }

    // 3. 否则,正常渲染子组件
    return children;
}
