#!/bin/bash

# MyCampus 完整环境管理脚本
# 包含环境检查、故障排除和部署功能

# 解析命令行参数
ACTION=${1:-check}  # 默认为检查模式

case "$ACTION" in
    "check")
        MODE="check"
        echo "🔍 MyCampus 环境检查模式..."
        ;;
    "troubleshoot"|"debug")
        MODE="troubleshoot"
        echo "🔍 MyCampus 故障排除模式..."
        ;;
    "deploy")
        MODE="deploy"
        echo "🚀 MyCampus 部署模式..."
        ;;
    "--help"|"-h"|"help")
        echo "MyCampus 环境管理脚本"
        echo ""
        echo "用法: $0 [模式]"
        echo ""
        echo "模式:"
        echo "  check         环境检查 (默认)"
        echo "  troubleshoot  故障排除和详细诊断"
        echo "  deploy        执行部署"
        echo "  help          显示此帮助信息"
        echo ""
        echo "示例:"
        echo "  $0                 # 环境检查"
        echo "  $0 check           # 环境检查"
        echo "  $0 troubleshoot    # 故障排除"
        echo "  $0 deploy          # 执行部署"
        exit 0
        ;;
    *)
        echo "❌ 未知参数: $ACTION"
        echo "💡 使用 '$0 help' 查看帮助信息"
        exit 1
        ;;
esac

echo "🔍 开始执行: $MODE"

# 切换到项目根目录
cd "$(dirname "$0")/.."

# ========================
# 基础文件检查
# ========================
echo "📂 检查项目文件结构..."
required_files=(
    ".env"
    "docker-compose.yml"
    "backend/MyCampus/Dockerfile"
    "backend/MyCampus/pom.xml"
    "mongo-init/init-mongo.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (缺失)"
        exit 1
    fi
done

# ========================
# 环境变量检查
# ========================
echo ""
echo "🔧 检查环境变量..."

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "❌ .env 文件不存在"
    echo "💡 请运行: cp .env.example .env"
    exit 1
fi

# 读取 .env 文件
source .env

# 验证环境变量值不包含问题字符
validate_env_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo "   ❌ 环境变量 $var_name 为空"
        return 1
    fi
    
    # 检查是否包含可能导致Docker问题的字符
    if [[ "$var_value" =~ [[:space:]] ]]; then
        echo "   ⚠️  警告: $var_name 包含空格字符"
    fi
    
    if [[ "$var_value" =~ [\$\`\"] ]]; then
        echo "   ⚠️  警告: $var_name 包含特殊字符，可能导致问题"
    fi
    
    # 对于密码字段，隐藏实际值
    if [[ "$var_name" =~ PASSWORD ]]; then
        echo "   ✅ $var_name: [已设置]"
    else
        echo "   ✅ $var_name: $var_value"
    fi
    return 0
}

# 检查必需的环境变量
required_vars=(
    "MONGO_INITDB_ROOT_USERNAME"
    "MONGO_INITDB_ROOT_PASSWORD"
    "MONGO_INITDB_DATABASE"
    "MYCAMPUS_DB_USER"
    "MYCAMPUS_DB_PASSWORD"
    "APP_PORT"
    "MONGODB_PORT"
    "SPRING_PROFILES_ACTIVE"
    "SERVER_PORT"
    "DOCKER_REGISTRY_MIRROR"
    "COMPOSE_PROJECT_NAME"
)

missing_vars=()

echo "   📋 验证必需环境变量..."
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
        echo "   ❌ $var 未设置"
    else
        validate_env_var "$var"
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ 缺少以下必需的环境变量:"
    printf "   - %s\n" "${missing_vars[@]}"
    echo "💡 请在 .env 文件中设置这些变量"
    exit 1
fi

# 验证端口号格式
echo "   📋 验证端口号格式..."
if ! [[ "$APP_PORT" =~ ^[0-9]+$ ]] || [ "$APP_PORT" -lt 1 ] || [ "$APP_PORT" -gt 65535 ]; then
    echo "   ❌ APP_PORT 格式无效: $APP_PORT"
    exit 1
else
    echo "   ✅ APP_PORT 格式正确: $APP_PORT"
fi

if ! [[ "$MONGODB_PORT" =~ ^[0-9]+$ ]] || [ "$MONGODB_PORT" -lt 1 ] || [ "$MONGODB_PORT" -gt 65535 ]; then
    echo "   ❌ MONGODB_PORT 格式无效: $MONGODB_PORT"
    exit 1
else
    echo "   ✅ MONGODB_PORT 格式正确: $MONGODB_PORT"
fi

# 检查默认密码
if [ "$MONGO_INITDB_ROOT_PASSWORD" = "password123" ] || [ "$MYCAMPUS_DB_PASSWORD" = "mycampus_password" ]; then
    echo "   ⚠️  警告: 检测到默认密码，建议在生产环境中修改"
fi

# ========================
# 端口占用检查
# ========================
echo ""
echo "🌐 检查端口占用..."

check_port() {
    local port=$1
    if command -v lsof &> /dev/null; then
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "   ❌ 端口 $port 已被占用"
            lsof -Pi :$port -sTCP:LISTEN | head -3
            return 1
        else
            echo "   ✅ 端口 $port 可用"
            return 0
        fi
    elif command -v netstat &> /dev/null; then
        if netstat -ln | grep ":$port " >/dev/null 2>&1; then
            echo "   ❌ 端口 $port 已被占用"
            return 1
        else
            echo "   ✅ 端口 $port 可用"
            return 0
        fi
    else
        echo "   ⚠️  无法检查端口 $port (缺少 lsof 或 netstat)"
        return 0
    fi
}

port_issues=0
if ! check_port $MONGODB_PORT; then
    port_issues=1
fi
if ! check_port $APP_PORT; then
    port_issues=1
fi

# ========================
# Docker 环境检查
# ========================
echo ""
echo "🐳 检查Docker环境..."

if ! command -v docker &> /dev/null; then
    echo "   ❌ Docker 未安装"
    echo "   💡 请安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    if command -v docker &> /dev/null && docker compose version &> /dev/null; then
        echo "   ✅ 使用 Docker Compose V2 (docker compose)"
        # 创建一个临时的 docker-compose 别名函数
        docker-compose() { docker compose "$@"; }
        export -f docker-compose
    else
        echo "   ❌ Docker Compose 未安装"
        echo "   💡 请安装 Docker Compose 或使用 Docker Desktop"
        exit 1
    fi
else
    echo "   ✅ Docker Compose 版本: $(docker-compose --version)"
fi

echo "   ✅ Docker 版本: $(docker --version)"

# 检查Docker服务状态
if docker ps &> /dev/null; then
    echo "   ✅ Docker 服务运行正常"
    
    # 显示相关容器
    if docker ps -a --filter name=mycampus --format "table {{.Names}}" | grep -q mycampus; then
        echo "   📋 现有MyCampus容器:"
        docker ps -a --filter name=mycampus --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    fi
else
    echo "   ❌ Docker 服务未运行，请启动 Docker"
    exit 1
fi

# 验证 docker-compose.yml 语法
echo "   📋 验证 docker-compose.yml 语法..."
if docker-compose config &> /dev/null; then
    echo "   ✅ docker-compose.yml 语法正确"
else
    echo "   ❌ docker-compose.yml 语法错误"
    echo "   💡 错误详情:"
    docker-compose config 2>&1 | head -5
    exit 1
fi

# ========================
# 系统资源检查
# ========================
echo ""
echo "💾 检查系统资源..."

# 检查磁盘空间
if command -v df &> /dev/null; then
    echo "   📋 磁盘空间:"
    df -h . | head -2 | sed 's/^/      /'
    
    # 检查可用空间是否充足（至少需要2GB）
    available_space=$(df . | tail -1 | awk '{print $4}')
    if [ "$available_space" -lt 2097152 ]; then # 2GB in KB
        echo "   ⚠️  警告: 磁盘空间可能不足，建议至少保留2GB空间"
    fi
else
    echo "   ⚠️  无法检查磁盘空间"
fi

# 检查内存
if command -v free &> /dev/null; then
    echo "   📋 内存使用:"
    free -h | head -2 | sed 's/^/      /'
elif command -v vm_stat &> /dev/null; then
    echo "   📋 内存状态: $(vm_stat | head -1)"
fi

# ========================
# 最终检查结果
# ========================
echo ""
if [ $port_issues -eq 1 ]; then
    echo "⚠️  警告: 检测到端口占用问题"
    echo "💡 建议: 停止占用端口的服务或修改配置文件中的端口号"
fi

echo "✅ 环境变量配置检查完成"
echo "📋 配置摘要:"
echo "   项目目录: $(basename $(pwd))"
echo "   MongoDB 用户: $MONGO_INITDB_ROOT_USERNAME"
echo "   数据库名称: $MONGO_INITDB_DATABASE"
echo "   应用端口: $APP_PORT"
echo "   MongoDB 端口: $MONGODB_PORT"
echo "   Spring Profile: $SPRING_PROFILES_ACTIVE"

# ========================
# 故障排除模式的额外功能
# ========================
if [ "$MODE" = "troubleshoot" ]; then
    echo ""
    echo "🔍 详细系统信息:"
    echo "   操作系统: $(uname -a)"
    echo "   当前用户: $(whoami)"
    echo "   当前时间: $(date)"
    echo "   Shell: $SHELL"
    
    # 检查Docker详细状态
    echo ""
    echo "Docker 详细状态:"
    if docker info &> /dev/null; then
        echo "   ✅ Docker Info 可访问"
        docker info | grep -E "(Server Version|Storage Driver|Logging Driver|Cgroup Version|Kernel Version)" | sed 's/^/      /'
    fi
    
    # 显示Docker镜像
    echo ""
    echo "🖼️  相关Docker镜像:"
    docker images | head -1
    docker images | grep -E "(mycampus|mongo|openjdk)" | sed 's/^/   /' || echo "   无相关镜像"
    
    # 显示Docker网络
    echo ""
    echo "🌐 Docker网络:"
    docker network ls | head -1
    docker network ls | grep mycampus | sed 's/^/   /' || echo "   无MyCampus网络"
    
    # 检查最近的Docker事件
    echo ""
    echo "📋 最近的Docker事件 (最后10条):"
    timeout 3 docker events --since 10m --until now 2>/dev/null | tail -10 | sed 's/^/   /' || echo "   无法获取Docker事件"
fi

# ========================
# 应用日志检查 (故障排除模式)
# ========================
if [ "$MODE" = "troubleshoot" ]; then
    echo ""
    echo "📋 应用日志检查:"
    
    # 检查应用日志文件
    if [ -f logs/mycampus.log ]; then
        echo "   ✅ 找到应用日志文件"
        echo "   📄 最近的应用日志 (最后15行):"
        tail -15 logs/mycampus.log | sed 's/^/      /'
    else
        echo "   ⚠️  应用日志文件不存在: logs/mycampus.log"
    fi
    
    # 检查Docker容器日志
    if docker ps -a --filter name=mycampus-app --format "{{.Names}}" | grep -q mycampus-app; then
        echo ""
        echo "   📄 容器日志 (最后10行):"
        docker logs --tail 10 mycampus-app 2>/dev/null | sed 's/^/      /' || echo "      无法获取容器日志"
    fi
fi

# ========================
# 最终结果和建议
# ========================
echo ""
if [ $port_issues -eq 1 ]; then
    echo "⚠️  警告: 检测到端口占用问题"
    echo "💡 建议: 停止占用端口的服务或修改配置文件中的端口号"
fi

echo "✅ 环境检查完成"
echo "📋 配置摘要:"
echo "   项目目录: $(basename $(pwd))"
echo "   MongoDB 用户: $MONGO_INITDB_ROOT_USERNAME"
echo "   数据库名称: $MONGO_INITDB_DATABASE"
echo "   应用端口: $APP_PORT"
echo "   MongoDB 端口: $MONGODB_PORT"
echo "   Spring Profile: $SPRING_PROFILES_ACTIVE"

echo ""
if [ "$MODE" = "troubleshoot" ]; then
    echo "故障排除建议:"
    echo "   1. 确保所有必需文件存在且格式正确"
    echo "   2. 检查环境变量配置，特别是密码设置"
    echo "   3. 确保端口 8080 和 27017 未被占用"
    echo "   4. 确保Docker服务正在运行"
    echo "   5. 检查磁盘空间是否充足"
    echo "   6. 查看详细日志: docker-compose logs"
    echo ""
    echo "🔧 推荐操作:"
    echo "   1. 尝试部署: $0 deploy"
    echo "   2. 查看容器状态: docker-compose ps"
    echo "   3. 重建镜像: docker-compose build --no-cache"
elif [ $port_issues -eq 0 ]; then
    echo "💡 部署建议:"
    echo "   ✅ 环境检查通过，可以开始部署"
    echo "   🚀 执行部署: $0 deploy"
    echo "   🔧 故障排除: $0 troubleshoot"
else
    echo "💡 部署建议:"
    echo "   ⚠️  请先解决端口占用问题后再部署"
    echo "   🔧 故障排除: $0 troubleshoot"
fi

# ========================
# 部署功能
# ========================
if [ "$MODE" = "deploy" ]; then
    echo ""
    echo "🚀 开始部署流程..."
    
    # 如果环境检查失败，不继续部署
    if [ $port_issues -eq 1 ]; then
        echo "❌ 环境检查发现问题，请先解决后再部署"
        exit 1
    fi
    
    # 停止并清理现有容器
    echo "🛑 停止现有服务..."
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # 清理相关镜像
    echo "🧹 清理相关镜像..."
    docker images | grep mycampus | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true
    
    # 清理Docker系统
    echo "🗑️  清理Docker系统..."
    docker system prune -f
    
    # 使用明确的项目名称构建
    echo "🔨 设置项目名称..."
    export COMPOSE_PROJECT_NAME=mycampus
    
    # 分步构建以便调试
    echo "🏗️  构建应用镜像..."
    if ! docker-compose build mycampus-app; then
        echo "❌ 应用镜像构建失败"
        exit 1
    fi
    
    echo "🏗️  启动MongoDB..."
    if ! docker-compose up -d mongodb; then
        echo "❌ MongoDB启动失败"
        exit 1
    fi
    
    echo "⏳ 等待MongoDB启动..."
    sleep 10
    
    echo "🏗️  启动应用..."
    if ! docker-compose up -d mycampus-app; then
        echo "❌ 应用启动失败"
        echo "💡 查看日志: docker-compose logs mycampus-app"
        exit 1
    fi
    
    echo "📋 检查容器状态..."
    docker-compose ps
    
    echo "🩺 检查应用健康状态..."
    
    # 检查端口是否可访问 (更可靠的方法)
    for i in {1..12}; do
        if nc -z localhost ${APP_PORT:-8080} 2>/dev/null; then
            echo "✅ 应用端口可访问！"
            break
        else
            echo "⏳ 等待应用启动... ($i/12)"
            sleep 5
        fi
    done
    
    # 进一步验证应用状态
    if nc -z localhost ${APP_PORT:-8080} 2>/dev/null; then
        echo "📡 测试HTTP连接..."
        
        # 测试多个可能的端点
        health_status="未知"
        for endpoint in "/" "/actuator/health" "/health" "/api"; do
            http_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${APP_PORT:-8080}$endpoint" 2>/dev/null || echo "000")
            if [[ "$http_code" =~ ^(200|302|404)$ ]]; then
                health_status="正常"
                break
            fi
        done
        
        if [ "$health_status" = "正常" ]; then
            echo "✅ 应用启动成功！"
            echo "🌐 访问地址: http://localhost:${APP_PORT:-8080}"
            echo "🍃 MongoDB 访问端口: ${MONGODB_PORT:-27017}"
            echo "📋 查看日志: docker-compose logs -f"
            echo "🔍 部署验证: ./scripts/verify-deployment.sh"
            echo ""
            echo "✨ 部署完成！"
            exit 0
        else
            echo "⚠️  端口可访问但HTTP响应异常"
        fi
    else
        echo "❌ 应用端口不可访问"
    fi
    
    echo ""
    echo "⚠️  应用状态检查完成，请查看详细日志:"
    docker-compose logs --tail=50 mycampus-app
    
    echo ""
    echo "💡 故障排除提示:"
    echo "   1. 运行验证脚本: ./scripts/verify-deployment.sh"
    echo "   2. 运行故障排除: $0 troubleshoot"
    echo "   3. 查看详细日志: docker-compose logs -f"
    echo "   4. 检查端口占用: lsof -i :8080"
    exit 0
fi