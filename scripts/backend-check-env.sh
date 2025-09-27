#!/bin/bash

# 环境变量检查脚本

echo "🔍 检查环境变量配置..."

# 切换到项目根目录
cd "$(dirname "$0")/.."

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "❌ .env 文件不存在"
    echo "💡 请运行: cp .env.example .env"
    exit 1
fi

# 读取 .env 文件
source .env

# 检查必需的环境变量
required_vars=(
    "MONGO_INITDB_ROOT_USERNAME"
    "MONGO_INITDB_ROOT_PASSWORD"
    "MONGO_INITDB_DATABASE"
    "MYCAMPUS_DB_USER"
    "MYCAMPUS_DB_PASSWORD"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ 缺少以下必需的环境变量:"
    printf "   - %s\n" "${missing_vars[@]}"
    echo "💡 请在 .env 文件中设置这些变量"
    exit 1
fi

# 检查默认密码
if [ "$MONGO_INITDB_ROOT_PASSWORD" = "password123" ] || [ "$MYCAMPUS_DB_PASSWORD" = "mycampus_password" ]; then
    echo "⚠️  警告: 检测到默认密码，建议在生产环境中修改"
fi

# 检查端口冲突
if lsof -Pi :$MONGODB_PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  警告: 端口 $MONGODB_PORT 已被占用"
fi

if lsof -Pi :$APP_PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  警告: 端口 $APP_PORT 已被占用"
fi

echo "✅ 环境变量配置检查完成"
echo "📋 配置摘要:"
echo "   MongoDB 用户: $MONGO_INITDB_ROOT_USERNAME"
echo "   数据库名称: $MONGO_INITDB_DATABASE"
echo "   应用端口: $APP_PORT"
echo "   MongoDB 端口: $MONGODB_PORT"