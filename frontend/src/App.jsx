// frontend/src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import FoodPage from "./pages/user/FoodPage";
import ErrandOrderPage from "./pages/user/ErrandOrderPage";
import ApplyRunnerPage from "./pages/user/ApplyRunnerPage";
import RunnerOrderPage from "./pages/runner/RunnerOrderPage";
import AdminRunnerApprovalPage from "./pages/admin/AdminRunnerApprovalPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<FoodPage />} />
        <Route path="/errand-orders" element={<ErrandOrderPage />} />
        <Route path="/apply-runner" element={<ApplyRunnerPage />} />
        <Route path="/runner-orders" element={<RunnerOrderPage />} />
        <Route path="/admin/runners" element={<AdminRunnerApprovalPage />} />
      </Routes>
    </div>
  );
}

export default App;
