import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('认证接口 /api/auth', () => {
  it('未登录访问图书接口应返回 401', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(401);
  });

  it('正确账号密码可登录,并返回用户信息', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(0);
    expect(res.body.data.username).toBe('admin');
    expect(res.body.data.realName).toBe('系统管理员');
  });

  it('错误密码登录失败返回 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('缺少参数登录返回 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: '' });
    expect(res.status).toBe(400);
  });

  it('未登录访问 /api/auth/me 返回 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
