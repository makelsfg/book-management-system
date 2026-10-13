import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();
const agent = request.agent(app);

interface BookRow {
  bookId: number;
  bookCode: string;
  bookName: string;
  borrowed: number;
  createdBy: string;
  creationTime: string;
}

beforeAll(async () => {
  await agent.post('/api/auth/login').send({ username: 'admin', password: '123456' });
});

describe('图书接口 /api/books', () => {
  it('列表分页:每页 5 条且按入库时间降序', async () => {
    const res = await agent.get('/api/books');
    expect(res.status).toBe(200);
    expect(res.body.data.pageSize).toBe(5);

    const list = res.body.data.list as BookRow[];
    const times = list.map((item) => new Date(item.creationTime).getTime());
    const sortedDesc = [...times].sort((a, b) => b - a);
    expect(times).toEqual(sortedDesc);
  });

  it('按图书名称模糊查询', async () => {
    const res = await agent.get('/api/books').query({ bookName: '三体' });
    expect(res.status).toBe(200);

    const list = res.body.data.list as BookRow[];
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((item) => item.bookName.includes('三体'))).toBe(true);
  });

  it('图书类型列表返回不少于 5 类', async () => {
    const res = await agent.get('/api/book-types');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(5);
  });

  it('新增缺少必填项返回 400', async () => {
    const res = await agent.post('/api/books').send({ bookName: '缺少编号' });
    expect(res.status).toBe(400);
  });

  it('新增->详情->修改(只读字段不可改)->删除 完整流程', async () => {
    const typeRes = await agent.get('/api/book-types');
    const typeId = typeRes.body.data[0].id;

    // 新增
    const createRes = await agent.post('/api/books').send({
      bookCode: 'BK-TEST-1',
      bookName: '测试用例图书',
      bookType: typeId,
      bookAuthor: '测试作者',
      publishPress: '测试出版社',
      publishDate: '2024-01-01',
      borrowed: 0,
    });
    expect(createRes.status).toBe(200);
    const bookId = createRes.body.data.bookId;

    // 详情
    const detailRes = await agent.get(`/api/books/${bookId}`);
    expect(detailRes.status).toBe(200);
    const originalCreatedBy = detailRes.body.data.createdBy as string;

    // 修改:尝试篡改只读字段 createdBy / creationTime
    const updateRes = await agent.put(`/api/books/${bookId}`).send({
      bookCode: 'BK-TEST-1',
      bookName: '测试用例图书-已改',
      bookType: typeId,
      bookAuthor: '测试作者',
      publishPress: '测试出版社',
      publishDate: '2024-01-01',
      borrowed: 1,
      createdBy: 'HACK',
      creationTime: '1999-01-01',
    });
    expect(updateRes.status).toBe(200);

    const afterRes = await agent.get(`/api/books/${bookId}`);
    expect(afterRes.body.data.bookName).toBe('测试用例图书-已改');
    expect(afterRes.body.data.borrowed).toBe(1);
    // 只读字段保持不变
    expect(afterRes.body.data.createdBy).toBe(originalCreatedBy);

    // 删除
    const deleteRes = await agent.delete(`/api/books/${bookId}`);
    expect(deleteRes.status).toBe(200);

    const goneRes = await agent.get(`/api/books/${bookId}`);
    expect(goneRes.status).toBe(404);
  });
});
