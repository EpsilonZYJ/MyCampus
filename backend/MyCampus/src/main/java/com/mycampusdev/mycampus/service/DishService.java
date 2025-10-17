package com.mycampusdev.mycampus.service;

import com.mycampusdev.mycampus.dto.CreateDishRequest;
import com.mycampusdev.mycampus.pojo.Dish;
import com.mycampusdev.mycampus.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 菜品服务实现类
 */
@Service
public class DishService implements IDishService {

    @Autowired
    private DishRepository dishRepository;

    @Override
    public Dish createDish(CreateDishRequest createDishRequest) {
        // 参数验证
        if (createDishRequest == null) {
            throw new RuntimeException("菜品信息不能为空");
        }
        if (createDishRequest.getDishName() == null || createDishRequest.getDishName().trim().isEmpty()) {
            throw new RuntimeException("菜品名称不能为空");
        }
        if (createDishRequest.getRestaurant() == null || createDishRequest.getRestaurant().trim().isEmpty()) {
            throw new RuntimeException("餐厅名称不能为空");
        }
        if (createDishRequest.getPrice() == null || createDishRequest.getPrice() < 0) {
            throw new RuntimeException("价格必须大于等于0");
        }
        
        // 创建新的Dish实体
        Dish dish = new Dish();
        
        // 设置基本属性
        dish.setDishName(createDishRequest.getDishName());
        dish.setRestaurant(createDishRequest.getRestaurant());
        dish.setRating(createDishRequest.getRating());
        dish.setPrice(createDishRequest.getPrice());
        dish.setDescription(createDishRequest.getDescription());
        dish.setCategory(createDishRequest.getCategory());
        dish.setIsAvailable(createDishRequest.getIsAvailable());
        
        // 处理图片 - 转换为Base64编码并存储
        if (createDishRequest.getImageData() != null && !createDishRequest.getImageData().isEmpty()) {
            try {
                // 获取图片类型
                String contentType = createDishRequest.getImageData().getContentType();
                
                // 将图片转换为Base64编码字符串
                byte[] imageBytes = createDishRequest.getImageData().getBytes();
                String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
                
                // 在数据库中存储Base64编码和图片类型
                dish.setImageData(base64Image);
                dish.setImageType(contentType);
            } catch (IOException e) {
                throw new RuntimeException("图片处理失败: " + e.getMessage());
            }
        }else {
            throw new IllegalArgumentException("上传的图片不能为空");
        }
        
        // 设置创建时间
        dish.setCreatedAt(LocalDateTime.now());
        dish.setUpdatedAt(LocalDateTime.now());

        // 默认值设置
        if (dish.getIsAvailable() == null) {
            dish.setIsAvailable(true);
        }
        if (dish.getReviewCount() == null) {
            dish.setReviewCount(0);
        }
        if (dish.getRating() == null) {
            dish.setRating(0.0);
        }

        return dishRepository.save(dish);
    }

    @Override
    public Dish getDishById(String id) {
        return dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("菜品不存在，ID: " + id));
    }

    @Override
    public List<Dish> getAllDishes() {
        return dishRepository.findAll();
    }

    @Override
    public List<Dish> getDishesByRestaurant(String restaurant) {
        if (restaurant == null || restaurant.trim().isEmpty()) {
            throw new RuntimeException("餐厅名称不能为空");
        }
        List<Dish> dishes = dishRepository.findByRestaurant(restaurant);
        if (dishes.isEmpty()) {
            throw new RuntimeException("未找到该餐厅的菜品: " + restaurant);
        }
        return dishes;
    }

    @Override
    public List<Dish> getDishesByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new RuntimeException("菜品分类不能为空");
        }
        List<Dish> dishes = dishRepository.findByCategory(category);
        if (dishes.isEmpty()) {
            throw new RuntimeException("未找到该分类的菜品: " + category);
        }
        return dishes;
    }

    @Override
    public List<Dish> getAvailableDishes() {
        List<Dish> dishes = dishRepository.findByIsAvailable(true);
        if (dishes.isEmpty()) {
            throw new RuntimeException("当前没有可供应的菜品");
        }
        return dishes;
    }

    @Override
    public Dish updateDish(String id, Dish dish) {
        if (dish == null) {
            throw new RuntimeException("菜品更新信息不能为空");
        }
        
        Dish existingDish = getDishById(id);

        // 参数验证
        if (dish.getPrice() != null && dish.getPrice() < 0) {
            throw new RuntimeException("价格必须大于等于0");
        }
        if (dish.getRating() != null && (dish.getRating() < 0 || dish.getRating() > 5)) {
            throw new RuntimeException("评分必须在0-5之间");
        }

        // 更新字段
        if (dish.getDishName() != null) {
            existingDish.setDishName(dish.getDishName());
        }
        if (dish.getRestaurant() != null) {
            existingDish.setRestaurant(dish.getRestaurant());
        }
        if (dish.getImageData() != null) {
            existingDish.setImageData(dish.getImageData());
        }
        if(dish.getImageType() != null) {
            existingDish.setImageType(dish.getImageType());
        }
        if (dish.getRating() != null) {
            existingDish.setRating(dish.getRating());
        }
        if (dish.getPrice() != null) {
            existingDish.setPrice(dish.getPrice());
        }
        if (dish.getDescription() != null) {
            existingDish.setDescription(dish.getDescription());
        }
        if (dish.getCategory() != null) {
            existingDish.setCategory(dish.getCategory());
        }
        if (dish.getIsAvailable() != null) {
            existingDish.setIsAvailable(dish.getIsAvailable());
        }

        existingDish.setUpdatedAt(LocalDateTime.now());
        return dishRepository.save(existingDish);
    }

    @Override
    public void deleteDish(String id) {
        Dish dish = getDishById(id);
        dishRepository.delete(dish);
    }

    @Override
    public Dish updateDishWithImage(String id, CreateDishRequest dishRequest) {
        // 参数验证
        if (id == null || id.trim().isEmpty()) {
            throw new RuntimeException("菜品ID不能为空");
        }
        if (dishRequest == null) {
            throw new RuntimeException("菜品更新信息不能为空");
        }
        if (dishRequest.getRating() != null && (dishRequest.getRating() < 0 || dishRequest.getRating() > 5)) {
            throw new RuntimeException("评分必须在0-5之间");
        }
        if (dishRequest.getPrice() != null && dishRequest.getPrice() < 0) {
            throw new RuntimeException("价格必须大于等于0");
        }
        
        Dish existingDish = getDishById(id);
        
        // 更新基本信息
        if (dishRequest.getDishName() != null && !dishRequest.getDishName().trim().isEmpty()) {
            existingDish.setDishName(dishRequest.getDishName());
        }
        if (dishRequest.getRestaurant() != null && !dishRequest.getRestaurant().trim().isEmpty()) {
            existingDish.setRestaurant(dishRequest.getRestaurant());
        }
        if (dishRequest.getRating() != null) {
            existingDish.setRating(dishRequest.getRating());
        }
        if (dishRequest.getPrice() != null) {
            existingDish.setPrice(dishRequest.getPrice());
        }
        if (dishRequest.getDescription() != null) {
            existingDish.setDescription(dishRequest.getDescription());
        }
        if (dishRequest.getCategory() != null) {
            existingDish.setCategory(dishRequest.getCategory());
        }
        if (dishRequest.getIsAvailable() != null) {
            existingDish.setIsAvailable(dishRequest.getIsAvailable());
        }
        
        // 处理图片更新
        if (dishRequest.getImageData() != null && !dishRequest.getImageData().isEmpty()) {
            try {
                // 获取图片类型
                String contentType = dishRequest.getImageData().getContentType();
                
                // 将图片转换为Base64编码字符串
                byte[] imageBytes = dishRequest.getImageData().getBytes();
                String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
                
                // 在数据库中存储Base64编码和图片类型
                existingDish.setImageData(base64Image);
                existingDish.setImageType(contentType);
            } catch (IOException e) {
                throw new RuntimeException("图片更新失败: " + e.getMessage());
            }
        }
        
        existingDish.setUpdatedAt(LocalDateTime.now());
        return dishRepository.save(existingDish);
    }

    @Override
    public Dish updateRating(String id, Double newRating) {
        if (newRating == null || newRating < 0 || newRating > 5) {
            throw new RuntimeException("评分必须在0-5之间");
        }
        
        Dish dish = getDishById(id);

        // 计算新的平均评分
        Integer currentReviewCount = dish.getReviewCount() != null ? dish.getReviewCount() : 0;
        Double currentRating = dish.getRating() != null ? dish.getRating() : 0.0;

        Double updatedRating = ((currentRating * currentReviewCount) + newRating) / (currentReviewCount + 1);

        dish.setRating(Math.round(updatedRating * 10.0) / 10.0); // 保留一位小数
        dish.setReviewCount(currentReviewCount + 1);
        dish.setUpdatedAt(LocalDateTime.now());

        return dishRepository.save(dish);
    }

    @Override
    public List<Dish> searchDishes(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new RuntimeException("搜索关键词不能为空");
        }
        
        // 获取所有菜品，然后进行模糊匹配
        List<Dish> searchResults = dishRepository.findAll().stream()
                .filter(dish -> dish.getDishName().toLowerCase().contains(keyword.toLowerCase()) ||
                        (dish.getDescription() != null && dish.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toList());
        
        if (searchResults.isEmpty()) {
            throw new RuntimeException("未找到包含关键词'" + keyword + "'的菜品");
        }
        
        return searchResults;
    }

    @Override
    public Map<String, Object> getDishImage(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new RuntimeException("菜品ID不能为空");
        }
        
        Dish dish = getDishById(id);
        
        if (dish.getImageData() == null || dish.getImageData().isEmpty()) {
            throw new RuntimeException("该菜品没有图片");
        }
        
        try {
            // 从数据库获取Base64编码的图片数据并解码
            byte[] imageBytes = java.util.Base64.getDecoder().decode(dish.getImageData());
            
            // 创建返回结果Map
            Map<String, Object> result = new HashMap<>();
            result.put("imageData", imageBytes);
            result.put("contentType", dish.getImageType());
            result.put("contentLength", (long) imageBytes.length);
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("读取图片数据失败: " + e.getMessage());
        }
    }
}