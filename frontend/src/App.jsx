import React from "react";
import { Routes, Route } from "react-router-dom";
import FoodPage from "./pages/user/FoodPage";
import UploadDishPage from "./pages/user/UploadDishPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FoodPage />} />
      <Route path="/upload-dish" element={<UploadDishPage />} />
    </Routes>
  );
}

export default App;
