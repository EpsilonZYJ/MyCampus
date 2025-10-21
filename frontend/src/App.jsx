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

// 受保护路由组件 - 需要登录才能访问
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* 公开路由 - 无需登录 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 受保护路由 - 需要登录 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <FoodPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-dish"
        element={
          <ProtectedRoute>
            <UploadDishPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/errand-orders"
        element={
          <ProtectedRoute>
            <ErrandOrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply-runner"
        element={
          <ProtectedRoute>
            <ApplyRunnerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/runner-orders"
        element={
          <ProtectedRoute>
            <RunnerOrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/runners"
        element={
          <ProtectedRoute>
            <AdminRunnerApprovalPage />
          </ProtectedRoute>
        }
      />

      {/* 404 重定向到首页 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
