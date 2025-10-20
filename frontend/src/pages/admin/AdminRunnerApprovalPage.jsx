import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "./AdminRunnerApprovalPage.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function AdminRunnerApprovalPage() {
  const [pendingRunners, setPendingRunners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingRunners();
  }, []);

  const fetchPendingRunners = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/runners/pending`);
      const result = await response.json();
      // 后端返回格式: { code: 200, message: "success", data: [...] }
      if (result.code === 200 || response.ok) {
        setPendingRunners(result.data);
      }
    } catch (error) {
      console.error("获取待审核跑腿员失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, approved) => {
    const action = approved ? "批准" : "拒绝";
    if (!window.confirm(`确定要${action}此跑腿员申请吗？`)) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/runners/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approved }),
        }
      );
      const result = await response.json();
      // 后端返回格式: { code: 200, message: "success", data: {...} }
      if (result.code === 200 || response.ok) {
        alert(`${action}成功！`);
        fetchPendingRunners();
      } else {
        alert(`${action}失败: ` + result.message);
      }
    } catch (error) {
      console.error(`${action}失败:`, error);
      alert(`${action}失败`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-approval-container">
        <h1>跑腿员审核管理</h1>

        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-value">{pendingRunners.length}</div>
            <div className="stat-label">待审核申请</div>
          </div>
        </div>

        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <div className="applicants-section">
            <h2>待审核申请列表</h2>
            {pendingRunners.length === 0 ? (
              <p className="empty-message">暂无待审核申请</p>
            ) : (
              <div className="applicants-grid">
                {pendingRunners.map((runner) => (
                  <div key={runner.id} className="applicant-card">
                    <div className="card-header">
                      <h3>{runner.userName}</h3>
                      <span className="badge-pending">待审核</span>
                    </div>

                    <div className="card-content">
                      <div className="info-grid">
                        <div className="info-item">
                          <label>学号：</label>
                          <span>{runner.studentId}</span>
                        </div>
                        <div className="info-item">
                          <label>手机号：</label>
                          <span>{runner.phoneNumber}</span>
                        </div>
                        <div className="info-item">
                          <label>邮箱：</label>
                          <span>{runner.email || "未填写"}</span>
                        </div>
                        <div className="info-item">
                          <label>身份证号：</label>
                          <span>
                            {runner.runnerProfile?.idCardNumber || "未填写"}
                          </span>
                        </div>
                      </div>

                      {runner.runnerProfile?.healthCertificateUrl && (
                        <div className="certificate-section">
                          <label>学生证图片：</label>
                          <a
                            href={runner.runnerProfile.healthCertificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="certificate-link"
                          >
                            查看学生证 <i className="fa fa-external-link"></i>
                          </a>
                        </div>
                      )}

                      <div className="metadata">
                        <span className="meta-item">
                          <i className="fa fa-clock-o"></i>
                          申请时间：
                          {new Date(
                            runner.runnerProfile?.runnerSince
                          ).toLocaleString("zh-CN")}
                        </span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn-reject"
                        onClick={() => handleApprove(runner.id, false)}
                      >
                        <i className="fa fa-times"></i> 拒绝
                      </button>
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(runner.id, true)}
                      >
                        <i className="fa fa-check"></i> 批准
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
