# 使用官方的 OpenJDK 17 基础镜像
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 安装必要的工具
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 复制 Maven 包装器文件
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# 复制 pom.xml 文件和Maven配置
COPY pom.xml .
COPY settings.xml /root/.m2/settings.xml

# 设置 Maven 包装器权限并下载依赖项
RUN chmod +x ./mvnw && \
    ./mvnw dependency:go-offline -B --no-transfer-progress -s /root/.m2/settings.xml

# 复制源代码
COPY src src

# 构建应用程序
RUN ./mvnw clean package -DskipTests --no-transfer-progress -s /root/.m2/settings.xml

# 创建日志目录
RUN mkdir -p /app/logs

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# 运行应用程序
CMD ["java", "-jar", "-Dspring.profiles.active=docker", "target/MyCampus-0.0.1-SNAPSHOT.jar"]