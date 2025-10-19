package com.mycampusdev.mycampus.repository;

import com.mycampusdev.mycampus.pojo.ErrandOrder;
import com.mycampusdev.mycampus.pojo.ErrandOrder.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 跑腿订单数据访问层接口，继承MongoRepository以获得基础的CRUD功能。
 */
@Repository
public interface ErrandOrderRepository extends MongoRepository<ErrandOrder, String> {

    /**
     * 根据客户ID查询订单列表
     */
    List<ErrandOrder> findByCustomerId(String customerId);

    /**
     * 根据跑腿员ID查询订单列表
     */
    List<ErrandOrder> findByRunnerId(String runnerId);

    /**
     * 根据订单状态查询订单列表
     */
    List<ErrandOrder> findByStatus(OrderStatus status);

    /**
     * 根据订单编号查询订单
     */
    ErrandOrder findByOrderNumber(String orderNumber);

    /**
     * 查询指定客户的指定状态订单
     */
    List<ErrandOrder> findByCustomerIdAndStatus(String customerId, OrderStatus status);

    /**
     * 查询指定跑腿员的指定状态订单
     */
    List<ErrandOrder> findByRunnerIdAndStatus(String runnerId, OrderStatus status);
}
