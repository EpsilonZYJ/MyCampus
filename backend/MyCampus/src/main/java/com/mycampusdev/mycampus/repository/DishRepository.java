package com.mycampusdev.mycampus.repository;

import com.mycampusdev.mycampus.pojo.Dish;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 菜品数据仓库接口，继承自MongoRepository，提供对Dish集合的CRUD操作。
 */
@Repository
public interface DishRepository extends MongoRepository<Dish, String> {

    /**
     * 根据菜品名称查找菜品
     * @param dishName 菜品名称
     * @return 包含菜品（如果找到）的Optional对象
     */
    Optional<Dish> findByDishName(String dishName);

    /**
     * 根据餐厅查找所有菜品
     * @param restaurant 餐厅名称
     * @return 菜品列表
     */
    List<Dish> findByRestaurant(String restaurant);

    /**
     * 根据分类查找所有菜品
     * @param category 分类
     * @return 菜品列表
     */
    List<Dish> findByCategory(String category);

    /**
     * 查找所有可供应的菜品
     * @param isAvailable 是否可供应
     * @return 菜品列表
     */
    List<Dish> findByIsAvailable(Boolean isAvailable);

    /**
     * 根据评分范围查找菜品
     * @param minRating 最低评分
     * @param maxRating 最高评分
     * @return 菜品列表
     */
    List<Dish> findByRatingBetween(Double minRating, Double maxRating);

    /**
     * 根据地点和分类查找菜品
     * @param restaurant 餐厅
     * @param category 分类
     * @return 菜品列表
     */
    List<Dish> findByRestaurantAndCategory(String restaurant, String category);
}