package com.mycampusdev.mycampus.pojo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 交易记录实体类，映射到MongoDB的"tb_transaction"集合
 * 用于记录所有的余额变动，包括充值、消费、结算、转账、提现等
 */
@Document(collection = "tb_transaction")
public class Transaction {

    @Id
    private String id;

    @Field("transaction_number")
    @Indexed(unique = true)
    /**
     * 交易流水号，用于对账和查询
     */
    private String transactionNumber;

    @Field("user_id")
    @NotBlank(message = "User ID cannot be empty")
    @Indexed
    /**
     * 用户ID（交易发起方或接收方）
     */
    private String userId;

    @Field("user_name")
    /**
     * 用户名（冗余字段，方便查询显示）
     */
    private String userName;

    @Field("type")
    @NotNull(message = "Transaction type cannot be null")
    @Indexed
    /**
     * 交易类型
     */
    private TransactionType type;

    @Field("amount")
    @NotNull(message = "Amount cannot be null")
    @DecimalMin(value = "0.0", message = "Amount cannot be negative")
    /**
     * 交易金额（绝对值）
     */
    private BigDecimal amount;

    @Field("balance_before")
    /**
     * 交易前余额
     */
    private BigDecimal balanceBefore;

    @Field("balance_after")
    /**
     * 交易后余额
     */
    private BigDecimal balanceAfter;

    @Field("related_order_id")
    /**
     * 关联的订单ID（如果是订单相关交易）
     */
    private String relatedOrderId;

    @Field("related_user_id")
    /**
     * 关联的另一方用户ID（用于转账、结算等）
     */
    private String relatedUserId;

    @Field("related_user_name")
    /**
     * 关联的另一方用户名（冗余字段）
     */
    private String relatedUserName;

    @Field("status")
    /**
     * 交易状态
     */
    private TransactionStatus status = TransactionStatus.SUCCESS;

    @Field("description")
    /**
     * 交易描述
     */
    private String description;

    @Field("remark")
    /**
     * 备注信息
     */
    private String remark;

    @CreatedDate
    @Field("created_at")
    @Indexed
    /**
     * 交易创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 交易类型枚举
     */
    public enum TransactionType {
        RECHARGE("充值"),           // 用户充值
        ORDER_PAYMENT("订单支付"),   // 下单支付
        ORDER_REFUND("订单退款"),    // 订单取消退款
        ORDER_SETTLEMENT("订单结算"), // 订单完成给跑腿员结算
        TRANSFER("转账"),           // 用户间转账
        WITHDRAW("提现"),           // 跑腿员提现
        SYSTEM_ADJUSTMENT("系统调整"); // 系统调整（如补偿、扣除等）

        private final String description;

        TransactionType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 交易状态枚举
     */
    public enum TransactionStatus {
        PENDING("处理中"),    // 处理中
        SUCCESS("成功"),      // 成功
        FAILED("失败"),       // 失败
        CANCELLED("已取消");  // 已取消

        private final String description;

        TransactionStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public Transaction() {
        this.transactionNumber = generateTransactionNumber();
        this.createdAt = LocalDateTime.now();
    }

    /**
     * 生成交易流水号
     * 格式：TXN + 时间戳 + 4位随机数
     */
    private String generateTransactionNumber() {
        int randomNum = (int) (Math.random() * 9000) + 1000;
        return "TXN" + System.currentTimeMillis() + randomNum;
    }

    // --- 便捷构造方法 ---

    /**
     * 创建充值交易记录
     */
    public static Transaction createRecharge(String userId, String userName, BigDecimal amount, 
                                             BigDecimal balanceBefore, BigDecimal balanceAfter) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setUserName(userName);
        transaction.setType(TransactionType.RECHARGE);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setDescription("账户充值");
        transaction.setStatus(TransactionStatus.SUCCESS);
        return transaction;
    }

    /**
     * 创建订单支付交易记录
     */
    public static Transaction createOrderPayment(String userId, String userName, BigDecimal amount,
                                                 BigDecimal balanceBefore, BigDecimal balanceAfter,
                                                 String orderId) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setUserName(userName);
        transaction.setType(TransactionType.ORDER_PAYMENT);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setRelatedOrderId(orderId);
        transaction.setDescription("订单支付");
        transaction.setStatus(TransactionStatus.SUCCESS);
        return transaction;
    }

    /**
     * 创建订单退款交易记录
     */
    public static Transaction createOrderRefund(String userId, String userName, BigDecimal amount,
                                               BigDecimal balanceBefore, BigDecimal balanceAfter,
                                               String orderId) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setUserName(userName);
        transaction.setType(TransactionType.ORDER_REFUND);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setRelatedOrderId(orderId);
        transaction.setDescription("订单退款");
        transaction.setStatus(TransactionStatus.SUCCESS);
        return transaction;
    }

    /**
     * 创建订单结算交易记录（跑腿员收入）
     */
    public static Transaction createOrderSettlement(String runnerId, String runnerName, BigDecimal amount,
                                                   BigDecimal balanceBefore, BigDecimal balanceAfter,
                                                   String orderId, String customerId, String customerName) {
        Transaction transaction = new Transaction();
        transaction.setUserId(runnerId);
        transaction.setUserName(runnerName);
        transaction.setType(TransactionType.ORDER_SETTLEMENT);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setRelatedOrderId(orderId);
        transaction.setRelatedUserId(customerId);
        transaction.setRelatedUserName(customerName);
        transaction.setDescription("订单完成结算");
        transaction.setStatus(TransactionStatus.SUCCESS);
        return transaction;
    }

    /**
     * 创建转账交易记录
     */
    public static Transaction createTransfer(String fromUserId, String fromUserName, 
                                            String toUserId, String toUserName,
                                            BigDecimal amount, BigDecimal balanceBefore, 
                                            BigDecimal balanceAfter, boolean isSender) {
        Transaction transaction = new Transaction();
        if (isSender) {
            transaction.setUserId(fromUserId);
            transaction.setUserName(fromUserName);
            transaction.setRelatedUserId(toUserId);
            transaction.setRelatedUserName(toUserName);
            transaction.setDescription("转账给 " + toUserName);
        } else {
            transaction.setUserId(toUserId);
            transaction.setUserName(toUserName);
            transaction.setRelatedUserId(fromUserId);
            transaction.setRelatedUserName(fromUserName);
            transaction.setDescription("收到来自 " + fromUserName + " 的转账");
        }
        transaction.setType(TransactionType.TRANSFER);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setStatus(TransactionStatus.SUCCESS);
        return transaction;
    }

    /**
     * 创建提现交易记录
     */
    public static Transaction createWithdraw(String userId, String userName, BigDecimal amount,
                                            BigDecimal balanceBefore, BigDecimal balanceAfter) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setUserName(userName);
        transaction.setType(TransactionType.WITHDRAW);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setDescription("余额提现");
        transaction.setStatus(TransactionStatus.PENDING); // 提现需要审核
        return transaction;
    }

    // --- Getters and Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTransactionNumber() { return transactionNumber; }
    public void setTransactionNumber(String transactionNumber) { this.transactionNumber = transactionNumber; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getBalanceBefore() { return balanceBefore; }
    public void setBalanceBefore(BigDecimal balanceBefore) { this.balanceBefore = balanceBefore; }

    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(BigDecimal balanceAfter) { this.balanceAfter = balanceAfter; }

    public String getRelatedOrderId() { return relatedOrderId; }
    public void setRelatedOrderId(String relatedOrderId) { this.relatedOrderId = relatedOrderId; }

    public String getRelatedUserId() { return relatedUserId; }
    public void setRelatedUserId(String relatedUserId) { this.relatedUserId = relatedUserId; }

    public String getRelatedUserName() { return relatedUserName; }
    public void setRelatedUserName(String relatedUserName) { this.relatedUserName = relatedUserName; }

    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


