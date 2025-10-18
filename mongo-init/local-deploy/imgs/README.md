# 菜品图片目录

此目录用于存放菜品图片文件。初始化脚本会读取这些图片，转换为 Base64 编码后存储到 MongoDB 数据库中。

## 使用方法

1. **添加图片文件**
   
   将菜品图片文件放入此目录，支持的格式：
   - `.jpg` / `.jpeg`
   - `.png`
   - `.gif`
   - `.webp`

2. **在 init-data.json 中引用**
   
   ```json
   {
       "dish_name": "宫保鸡丁",
       "restaurant": "百景园食堂",
       "image_path": "imgs/gongbao_chicken.jpg",
       ...
   }
   ```

3. **运行初始化脚本**
   
   ```bash
   npm run init
   ```

## 图片命名建议

使用有意义的文件名，例如：
- `gongbao_chicken.jpg` - 宫保鸡丁
- `hongshao_pork.jpg` - 红烧肉
- `mapo_tofu.jpg` - 麻婆豆腐
- `yuxiang_pork.jpg` - 鱼香肉丝
- `huangmen_chicken.jpg` - 黄焖鸡米饭

## 图片尺寸建议

- **推荐尺寸**: 800x600 像素
- **最大尺寸**: 1920x1440 像素
- **文件大小**: 建议小于 500KB（过大会增加数据库存储负担）

## 图片优化

在添加图片前，建议进行压缩优化：

### macOS 使用 ImageMagick

```bash
# 安装
brew install imagemagick

# 批量压缩当前目录所有 jpg 图片
for img in *.jpg; do
    convert "$img" -resize 800x600 -quality 85 "optimized_$img"
done
```

### 在线工具

- [TinyPNG](https://tinypng.com/) - PNG/JPG 压缩
- [Squoosh](https://squoosh.app/) - 谷歌出品的图片压缩工具

## 注意事项

⚠️ **重要提示**：
- 图片会被转换为 Base64 编码存储在 MongoDB 中
- Base64 编码会使文件大小增加约 33%
- 建议图片文件不要过大，以免影响数据库性能
- 如果图片文件不存在，脚本会使用占位图片

## 示例

当前目录需要包含以下图片文件（根据 init-data.json）：

```
imgs/
├── gongbao_chicken.jpg     # 宫保鸡丁
├── hongshao_pork.jpg       # 红烧肉
├── mapo_tofu.jpg           # 麻婆豆腐
├── yuxiang_pork.jpg        # 鱼香肉丝
└── huangmen_chicken.jpg    # 黄焖鸡米饭
```

如果你没有真实图片，脚本会自动使用占位图片，不会影响初始化流程。
