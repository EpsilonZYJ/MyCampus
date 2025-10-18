const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// 导入模型
const User = require('../models/User');
const Dish = require('../models/Dish');

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
    const propsPath = path.resolve(process.cwd(), 'backend', 'MyCampus', 'src', 'main', 'resources', 'application.properties');
    const propsPath2 = path.resolve(process.cwd(), '../..', 'backend', 'MyCampus', 'src', 'main', 'resources', 'application.properties');
    try {
        const content = await fs.readFile(propsPath, 'utf8');
        const props = parseProperties(content);
        for (const k of Object.keys(props)) {
            props[k] = resolvePlaceholders(props[k]);
        }
        return props;
    } catch (error) {
        try {
        const content = await fs.readFile(propsPath2, 'utf8');
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
}

async function clearDatabase() {
    let connection = null;
    
    try {
        console.log('🗑️  MyCampus 数据库清空工具');
        console.log('=====================================\n');
        
        // 获取 MongoDB 连接
        const props = await readApplicationProperties();
        const mongoUri = props['spring.data.mongodb.uri'] || process.env.MONGODB_URI || 'mongodb://localhost:27017/mycampus';
        
        console.log('🔗 连接到 MongoDB:', mongoUri);
        connection = await mongoose.connect(mongoUri);
        console.log('✅ 数据库连接成功\n');
        
        // 统计现有数据
        const userCount = await User.countDocuments();
        const dishCount = await Dish.countDocuments();
        
        console.log('📊 当前数据统计:');
        console.log(`   👥 用户: ${userCount} 个`);
        console.log(`   🍽️  菜品: ${dishCount} 个\n`);
        
        if (userCount === 0 && dishCount === 0) {
            console.log('ℹ️  数据库已经是空的，无需清空');
            return;
        }
        
        // 确认清空
        console.log('⚠️  警告：此操作将删除所有用户和菜品数据！');
        console.log('⚠️  此操作不可撤销！\n');
        
        // 开始清空
        console.log('🗑️  开始清空数据...');
        
        await User.deleteMany({});
        console.log('   ✓ 用户数据已清空');
        
        await Dish.deleteMany({});
        console.log('   ✓ 菜品数据已清空');
        
        console.log('\n✅ 数据库清空完成！');
        console.log('=====================================');
        console.log(`已删除: ${userCount} 个用户, ${dishCount} 个菜品\n`);
        
    } catch (error) {
        console.error('\n💥 清空失败:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        if (connection) {
            await mongoose.connection.close();
            console.log('🔌 数据库连接已关闭');
        }
    }
}

// 执行清空
clearDatabase().catch(() => {
    process.exit(1);
});
