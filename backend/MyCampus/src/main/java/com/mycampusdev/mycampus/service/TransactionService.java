package com.mycampusdev.mycampus.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycampusdev.mycampus.pojo.Transaction;
import com.mycampusdev.mycampus.pojo.Transaction.TransactionStatus;
import com.mycampusdev.mycampus.pojo.Transaction.TransactionType;
import com.mycampusdev.mycampus.pojo.User;
import com.mycampusdev.mycampus.repository.TransactionRepository;
import com.mycampusdev.mycampus.repository.UserRepository;

/**
 * 交易服务实现类
 */
@Service
public class TransactionService implements ITransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Transaction recordRecharge(String userId, BigDecimal amount, 
                                     BigDecimal balanceBefore, BigDecimal balanceAfter) {
        User user = getUserById(userId);
        Transaction transaction = Transaction.createRecharge(
            userId, user.getUserName(), amount, balanceBefore, balanceAfter
        );
        log.info("Recording recharge transaction for user {}: amount={}", userId, amount);
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction recordOrderPayment(String userId, String orderId, BigDecimal amount,
                                         BigDecimal balanceBefore, BigDecimal balanceAfter) {
        User user = getUserById(userId);
        Transaction transaction = Transaction.createOrderPayment(
            userId, user.getUserName(), amount, balanceBefore, balanceAfter, orderId
        );
        log.info("Recording order payment transaction for user {}: orderId={}, amount={}", 
                 userId, orderId, amount);
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction recordOrderRefund(String userId, String orderId, BigDecimal amount,
                                        BigDecimal balanceBefore, BigDecimal balanceAfter) {
        User user = getUserById(userId);
        Transaction transaction = Transaction.createOrderRefund(
            userId, user.getUserName(), amount, balanceBefore, balanceAfter, orderId
        );
        log.info("Recording order refund transaction for user {}: orderId={}, amount={}", 
                 userId, orderId, amount);
        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction recordOrderSettlement(String runnerId, String customerId, String orderId,
                                            BigDecimal amount, BigDecimal balanceBefore, 
                                            BigDecimal balanceAfter) {
        User runner = getUserById(runnerId);
        User customer = getUserById(customerId);
        Transaction transaction = Transaction.createOrderSettlement(
            runnerId, runner.getUserName(), amount, balanceBefore, balanceAfter,
            orderId, customerId, customer.getUserName()
        );
        log.info("Recording order settlement transaction for runner {}: orderId={}, amount={}", 
                 runnerId, orderId, amount);
        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction recordTransfer(String fromUserId, String toUserId, BigDecimal amount,
                                     BigDecimal fromBalanceBefore, BigDecimal fromBalanceAfter,
                                     BigDecimal toBalanceBefore, BigDecimal toBalanceAfter) {
        User fromUser = getUserById(fromUserId);
        User toUser = getUserById(toUserId);

        // 创建转出记录
        Transaction senderTransaction = Transaction.createTransfer(
            fromUserId, fromUser.getUserName(), toUserId, toUser.getUserName(),
            amount, fromBalanceBefore, fromBalanceAfter, true
        );
        transactionRepository.save(senderTransaction);

        // 创建转入记录
        Transaction receiverTransaction = Transaction.createTransfer(
            fromUserId, fromUser.getUserName(), toUserId, toUser.getUserName(),
            amount, toBalanceBefore, toBalanceAfter, false
        );
        transactionRepository.save(receiverTransaction);

        log.info("Recording transfer transaction: from {} to {}, amount={}", 
                 fromUserId, toUserId, amount);
        return senderTransaction;
    }

    @Override
    public Transaction recordWithdraw(String userId, BigDecimal amount,
                                     BigDecimal balanceBefore, BigDecimal balanceAfter) {
        User user = getUserById(userId);
        Transaction transaction = Transaction.createWithdraw(
            userId, user.getUserName(), amount, balanceBefore, balanceAfter
        );
        log.info("Recording withdraw transaction for user {}: amount={}", userId, amount);
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction updateTransactionStatus(String transactionId, TransactionStatus status) {
        Transaction transaction = getTransactionById(transactionId);
        transaction.setStatus(status);
        log.info("Updating transaction {} status to {}", transactionId, status);
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction getTransactionById(String id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    @Override
    public Transaction getTransactionByNumber(String transactionNumber) {
        return transactionRepository.findByTransactionNumber(transactionNumber)
                .orElseThrow(() -> new RuntimeException("Transaction not found with number: " + transactionNumber));
    }

    @Override
    public List<Transaction> getUserTransactions(String userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Transaction> getUserTransactionsByType(String userId, TransactionType type) {
        return transactionRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type);
    }

    @Override
    public List<Transaction> getUserTransactionsByStatus(String userId, TransactionStatus status) {
        return transactionRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
    }

    @Override
    public List<Transaction> getUserTransactionsByDateRange(String userId, 
                                                           LocalDateTime startTime, 
                                                           LocalDateTime endTime) {
        return transactionRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            userId, startTime, endTime
        );
    }

    @Override
    public List<Transaction> getOrderTransactions(String orderId) {
        return transactionRepository.findByRelatedOrderId(orderId);
    }

    @Override
    public List<Transaction> getPendingWithdrawals() {
        return transactionRepository.findByTypeAndStatusOrderByCreatedAtAsc(
            TransactionType.WITHDRAW, TransactionStatus.PENDING
        );
    }

    @Override
    @Transactional
    public Transaction approveWithdrawal(String transactionId, boolean approved, String remark) {
        Transaction transaction = getTransactionById(transactionId);
        
        if (transaction.getType() != TransactionType.WITHDRAW) {
            throw new RuntimeException("Transaction is not a withdrawal");
        }
        
        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new RuntimeException("Transaction is not pending");
        }

        if (approved) {
            transaction.setStatus(TransactionStatus.SUCCESS);
            transaction.setRemark(remark != null ? remark : "提现已批准");
            log.info("Withdrawal approved: transactionId={}", transactionId);
        } else {
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setRemark(remark != null ? remark : "提现已拒绝");
            
            // 拒绝提现需要退还余额
            String userId = transaction.getUserId();
            User user = getUserById(userId);
            user.setBalance(user.getBalance().add(transaction.getAmount()));
            userRepository.save(user);
            
            log.info("Withdrawal rejected and balance refunded: transactionId={}, userId={}", 
                     transactionId, userId);
        }

        return transactionRepository.save(transaction);
    }

    /**
     * 内部辅助方法：根据ID获取用户
     */
    private User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
}


