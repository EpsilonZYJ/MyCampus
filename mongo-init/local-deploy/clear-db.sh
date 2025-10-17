#!/bin/bash

# MyCampus 数据库清空脚本
# 提供交互式确认的数据库清空功能

cd "$(dirname "$0")"

echo "🗑️  MyCampus 数据库清空工具"
echo "===================================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请访问 https://nodejs.org/ 下载安装"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 MongoDB
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  警告: 未检测到 MongoDB 客户端工具"
    echo "请确保 MongoDB 服务正在运行"
else
    echo "✅ MongoDB 客户端已安装"
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "⚠️  依赖包未安装"
    echo "正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

echo "✅ 依赖包已安装"
echo ""
echo "===================================="
echo "⚠️  警告：此操作将删除数据库中的所有数据！"
echo "⚠️  包括：所有用户、所有菜品"
echo "⚠️  此操作不可撤销！"
echo "===================================="
echo ""

# 第一次确认
read -p "确定要清空数据库吗？(yes/no): " confirm1

if [ "$confirm1" != "yes" ]; then
    echo "❌ 已取消操作"
    exit 0
fi

# 第二次确认
echo ""
read -p "再次确认：真的要删除所有数据吗？(YES/no): " confirm2

if [ "$confirm2" != "YES" ]; then
    echo "❌ 已取消操作"
    exit 0
fi

echo ""
echo "🗑️  开始清空数据库..."
echo ""

# 执行清空
npm run clear

if [ $? -eq 0 ]; then
    echo ""
    echo "===================================="
    echo "💡 提示："
    echo "   - 使用 ./quick-start.sh 重新初始化数据库"
    echo "   - 使用 npm run init 运行普通初始化"
    echo "===================================="
else
    echo ""
    echo "===================================="
    echo "💡 可能的原因："
    echo "   - MongoDB 服务未启动"
    echo "   - 数据库连接配置错误"
    echo "   - 网络连接问题"
    echo "===================================="
    exit 1
fi
