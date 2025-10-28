const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs').promises;

// 从 backend 的 application.properties 读取配置
function parseProperties(content) {
    const lines = content.split(/\r?\n/);
    const props = {};
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        props[key] = val;
    }
    return props;
}

function resolvePlaceholders(val) {
    return val.replace(/\$\{([^:}]+)(?::([^}]*))?\}/g, (_, envName, def) => {
        if (process.env[envName] !== undefined) return process.env[envName];
        if (def !== undefined) return def;
        return '';
    });
}

async function readApplicationProperties() {
    const propsPath = path.resolve(process.cwd(), '../..', 'backend', 'MyCampus', 'src', 'main', 'resources', 'application.properties');
    try {
        const content = await fs.readFile(propsPath, 'utf8');
        const props = parseProperties(content);
        for (const k of Object.keys(props)) {
            props[k] = resolvePlaceholders(props[k]);
        }
        return props;
    } catch (error) {
        console.warn('⚠️  无法读取 application.properties，使用默认配置');
        return {};
    }
}

async function cleanupIndexes() {
    try {
        // 连接数据库
        const props = await readApplicationProperties();
        const mongoUri = props['spring.data.mongodb.uri'] || process.env.MONGODB_URI || 'mongodb://localhost:27017/mycampus';
        
        console.log('🔗 连接到 MongoDB:', mongoUri);
        await mongoose.connect(mongoUri);
        console.log('✅ 数据库连接成功\n');
        
        const db = mongoose.connection.db;
        const collection = db.collection('tb_user');
        
        // 获取所有索引
        const indexes = await collection.indexes();
        console.log('📋 当前所有索引:');
        indexes.forEach(idx => {
            console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
        });
        
        console.log('\n🧹 开始清理索引...\n');
        
        // 删除所有索引(除了 _id)
        for (const idx of indexes) {
            if (idx.name === '_id_') {
                console.log(`  ⏭️  跳过系统索引: ${idx.name}`);
                continue;
            }
            
            try {
                await collection.dropIndex(idx.name);
                console.log(`  ✓ 已删除索引: ${idx.name}`);
            } catch (error) {
                console.error(`  ✗ 删除索引失败 ${idx.name}:`, error.message);
            }
        }
        
        console.log('\n✅ 索引清理完成!');
        console.log('\n💡 提示: 重启后端应用后,Spring Boot 会自动创建正确的索引。');
        
    } catch (error) {
        console.error('❌ 错误:', error.message);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 数据库连接已关闭');
    }
}

cleanupIndexes().catch(() => {
    process.exit(1);
});
