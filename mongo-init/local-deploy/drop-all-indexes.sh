#!/bin/bash

echo "🧹 删除 tb_user 集合的所有索引(保留 _id)"
echo "======================================"

mongosh --quiet --eval "
use mycampus;

print('📋 当前索引:');
db.tb_user.getIndexes().forEach(idx => {
    print('  - ' + idx.name);
});

print('');
print('🗑️  开始删除索引...');

// 删除所有非 _id 索引
const result = db.tb_user.dropIndexes();
print('');
if (result.ok) {
    print('✅ 索引删除成功!');
} else {
    print('❌ 删除失败:', result);
}

print('');
print('📋 剩余索引:');
db.tb_user.getIndexes().forEach(idx => {
    print('  - ' + idx.name);
});
"

echo ""
echo "======================================"
echo "✨ 完成! 现在可以重启后端应用了。"
