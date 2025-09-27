// MongoDB 初始化脚本
// 创建应用程序用户和数据库

// 切换到 mycampus 数据库
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'mycampus');

// 创建应用程序用户
db.createUser({
  user: process.env.MYCAMPUS_DB_USER || 'mycampus_user',
  pwd: process.env.MYCAMPUS_DB_PASSWORD || 'mycampus_password',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE || 'mycampus'
    }
  ]
});

// 创建示例集合和索引
db.createCollection('users');

// 为用户集合创建索引
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });


// 插入一些示例数据
db.users.insertOne({
  username: "admin",
  email: "admin@mycampus.com",
  role: "ADMIN",
  createdAt: new Date()
});

console.log("MongoDB initialization completed successfully!");