import React, { createContext, useState, useContext, useEffect } from 'react';
import { ROLES, MOCK_USERS } from '../constants/roles';

// 创建用户上下文
const UserContext = createContext();

// UserProvider 组件
export function UserProvider({ children }) {
    // 从 localStorage 读取保存的角色，默认为普通学生
    const [currentRole, setCurrentRole] = useState(() => {
        return localStorage.getItem('currentRole') || ROLES.STUDENT;
    });

    const [currentUser, setCurrentUser] = useState(MOCK_USERS[currentRole]);
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('token');
    });

    // 当角色改变时，更新用户信息和 localStorage
    useEffect(() => {
        setCurrentUser(MOCK_USERS[currentRole]);
        localStorage.setItem('currentRole', currentRole);
    }, [currentRole]);

    // 监听 localStorage 变化，实现跨标签页登出同步
    useEffect(() => {
        const handleStorageChange = (e) => {
            console.log("[Storage Event] Storage changed in another tab");
            console.log(`[Storage Event] Key: ${e.key}, NewValue: ${e.newValue}`);

            // 如果 token 被移除，说明在其他标签页登出了
            if (e.key === 'token' && e.newValue === null) {
                console.log("[Storage Event] Token removed - User logged out in another tab");
                setIsLoggedIn(false);

                // 触发页面重新加载或跳转到登录页
                window.location.href = '/login';
            }

            // 如果 token 被添加，说明在其他标签页登录了
            if (e.key === 'token' && e.newValue !== null && e.oldValue === null) {
                console.log("[Storage Event] Token added - User logged in in another tab");
                setIsLoggedIn(true);

                // 重新加载用户信息
                const savedUser = localStorage.getItem('user');
                const savedRole = localStorage.getItem('currentRole');
                if (savedUser && savedRole) {
                    setCurrentRole(savedRole);
                }
            }

            // 如果 currentRole 变化，更新状态
            if (e.key === 'currentRole' && e.newValue !== null) {
                console.log("[Storage Event] Role changed to:", e.newValue);
                setCurrentRole(e.newValue);
            }
        };

        // 添加事件监听器
        window.addEventListener('storage', handleStorageChange);

        console.log("[UserContext] Storage event listener added");

        // 清理函数
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            console.log("[UserContext] Storage event listener removed");
        };
    }, []);

    // 监听登录状态变化 - 在同一标签页中更新
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('currentRole');

            if (token && !isLoggedIn) {
                console.log("[UserContext] User logged in - updating state");
                setIsLoggedIn(true);
                if (role) {
                    setCurrentRole(role);
                }
            } else if (!token && isLoggedIn) {
                console.log("[UserContext] User logged out - updating state");
                setIsLoggedIn(false);
            }
        };

        // 每秒检查一次登录状态
        const interval = setInterval(checkLoginStatus, 1000);

        return () => clearInterval(interval);
    }, [isLoggedIn]);

    // 切换角色
    const switchRole = (role) => {
        setCurrentRole(role);
    };

    // 检查用户是否有某个角色
    const hasRole = (role) => {
        return currentUser.roles.includes(role);
    };

    // 登出功能
    const logout = () => {
        console.log("[Logout] User logout started");
        console.log(`[Logout] Current user: ${currentUser.userName}, Time: ${new Date().toLocaleString('zh-CN')}`);

        // 清除 localStorage (这会触发其他标签页的 storage 事件)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentRole');

        console.log("[Logout] LocalStorage cleared");
        console.log("[Logout] This will trigger storage event in other tabs");
        console.log("[Logout] User logout completed\n");

        // 更新登录状态
        setIsLoggedIn(false);

        // 重置为默认状态
        setCurrentRole(ROLES.STUDENT);
        setCurrentUser(MOCK_USERS[ROLES.STUDENT]);
    };

    const value = {
        currentUser,
        currentRole,
        switchRole,
        hasRole,
        logout,
        isLoggedIn,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 自定义 Hook
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
