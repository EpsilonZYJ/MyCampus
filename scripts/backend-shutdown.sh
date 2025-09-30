#!/bin/bash

# MyCampus 后端服务关闭脚本
# 独立脚本，无外部依赖

set -e

echo "🛑 MyCampus 后端服务关闭工具"
echo ""

# 获取脚本所在目录的父目录作为项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📂 项目目录: $PROJECT_ROOT"
echo ""

# ========================
# 1. 检查并停止Docker容器
# ========================
echo "🐳 检查Docker容器状态..."

# 检查docker-compose.yml文件是否存在
if [ -f "docker-compose.yml" ]; then
    echo "✅ 找到 docker-compose.yml 文件"
    
    # 检查是否有运行中的容器
    if command -v docker >/dev/null 2>&1; then
        if docker compose ps -q >/dev/null 2>&1; then
            running_containers=$(docker compose ps --services --filter "status=running" 2>/dev/null || echo "")
            
            if [ -n "$running_containers" ]; then
                echo "📋 发现运行中的容器:"
                docker compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || docker compose ps
                
                echo ""
                echo "🛑 正在优雅停止Docker服务..."
                if docker compose down; then
                    echo "✅ Docker服务已成功停止"
                else
                    echo "⚠️  优雅停止失败，尝试强制停止..."
                    docker compose kill 2>/dev/null || echo "❌ 强制停止也失败"
                fi
            else
                echo "ℹ️  没有发现运行中的Docker容器"
            fi
        else
            echo "ℹ️  Docker Compose项目未运行"
        fi
        
        # 显示停止后的状态
        echo ""
        echo "📊 当前容器状态:"
        docker compose ps 2>/dev/null || echo "   无容器运行"
        
    else
        echo "❌ Docker 命令未找到，请确保Docker已安装"
    fi
else
    echo "⚠️  未找到 docker-compose.yml 文件，跳过Docker容器检查"
fi

echo ""

# ========================
# 2. 检查并释放端口占用
# ========================
echo "🔍 检查端口占用情况..."

# 应用端口 8080
check_and_kill_port() {
    local port=$1
    local service_name=$2
    
    if command -v lsof >/dev/null 2>&1; then
        if lsof -ti:$port >/dev/null 2>&1; then
            echo "⚠️  端口 $port ($service_name) 仍被占用"
            echo "   占用进程信息:"
            lsof -i:$port | sed 's/^/      /'
            
            echo ""
            echo "   进程PID: $(lsof -ti:$port | tr '\n' ' ')"
            
            read -p "   是否强制关闭占用端口 $port 的进程？[y/N]: " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                if lsof -ti:$port | xargs kill -9 2>/dev/null; then
                    echo "   ✅ 已强制关闭端口 $port 占用进程"
                else
                    echo "   ❌ 关闭端口 $port 占用进程失败"
                fi
            else
                echo "   ℹ️  跳过关闭端口 $port 进程"
            fi
        else
            echo "✅ 端口 $port ($service_name) 已释放"
        fi
    else
        echo "⚠️  lsof 命令未找到，无法检查端口 $port 占用情况"
        
        # 尝试使用netstat
        if command -v netstat >/dev/null 2>&1; then
            if netstat -tlnp 2>/dev/null | grep ":$port " >/dev/null; then
                echo "   netstat显示端口 $port 被占用："
                netstat -tlnp | grep ":$port " | sed 's/^/      /'
            else
                echo "   ✅ netstat显示端口 $port 未被占用"
            fi
        elif command -v ss >/dev/null 2>&1; then
            if ss -tlnp 2>/dev/null | grep ":$port " >/dev/null; then
                echo "   ss显示端口 $port 被占用："
                ss -tlnp | grep ":$port " | sed 's/^/      /'
            else
                echo "   ✅ ss显示端口 $port 未被占用"
            fi
        fi
    fi
}

# 检查应用端口
check_and_kill_port "8080" "MyCampus应用"

echo ""

# 检查MongoDB端口
check_and_kill_port "27017" "MongoDB数据库"

echo ""

# ========================
# 3. 清理Java进程（可选）
# ========================
echo "☕ 检查相关Java进程..."

if command -v ps >/dev/null 2>&1; then
    java_processes=$(ps aux | grep -i mycampus | grep -v grep | grep java || echo "")
    
    if [ -n "$java_processes" ]; then
        echo "⚠️  发现MyCampus相关Java进程:"
        echo "$java_processes" | sed 's/^/   /'
        
        echo ""
        read -p "是否关闭这些Java进程？[y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # 获取进程ID并关闭
            pids=$(ps aux | grep -i mycampus | grep -v grep | grep java | awk '{print $2}')
            if [ -n "$pids" ]; then
                for pid in $pids; do
                    if kill "$pid" 2>/dev/null; then
                        echo "   ✅ 已关闭进程 PID: $pid"
                    else
                        echo "   ⚠️  关闭进程 PID: $pid 失败，尝试强制关闭..."
                        kill -9 "$pid" 2>/dev/null || echo "   ❌ 强制关闭进程 PID: $pid 失败"
                    fi
                done
            fi
        else
            echo "   ℹ️  跳过Java进程关闭"
        fi
    else
        echo "✅ 未发现MyCampus相关Java进程"
    fi
else
    echo "⚠️  ps 命令未找到，无法检查Java进程"
fi

echo ""

# ========================
# 4. 最终状态检查
# ========================
echo "🎯 最终状态检查..."

echo ""
echo "📊 端口状态:"
for port in 8080 27017; do
    if command -v nc >/dev/null 2>&1; then
        if nc -z localhost $port 2>/dev/null; then
            echo "   ❌ 端口 $port 仍在使用"
        else
            echo "   ✅ 端口 $port 已释放"
        fi
    elif command -v telnet >/dev/null 2>&1; then
        if timeout 1 telnet localhost $port >/dev/null 2>&1; then
            echo "   ❌ 端口 $port 仍在使用"
        else
            echo "   ✅ 端口 $port 已释放"
        fi
    else
        echo "   ⚠️  无法检查端口 $port (缺少nc或telnet命令)"
    fi
done

echo ""
echo "🐳 Docker容器状态:"
if command -v docker >/dev/null 2>&1 && [ -f "docker-compose.yml" ]; then
    if docker compose ps -q >/dev/null 2>&1; then
        containers=$(docker compose ps --format "{{.Service}} {{.Status}}" 2>/dev/null | grep -v "exited" || echo "")
        if [ -n "$containers" ]; then
            echo "   ⚠️  仍有容器在运行:"
            echo "$containers" | sed 's/^/      /'
        else
            echo "   ✅ 所有容器已停止"
        fi
    else
        echo "   ✅ 所有容器已停止"
    fi
else
    echo "   ℹ️  无法检查Docker状态"
fi

echo ""
echo "✨ MyCampus 后端服务关闭完成！"
echo ""
echo "💡 常用操作提示:"
echo "   🔄 重新启动服务:"
if [ -f "scripts/backend-check-env.sh" ]; then
    echo "      ./scripts/backend-check-env.sh deploy"
else
    echo "      docker compose up -d"
fi
echo "   📋 查看服务状态:"
if [ -f "scripts/verify-deployment.sh" ]; then
    echo "      ./scripts/verify-deployment.sh"
else
    echo "      docker compose ps"
fi
echo "   🧹 清理Docker资源:"
echo "      docker system prune -f"
echo "   📁 查看日志:"
echo "      docker compose logs"