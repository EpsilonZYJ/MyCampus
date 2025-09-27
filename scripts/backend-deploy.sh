#!/bin/bash

# MyCampus 部署脚本 - 兼容性包装器
# 此脚本现在调用集成的环境管理脚本

set -e

echo "🚀 MyCampus 部署脚本"

# 切换到项目根目录
cd "$(dirname "$0")/.."

# 使用集成的环境检查和部署功能
if [ -f scripts/backend-check-env.sh ]; then
    echo "� 使用集成的环境管理脚本进行部署..."
    ./scripts/backend-check-env.sh deploy
    exit $?
else
    echo "❌ 错误: 找不到环境管理脚本 scripts/backend-check-env.sh"
    echo "� 请确保项目文件完整"
    exit 1
fi