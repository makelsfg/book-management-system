import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // 共用一个数据库,串行执行避免相互干扰
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
