package com.mycampusdev.mycampus.controller;

import com.mycampusdev.mycampus.pojo.Dish;
import com.mycampusdev.mycampus.pojo.ResponseMessage;
import com.mycampusdev.mycampus.service.IDishService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;

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

    // --- DTO (Data Transfer Objects) 作为静态内部类 ---

    /**
     * 用于更新菜品评分的数据传输对象
     */
    public static class RatingUpdateRequest {
        @DecimalMin(value = "0.0", message = "评分不能小于0")
        @DecimalMax(value = "5.0", message = "评分不能大于5")
        public Double rating;
    }

    /**
     * 用于创建菜品的请求对象（不包含图片）
     */
    public static class CreateDishRequest {
        @NotBlank(message = "菜名不能为空")
        public String dishName;

        @NotBlank(message = "地点不能为空")
        public String location;

        public Double rating;
        public Double price;
        public String description;
        public String category;
        public Boolean isAvailable;
    }

    /**
     * 创建新菜品（支持图片上传）
     * POST /api/dishes
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseMessage<Dish> createDish(
            @RequestParam("dishName") String dishName,
            @RequestParam("restaurant") String restaurant,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "rating", required = false) Double rating,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "isAvailable", required = false) Boolean isAvailable) {
        try {
            Dish dish = new Dish();
            dish.setDishName(dishName);
            dish.setRestaurant(restaurant);
            dish.setRating(rating);
            dish.setPrice(price);
            dish.setDescription(description);
            dish.setCategory(category);
            dish.setIsAvailable(isAvailable);

            // 处理图片上传
            if (image != null && !image.isEmpty()) {
                byte[] imageBytes = image.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                dish.setImageData(base64Image);
                dish.setImageType(image.getContentType());
                dish.setImageName(image.getOriginalFilename());
            }

            Dish createdDish = dishService.createDish(dish);
            return ResponseMessage.success(createdDish);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.BAD_REQUEST.value(), "菜品创建失败: " + e.getMessage());
        }
    }

    /**
     * 创建新菜品（使用JSON，图片以Base64格式传递）
     * POST /api/dishes/json
     */
    @PostMapping("/json")
    public ResponseMessage<Dish> createDishWithJson(@Valid @RequestBody Dish dish) {
        try {
            Dish createdDish = dishService.createDish(dish);
            return ResponseMessage.success(createdDish);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.BAD_REQUEST.value(), "菜品创建失败: " + e.getMessage());
        }
    }

    /**
     * 获取所有菜品
     * GET /api/dishes
     */
    @GetMapping
    public ResponseMessage<List<Dish>> getAllDishes() {
        try {
            List<Dish> dishes = dishService.getAllDishes();
            return ResponseMessage.success(dishes);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "获取菜品列表失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID获取菜品
     * GET /api/dishes/{id}
     */
    @GetMapping("/{id}")
    public ResponseMessage<Dish> getDishById(@PathVariable String id) {
        try {
            Dish dish = dishService.getDishById(id);
            return ResponseMessage.success(dish);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.NOT_FOUND.value(), "菜品不存在: " + e.getMessage());
        }
    }

    /**
     * 获取菜品图片（返回图片文件）
     * GET /api/dishes/{id}/image
     */
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getDishImage(@PathVariable String id) {
        try {
            Dish dish = dishService.getDishById(id);

            if (dish.getImageData() == null || dish.getImageData().isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // 解码Base64图片数据
            byte[] imageBytes = Base64.getDecoder().decode(dish.getImageData());

            // 设置响应头
            HttpHeaders headers = new HttpHeaders();
            if (dish.getImageType() != null) {
                headers.setContentType(MediaType.parseMediaType(dish.getImageType()));
            } else {
                headers.setContentType(MediaType.IMAGE_JPEG);
            }
            headers.setContentLength(imageBytes.length);

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 根据餐厅获取菜品
     * GET /api/dishes/location/{restaurant}
     */
    @GetMapping("/location/{restaurant}")
    public ResponseMessage<List<Dish>> getDishesByRestaurant(@PathVariable String restaurant) {
        try {
            List<Dish> dishes = dishService.getDishesByRestaurant(restaurant);
            return ResponseMessage.success(dishes);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "获取菜品失败: " + e.getMessage());
        }
    }

    /**
     * 根据分类获取菜品
     * GET /api/dishes/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseMessage<List<Dish>> getDishesByCategory(@PathVariable String category) {
        try {
            List<Dish> dishes = dishService.getDishesByCategory(category);
            return ResponseMessage.success(dishes);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "获取菜品失败: " + e.getMessage());
        }
    }

    /**
     * 获取所有可供应的菜品
     * GET /api/dishes/available
     */
    @GetMapping("/available")
    public ResponseMessage<List<Dish>> getAvailableDishes() {
        try {
            List<Dish> dishes = dishService.getAvailableDishes();
            return ResponseMessage.success(dishes);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "获取菜品失败: " + e.getMessage());
        }
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
            return ResponseMessage.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "搜索菜品失败: " + e.getMessage());
        }
    }

    /**
     * 更新菜品信息（支持图片更新）
     * PUT /api/dishes/{id}
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseMessage<Dish> updateDish(
            @PathVariable String id,
            @RequestParam(value = "dishName", required = false) String dishName,
            @RequestParam(value = "restaurant", required = false) String restaurant,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "rating", required = false) Double rating,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "isAvailable", required = false) Boolean isAvailable) {
        try {
            Dish dish = new Dish();
            dish.setDishName(dishName);
            dish.setRestaurant(restaurant);
            dish.setRating(rating);
            dish.setPrice(price);
            dish.setDescription(description);
            dish.setCategory(category);
            dish.setIsAvailable(isAvailable);

            // 处理图片更新
            if (image != null && !image.isEmpty()) {
                byte[] imageBytes = image.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                dish.setImageData(base64Image);
                dish.setImageType(image.getContentType());
                dish.setImageName(image.getOriginalFilename());
            }

            Dish updatedDish = dishService.updateDish(id, dish);
            return ResponseMessage.success(updatedDish);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.BAD_REQUEST.value(), "菜品更新失败: " + e.getMessage());
        }
    }

    /**
     * 更新菜品信息（使用JSON）
     * PUT /api/dishes/{id}/json
     */
    @PutMapping("/{id}/json")
    public ResponseMessage<Dish> updateDishWithJson(@PathVariable String id, @RequestBody Dish dish) {
        try {
            Dish updatedDish = dishService.updateDish(id, dish);
            return ResponseMessage.success(updatedDish);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.BAD_REQUEST.value(), "菜品更新失败: " + e.getMessage());
        }
    }

    /**
     * 删除菜品
     * DELETE /api/dishes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseMessage<Void> deleteDish(@PathVariable String id) {
        try {
            dishService.deleteDish(id);
            return ResponseMessage.success(null);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.BAD_REQUEST.value(), "菜品删除失败: " + e.getMessage());
        }
    }

    /**
     * 更新菜品评分
     * POST /api/dishes/{id}/rating
     */
    @PostMapping("/{id}/rating")
    public ResponseMessage<Dish> updateRating(@PathVariable String id,
                                              @Valid @RequestBody RatingUpdateRequest request) {
        try {
            Dish updatedDish = dishService.updateRating(id, request.rating);
            return ResponseMessage.success(updatedDish);
        } catch (Exception e) {
            return ResponseMessage.error(HttpStatus.BAD_REQUEST.value(), "评分更新失败: " + e.getMessage());
        }
    }
}