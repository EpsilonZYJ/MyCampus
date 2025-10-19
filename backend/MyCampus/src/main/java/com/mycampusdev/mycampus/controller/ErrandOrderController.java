package com.mycampusdev.mycampus.controller;

import com.mycampusdev.mycampus.pojo.ErrandOrder;
import com.mycampusdev.mycampus.pojo.ErrandOrder.OrderStatus;
import com.mycampusdev.mycampus.pojo.ResponseMessage;
import com.mycampusdev.mycampus.service.IErrandOrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 跑腿订单控制器，处理与跑腿订单相关的HTTP请求
 */
@RestController
@RequestMapping("/api/errand-orders")
@Validated
public class ErrandOrderController {

    @Autowired
    private IErrandOrderService errandOrderService;

    /**
     * 用于订单评价的数据传输对象
     */
    public static class OrderRatingRequest {
        @DecimalMin(value = "1.0", message = "评分不能小于1")
        @DecimalMax(value = "5.0", message = "评分不能大于5")
        public Double rating;
        public String comment;
    }

    /**
     * 创建新的跑腿订单
     * POST /api/errand-orders
     */
    @PostMapping
    public ResponseMessage<ErrandOrder> createOrder(@Valid @RequestBody ErrandOrder order) {
        ErrandOrder createdOrder = errandOrderService.createOrder(order);
        return ResponseMessage.success(createdOrder);
    }

    /**
     * 获取所有订单
     * GET /api/errand-orders
     */
    @GetMapping
    public ResponseMessage<List<ErrandOrder>> getAllOrders() {
        List<ErrandOrder> orders = errandOrderService.getAllOrders();
        return ResponseMessage.success(orders);
    }

    /**
     * 根据ID获取订单详情
     * GET /api/errand-orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseMessage<ErrandOrder> getOrderById(@PathVariable String id) {
        ErrandOrder order = errandOrderService.getOrderById(id);
        return ResponseMessage.success(order);
    }

    /**
     * 获取指定客户的所有订单
     * GET /api/errand-orders/customer/{customerId}
     */
    @GetMapping("/customer/{customerId}")
    public ResponseMessage<List<ErrandOrder>> getOrdersByCustomerId(@PathVariable String customerId) {
        List<ErrandOrder> orders = errandOrderService.getOrdersByCustomerId(customerId);
        return ResponseMessage.success(orders);
    }

    /**
     * 获取指定跑腿员的所有订单
     * GET /api/errand-orders/runner/{runnerId}
     */
    @GetMapping("/runner/{runnerId}")
    public ResponseMessage<List<ErrandOrder>> getOrdersByRunnerId(@PathVariable String runnerId) {
        List<ErrandOrder> orders = errandOrderService.getOrdersByRunnerId(runnerId);
        return ResponseMessage.success(orders);
    }

    /**
     * 获取指定状态的订单列表（用于查看待接单列表）
     * GET /api/errand-orders/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseMessage<List<ErrandOrder>> getOrdersByStatus(@PathVariable String status) {
        OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
        List<ErrandOrder> orders = errandOrderService.getOrdersByStatus(orderStatus);
        return ResponseMessage.success(orders);
    }

    /**
     * 跑腿员接单
     * POST /api/errand-orders/{orderId}/accept
     */
    @PostMapping("/{orderId}/accept")
    public ResponseMessage<ErrandOrder> acceptOrder(
            @PathVariable String orderId,
            @RequestBody Map<String, String> request) {
        String runnerId = request.get("runnerId");
        ErrandOrder order = errandOrderService.acceptOrder(orderId, runnerId);
        return ResponseMessage.success(order);
    }

    /**
     * 更新订单状态
     * PUT /api/errand-orders/{orderId}/status
     */
    @PutMapping("/{orderId}/status")
    public ResponseMessage<ErrandOrder> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> request) {
        OrderStatus status = OrderStatus.valueOf(request.get("status").toUpperCase());
        ErrandOrder order = errandOrderService.updateOrderStatus(orderId, status);
        return ResponseMessage.success(order);
    }

    /**
     * 完成订单并评分
     * POST /api/errand-orders/{orderId}/complete
     */
    @PostMapping("/{orderId}/complete")
    public ResponseMessage<ErrandOrder> completeOrder(
            @PathVariable String orderId,
            @Valid @RequestBody OrderRatingRequest request) {
        ErrandOrder order = errandOrderService.completeOrder(
                orderId,
                request.rating,
                request.comment
        );
        return ResponseMessage.success(order);
    }

    /**
     * 取消订单
     * POST /api/errand-orders/{orderId}/cancel
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseMessage<ErrandOrder> cancelOrder(@PathVariable String orderId) {
        ErrandOrder order = errandOrderService.cancelOrder(orderId);
        return ResponseMessage.success(order);
    }

    /**
     * 删除订单
     * DELETE /api/errand-orders/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseMessage<Void> deleteOrder(@PathVariable String id) {
        errandOrderService.deleteOrder(id);
        return ResponseMessage.success(null);
    }
}
