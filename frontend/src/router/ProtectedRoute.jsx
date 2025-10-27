import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  });

  useEffect(() => {
    // 监听 storage 事件，实时响应登出操作
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        const newAuthState = !!(token && user);
        
        console.log("[ProtectedRoute] Auth state changed:", newAuthState);
        setIsAuthenticated(newAuthState);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 定期检查认证状态（作为备用方案）
    const intervalId = setInterval(() => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const currentAuthState = !!(token && user);
      
      if (currentAuthState !== isAuthenticated) {
        console.log("[ProtectedRoute] Auth state check - updating:", currentAuthState);
        setIsAuthenticated(currentAuthState);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  // 如果没有登录信息 → 跳转到 /login
  if (!isAuthenticated) {
    console.log("[ProtectedRoute] User not authenticated - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // 否则，正常渲染子组件
  return children;
}
