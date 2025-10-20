// 角色常量 - 单独导出避免 Fast Refresh 警告
export const ROLES = {
  STUDENT: 'ROLE_STUDENT',
  RUNNER: 'ROLE_RUNNER',
  ADMIN: 'ROLE_ADMIN',
};

// 模拟用户数据
export const MOCK_USERS = {
  ROLE_STUDENT: {
    id: '68f4a41f21766212095f1b0a',
    userName: '普通学生 (testuser)',
    roles: ['ROLE_STUDENT'],
  },
  ROLE_RUNNER: {
    id: '68f4a42421766212095f1b0b',
    userName: '跑腿员 (testrunner)',
    roles: ['ROLE_STUDENT', 'ROLE_RUNNER'],
  },
  ROLE_ADMIN: {
    id: '68f4a42921766212095f1b0c',
    userName: '管理员 (pendingrunner)',
    roles: ['ROLE_ADMIN'],
  },
};
