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
    const propsPath = path.resolve(process.cwd(),'backend', 'MyCampus', 'src', 'main', 'resources', 'application.properties');
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

class DatabaseInitializer {
    constructor(dataFilePath) {
        this.dataFilePath = dataFilePath;
        this.data = null;
        this.mongoUri = null;
        this.stats = {
            usersCreated: 0,
            dishesCreated: 0,
            errors: []
        };
    }

    // 加载JSON数据
    async loadData() {
        try {
            const jsonData = await fs.readFile(this.dataFilePath, 'utf8');
            this.data = JSON.parse(jsonData);
            console.log('✅ 数据文件加载成功');
        } catch (error) {
            console.error('❌ 数据文件加载失败:', error.message);
            throw error;
        }
    }

    // 连接数据库
    async connectDatabase() {
        try {
            // 从 application.properties 读取配置
            const props = await readApplicationProperties();
            this.mongoUri = props['spring.data.mongodb.uri'] || process.env.MONGODB_URI || 'mongodb://localhost:27017/mycampus';
            
            console.log('🔗 连接到 MongoDB:', this.mongoUri);
            
            await mongoose.connect(this.mongoUri);
            
            console.log('✅ 数据库连接成功');
        } catch (error) {
            console.error('❌ 数据库连接失败:', error.message);
            throw error;
        }
    }

    // 清空现有数据（可选）
    async clearExistingData() {
        try {
            const userCount = await User.countDocuments();
            const dishCount = await Dish.countDocuments();
            
            await User.deleteMany({});
            await Dish.deleteMany({});
            
            console.log(`✅ 现有数据已清空 (用户: ${userCount}, 菜品: ${dishCount})`);
        } catch (error) {
            console.error('❌ 清空数据失败:', error.message);
        }
    }

    // 清理旧索引
    async cleanupOldIndexes() {
        try {
            console.log('\n🧹 清理旧索引...');
            
            // 获取 User 集合的所有索引
            const userIndexes = await User.collection.getIndexes();
            console.log('  现有用户索引:', Object.keys(userIndexes).join(', '));
            
            // 删除所有旧的驼峰命名索引(如果存在)
            const oldIndexNames = [
                'userName', 'userName_1',      // 旧的用户名索引
                'studentId', 'studentId_1',    // 旧的学号索引
                'email_1'                       // 保留 email_1,因为模型中确实使用 email
            ];
            
            let cleanedCount = 0;
            for (const indexName of oldIndexNames) {
                // email_1 是正确的索引,跳过
                if (indexName === 'email_1') continue;
                
                if (userIndexes[indexName]) {
                    try {
                        await User.collection.dropIndex(indexName);
                        console.log(`  ✓ 已删除旧索引: ${indexName}`);
                        cleanedCount++;
                    } catch (dropError) {
                        console.warn(`  ⚠️  删除索引 ${indexName} 失败:`, dropError.message);
                    }
                }
            }
            
            if (cleanedCount > 0) {
                console.log(`✅ 旧索引清理完成 (删除 ${cleanedCount} 个)`);
            } else {
                console.log('✅ 未发现需要清理的旧索引');
            }
        } catch (error) {
            // 如果集合不存在或其他错误
            if (error.message.includes('ns not found') || error.message.includes('does not exist')) {
                console.log('  ℹ️  用户集合尚未创建,跳过索引清理');
            } else {
                console.warn('⚠️  清理索引时出现警告:', error.message);
            }
        }
    }

        // 创建用户数据
    async createUsers() {
        console.log('\n👥 开始创建用户数据...');
        
        for (const userData of this.data.users) {
            try {
                // 字段名映射: 将驼峰命名转换为下划线命名
                const mappedUserData = {
                    user_name: userData.userName || userData.user_name,
                    password: userData.password,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    student_id: userData.studentId || userData.student_id,
                    balance: userData.balance,
                    roles: userData.roles,
                    runnerProfile: userData.runnerProfile,
                    addresses: userData.addresses
                };

                // 检查用户是否已存在
                if (this.data.settings.skipExisting) {
                    const existing = await User.findOne({ 
                        $or: [
                            { user_name: mappedUserData.user_name },
                            { email: mappedUserData.email },
                            { student_id: mappedUserData.student_id }
                        ]
                    });
                    if (existing) {
                        console.log(`⏭️  跳过已存在的用户: ${mappedUserData.user_name}`);
                        continue;
                    }
                }

                // 处理 runnerProfile 中的 Decimal128 字段
                if (mappedUserData.runnerProfile && mappedUserData.runnerProfile.totalEarnings) {
                    mappedUserData.runnerProfile.totalEarnings = mongoose.Types.Decimal128.fromString(
                        mappedUserData.runnerProfile.totalEarnings.toString()
                    );
                }

                const user = new User(mappedUserData);
                await user.save();
                
                this.stats.usersCreated++;
                const roleStr = mappedUserData.roles ? mappedUserData.roles.join(', ') : 'ROLE_STUDENT';
                console.log(`✅ 用户创建成功: ${mappedUserData.user_name} (学号: ${mappedUserData.student_id}, 角色: ${roleStr})`);
                
            } catch (error) {
                const userName = userData.userName || userData.user_name || 'undefined';
                this.stats.errors.push(`用户创建失败 ${userName}: ${error.message}`);
                console.error(`❌ 用户创建失败 ${userName}: ${error.message}`);
            }
        }
    }

    

        // 创建菜品数据
    async createDishes() {
        console.log('\n🍽️  开始创建菜品数据...');
        
        for (const dishData of this.data.dishes) {
            try {
                // 检查菜品是否已存在
                if (this.data.settings.skipExisting) {
                    const existing = await Dish.findOne({ 
                        dish_name: dishData.dish_name,
                        restaurant: dishData.restaurant
                    });
                    if (existing) {
                        console.log(`⏭️  跳过已存在的菜品: ${dishData.dish_name} (${dishData.restaurant})`);
                        continue;
                    }
                }

                // 处理图片：从文件路径读取并转换为 Base64
                let imageData = null;
                let imageType = null;

                if (dishData.image_path) {
                    try {
                        // 解析相对路径，相对于 data 目录的父目录（即 local-deploy）
                        const imagePath = path.resolve(path.dirname(this.dataFilePath), '..', dishData.image_path);
                        
                        // 检查文件是否存在
                        await fs.access(imagePath);
                        
                        // 读取文件
                        const imageBuffer = await fs.readFile(imagePath);
                        
                        // 转换为 Base64
                        const base64Data = imageBuffer.toString('base64');
                        
                        // 获取文件扩展名作为图片类型
                        const ext = path.extname(imagePath).toLowerCase().slice(1);
                        imageType = ext === 'jpg' ? 'jpeg' : ext;
                        
                        // 构建完整的 Data URL 格式
                        imageData = `data:image/${imageType};base64,${base64Data}`;
                        
                        console.log(`  📷 图片加载成功: ${dishData.image_path} (${Math.round(imageBuffer.length / 1024)}KB)`);
                    } catch (imageError) {
                        console.warn(`  ⚠️  图片加载失败 ${dishData.image_path}: ${imageError.message}`);
                        console.warn(`  ℹ️  将使用占位图片`);
                        // 使用占位图片
                        imageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCXABmAAA==';
                        imageType = 'jpeg';
                    }
                } else if (dishData.image_data) {
                    // 如果直接提供了 image_data，则使用它
                    imageData = dishData.image_data;
                    imageType = dishData.image_type || 'jpeg';
                } else {
                    // 使用默认占位图片
                    imageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCXABmAAA==';
                    imageType = 'jpeg';
                }

                // 创建菜品文档
                const dishDoc = {
                    dish_name: dishData.dish_name,
                    restaurant: dishData.restaurant,
                    image_data: imageData,
                    image_type: imageType,
                    rating: dishData.rating,
                    price: dishData.price,
                    description: dishData.description,
                    category: dishData.category,
                    review_count: dishData.review_count,
                    isAvailable: dishData.isAvailable
                };

                const dish = new Dish(dishDoc);
                await dish.save();
                
                this.stats.dishesCreated++;
                console.log(`✅ 菜品创建成功: ${dishData.dish_name} - ${dishData.restaurant} (¥${dishData.price})`);
                
            } catch (error) {
                this.stats.errors.push(`菜品创建失败 ${dishData.dish_name}: ${error.message}`);
                console.error(`❌ 菜品创建失败 ${dishData.dish_name}: ${error.message}`);
            }
        }
    }

    // 创建数据库索引
    async createIndexes() {
        if (!this.data.settings.createIndexes) {
            console.log('⏭️  跳过索引创建（settings.createIndexes = false）');
            return;
        }
        
        try {
            console.log('\n🔍 开始创建数据库索引...');
            
            // 使用 syncIndexes 同步 Schema 中定义的所有索引
            // 这会自动处理索引的创建、更新和删除
            await User.syncIndexes();
            console.log('  ✓ 用户索引同步完成');
            
            await Dish.syncIndexes();
            console.log('  ✓ 菜品索引同步完成');
            
            console.log('✅ 数据库索引全部创建完成');
        } catch (error) {
            console.error('❌ 索引创建失败:', error.message);
            // 索引错误不应该导致整个初始化失败
            console.warn('⚠️  继续执行，索引可能需要手动修复');
        }
    }

        // 生成统计报告
    generateReport() {
        console.log('\n📊 初始化完成报告:');
        console.log('==========================================');
        console.log(`👥 用户创建: ${this.stats.usersCreated} 个`);
        console.log(`🍽️  菜品创建: ${this.stats.dishesCreated} 个`);
        
        if (this.stats.errors.length > 0) {
            console.log(`\n❌ 错误详情 (${this.stats.errors.length} 个):`);
            for (let i = 0; i < this.stats.errors.length; i++) {
                console.log(`  ${i + 1}. ${this.stats.errors[i]}`);
            }
        } else {
            console.log('\n✨ 没有错误！所有数据初始化成功。');
        }
        
        console.log('==========================================');
    }

        // 执行完整初始化流程
    async run(clearData = false) {
        try {
            console.log('🚀 MyCampus 数据库初始化工具');
            console.log('=====================================');
            
            await this.loadData();
            await this.connectDatabase();
            
            if (clearData) {
                console.log('\n⚠️  清空模式：将删除所有现有数据');
                await this.clearExistingData();
            }
            
            // 清理旧索引(每次都执行,确保索引正确)
            await this.cleanupOldIndexes();
            
            await this.createUsers();
            await this.createDishes();
            await this.createIndexes();
            
            this.generateReport();
            
            console.log('\n🎉 数据库初始化完成!');
            
        } catch (error) {
            console.error('\n💥 初始化失败:', error.message);
            console.error(error.stack);
            throw error;
        } finally {
            await mongoose.connection.close();
            console.log('🔌 数据库连接已关闭');
        }
    }
}

// 命令行参数处理
const args = process.argv.slice(2);
const clearData = args.includes('--clear');

// 过滤掉 --clear 参数，获取数据文件路径
const nonFlagArgs = args.filter(arg => !arg.startsWith('--'));
const dataFile = path.resolve(__dirname, '..', nonFlagArgs[0] || 'data/init-data.json');

console.log(`📁 数据文件: ${dataFile}`);
console.log(`🗑️  清空模式: ${clearData ? '是' : '否'}\n`);

// 执行初始化
const initializer = new DatabaseInitializer(dataFile);
initializer.run(clearData).catch(() => {
    process.exit(1);
});
