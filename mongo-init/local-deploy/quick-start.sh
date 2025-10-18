#!/bin/bash

# MyCampus MongoDB 快速初始化脚本
# 用途：一键检查环境、安装依赖、初始化数据库

set -e  # 遇到错误立即退出

echo "🚀 MyCampus MongoDB 初始化工具"
echo "===================================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js (https://nodejs.org/)"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查 MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  未找到 MongoDB，请确保 MongoDB 已安装并正在运行"
    echo "   macOS: brew install mongodb-community"
    echo "   启动: brew services start mongodb-community"
else
    echo "✅ MongoDB 已安装"
fi

# 进入脚本目录
cd "$(dirname "$0")"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 安装依赖包..."
    npm install
else
    echo "✅ 依赖包已安装"
fi

echo ""
echo "===================================="
echo "选择初始化模式："
echo "  1. 普通初始化（保留现有数据）"
echo "  2. 清空重建（删除所有现有数据）"
echo "  3. 退出"
echo "===================================="
read -p "请输入选项 (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "📝 开始普通初始化..."
        npm run init
        ;;
    2)
        echo ""
        echo "⚠️  警告：将删除所有现有数据！"
        read -p "确认继续？(yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo "🗑️  开始清空重建..."
            npm run init:clear
        else
            echo "❌ 已取消操作"
            exit 0
        fi
        ;;
    3)
        echo "👋 退出"
        exit 0
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "===================================="
echo "✨ 初始化完成！"
echo "===================================="
