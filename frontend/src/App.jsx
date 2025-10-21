// frontend/src/App.jsx
import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FoodPage from "./pages/user/FoodPage";
import ErrandOrderPage from "./pages/user/ErrandOrderPage";
import ApplyRunnerPage from "./pages/user/ApplyRunnerPage";
import RunnerOrderPage from "./pages/runner/RunnerOrderPage";
import AdminRunnerApprovalPage from "./pages/admin/AdminRunnerApprovalPage";
import UploadDishPage from "./pages/user/UploadDishPage";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import { ROLES } from "./constants/roles";

// 受保护路由组件 - 需要登录才能访问
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
}

// 角色限制路由组件 - 需要特定角色才能访问
function RoleBasedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const currentRole = localStorage.getItem("currentRole");
  
  if (!token || !user) return <Navigate to="/login" replace />;
  
  // 检查当前角色是否有权限访问
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // 根据角色重定向到对应的默认页面
    if (currentRole === ROLES.STUDENT) {
      return <Navigate to="/" replace />;
    } else if (currentRole === ROLES.RUNNER) {
      return <Navigate to="/runner-orders" replace />;
    } else if (currentRole === ROLES.ADMIN) {
      return <Navigate to="/admin/runners" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* 公开路由 - 无需登录 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 学生专属路由 */}
      <Route
        path="/"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
            <FoodPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/upload-dish"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
            <UploadDishPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/errand-orders"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
            <ErrandOrderPage />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/apply-runner"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
            <ApplyRunnerPage />
          </RoleBasedRoute>
        }
      />

      {/* 跑腿员专属路由 */}
      <Route
        path="/runner-orders"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.RUNNER]}>
            <RunnerOrderPage />
          </RoleBasedRoute>
        }
      />

      {/* 管理员专属路由 */}
      <Route
        path="/admin/runners"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminRunnerApprovalPage />
          </RoleBasedRoute>
        }
      />

      {/* 404 重定向 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
