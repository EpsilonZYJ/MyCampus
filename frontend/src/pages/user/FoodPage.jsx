// frontend/src/pages/user/FoodPage.jsx
import Sidebar from "../../components/Sidebar";

export default function FoodPage() {
    
  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: "150px", padding: "20px", color: "white" }}>
        <h1>用户首页</h1>
        <p>欢迎来到美食广场系统！</p>
      </div>
    </>
  );
}
