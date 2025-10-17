package com.mycampusdev.mycampus.service;

import com.mycampusdev.mycampus.dto.CreateDishRequest;
import com.mycampusdev.mycampus.pojo.Dish;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * 菜品服务接口，定义菜品相关的业务逻辑方法。
 */
public interface IDishService {

    /**
     * 创建新菜品
     * @param createDishRequest 菜品创建请求对象
     * @return 保存后的菜品对象
     */
    Dish createDish(CreateDishRequest createDishRequest);

    /**
     * 根据ID获取菜品
     * @param id 菜品ID
     * @return 菜品对象
     */
    Dish getDishById(String id);

    /**
     * 获取所有菜品
     * @return 菜品列表
     */
    List<Dish> getAllDishes();

    /**
     * 根据餐厅获取菜品
     * @param restaurant 餐厅
     * @return 菜品列表
     */
    List<Dish> getDishesByRestaurant(String restaurant);

    /**
     * 根据分类获取菜品
     * @param category 分类
     * @return 菜品列表
     */
    List<Dish> getDishesByCategory(String category);

    /**
     * 获取可供应的菜品
     * @return 菜品列表
     */
    List<Dish> getAvailableDishes();

    /**
     * 更新菜品信息
     * @param id 菜品ID
     * @param dish 更新的菜品信息
     * @return 更新后的菜品对象
     */
    Dish updateDish(String id, Dish dish);

    /**
     * 删除菜品
     * @param id 菜品ID
     */
    void deleteDish(String id);

    /**
     * 更新菜品评分
     * @param id 菜品ID
     * @param newRating 新评分
     * @return 更新后的菜品对象
     */
    Dish updateRating(String id, Double newRating);

    /**
     * 搜索菜品（根据菜名模糊搜索）
     * @param keyword 关键词
     * @return 菜品列表
     */
    List<Dish> searchDishes(String keyword);
    
    /**
     * 更新菜品信息（包含图片更新）
     * @param id 菜品ID
     * @param dishRequest 菜品更新请求对象
     * @return 更新后的菜品对象
     */
    Dish updateDishWithImage(String id, CreateDishRequest dishRequest);
    
    /**
     * 获取菜品图片信息
     * @param id 菜品ID
     * @return 包含图片数据、媒体类型和内容长度的Map
     */
    Map<String, Object> getDishImage(String id);
}