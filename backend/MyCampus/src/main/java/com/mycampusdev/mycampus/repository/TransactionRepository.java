package com.mycampusdev.mycampus.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.mycampusdev.mycampus.pojo.Transaction;
import com.mycampusdev.mycampus.pojo.Transaction.TransactionStatus;
import com.mycampusdev.mycampus.pojo.Transaction.TransactionType;

/**
 * 交易记录数据访问层接口
 */
@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {

    /**
     * 根据交易流水号查找交易记录
     */
    Optional<Transaction> findByTransactionNumber(String transactionNumber);

    /**
     * 查找指定用户的所有交易记录（按创建时间倒序）
     */
    List<Transaction> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * 查找指定用户指定类型的交易记录
     */
    List<Transaction> findByUserIdAndTypeOrderByCreatedAtDesc(String userId, TransactionType type);

    /**
     * 查找指定用户指定状态的交易记录
     */
    List<Transaction> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, TransactionStatus status);

    /**
     * 查找指定用户在某个时间范围内的交易记录
     */
    List<Transaction> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            String userId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 查找指定订单相关的所有交易记录
     */
    List<Transaction> findByRelatedOrderId(String orderId);

    /**
     * 查找所有待处理的提现申请
     */
    List<Transaction> findByTypeAndStatusOrderByCreatedAtAsc(TransactionType type, TransactionStatus status);

    /**
     * 统计用户的总交易次数
     */
    long countByUserId(String userId);

    /**
     * 统计用户特定类型的交易次数
     */
    long countByUserIdAndType(String userId, TransactionType type);
}


