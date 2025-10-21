// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FoodPage from "./pages/user/FoodPage";
import UploadDishPage from "./pages/user/UploadDishPage";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
