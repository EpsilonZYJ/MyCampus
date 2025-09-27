#!/bin/bash

# MyCampus 部署验证脚本

echo "🔍 MyCampus 部署验证..."
echo ""

# 基本信息
echo "📋 容器状态:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🌐 网络连通性测试:"

# 测试应用端口
if nc -z localhost 8080 2>/dev/null; then
    echo "✅ 应用端口 8080 可访问"
else
    echo "❌ 应用端口 8080 不可访问"
fi

# 测试MongoDB端口
if nc -z localhost 27017 2>/dev/null; then
    echo "✅ MongoDB 端口 27017 可访问"
else
    echo "❌ MongoDB 端口 27017 不可访问"
fi

echo ""
echo "🩺 应用健康检查:"

# 测试根路径
echo "测试根路径 (/):"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ | grep -q "200\|302\|404"; then
    echo "✅ 应用响应正常"
else
    echo "⚠️  应用可能还在启动中，请稍后再试"
fi

# 测试常见端点
echo ""
echo "📡 测试可用端点:"
for endpoint in "/" "/api" "/health" "/actuator/health"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080$endpoint" 2>/dev/null || echo "000")
    case $status in
        200) echo "✅ $endpoint - OK ($status)" ;;
        302) echo "✅ $endpoint - 重定向 ($status)" ;;
        404) echo "⚠️  $endpoint - 未找到 ($status)" ;;
        000) echo "❌ $endpoint - 无法连接" ;;
        *) echo "⚠️  $endpoint - 状态码: $status" ;;
    esac
done

echo ""
echo "📊 资源使用情况:"
echo "内存使用:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "📁 日志文件:"
if [ -f "logs/mycampus.log" ]; then
    echo "✅ 应用日志文件存在"
    echo "   最新日志大小: $(ls -lh logs/mycampus.log | awk '{print $5}')"
    echo "   最新日志时间: $(ls -l logs/mycampus.log | awk '{print $6, $7, $8}')"
else
    echo "⚠️  应用日志文件不存在"
fi

echo ""
echo "🎯 部署成功验证完成！"
echo ""
echo "💡 下一步操作:"
echo "   1. 访问应用: http://你的服务器IP:8080"
echo "   2. 查看详细日志: docker compose logs -f"
echo "   3. 监控资源: docker stats"
echo "   4. 停止服务: docker compose down"