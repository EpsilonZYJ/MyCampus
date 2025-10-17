#!/bin/bash

# 生成测试用的占位图片
# 需要安装 ImageMagick: brew install imagemagick

set -e

echo "🖼️  生成测试菜品图片..."
echo "===================================="

# 检查 ImageMagick
if ! command -v convert &> /dev/null; then
    echo "❌ 未找到 ImageMagick"
    echo "   请先安装: brew install imagemagick"
    exit 1
fi

cd "$(dirname "$0")"

# 创建 imgs 目录（如果不存在）
mkdir -p imgs

# 定义菜品信息（文件名|菜品名|颜色）
dishes=(
    "gongbao_chicken.jpg|宫保鸡丁|#D2691E"
    "hongshao_pork.jpg|红烧肉|#8B4513"
    "mapo_tofu.jpg|麻婆豆腐|#FF6347"
    "yuxiang_pork.jpg|鱼香肉丝|#CD853F"
    "huangmen_chicken.jpg|黄焖鸡米饭|#DAA520"
)

# 生成图片
for dish_info in "${dishes[@]}"; do
    IFS='|' read -r filename name color <<< "$dish_info"
    
    if [ -f "imgs/$filename" ]; then
        echo "⏭️  跳过已存在: $filename"
        continue
    fi
    
    echo "✨ 生成: $filename ($name)"
    
    # 创建 800x600 的渐变图片，带文字
    convert -size 800x600 \
        -define gradient:angle=135 \
        gradient:"${color}"-white \
        -gravity center \
        -font Arial \
        -pointsize 72 \
        -fill white \
        -stroke black \
        -strokewidth 2 \
        -annotate +0+0 "$name" \
        -quality 85 \
        "imgs/$filename"
    
    echo "  ✓ 已保存 ($(du -h "imgs/$filename" | cut -f1))"
done

echo ""
echo "===================================="
echo "✅ 图片生成完成！"
echo ""
echo "📁 图片位置: imgs/"
echo "🔍 查看图片:"
ls -lh imgs/*.jpg 2>/dev/null || echo "   (没有生成图片)"
echo ""
echo "💡 提示: 你可以替换这些占位图片为真实的菜品图片"
echo "===================================="
