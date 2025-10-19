package com.mycampusdev.mycampus.service;

import com.mycampusdev.mycampus.pojo.ErrandOrder;
import com.mycampusdev.mycampus.pojo.ErrandOrder.OrderStatus;
import com.mycampusdev.mycampus.pojo.User;
import com.mycampusdev.mycampus.repository.ErrandOrderRepository;
import com.mycampusdev.mycampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 跑腿订单服务实现类
 */
@Service
public class ErrandOrderService implements IErrandOrderService {

    @Autowired
    private ErrandOrderRepository errandOrderRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ErrandOrder createOrder(ErrandOrder order) {
        // 验证客户是否存在
        User customer = userRepository.findById(order.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // 设置客户姓名
        order.setCustomerName(customer.getUserName());
        order.setStatus(OrderStatus.PENDING);
        
        return errandOrderRepository.save(order);
    }

    @Override
    public ErrandOrder getOrderById(String id) {
        return errandOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    public List<ErrandOrder> getAllOrders() {
        return errandOrderRepository.findAll();
    }

    @Override
    public List<ErrandOrder> getOrdersByCustomerId(String customerId) {
        return errandOrderRepository.findByCustomerId(customerId);
    }

    @Override
    public List<ErrandOrder> getOrdersByRunnerId(String runnerId) {
        return errandOrderRepository.findByRunnerId(runnerId);
    }

    @Override
    public List<ErrandOrder> getOrdersByStatus(OrderStatus status) {
        return errandOrderRepository.findByStatus(status);
    }

    @Override
    public ErrandOrder acceptOrder(String orderId, String runnerId) {
        ErrandOrder order = getOrderById(orderId);
        
        // 验证订单状态
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Order cannot be accepted. Current status: " + order.getStatus());
        }
        
        // 验证跑腿员是否存在且已认证
        User runner = userRepository.findById(runnerId)
                .orElseThrow(() -> new RuntimeException("Runner not found"));
        
        if (!runner.isRunner()) {
            throw new RuntimeException("User is not a runner");
        }
        
        if (runner.getRunnerProfile() == null || !runner.getRunnerProfile().getVerified()) {
            throw new RuntimeException("Runner is not verified");
        }
        
        // 更新订单信息
        order.setRunnerId(runnerId);
        order.setRunnerName(runner.getUserName());
        order.setStatus(OrderStatus.ACCEPTED);
        order.setAcceptedAt(LocalDateTime.now());
        
        return errandOrderRepository.save(order);
    }

    @Override
    public ErrandOrder updateOrderStatus(String orderId, OrderStatus status) {
        ErrandOrder order = getOrderById(orderId);
        order.setStatus(status);
        
        // 如果状态变为配送中，更新时间
        if (status == OrderStatus.IN_PROGRESS) {
            // 可以添加开始配送时间字段
        } else if (status == OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
        }
        
        return errandOrderRepository.save(order);
    }

    @Override
    public ErrandOrder completeOrder(String orderId, Double rating, String comment) {
        ErrandOrder order = getOrderById(orderId);
        
        // 验证订单状态
        if (order.getStatus() != OrderStatus.IN_PROGRESS) {
            throw new RuntimeException("Order cannot be completed. Current status: " + order.getStatus());
        }
        
        // 更新订单信息
        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
        
        if (rating != null) {
            order.setCustomerRating(rating);
        }
        if (comment != null) {
            order.setCustomerComment(comment);
        }
        
        // 更新跑腿员的统计信息
        if (order.getRunnerId() != null) {
            User runner = userRepository.findById(order.getRunnerId()).orElse(null);
            if (runner != null && runner.getRunnerProfile() != null) {
                var profile = runner.getRunnerProfile();
                profile.setTotalOrdersCompleted(profile.getTotalOrdersCompleted() + 1);
                
                // 更新跑腿员评分（简单平均）
                if (rating != null) {
                    int totalOrders = profile.getTotalOrdersCompleted();
                    double currentRating = profile.getRating();
                    double newRating = ((currentRating * (totalOrders - 1)) + rating) / totalOrders;
                    profile.setRating(newRating);
                }
                
                // 更新收入
                if (order.getReward() != null) {
                    profile.setTotalEarnings(profile.getTotalEarnings().add(order.getReward()));
                }
                
                userRepository.save(runner);
            }
        }
        
        return errandOrderRepository.save(order);
    }

    @Override
    public ErrandOrder cancelOrder(String orderId) {
        ErrandOrder order = getOrderById(orderId);
        
        // 只有待接单或已接单的订单可以取消
        if (order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        return errandOrderRepository.save(order);
    }

    @Override
    public void deleteOrder(String id) {
        ErrandOrder order = getOrderById(id);
        errandOrderRepository.delete(order);
    }
}
