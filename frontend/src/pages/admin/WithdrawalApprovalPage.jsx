import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useUser } from "../../contexts/UserContext";
import { getPendingWithdrawals, approveWithdrawal } from "../../api/balance";
import { getUserById } from "../../api/userLogin";
import "./WithdrawalApprovalPage.css";

export default function WithdrawalApprovalPage() {
  const { hasRole } = useUser();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 权限检查：只有管理员可以访问
  const isAdmin = hasRole('ROLE_ADMIN');

  useEffect(() => {
    if (isAdmin) {
      fetchPendingWithdrawals();
    }
  }, [isAdmin]);

  const fetchPendingWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await getPendingWithdrawals();
      
      // 为每个提现记录获取用户信息
      const withdrawalsWithUserInfo = await Promise.all(
        data.map(async (withdrawal) => {
          const userInfo = await getUserById(withdrawal.userId);
          return {
            ...withdrawal,
            userName: userInfo?.userName || "未知用户",
            userPhone: userInfo?.phone || "无"
          };
        })
      );
      
      setWithdrawals(withdrawalsWithUserInfo);
    } catch (error) {
      console.error("获取待审核提现列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId, approved) => {
    const action = approved ? "通过" : "拒绝";
    const confirmMessage = `确定要${action}此提现申请吗？`;
    
    if (!window.confirm(confirmMessage)) return;

    let remark = "";
    if (!approved) {
      remark = prompt("请输入拒绝原因：");
      if (remark === null) return; // 用户取消
    }

    setProcessingId(transactionId);
    try {
      const result = await approveWithdrawal(transactionId, approved, remark);

      if (result.success) {
        alert(`提现申请已${action}！`);
        fetchPendingWithdrawals();
      } else {
        alert(`审核失败: ${result.message}`);
      }
    } catch (error) {
      console.error("审核失败:", error);
      alert("审核失败");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="withdrawal-approval-container">
          <div className="permission-notice">
            <i className="fa fa-lock"></i>
            <h2>权限不足</h2>
            <p>只有管理员可以访问此页面</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="withdrawal-approval-container">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <div className="icon-wrapper">
                <i className="fa fa-check-circle"></i>
              </div>
              <div className="title-text">
                <h1>提现审核</h1>
                <p className="subtitle">审核用户提现申请</p>
              </div>
            </div>
            <button className="btn-refresh" onClick={fetchPendingWithdrawals}>
              <i className="fa fa-refresh"></i>
              刷新
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="stats-bar">
          <div className="stat-item">
            <i className="fa fa-clock-o"></i>
            <span>待审核：{withdrawals.length} 笔</span>
          </div>
          <div className="stat-item">
            <i className="fa fa-money"></i>
            <span>
              总金额：¥
              {withdrawals.reduce((sum, w) => sum + w.amount, 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* 提现列表 */}
        <div className="withdrawals-list">
          {loading ? (
            <div className="loading-container">
              <i className="fa fa-spinner fa-spin"></i>
              <p>加载中...</p>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="empty-container">
              <i className="fa fa-inbox"></i>
              <h3>暂无待审核提现</h3>
              <p>所有提现申请已处理完毕</p>
            </div>
          ) : (
            <div className="withdrawals-grid">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="withdrawal-card">
                  <div className="card-header">
                    <div className="transaction-number">
                      <i className="fa fa-hashtag"></i>
                      {withdrawal.transactionNumber}
                    </div>
                    <div className="status-badge pending">
                      <i className="fa fa-clock-o"></i>
                      待审核
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="amount-section">
                      <div className="amount-label">提现金额</div>
                      <div className="amount-value">
                        ¥{withdrawal.amount.toFixed(2)}
                      </div>
                    </div>

                    <div className="info-section">
                      <div className="info-row">
                        <i className="fa fa-user"></i>
                        <span className="label">申请人：</span>
                        <span className="value">{withdrawal.userName}</span>
                      </div>
                      <div className="info-row">
                        <i className="fa fa-id-card"></i>
                        <span className="label">用户ID：</span>
                        <span className="value">{withdrawal.userId}</span>
                      </div>
                      <div className="info-row">
                        <i className="fa fa-phone"></i>
                        <span className="label">联系电话：</span>
                        <span className="value">{withdrawal.userPhone}</span>
                      </div>
                      <div className="info-row">
                        <i className="fa fa-calendar"></i>
                        <span className="label">申请时间：</span>
                        <span className="value">
                          {formatDate(withdrawal.createdAt)}
                        </span>
                      </div>
                      {withdrawal.description && (
                        <div className="info-row full-width">
                          <i className="fa fa-comment"></i>
                          <span className="label">说明：</span>
                          <span className="value">{withdrawal.description}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(withdrawal.id, true)}
                      disabled={processingId === withdrawal.id}
                    >
                      <i className="fa fa-check"></i>
                      {processingId === withdrawal.id ? "处理中..." : "通过"}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleApprove(withdrawal.id, false)}
                      disabled={processingId === withdrawal.id}
                    >
                      <i className="fa fa-times"></i>
                      {processingId === withdrawal.id ? "处理中..." : "拒绝"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 审核说明 */}
        <div className="approval-guide">
          <h3>审核说明</h3>
          <div className="guide-content">
            <div className="guide-item">
              <i className="fa fa-info-circle"></i>
              <div>
                <h4>审核流程</h4>
                <p>
                  1. 核实用户身份和提现金额<br />
                  2. 检查用户账户余额是否充足<br />
                  3. 确认无异常后点击"通过"<br />
                  4. 如有问题，点击"拒绝"并说明原因
                </p>
              </div>
            </div>
            <div className="guide-item">
              <i className="fa fa-exclamation-triangle"></i>
              <div>
                <h4>注意事项</h4>
                <p>
                  • 审核通过后，金额将从用户余额中扣除<br />
                  • 审核拒绝后，冻结金额将返还用户<br />
                  • 请仔细核对信息，避免误操作<br />
                  • 拒绝时请务必填写拒绝原因
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


