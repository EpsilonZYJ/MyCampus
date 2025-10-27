# MongoDB 索引问题修复指南

## 问题描述
后端启动时出现 `E11000 duplicate key error` 错误,原因是数据库中存在旧的驼峰命名索引 (userName, studentId) 与新的下划线命名索引 (user_name, student_id) 冲突。

## 解决方案

### 方法 1: 使用 Node.js 脚本清理(推荐)

```bash
cd /Users/zhouyujie/Developer/hust-softeware-engineering/mongo-init/local-deploy
node scripts/cleanup-indexes.js
```

### 方法 2: 手动清理(如果有 mongosh 或 mongo 命令)

```bash
# 使用 mongosh (MongoDB Shell)
mongosh
use mycampus
db.tb_user.dropIndexes()
db.tb_dish.dropIndexes()
exit

# 或使用旧版 mongo
mongo mycampus --eval "db.tb_user.dropIndexes(); db.tb_dish.dropIndexes();"
```

### 方法 3: 临时禁用自动索引(已完成)

已修改 `application.properties`,将 `spring.data.mongodb.auto-index-creation` 设置为 `false`。

这样后端可以先启动,然后你可以:

1. **重启后端应用**
   ```bash
   cd /Users/zhouyujie/Developer/hust-softeware-engineering/backend/MyCampus
   ./mvnw spring-boot:run
   ```

2. **应用启动后,手动清理索引**
   运行 `node scripts/cleanup-indexes.js`

3. **清理完成后,重新启用自动索引**
   将 `application.properties` 中的配置改回:
   ```properties
   spring.data.mongodb.auto-index-creation=true
   ```

4. **再次重启后端**
   这次会自动创建正确的索引

## 已完成的代码修复

### 1. User.java
```java
@Field("user_name")
@Indexed(unique = true, name = "user_name")
private String userName;

@Field("student_id")
@Indexed(unique = true, name = "student_id")
private String studentId;
```

### 2. init-database.js
- 添加了字段名映射 (userName → user_name)
- 改进了索引清理逻辑

## 验证步骤

1. 启动后端
2. 测试登录功能
3. 检查索引是否正确创建:
   ```bash
   node scripts/cleanup-indexes.js  # 会显示当前索引
   ```

期望看到的索引:
- `_id_` (系统默认)
- `user_name` (唯一)
- `student_id` (唯一)
- `email_1` (唯一)
