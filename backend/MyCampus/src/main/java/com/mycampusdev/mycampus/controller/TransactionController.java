package com.mycampusdev.mycampus.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mycampusdev.mycampus.pojo.ResponseMessage;
import com.mycampusdev.mycampus.pojo.Transaction;
import com.mycampusdev.mycampus.pojo.Transaction.TransactionStatus;
import com.mycampusdev.mycampus.pojo.Transaction.TransactionType;
import com.mycampusdev.mycampus.service.ITransactionService;

/**
 * 交易记录控制器，处理交易查询和管理相关的HTTP请求
 */
@RestController
@RequestMapping("/api/transactions")
@Validated
public class TransactionController {

    private static final Logger log = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private ITransactionService transactionService;

    /**
     * 根据交易ID查询交易记录
     * GET /api/transactions/{id}
     */
    @GetMapping("/{id}")
    public ResponseMessage<Transaction> getTransactionById(@PathVariable String id) {
        log.info("Getting transaction by id: {}", id);
        Transaction transaction = transactionService.getTransactionById(id);
        return ResponseMessage.success(transaction);
    }

    /**
     * 根据交易流水号查询交易记录
     * GET /api/transactions/number/{transactionNumber}
     */
    @GetMapping("/number/{transactionNumber}")
    public ResponseMessage<Transaction> getTransactionByNumber(@PathVariable String transactionNumber) {
        log.info("Getting transaction by number: {}", transactionNumber);
        Transaction transaction = transactionService.getTransactionByNumber(transactionNumber);
        return ResponseMessage.success(transaction);
    }

    /**
     * 查询用户的所有交易记录
     * GET /api/transactions/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseMessage<List<Transaction>> getUserTransactions(@PathVariable String userId) {
        log.info("Getting all transactions for user: {}", userId);
        List<Transaction> transactions = transactionService.getUserTransactions(userId);
        return ResponseMessage.success(transactions);
    }

    /**
     * 查询用户指定类型的交易记录
     * GET /api/transactions/user/{userId}/type/{type}
     */
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseMessage<List<Transaction>> getUserTransactionsByType(
            @PathVariable String userId,
            @PathVariable TransactionType type) {
        log.info("Getting transactions for user {} with type: {}", userId, type);
        List<Transaction> transactions = transactionService.getUserTransactionsByType(userId, type);
        return ResponseMessage.success(transactions);
    }

    /**
     * 查询用户指定状态的交易记录
     * GET /api/transactions/user/{userId}/status/{status}
     */
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseMessage<List<Transaction>> getUserTransactionsByStatus(
            @PathVariable String userId,
            @PathVariable TransactionStatus status) {
        log.info("Getting transactions for user {} with status: {}", userId, status);
        List<Transaction> transactions = transactionService.getUserTransactionsByStatus(userId, status);
        return ResponseMessage.success(transactions);
    }

    /**
     * 查询用户指定时间范围内的交易记录
     * GET /api/transactions/user/{userId}/date-range?startTime=xxx&endTime=xxx
     * 时间格式: 2024-01-01T00:00:00
     */
    @GetMapping("/user/{userId}/date-range")
    public ResponseMessage<List<Transaction>> getUserTransactionsByDateRange(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        log.info("Getting transactions for user {} between {} and {}", userId, startTime, endTime);
        List<Transaction> transactions = transactionService.getUserTransactionsByDateRange(userId, startTime, endTime);
        return ResponseMessage.success(transactions);
    }

    /**
     * 查询订单相关的所有交易记录
     * GET /api/transactions/order/{orderId}
     */
    @GetMapping("/order/{orderId}")
    public ResponseMessage<List<Transaction>> getOrderTransactions(@PathVariable String orderId) {
        log.info("Getting transactions for order: {}", orderId);
        List<Transaction> transactions = transactionService.getOrderTransactions(orderId);
        return ResponseMessage.success(transactions);
    }

    /**
     * 获取所有待处理的提现申请（管理员功能）
     * GET /api/transactions/withdrawals/pending
     */
    @GetMapping("/withdrawals/pending")
    public ResponseMessage<List<Transaction>> getPendingWithdrawals() {
        log.info("Getting all pending withdrawals");
        List<Transaction> withdrawals = transactionService.getPendingWithdrawals();
        return ResponseMessage.success(withdrawals);
    }

    /**
     * 审核提现申请（管理员功能）
     * POST /api/transactions/{transactionId}/approve-withdrawal
     * Body: {"approved": true, "remark": "审核通过"}
     */
    @PostMapping("/{transactionId}/approve-withdrawal")
    public ResponseMessage<Transaction> approveWithdrawal(
            @PathVariable String transactionId,
            @RequestBody Map<String, Object> request) {
        Boolean approved = (Boolean) request.get("approved");
        String remark = (String) request.get("remark");
        
        log.info("Approving withdrawal: transactionId={}, approved={}", transactionId, approved);
        Transaction transaction = transactionService.approveWithdrawal(transactionId, approved, remark);
        return ResponseMessage.success(transaction);
    }

    /**
     * 数据传输对象：提现申请请求
     */
    public static class WithdrawalApprovalRequest {
        private Boolean approved;
        private String remark;

        public Boolean getApproved() { return approved; }
        public void setApproved(Boolean approved) { this.approved = approved; }
        public String getRemark() { return remark; }
        public void setRemark(String remark) { this.remark = remark; }
    }
}


