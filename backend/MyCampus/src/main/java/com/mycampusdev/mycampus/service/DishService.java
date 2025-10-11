package com.mycampusdev.mycampus.service;

import com.mycampusdev.mycampus.pojo.Dish;
import com.mycampusdev.mycampus.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 菜品服务实现类
 */
@Service
public class DishService implements IDishService {

    @Autowired
    private DishRepository dishRepository;

    @Override
    public Dish createDish(Dish dish) {
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
        return dishRepository.findByRestaurant(restaurant);
    }

    @Override
    public List<Dish> getDishesByCategory(String category) {
        return dishRepository.findByCategory(category);
    }

    @Override
    public List<Dish> getAvailableDishes() {
        return dishRepository.findByIsAvailable(true);
    }

    @Override
    public Dish updateDish(String id, Dish dish) {
        Dish existingDish = getDishById(id);

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
        if(dish.getImageName() != null) {
            existingDish.setImageName(dish.getImageName());
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
    public Dish updateRating(String id, Double newRating) {
        Dish dish = getDishById(id);

        // 计算新的平均评分
        Integer currentReviewCount = dish.getReviewCount();
        Double currentRating = dish.getRating();

        Double updatedRating = ((currentRating * currentReviewCount) + newRating) / (currentReviewCount + 1);

        dish.setRating(Math.round(updatedRating * 10.0) / 10.0); // 保留一位小数
        dish.setReviewCount(currentReviewCount + 1);
        dish.setUpdatedAt(LocalDateTime.now());

        return dishRepository.save(dish);
    }

    @Override
    public List<Dish> searchDishes(String keyword) {
        // 获取所有菜品，然后进行模糊匹配
        return dishRepository.findAll().stream()
                .filter(dish -> dish.getDishName().toLowerCase().contains(keyword.toLowerCase()) ||
                        (dish.getDescription() != null && dish.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toList());
    }
}