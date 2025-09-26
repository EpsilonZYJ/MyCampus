# MyCampus Docker 部署指南

这个项目使用Docker和Docker Compose来部署Spring Boot应用程序和MongoDB数据库。

## 前置要求

- Docker
- Docker Compose
- Java 17 (用于本地开发)

## 快速开始

1. **克隆项目并进入项目目录**

   ```bash
   cd /Users/zhouyujie/Developer/hust-softeware-engineering
   ```

2. **配置环境变量**

   ```bash
   # 复制环境变量模板文件
   cp .env.example .env
   
   # 编辑 .env 文件，修改密码和其他配置
   nano .env
   ```

3. **启动服务**

   ```bash
   docker-compose up -d
   ```

3. **检查服务状态**
   ```bash
   docker-compose ps
   ```

4. **查看日志**
   ```bash
   # 查看应用日志
   docker-compose logs -f mycampus-app
   
   # 查看MongoDB日志
   docker-compose logs -f mongodb
   ```

## 服务配置

### Spring Boot 应用
- 端口: 8080
- 容器名: mycampus-app
- 日志目录: ./logs

### MongoDB 数据库
- 端口: 27017
- 容器名: mycampus-mongodb
- 管理员用户: admin
- 管理员密码: password123
- 数据库名: mycampus

## 环境变量

可以通过修改docker-compose.yml中的环境变量来配置应用程序：

- `SPRING_DATA_MONGODB_URI`: MongoDB连接URI
- `SPRING_DATA_MONGODB_DATABASE`: 数据库名称

## 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up --build -d

# 查看服务状态
docker-compose ps

# 进入MongoDB容器
docker-compose exec mongodb mongosh -u admin -p password123

# 进入应用容器
docker-compose exec mycampus-app bash

# 清理所有数据（慎用）
docker-compose down -v
```

## API测试

应用启动后，可以通过以下URL访问：

- 应用程序: http://localhost:8080
- 健康检查: http://localhost:8080/actuator/health (需要添加actuator依赖)

## 数据持久化

- MongoDB数据存储在Docker volume `mongodb_data`中
- 应用日志映射到宿主机`./logs`目录

## 故障排查

1. **端口冲突**: 确保8080和27017端口未被占用
2. **内存不足**: 确保Docker有足够的内存分配
3. **权限问题**: 确保Docker有权限访问项目目录

## 生产环境部署建议

1. 修改默认密码
2. 使用环境变量文件(.env)
3. 配置SSL/TLS
4. 设置备份策略
5. 配置监控和日志收集
