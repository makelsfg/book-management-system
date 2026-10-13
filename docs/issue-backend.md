# 后端 Issue 模板(图书借阅系统 API)

> 关联:本仓库 `book-management-system`;前端 Issue 同步跟进。
> 需求来源:2016 年 10 月学士后 Java 毕业考试机试试卷 - 图书借阅系统(后台)

## 目标

基于 **Express 4 + Prisma 5 + MySQL 8** 提供图书借阅系统后台 REST API,含简易 session 登录。

## 技术栈

- Node.js 20+ / Express 4
- Prisma 5(TS 优先 ORM,自带迁移/seed)
- MySQL 8(Docker 容器 `book-mysql`)
- express-session(内存 store,MVP 够用)
- bcryptjs(密码哈希)
- 端口:3001

## 数据模型

表 `book_info`(对应 PDF 字段):
- `bookId` Int PK 自增
- `bookCode` String 非空 唯一
- `bookName` String 非空
- `bookType` Int 非空 → `book_type.id`
- `bookAuthor` String 非空(PDF 误标 int,实际为姓名)
- `publishPress` String 非空
- `publishDate` DateTime 非空
- `borrowed` Int 非空(1 已借阅 / 0 未借阅)
- `createdBy` String 非空
- `creationTime` DateTime 非空
- `lastUpdatetime` DateTime?

表 `book_type`:
- `id` Int PK 自增
- `typeName` String 非空

表 `sys_user`(登录用):
- `id` Int PK 自增
- `username` String 非空 唯一
- `password` String 非空(bcrypt 哈希)
- `realName` String 非空
- `role` String 默认 `admin`

## 范围 / 验收点

- [ ] `prisma/schema.prisma` 三张表 + 迁移 + seed(每表 ≥ 5 条,初始化 `admin/123456`)
- [ ] `POST /api/auth/login` 用户名密码校验,session 写 `username`
- [ ] `POST /api/auth/logout` 销毁 session
- [ ] `GET /api/auth/me` 返回当前用户(未登录 401)
- [ ] `GET /api/books?page=&pageSize=5&keyword=` 模糊按 bookName 查询,按 `creationTime` desc
- [ ] `GET /api/books/:id` 详情,含类型名称
- [ ] `POST /api/books` 必填校验,`createdBy` 取 session 用户,`creationTime` 取 now,`borrowed` 默认 0
- [ ] `PUT /api/books/:id` 必填校验,`createdBy` / `creationTime` 服务端锁定不变
- [ ] `DELETE /api/books/:id` 删除并返回成功/失败 message
- [ ] `GET /api/book-types` 类型列表(下拉用)
- [ ] 鉴权中间件:除登录外接口未登录返回 401
- [ ] 统一错误响应 `{ code, message }`;成功响应 `{ code: 0, message: 'ok', data }`
- [ ] README 启动步骤(Docker 起 MySQL → migrate → seed → npm run dev)

## 任务清单

- [ ] Prisma schema + 迁移
- [ ] Seed(类型 8 种 / 图书 ≥ 5 条 / 用户 admin)
- [ ] 鉴权中间件 + session 配置
- [ ] auth 域(登录/登出/me)
- [ ] book 域(分页查询/详情/新增/修改/删除)
- [ ] bookType 域(列表接口)
- [ ] 错误处理兜底中间件
- [ ] README + `.env.example` 完善

## 非目标(MVP 不做)

- 角色权限 / 多用户管理
- 借阅记录表(超出 PDF 范围)
- 单元/接口测试(迭代 2 接入 Vitest + Supertest)
- `db/init.sql` 导出(迭代 3 交付时导出)
- Redis session store
