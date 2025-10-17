# MyCampus MongoDB 数据库初始化工具

这个工具用于初始化 MyCampus 项目的 MongoDB 数据库，包括创建用户、菜品、索引等。

## 功能特性

- ✅ 自动从 `backend/MyCampus/src/main/resources/application.properties` 读取数据库配置
- ✅ 支持环境变量占位符 `${VAR:default}` 格式
- ✅ 创建符合 Java 实体类定义的数据结构
- ✅ 自动创建数据库索引
- ✅ 支持跳过已存在的数据
- ✅ 详细的执行日志和错误报告

## 数据结构

### 用户集合 (tb_user)
- 基础信息：用户名、密码、邮箱、手机号、学号
- 账户信息：余额、头像URL、角色列表
- 地址信息：收货地址列表（支持多个地址）
- 跑腿员档案：状态、评分、完成订单数、认证信息等

### 菜品集合 (tb_dish)
- 基础信息：菜品名称、所属食堂、价格、描述
- 图片信息：Base64 编码的图片数据和图片类型（自动从 `imgs/` 目录读取）
- 评价信息：评分、评价数量
- 状态信息：是否可供应

## 图片管理

菜品图片存放在 `imgs/` 目录下。初始化脚本会自动读取图片文件并转换为 Base64 编码存储到数据库。

### 添加菜品图片

1. 将图片文件放入 `imgs/` 目录
2. 在 `data/init-data.json` 中使用相对路径引用：
   ```json
   {
       "dish_name": "宫保鸡丁",
       "image_path": "imgs/gongbao_chicken.jpg",
       ...
   }
   ```
3. 运行初始化脚本

详见 `imgs/README.md` 了解图片规范和优化建议。

## 安装依赖

```bash
cd mongo-init/local-deploy
npm install
```

## 使用方法

### 1. 使用默认数据初始化

```bash
npm run init
```

这将使用 `data/init-data.json` 中的数据初始化数据库。

### 2. 清空现有数据后重新初始化

```bash
npm run init:clear
```

⚠️ **警告**：这会删除 `tb_user` 和 `tb_dish` 集合中的所有现有数据！

### 3. 使用自定义数据文件

```bash
npm run init:custom
# 或直接指定文件路径
node scripts/init-database.js data/my-custom-data.json
```

### 4. 清空数据库

```bash
# 交互式清空（推荐，有二次确认）
./clear-db.sh

# 或直接运行
npm run clear
```

⚠️ **警告**：清空操作会删除所有用户和菜品数据，且不可撤销！

### 5. 添加菜品图片

```bash
# 方式 1: 将真实图片放入 imgs 目录
cp your_dish_photo.jpg imgs/

# 方式 2: 生成测试占位图片（需要 ImageMagick）
brew install imagemagick
./generate-placeholder-images.sh
```

在 `data/init-data.json` 中引用图片：

```json
{
    "dish_name": "你的菜品",
    "restaurant": "食堂名称",
    "image_path": "imgs/your_dish_photo.jpg",
    "price": 25.0,
    ...
}
```

**支持格式**: JPG, PNG, GIF, WebP | **推荐**: 800x600px, < 500KB

详见 `imgs/README.md` 了解图片规范。

## 配置说明

### 数据库连接

工具会按以下优先级获取数据库连接信息：

1. 从 `backend/MyCampus/src/main/resources/application.properties` 读取
2. 从环境变量 `MONGODB_URI` 读取
3. 使用默认值 `mongodb://localhost:27017/mycampus`

### 环境变量

可以通过环境变量覆盖 `application.properties` 中的占位符：

```bash
# 设置环境变量
export SPRING_DATA_MONGODB_URI="mongodb://localhost:27017/mycampus"
export SPRING_DATA_MONGODB_DATABASE="mycampus"

# 运行初始化
npm run init
```

### 数据文件格式

`init-data.json` 的基本结构：

```json
{
    "users": [
        {
            "user_name": "john_doe",
            "password": "$2a$10$...",
            "email": "john@hust.edu.cn",
            "phoneNumber": "13800138001",
            "student_id": "U202100101",
            "balance": 500.5,
            "roles": ["ROLE_STUDENT"],
            "addresses": [...]
        }
    ],
    "dishes": [
        {
            "dish_name": "宫保鸡丁",
            "restaurant": "百景园食堂",
            "image_data": "data:image/jpeg;base64,...",
            "image_type": "jpeg",
            "rating": 4.5,
            "price": 28.8,
            "description": "经典川菜",
            "category": "川菜"
        }
    ],
    "settings": {
        "skipExisting": true,
        "createIndexes": true
    }
}
```

#### settings 配置项

- `skipExisting`: 是否跳过已存在的数据（默认 `true`）
- `createIndexes`: 是否创建数据库索引（默认 `true`）

## 项目结构

```
mongo-init/local-deploy/
├── data/
│   └── init-data.json          # 初始化数据
├── models/
│   ├── User.js                 # 用户模型（对应 tb_user）
│   └── Dish.js                 # 菜品模型（对应 tb_dish）
├── scripts/
│   └── init-database.js        # 主初始化脚本
├── package.json
└── README.md
```

## 注意事项

1. **密码加密**：示例数据中的密码使用 BCrypt 加密（对应明文 `password123`）
2. **图片数据**：菜品图片使用 Base64 编码存储，示例数据中使用了占位图片
3. **索引创建**：首次运行会自动创建唯一索引，确保数据完整性
4. **跑腿员档案**：只有角色包含 `ROLE_RUNNER` 的用户才有 `runnerProfile` 字段

## 常见问题

### 1. 连接数据库失败

确保 MongoDB 服务正在运行：

```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# 或直接启动
mongod --config /usr/local/etc/mongod.conf
```

### 2. 索引创建失败

如果数据库中已有不符合索引约束的数据，可能导致索引创建失败。使用 `--clear` 选项清空数据后重试。

### 3. 读取 application.properties 失败

确保脚本从项目根目录执行，或者手动设置环境变量：

```bash
export MONGODB_URI="mongodb://localhost:27017/mycampus"
```

## 开发调试

查看详细日志：

```bash
# 设置 Mongoose 调试模式
DEBUG=mongoose:* npm run init
```

## 命令参考

### NPM 脚本

| 命令 | 说明 | 危险等级 |
|------|------|----------|
| `npm run init` | 普通初始化（保留现有数据） | 🟢 安全 |
| `npm run init:clear` | 清空并重新初始化 | 🔴 危险 |
| `npm run init:custom` | 使用自定义数据文件初始化 | 🟢 安全 |
| `npm run clear` | 仅清空数据库 | 🔴 危险 |

### Shell 脚本

| 脚本 | 说明 | 特点 |
|------|------|------|
| `./quick-start.sh` | 交互式初始化向导 | 检查环境、选择模式 |
| `./clear-db.sh` | 交互式清空数据库 | 二次确认、安全提示 |
| `./generate-placeholder-images.sh` | 生成测试图片 | 需要 ImageMagick |

### 直接命令

```bash
# 普通初始化
node scripts/init-database.js

# 清空并初始化
node scripts/init-database.js --clear

# 使用自定义数据文件
node scripts/init-database.js data/my-data.json

# 清空数据库（仅清空）
node scripts/clear-database.js
```

## 相关文档

- [测试指南](TEST_GUIDE.md) - 详细的测试步骤和验证方法
- [图片规范](imgs/README.md) - 菜品图片的格式和优化建议
