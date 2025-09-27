#!/bin/bash

# MyCampus 部署脚本

set -e

echo "🚀 开始部署 MyCampus 应用..."

# 切换到项目根目录
cd "$(dirname "$0")/.."

# 检查环境变量配置
if [ -f scripts/backend-check-env.sh ]; then
    ./scripts/backend-check-env.sh
    if [ $? -ne 0 ]; then
        echo "❌ 环境变量检查失败，请修复后重试"
        exit 1
    fi
else
    # 检查 .env 文件是否存在
    if [ ! -f .env ]; then
        echo "⚠️  .env 文件不存在，正在从模板创建..."
        if [ -f .env.example ]; then
            cp .env.example .env
            echo "✅ 已从 .env.example 创建 .env 文件"
            echo "⚠️  请编辑 .env 文件并设置安全的密码"
            echo "📝 编辑命令: nano .env"
            read -p "按 Enter 继续部署，或按 Ctrl+C 取消..."
        else
            echo "❌ 错误: .env.example 文件不存在，无法创建 .env 文件"
            exit 1
        fi
    fi
fi

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止现有服务
echo "🛑 停止现有服务..."
docker-compose down

# 清理旧的镜像（可选）
echo "🧹 清理旧镜像..."
docker system prune -f

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up --build -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 检查应用程序是否正常运行
echo "🩺 检查应用程序健康状态..."
for i in {1..30}; do
    if curl -f http://localhost:8080 &> /dev/null; then
        echo "✅ 应用程序启动成功！"
        echo "🌐 应用程序访问地址: http://localhost:8080"
        echo "🍃 MongoDB 访问端口: 27017"
        echo "📋 查看日志: docker-compose logs -f"
        break
    else
        echo "⏳ 等待应用程序启动... ($i/30)"
        sleep 5
    fi
done

if [ $i -eq 30 ]; then
    echo "⚠️  应用程序可能启动失败，请检查日志: docker-compose logs"
fi

echo "✨ 部署完成！"