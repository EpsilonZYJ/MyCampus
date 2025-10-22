package com.mycampusdev.mycampus.service;

import java.util.List;

import com.mycampusdev.mycampus.pojo.ErrandOrder;
import com.mycampusdev.mycampus.pojo.ErrandOrder.OrderStatus;

/**
 * 跑腿订单服务接口，定义业务逻辑方法。
 */
public interface IErrandOrderService {

    /**
     * 创建新的跑腿订单
     */
    ErrandOrder createOrder(ErrandOrder order);

    /**
     * 根据ID获取订单详情
     */
    ErrandOrder getOrderById(String id);

    /**
     * 获取所有订单
     */
    List<ErrandOrder> getAllOrders();

    /**
     * 获取指定客户的所有订单
     */
    List<ErrandOrder> getOrdersByCustomerId(String customerId);

    /**
     * 获取指定跑腿员的所有订单
     */
    List<ErrandOrder> getOrdersByRunnerId(String runnerId);

    /**
     * 获取指定状态的订单列表（用于跑腿员查看待接单列表）
     */
    List<ErrandOrder> getOrdersByStatus(OrderStatus status);

    /**
     * 跑腿员接单
     */
    ErrandOrder acceptOrder(String orderId, String runnerId);

    /**
     * 更新订单状态
     */
    ErrandOrder updateOrderStatus(String orderId, OrderStatus status);

    /**
     * 完成订单并评分
     */
    ErrandOrder completeOrder(String orderId, Double rating, String comment);

    /**
     * 取消订单
     */
    ErrandOrder cancelOrder(String orderId);

    /**
     * 删除订单
     */
    void deleteOrder(String id);
}
