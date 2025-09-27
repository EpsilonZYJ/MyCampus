# MyCampus Docker 部署指南

这个项目使用Docker和Docker Compose来部署Spring Boot应用程序和MongoDB数据库。

## 前置要求

- Docker
- Docker Compose
- Java 17 (用于本地开发)

## 快速开始

1. **克隆项目并进入项目目录**

   ```bash
   cd hust-softeware-engineering
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

## 关于.env文件配置

.env为敏感文件，请不要上传。

一定需要修改的有：

- MYCAMPUS_DB_PASSWORD
- MYCAMPUS_DB_PASSWORD（两个密码）
- DOCKER_REGISTRY_MIRROR（镜像加速器）

对于端口是否需要修改，在不进行前后端联调时没有很大关系，但是最后联调时必须确定。

### 镜像加速器配置

云服务器一般不能直接连接docker hub等网站，需要国内镜像加速器，然而也不代表所有国内镜像加速器都可以使用。比方说阿里云服务器只能使用阿里云的镜像加速，而且是指定的阿里云的某个镜像加速服务，而不是阿里云所有镜像加速服务都可使用。下面给出配置方法：

#### 对于阿里云服务器

需要阿里云容器镜像服务（ACR）的镜像加速器地址，方法如下：

1. 登录阿里云控制台
首先，访问阿里云官网并登录到你的账户，进入控制台页面。

2. 进入容器镜像服务（ACR）控制台
在控制台首页，搜索“容器镜像服务”或“Container Registry”，点击进入。
或者，在控制台页面的“产品与服务”菜单中，找到“容器镜像服务”并点击。

3. 选择实例和获取加速器地址
进入ACR控制台后，选择你需要的实例（如果没有，请先创建一个）。
在实例详情页面，找到“镜像加速器”或“Registry Mirror”相关选项。
你会看到一个URL，格式通常为：https://<你的实例ID>.mirror.aliyuncs.com
其中<你的实例ID>是ACR实例的唯一标识符，通常可以在实例详情页找到。

4. 获取实例ID
在ACR控制台中，进入你的实例详情页。
查找“实例名称”或“实例ID”，它通常是一个字符串，如abc123。
完整的加速器地址就是：https://abc123.mirror.aliyuncs.com（将abc123替换为你的实际实例ID）。

5. 配置到 Docker
编辑 /etc/docker/daemon.json 文件（如果没有，请创建）。
添加如下内容，注意替换你的实例ID为实际值：

```json
{
  "registry-mirrors": ["https://你的实例ID.mirror.aliyuncs.com"]
}
```

6. 重启 Docker 服务
保存文件后，运行以下命令使配置生效：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

7. 验证配置
使用以下命令检查配置是否生效：

```bash
docker info
```

在输出中，你应该看到Registry Mirrors部分包含了你刚添加的地址。

8. 配置.env文件
在.env文件中，找到`DOCKER_REGISTRY_MIRROR`这一项，修改值为刚添加的地址；若没找到则添加以下一行

```txt
DOCKER_REGISTRY_MIRROR=刚刚找到的地址
```
