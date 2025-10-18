// frontend/src/App.jsx
import "./App.css";
import FoodPage from "./pages/user/FoodPage"; // ✅ 导入你的页面组件

function App() {
  return (
    <div className="App">
      <FoodPage />  {/* ✅ 显示美食广场页面 */}
    </div>
  );
}

export default App;
