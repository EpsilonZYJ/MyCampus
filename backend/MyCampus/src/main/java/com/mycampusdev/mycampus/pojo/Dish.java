package com.mycampusdev.mycampus.pojo;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * 菜品实体类,映射到MongoDB中的"tb_dish"集合
 * 含有NotBlank字段的属性在添加时也不能为Blank
 */
@Document(collection = "tb_dish")
public class Dish {

    @Id
    /**
     * 菜品文档的唯一ID，由MongoDB自动生成。
     */
    private String id;

    @Field("dish_name")
    @NotBlank(message = "Dish name cannot be empty")
    /**
     * 菜品名称
     */
    private String dishName;

    @Field("restaurant")
    @NotBlank(message = "Restaurant name cannot be empty")
    /**
     * 菜品所在食堂
     */
    private String restaurant;

    @Field("image_data")
    @NotBlank(message = "Image data cannot be empty")
    /**
     * 菜品图片Base64编码数据
     */
    private String imageData;

    @Field("image_type")
    @NotBlank(message = "Image type cannot be empty")
    /**
     * 菜品图片类型（如：jpeg、png）
     */
    private String imageType;

    @Field("rating")
    @DecimalMin(value = "0.0", message = "Rating cannot be less than 0")
    @DecimalMax(value = "5.0", message = "Rating cannot be more than 5")
    /**
     * 菜品评分（0-5分）
     */
    private Double rating;

    @Field("price")
    /**
     * 菜品价格
     */
    private Double price;

    @Field("description")
    /**
     * 菜品描述
     */
    private String description;

    @Field("category")
    /**
     * 菜品分类（如：主食、炒菜、小吃、饮品等）
     */
    private String category;

    @Field("review_count")
    /**
     * 评价数量
     */
    private Integer reviewCount = 0;

    @CreatedDate
    @Field("created_at")
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Field("updated_at")
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

    /**
     * 是否可供应
     */
    private Boolean isAvailable = true;

    // 构造函数
    public Dish(){
    }

    public Dish(String dishName, String restaurant, String imageData, String imageType, Double rating, Double price, String description, String category) {
        this.dishName = dishName;
        this.restaurant = restaurant;
        this.imageData = imageData;
        this.imageType = imageType;
        this.rating = rating;
        this.price = price;
        this.description = description;
        this.category = category;
    }

    // Getter和Setter方法

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NotBlank(message = "Dish name cannot be empty") String getDishName() {
        return dishName;
    }

    public void setDishName(@NotBlank(message = "Dish name cannot be empty") String dishName) {
        this.dishName = dishName;
    }

    public @NotBlank(message = "Restaurant name cannot be empty") String getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(@NotBlank(message = "Restaurant name cannot be empty") String restaurant) {
        this.restaurant = restaurant;
    }

    public @NotBlank(message = "Image data cannot be empty") String getImageData() {
        return imageData;
    }

    public void setImageData(@NotBlank(message = "Image data cannot be empty") String imageData) {
        this.imageData = imageData;
    }

    public @NotBlank(message = "Image type cannot be empty") String getImageType() {
        return imageType;
    }

    public void setImageType(@NotBlank(message = "Image type cannot be empty") String imageType) {
        this.imageType = imageType;
    }



    public @DecimalMin(value = "0.0", message = "Rating cannot be less than 0") @DecimalMax(value = "5.0", message = "Rating cannot be more than 5") Double getRating() {
        return rating;
    }

    public void setRating(@DecimalMin(value = "0.0", message = "Rating cannot be less than 0") @DecimalMax(value = "5.0", message = "Rating cannot be more than 5") Double rating) {
        this.rating = rating;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean available) {
        isAvailable = available;
    }

    @Override
    public String toString() {
        return "Dish{" +
                "id='" + id + '\'' +
                ", dishName='" + dishName + '\'' +
                ", restaurant='" + restaurant + '\'' +
                ", imageData='" + imageData + '\'' +
                ", imageType='" + imageType + '\'' +
                ", rating=" + rating +
                ", price=" + price +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                ", reviewCount=" + reviewCount +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
