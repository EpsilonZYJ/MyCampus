import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { becomeRunner } from "../../api/userLogin";
import "./ApplyRunnerPage.css";

export default function ApplyRunnerPage() {
  const { currentUser, hasRole } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idCardNumber: "",
    studentIDCardurl: "",
  });
  const [loading, setLoading] = useState(false);

  // 权限检查：只有学生可以申请
  const isStudent = hasRole('ROLE_STUDENT');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 使用统一封装的API函数
      const result = await becomeRunner(
        currentUser.id, 
        formData.idCardNumber, 
        formData.studentIDCardurl
      );

      if (result) {
        console.log("[ApplyRunner] 申请提交成功:", result);
        alert("跑腿员申请已提交！\n请等待管理员审核。");
        navigate("/");
      } else {
        alert("申请失败，请稍后重试");
      }
    } catch (error) {
      console.error("申请失败:", error);
      alert("申请失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="apply-runner-container">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <div className="icon-wrapper">
                <i className="fa fa-id-card"></i>
              </div>
              <div className="title-text">
                <h1>申请成为跑腿员</h1>
                <p className="subtitle">加入跑腿团队，自由接单赚钱</p>
              </div>
            </div>
          </div>
        </div>

        {!isStudent ? (
          <div className="permission-notice">
            <i className="fa fa-info-circle"></i>
            <p>只有学生用户可以申请成为跑腿员</p>
          </div>
        ) : (
          <div className="apply-form-container">
            <div className="info-section">
              <h3>
                <i className="fa fa-lightbulb-o"></i> 申请须知
              </h3>
              <ul className="info-list">
                <li>✓ 必须是在校学生</li>
                <li>✓ 需要提供真实的身份证号码</li>
                <li>✓ 需要上传学生证照片用于认证</li>
                <li>✓ 审核通过后即可开始接单</li>
                <li>✓ 接单后请按时完成配送任务</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="apply-form">
              <h3>申请信息</h3>

              <div className="form-group">
                <label>
                  <i className="fa fa-id-card-o"></i> 身份证号码 *
                </label>
                <input
                  type="text"
                  name="idCardNumber"
                  value={formData.idCardNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="请输入18位身份证号码"
                  pattern="[0-9]{17}[0-9Xx]"
                  maxLength="18"
                />
                <small className="hint">
                  请输入真实身份证号码，仅用于身份验证
                </small>
              </div>

              <div className="form-group">
                <label>
                  <i className="fa fa-picture-o"></i> 学生证照片 URL *
                </label>
                <input
                  type="url"
                  name="studentIDCardurl"
                  value={formData.studentIDCardurl}
                  onChange={handleInputChange}
                  required
                  placeholder="请输入学生证照片的 URL 地址"
                />
                <small className="hint">
                  示例：http://example.com/student-id.jpg
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate("/")}
                  disabled={loading}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? "提交中..." : "提交申请"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
