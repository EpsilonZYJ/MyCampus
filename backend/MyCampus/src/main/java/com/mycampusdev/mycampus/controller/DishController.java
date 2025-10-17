package com.mycampusdev.mycampus.controller;

import com.mycampusdev.mycampus.dto.CreateDishRequest;
import com.mycampusdev.mycampus.pojo.Dish;
import com.mycampusdev.mycampus.pojo.ResponseMessage;
import com.mycampusdev.mycampus.service.IDishService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 菜品模块的控制器，负责处理与菜品相关的HTTP请求。
 * 支持图片上传和下载功能。
 */
@RestController
@RequestMapping("/api/dishes")
@Validated
public class DishController {

    @Autowired
    private IDishService dishService;

    /**
     * 用于更新菜品评分的数据传输对象
     */
    public static class RatingUpdateRequest {
        @DecimalMin(value = "0.0", message = "评分不能小于0")
        @DecimalMax(value = "5.0", message = "评分不能大于5")
        public Double rating;
    }


    /**
     * 创建新菜品（支持图片上传）
     * POST /api/dishes
     * MediaType.MULTIPART_FORM_DATA_VALUE是一种用于上传文件和表单数据的MIME类型
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseMessage<Dish> createDish(@Valid @ModelAttribute CreateDishRequest dish) {
        Dish createdDish = dishService.createDish(dish);
        return ResponseMessage.success(createdDish);
    }

    /**
     * 获取所有菜品
     * GET /api/dishes
     */
    @GetMapping
    public ResponseMessage<List<Dish>> getAllDishes() {
        List<Dish> dishes = dishService.getAllDishes();
        for (Dish dish : dishes) {
            dish.setImageData("null");
        }
        return ResponseMessage.success(dishes);
    }

    /**
     * 根据ID获取菜品
     * GET /api/dishes/{id}
     */
    @GetMapping("/{id}")
    public ResponseMessage<Dish> getDishById(@PathVariable String id) {
        Dish dish = dishService.getDishById(id);
        return ResponseMessage.success(dish);
    }

    /**
     * 获取菜品图片（从文件系统读取）
     * GET /api/dishes/{id}/image
     */
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getDishImage(@PathVariable String id) {
        try {
            Map<String, Object> imageInfo = dishService.getDishImage(id);
            
            byte[] imageBytes = (byte[]) imageInfo.get("imageData");
            String contentType = (String) imageInfo.get("contentType");
            Long contentLength = (Long) imageInfo.get("contentLength");
            
            // 设置响应头
            HttpHeaders headers = new HttpHeaders();
            if (contentType != null) {
                headers.setContentType(MediaType.parseMediaType(contentType));
            } else {
                headers.setContentType(MediaType.IMAGE_JPEG);
            }
            headers.setContentLength(contentLength);
            
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 根据餐厅获取菜品
     * GET /api/dishes/location/{restaurant}
     */
    @GetMapping("/location/{restaurant}")
    public ResponseMessage<List<Dish>> getDishesByRestaurant(@PathVariable String restaurant) {
        List<Dish> dishes = dishService.getDishesByRestaurant(restaurant);
        return ResponseMessage.success(dishes);
    }

    /**
     * 根据分类获取菜品
     * GET /api/dishes/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseMessage<List<Dish>> getDishesByCategory(@PathVariable String category) {
        List<Dish> dishes = dishService.getDishesByCategory(category);
        return ResponseMessage.success(dishes);
    }

    /**
     * 获取所有可供应的菜品
     * GET /api/dishes/available
     */
    @GetMapping("/available")
    public ResponseMessage<List<Dish>> getAvailableDishes() {
        List<Dish> dishes = dishService.getAvailableDishes();
        return ResponseMessage.success(dishes);
    }

    /**
     * 搜索菜品（模糊搜索）
     * GET /api/dishes/search?keyword=xxx
     */
    @GetMapping("/search")
    public ResponseMessage<List<Dish>> searchDishes(@RequestParam String keyword) {
        try {
            List<Dish> dishes = dishService.searchDishes(keyword);
            return ResponseMessage.success(dishes);
        } catch (Exception e) {
            throw new RuntimeException("搜索菜品失败: " + e.getMessage());
        }
    }

    /**
     * 更新菜品信息（支持图片更新）
     * PUT /api/dishes/{id}
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseMessage<Dish> updateDish(@PathVariable String id, @ModelAttribute CreateDishRequest dish) {
        // 调用service层新方法处理更新，包括图片处理
        Dish updatedDish = dishService.updateDishWithImage(id, dish);
        return ResponseMessage.success(updatedDish);
    }

    /**
     * 删除菜品
     * DELETE /api/dishes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseMessage<Void> deleteDish(@PathVariable String id) {
        dishService.deleteDish(id);
        return ResponseMessage.success(null);
    }

    /**
     * 更新菜品评分
     * POST /api/dishes/{id}/rating
     */
    @PostMapping("/{id}/rating")
    public ResponseMessage<Dish> updateRating(@PathVariable String id,
                                              @Valid @RequestBody RatingUpdateRequest request) {
        Dish updatedDish = dishService.updateRating(id, request.rating);
        return ResponseMessage.success(updatedDish);
    }
}