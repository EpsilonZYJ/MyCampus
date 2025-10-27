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

    // 当角色改变时，更新用户信息和 localStorage
    useEffect(() => {
        setCurrentUser(MOCK_USERS[currentRole]);
        localStorage.setItem('currentRole', currentRole);
    }, [currentRole]);

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

        // 清除 localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentRole');

        console.log("[Logout] LocalStorage cleared");
        console.log("[Logout] User logout completed\n");

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
