import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useUser } from "../../contexts/UserContext";
import { getUserById } from "../../api/userLogin";
import { rechargeBalance, transferBalance, withdrawBalance } from "../../api/balance";
import "./BalancePage.css";

export default function BalancePage() {
  const { currentUser, updateUser } = useUser();
  const [balance, setBalance] = useState(0);
  const [showRechargeForm, setShowRechargeForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 充值表单
  const [rechargeForm, setRechargeForm] = useState({
    amount: ""
  });

  // 转账表单
  const [transferForm, setTransferForm] = useState({
    toUserId: "",
    amount: ""
  });

  // 提现表单
  const [withdrawForm, setWithdrawForm] = useState({
    amount: ""
  });

  // 获取用户余额
  useEffect(() => {
    fetchUserBalance();
  }, [currentUser.id]);

  const fetchUserBalance = async () => {
    try {
      const userData = await getUserById(currentUser.id);
      if (userData) {
        setBalance(userData.balance || 0);
        // 使用updateUser方法更新context中的用户信息
        updateUser({ balance: userData.balance || 0 });
      }
    } catch (error) {
      console.error("获取余额失败:", error);
    }
  };

  // 处理充值（测试用）
  const handleRecharge = async (e) => {
    e.preventDefault();

    if (!rechargeForm.amount) {
      alert("请输入充值金额");
      return;
    }

    const amount = parseFloat(rechargeForm.amount);
    if (amount <= 0) {
      alert("充值金额必须大于0");
      return;
    }

    setLoading(true);
    try {
      console.log("=== 开始充值 ===");
      console.log("用户ID:", currentUser.id);
      console.log("充值金额:", amount);
      console.log("充值前余额:", balance);
      
      const result = await rechargeBalance(currentUser.id, amount);
      
      console.log("充值API返回结果:", result);

      if (result.success) {
        console.log("充值成功，返回数据:", result.data);
        
        // 直接使用后端返回的用户数据更新余额
        if (result.data && result.data.balance !== undefined) {
          console.log("更新余额为:", result.data.balance);
          setBalance(result.data.balance);
          // 使用updateUser方法同步更新到Context和localStorage
          updateUser({ balance: result.data.balance });
        } else {
          console.log("返回数据格式异常，重新获取余额");
          // 如果返回数据格式不对，再次获取用户信息
          await fetchUserBalance();
        }
        alert("充值成功！");
        setShowRechargeForm(false);
        setRechargeForm({ amount: "" });
      } else {
        console.error("充值失败:", result.message);
        alert("充值失败: " + result.message);
      }
    } catch (error) {
      console.error("充值异常:", error);
      alert("充值失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理转账
  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!transferForm.toUserId || !transferForm.amount) {
      alert("请填写完整信息");
      return;
    }

    const amount = parseFloat(transferForm.amount);
    if (amount <= 0) {
      alert("转账金额必须大于0");
      return;
    }

    if (amount > balance) {
      alert("余额不足");
      return;
    }

    setLoading(true);
    try {
      const result = await transferBalance(
        currentUser.id,
        transferForm.toUserId,
        amount
      );

      if (result.success) {
        // 使用后端返回的用户数据更新余额
        if (result.data && result.data.balance !== undefined) {
          setBalance(result.data.balance);
          updateUser({ balance: result.data.balance });
        } else {
          await fetchUserBalance();
        }
        alert("转账成功！");
        setShowTransferForm(false);
        setTransferForm({ toUserId: "", amount: "" });
      } else {
        alert("转账失败: " + result.message);
      }
    } catch (error) {
      console.error("转账失败:", error);
      alert("转账失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理提现
  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!withdrawForm.amount) {
      alert("请输入提现金额");
      return;
    }

    const amount = parseFloat(withdrawForm.amount);
    if (amount <= 0) {
      alert("提现金额必须大于0");
      return;
    }

    if (amount > balance) {
      alert("余额不足");
      return;
    }

    setLoading(true);
    try {
      const result = await withdrawBalance(currentUser.id, amount);

      if (result.success) {
        // 使用后端返回的用户数据更新余额
        if (result.data && result.data.balance !== undefined) {
          setBalance(result.data.balance);
          updateUser({ balance: result.data.balance });
        } else {
          await fetchUserBalance();
        }
        alert("提现申请已提交，请等待管理员审核");
        setShowWithdrawForm(false);
        setWithdrawForm({ amount: "" });
      } else {
        alert("提现申请失败: " + result.message);
      }
    } catch (error) {
      console.error("提现申请失败:", error);
      alert("提现申请失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="balance-container">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <div className="icon-wrapper">
                <i className="fa fa-credit-card"></i>
              </div>
              <div className="title-text">
                <h1>我的余额</h1>
                <p className="subtitle">管理您的账户余额</p>
              </div>
            </div>
          </div>
        </div>

        {/* 余额展示卡片 */}
        <div className="balance-card">
          <div className="balance-info">
            <div className="balance-label">当前余额</div>
            <div className="balance-amount">¥{balance.toFixed(2)}</div>
            <div className="balance-hint">可用于支付订单和转账</div>
          </div>
          <div className="balance-actions">
            <button
              className="btn-action btn-recharge"
              onClick={() => {
                setShowRechargeForm(!showRechargeForm);
                setShowTransferForm(false);
                setShowWithdrawForm(false);
              }}
            >
              <i className="fa fa-plus-circle"></i>
              <span>充值</span>
            </button>
            <button
              className="btn-action btn-transfer"
              onClick={() => {
                setShowTransferForm(!showTransferForm);
                setShowRechargeForm(false);
                setShowWithdrawForm(false);
              }}
            >
              <i className="fa fa-exchange"></i>
              <span>转账</span>
            </button>
            <button
              className="btn-action btn-withdraw"
              onClick={() => {
                setShowWithdrawForm(!showWithdrawForm);
                setShowRechargeForm(false);
                setShowTransferForm(false);
              }}
            >
              <i className="fa fa-money"></i>
              <span>提现</span>
            </button>
          </div>
        </div>

        {/* 充值表单 */}
        {showRechargeForm && (
          <div className="form-container">
            <div className="form-header">
              <h2>充值余额</h2>
              <button
                className="btn-close"
                onClick={() => setShowRechargeForm(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleRecharge} className="balance-form">
              <div className="form-group">
                <label>充值金额（元）*</label>
                <input
                  type="number"
                  value={rechargeForm.amount}
                  onChange={(e) =>
                    setRechargeForm({ ...rechargeForm, amount: e.target.value })
                  }
                  placeholder="请输入充值金额"
                  min="0.01"
                  step="0.01"
                  required
                />
                <span className="form-hint">
                  当前余额：¥{balance.toFixed(2)}
                </span>
              </div>

              <div className="recharge-notice">
                <i className="fa fa-info-circle"></i>
                <div>
                  <p>充值说明：</p>
                  <ul>
                    <li>此充值功能仅供测试使用</li>
                    <li>充值后余额立即到账</li>
                    <li>可用于支付订单、转账等操作</li>
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "处理中..." : "确认充值"}
              </button>
            </form>
          </div>
        )}

        {/* 转账表单 */}
        {showTransferForm && (
          <div className="form-container">
            <div className="form-header">
              <h2>转账</h2>
              <button
                className="btn-close"
                onClick={() => setShowTransferForm(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleTransfer} className="balance-form">
              <div className="form-group">
                <label>收款人用户ID *</label>
                <input
                  type="text"
                  value={transferForm.toUserId}
                  onChange={(e) =>
                    setTransferForm({ ...transferForm, toUserId: e.target.value })
                  }
                  placeholder="请输入收款人的用户ID"
                  required
                />
                <span className="form-hint">
                  可在用户个人信息页面查看用户ID
                </span>
              </div>

              <div className="form-group">
                <label>转账金额（元）*</label>
                <input
                  type="number"
                  value={transferForm.amount}
                  onChange={(e) =>
                    setTransferForm({ ...transferForm, amount: e.target.value })
                  }
                  placeholder="请输入转账金额"
                  min="0.01"
                  step="0.01"
                  required
                />
                <span className="form-hint">
                  当前余额：¥{balance.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "处理中..." : "确认转账"}
              </button>
            </form>
          </div>
        )}

        {/* 提现表单 */}
        {showWithdrawForm && (
          <div className="form-container">
            <div className="form-header">
              <h2>提现</h2>
              <button
                className="btn-close"
                onClick={() => setShowWithdrawForm(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleWithdraw} className="balance-form">
              <div className="form-group">
                <label>提现金额（元）*</label>
                <input
                  type="number"
                  value={withdrawForm.amount}
                  onChange={(e) =>
                    setWithdrawForm({ ...withdrawForm, amount: e.target.value })
                  }
                  placeholder="请输入提现金额"
                  min="0.01"
                  step="0.01"
                  required
                />
                <span className="form-hint">
                  当前余额：¥{balance.toFixed(2)}
                </span>
              </div>

              <div className="withdraw-notice">
                <i className="fa fa-info-circle"></i>
                <div>
                  <p>提现说明：</p>
                  <ul>
                    <li>提现申请需要管理员审核</li>
                    <li>审核通过后，金额将转入您的银行账户</li>
                    <li>提现金额将暂时冻结，直到审核完成</li>
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "处理中..." : "提交申请"}
              </button>
            </form>
          </div>
        )}

        {/* 快速操作提示 */}
        <div className="quick-tips">
          <h3>快速操作</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <i className="fa fa-history"></i>
              <h4>交易记录</h4>
              <p>查看您的所有交易明细</p>
              <a href="/transactions" className="tip-link">
                前往查看 <i className="fa fa-arrow-right"></i>
              </a>
            </div>
            <div className="tip-card">
              <i className="fa fa-shopping-bag"></i>
              <h4>跑腿订单</h4>
              <p>发布订单需要支付跑腿费</p>
              <a href="/errand-orders" className="tip-link">
                前往订单 <i className="fa fa-arrow-right"></i>
              </a>
            </div>
            <div className="tip-card">
              <i className="fa fa-question-circle"></i>
              <h4>帮助中心</h4>
              <p>了解余额使用规则</p>
              <span className="tip-link disabled">
                即将开放
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

