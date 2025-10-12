package com.mycampusdev.mycampus.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.web.multipart.MultipartFile;

/**
 * 用于创建菜品的请求数据传输对象
 */
public class CreateDishRequest {

    @NotBlank(message = "Dish name cannot be empty")
    private String dishName;

    @NotBlank(message = "Restaurant name cannot be empty")
    private String restaurant;

    @NotNull(message = "Image data cannot be empty")
    private MultipartFile imageData;

    @DecimalMin(value = "0.0", message = "Rating cannot be less than 0")
    @DecimalMax(value = "5.0", message = "Rating cannot be more than 5")
    private Double rating = 0.0;

    @DecimalMin(value = "0.0", message = "Price cannot be less than 0")
    private Double price;

    private String description;

    @Pattern(regexp = "^(主食|炒菜|小吃|饮品)", message = "所添加菜品分类无效")
    private String category;

    private Boolean isAvailable = true;
    
    // Getters and Setters
    public String getDishName() {
        return dishName;
    }
    public void setDishName(String dishName) {
        this.dishName = dishName;
    }
    public String getRestaurant() {
        return restaurant;
    }
    public void setRestaurant(String restaurant) {
        this.restaurant = restaurant;
    }
    public MultipartFile getImageData() {
        return imageData;
    }
    public void setImageData(MultipartFile imageData) {
        this.imageData = imageData;
    }
    public Double getRating() {
        return rating;
    }
    public void setRating(Double rating) {
        this.rating = rating;
    }
    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
}