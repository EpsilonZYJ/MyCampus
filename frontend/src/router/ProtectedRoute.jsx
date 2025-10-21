import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // 或 sessionStorage
  const user = localStorage.getItem("user");

  // 如果没有登录信息 → 跳转到 /login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 否则，正常渲染子组件
  return children;
}
