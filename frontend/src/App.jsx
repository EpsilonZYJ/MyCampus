// frontend/src/App.jsx
import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FoodPage from "./pages/user/FoodPage";
import ErrandOrderPage from "./pages/user/ErrandOrderPage";
import ApplyRunnerPage from "./pages/user/ApplyRunnerPage";
import BalancePage from "./pages/user/BalancePage";
import TransactionsPage from "./pages/user/TransactionsPage";
import RunnerOrderPage from "./pages/runner/RunnerOrderPage";
import AdminRunnerApprovalPage from "./pages/admin/AdminRunnerApprovalPage";
import WithdrawalApprovalPage from "./pages/admin/WithdrawalApprovalPage";
import UploadDishPage from "./pages/user/UploadDishPage";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import ProtectedRoute from "./router/ProtectedRoute";
import { ROLES } from "./constants/roles";

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
                    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                        <FoodPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/upload-dish"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                        <UploadDishPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/errand-orders"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                        <ErrandOrderPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/apply-runner"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                        <ApplyRunnerPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/balance"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                        <BalancePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/transactions"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                        <TransactionsPage />
                    </ProtectedRoute>
                }
            />

            {/* 跑腿员专属路由 */}
            <Route
                path="/runner-orders"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.RUNNER]}>
                        <RunnerOrderPage />
                    </ProtectedRoute>
                }
            />

            {/* 管理员专属路由 */}
            <Route
                path="/admin/runners"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminRunnerApprovalPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/withdrawals"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <WithdrawalApprovalPage />
                    </ProtectedRoute>
                }
            />

            {/* 404 重定向 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
