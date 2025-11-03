package com.mycampusdev.mycampus.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.mycampusdev.mycampus.pojo.Transaction;
import com.mycampusdev.mycampus.pojo.Transaction.TransactionStatus;
import com.mycampusdev.mycampus.pojo.Transaction.TransactionType;

/**
 * 交易服务接口，定义交易相关的业务方法
 */
public interface ITransactionService {

    /**
     * 记录充值交易
     * @param userId 用户ID
     * @param amount 充值金额
     * @param balanceBefore 充值前余额
     * @param balanceAfter 充值后余额
     * @return 创建的交易记录
     */
    Transaction recordRecharge(String userId, BigDecimal amount, 
                              BigDecimal balanceBefore, BigDecimal balanceAfter);

    /**
     * 记录订单支付交易
     * @param userId 用户ID
     * @param orderId 订单ID
     * @param amount 支付金额
     * @param balanceBefore 支付前余额
     * @param balanceAfter 支付后余额
     * @return 创建的交易记录
     */
    Transaction recordOrderPayment(String userId, String orderId, BigDecimal amount,
                                  BigDecimal balanceBefore, BigDecimal balanceAfter);

    /**
     * 记录订单退款交易
     * @param userId 用户ID
     * @param orderId 订单ID
     * @param amount 退款金额
     * @param balanceBefore 退款前余额
     * @param balanceAfter 退款后余额
     * @return 创建的交易记录
     */
    Transaction recordOrderRefund(String userId, String orderId, BigDecimal amount,
                                 BigDecimal balanceBefore, BigDecimal balanceAfter);

    /**
     * 记录订单结算交易（跑腿员收入）
     * @param runnerId 跑腿员ID
     * @param customerId 客户ID
     * @param orderId 订单ID
     * @param amount 结算金额
     * @param balanceBefore 结算前余额
     * @param balanceAfter 结算后余额
     * @return 创建的交易记录
     */
    Transaction recordOrderSettlement(String runnerId, String customerId, String orderId,
                                     BigDecimal amount, BigDecimal balanceBefore, BigDecimal balanceAfter);

    /**
     * 记录转账交易（会创建两条记录，一条转出，一条转入）
     * @param fromUserId 转出用户ID
     * @param toUserId 转入用户ID
     * @param amount 转账金额
     * @param fromBalanceBefore 转出用户转账前余额
     * @param fromBalanceAfter 转出用户转账后余额
     * @param toBalanceBefore 转入用户转账前余额
     * @param toBalanceAfter 转入用户转账后余额
     * @return 转出方的交易记录
     */
    Transaction recordTransfer(String fromUserId, String toUserId, BigDecimal amount,
                              BigDecimal fromBalanceBefore, BigDecimal fromBalanceAfter,
                              BigDecimal toBalanceBefore, BigDecimal toBalanceAfter);

    /**
     * 记录提现申请交易
     * @param userId 用户ID
     * @param amount 提现金额
     * @param balanceBefore 提现前余额
     * @param balanceAfter 提现后余额
     * @return 创建的交易记录
     */
    Transaction recordWithdraw(String userId, BigDecimal amount,
                              BigDecimal balanceBefore, BigDecimal balanceAfter);

    /**
     * 更新交易状态
     * @param transactionId 交易ID
     * @param status 新状态
     * @return 更新后的交易记录
     */
    Transaction updateTransactionStatus(String transactionId, TransactionStatus status);

    /**
     * 根据ID查询交易记录
     * @param id 交易ID
     * @return 交易记录
     */
    Transaction getTransactionById(String id);

    /**
     * 根据流水号查询交易记录
     * @param transactionNumber 交易流水号
     * @return 交易记录
     */
    Transaction getTransactionByNumber(String transactionNumber);

    /**
     * 查询用户的所有交易记录
     * @param userId 用户ID
     * @return 交易记录列表（按时间倒序）
     */
    List<Transaction> getUserTransactions(String userId);

    /**
     * 查询用户指定类型的交易记录
     * @param userId 用户ID
     * @param type 交易类型
     * @return 交易记录列表
     */
    List<Transaction> getUserTransactionsByType(String userId, TransactionType type);

    /**
     * 查询用户指定状态的交易记录
     * @param userId 用户ID
     * @param status 交易状态
     * @return 交易记录列表
     */
    List<Transaction> getUserTransactionsByStatus(String userId, TransactionStatus status);

    /**
     * 查询用户指定时间范围内的交易记录
     * @param userId 用户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 交易记录列表
     */
    List<Transaction> getUserTransactionsByDateRange(String userId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 查询订单相关的所有交易记录
     * @param orderId 订单ID
     * @return 交易记录列表
     */
    List<Transaction> getOrderTransactions(String orderId);

    /**
     * 获取所有待处理的提现申请
     * @return 提现申请列表
     */
    List<Transaction> getPendingWithdrawals();

    /**
     * 审核提现申请
     * @param transactionId 交易ID
     * @param approved 是否批准
     * @param remark 备注
     * @return 更新后的交易记录
     */
    Transaction approveWithdrawal(String transactionId, boolean approved, String remark);
}


