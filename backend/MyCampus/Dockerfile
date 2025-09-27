# 使用官方的 OpenJDK 17 基础镜像
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 复制 Maven 包装器文件
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# 复制 pom.xml 文件
COPY pom.xml .

# 下载依赖项（利用 Docker 层缓存）
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# 复制源代码
COPY src src

# 构建应用程序
RUN ./mvnw clean package -DskipTests

# 暴露端口
EXPOSE 8080

# 运行应用程序
CMD ["java", "-jar", "target/MyCampus-0.0.1-SNAPSHOT.jar"]