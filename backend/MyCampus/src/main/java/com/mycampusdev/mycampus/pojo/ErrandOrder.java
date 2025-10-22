package com.mycampusdev.mycampus.pojo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 跑腿订单实体类，映射到MongoDB中的"tb_errand_order"集合
 */
@Document(collection = "tb_errand_order")
public class ErrandOrder {

    @Id
    /**
     * 订单的唯一ID，由MongoDB自动生成
     */
    private String id;

    @Field("order_number")
    /**
     * 订单编号，用于显示给用户的友好ID
     */
    private String orderNumber;

    @Field("customer_id")
    @NotBlank(message = "Customer ID cannot be empty")
    /**
     * 下单用户的ID
     */
    private String customerId;

    @Field("customer_name")
    /**
     * 下单用户的姓名
     */
    private String customerName;

    @Field("runner_id")
    /**
     * 接单跑腿员的ID，订单创建时为null
     */
    private String runnerId;

    @Field("runner_name")
    /**
     * 接单跑腿员的姓名
     */
    private String runnerName;

    @Field("title")
    @NotBlank(message = "Order title cannot be empty")
    /**
     * 订单标题
     */
    private String title;

    @Field("description")
    @NotBlank(message = "Order description cannot be empty")
    /**
     * 订单描述（详细说明需要跑腿员做什么）
     */
    private String description;

    @Field("pickup_location")
    @NotBlank(message = "Pickup location cannot be empty")
    /**
     * 取件地点
     */
    private String pickupLocation;

    @Field("delivery_location")
    @NotBlank(message = "Delivery location cannot be empty")
    /**
     * 送达地点
     */
    private String deliveryLocation;

    @Field("contact_phone")
    @NotBlank(message = "Contact phone cannot be empty")
    /**
     * 联系电话
     */
    private String contactPhone;

    @Field("reward")
    @NotNull(message = "Reward cannot be null")
    @DecimalMin(value = "0.0", message = "Reward cannot be less than 0")
    /**
     * 跑腿费用（酬劳）
     */
    private BigDecimal reward;

    @Field("status")
    /**
     * 订单状态：PENDING(待接单), ACCEPTED(已接单), IN_PROGRESS(配送中), COMPLETED(已完成), CANCELLED(已取消)
     */
    private OrderStatus status = OrderStatus.PENDING;

    @Field("notes")
    /**
     * 备注信息
     */
    private String notes;

    @CreatedDate
    @Field("created_at")
    /**
     * 订单创建时间
     */
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Field("updated_at")
    /**
     * 订单最后更新时间
     */
    private LocalDateTime updatedAt;

    @Field("accepted_at")
    /**
     * 接单时间
     */
    private LocalDateTime acceptedAt;

    @Field("completed_at")
    /**
     * 完成时间
     */
    private LocalDateTime completedAt;

    @Field("customer_rating")
    /**
     * 客户对跑腿员的评分（1-5分）
     */
    private Double customerRating;

    @Field("customer_comment")
    /**
     * 客户评价内容
     */
    private String customerComment;

    /**
     * 订单状态枚举
     */
    public enum OrderStatus {
        PENDING,      // 待接单
        ACCEPTED,     // 已接单
        IN_PROGRESS,  // 配送中
        COMPLETED,    // 已完成
        CANCELLED     // 已取消
    }

    public ErrandOrder() {
        this.orderNumber = generateOrderNumber();
    }

    /**
     * 生成订单编号
     */
    private String generateOrderNumber() {
        return "ERR" + System.currentTimeMillis();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getRunnerId() { return runnerId; }
    public void setRunnerId(String runnerId) { this.runnerId = runnerId; }

    public String getRunnerName() { return runnerName; }
    public void setRunnerName(String runnerName) { this.runnerName = runnerName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public BigDecimal getReward() { return reward; }
    public void setReward(BigDecimal reward) { this.reward = reward; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Double getCustomerRating() { return customerRating; }
    public void setCustomerRating(Double customerRating) { this.customerRating = customerRating; }

    public String getCustomerComment() { return customerComment; }
    public void setCustomerComment(String customerComment) { this.customerComment = customerComment; }
}
