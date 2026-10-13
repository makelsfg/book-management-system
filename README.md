# 图书借阅系统(后台管理)

基于 **TypeScript** 的前后端分离图书借阅后台管理系统。功能对齐《2016 年 10 月学士后 Java 毕业考试机试试卷-2》,技术栈按 `quiz07.md` 选型(Express + MySQL),并将后端由 Java 改写为 TypeScript。

## 功能

- **登录**:账号密码登录(初始 `admin` / `123456`),登录态写入会话。
- **图书列表**:默认按入库时间降序,日期显示「年-月-日」,列表隔行变色,分页每页 5 条。
- **查询**:按图书名称模糊查询,查询条件写入 URL,刷新/返回后保留。
- **查看详情**:字段只读,返回列表时保留查询条件与页码。
- **新增**:入库时间默认当前时间、入库人默认当前登录用户、是否借阅默认「未借阅」;书类型取自 `book_type` 表。
- **修改**:入库人、入库时间为只读,服务端忽略对这两个字段的更新。
- **删除**:删除前确认,删除后提示成功/失败。
- 所有写操作均有成功/失败提示。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 语言 | TypeScript(前后端统一) |
| 后端 | Express + express-session + bcryptjs |
| 数据层 | Prisma ORM + MySQL 8 |
| 前端 | React 18 + Vite + react-router-dom + Tailwind CSS + lucide-react |
| 测试 | Vitest + Supertest(后端接口/单元测试) |
| CI | GitHub Actions(Node + MySQL service) |

## 目录结构

```
.
├── server/                        # 后端(Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma          # book_info / book_type / sys_user 模型
│   │   ├── migrations/            # 数据库迁移
│   │   └── seed.ts                # 测试数据
│   ├── src/
│   │   ├── main.ts                # 启动入口
│   │   ├── app.ts                 # 应用装配(会话、路由、静态托管、错误处理)
│   │   ├── lib/                   # Prisma 单例、asyncHandler
│   │   ├── middlewares/           # 登录态校验
│   │   ├── types/                 # 会话类型扩展
│   │   └── modules/               # 业务域:auth / book
│   └── tests/                     # Vitest + Supertest 用例
├── client/                        # 前端(React + Vite)
│   └── src/
│       ├── api/                   # 接口封装
│       ├── components/            # Layout / Pagination / Message / BookForm
│       ├── pages/                 # Login / BookList / BookDetail / BookAdd / BookEdit
│       └── lib/                   # 日期格式化
├── db/init.sql                    # 建表 + 测试数据 SQL(交付用)
└── .github/workflows/ci.yml       # 回归测试流水线
```

## 环境要求

- Node.js 18+(推荐 20+)
- MySQL 8(本地安装,或用 Docker)

## 快速开始

### 1. 准备数据库

使用 Docker(推荐,零安装):

```bash
docker run -d --name book-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=book_manage \
  -p 3306:3306 mysql:8.0
```

### 2. 启动后端

```bash
cd server
cp ../.env.example .env          # 按需修改数据库连接
npm install
npx prisma generate
npx prisma migrate deploy        # 创建表结构
npm run seed                     # 灌入测试数据
npm run dev                      # http://localhost:3001
```

### 3. 启动前端

```bash
cd client
npm install
npm run dev                      # http://localhost:5173(代理 /api 到 3001)
```

浏览器打开 <http://localhost:5173>,使用 `admin` / `123456` 登录。

### 4. 生产构建

```bash
cd client && npm run build       # 产物输出到 client/dist
cd ../server && npm run build && npm start
```

后端会自动托管 `client/dist`,访问 <http://localhost:3001> 即可。

## 测试

```bash
cd server
npm test                         # Vitest + Supertest
```

## 数据库设计

- `book_info` 图书信息表:bookId / bookCode / bookName / bookType / bookAuthor / publishPress / publishDate / borrowed / createdBy / creationTime / lastUpdatetime
- `book_type` 图书类型表:id / typeName(小说、文学、传记、艺术、少儿、经济、管理、科技)
- `sys_user` 系统用户表:id / username / password(哈希)/ realName / role

## 接口一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/logout` | 退出登录 |
| GET | `/api/auth/me` | 当前登录用户 |
| GET | `/api/books` | 图书列表(分页 + 名称模糊查询) |
| GET | `/api/books/:id` | 图书详情 |
| POST | `/api/books` | 新增图书 |
| PUT | `/api/books/:id` | 修改图书 |
| DELETE | `/api/books/:id` | 删除图书 |
| GET | `/api/book-types` | 图书类型列表 |

## GitHub 协作流程(按 quiz07.md)

1. 初始化仓库并托管到 GitHub。
2. 创建两个 Issue:**前端 Issue**、**后端 Issue**。
3. 按 Issue 建分支开发(如 `feature/frontend`、`feature/backend`),完成后提交 PR。
4. PR 触发 GitHub Actions 回归测试,通过后合并,**合并后删除分支**。
