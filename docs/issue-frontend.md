# 前端 Issue 模板(图书管理后台 SPA)

> 关联:本仓库 `book-management-system`;后端 Issue 同步跟进。
> 需求来源:2016 年 10 月学士后 Java 毕业考试机试试卷 - 图书借阅系统(后台)

## 目标

基于 **React 18 + Vite 5 + TypeScript** 实现图书管理后台单页应用,覆盖 PDF 规定的全部后台功能。

## 技术栈

- React 18 / Vite 5 / TypeScript
- react-router-dom v6(路由)
- Tailwind CSS(样式,统一色板)
- 内联 SVG 图标(无外部图片资源)
- 端口:Vite dev 5173,通过 `vite.config.ts` 的 proxy 把 `/api` 转发到后端 3001

## 范围 / 验收点

- [ ] **登录页** `POST /api/auth/login`;失败提示;成功跳列表
- [ ] **图书列表** `GET /api/books?page=1&pageSize=5&keyword=`
  - 每页 5 条,按 `creationTime` 降序
  - 隔行变色,日期格式 `YYYY-MM-DD`
  - 输入框记忆查询条件(localStorage / URL query)
- [ ] **图书详情** `GET /api/books/:id`;所有字段只读;返回列表时保留查询条件
- [ ] **新增图书** `POST /api/books`
  - 必填:图书编号、图书名称、图书类型(来自 `/api/book-types`)、作者、出版社、出版日期、是否借阅
  - 默认值:入库人 = 当前登录用户;入库时间 = 当前时间;是否借阅 = 0
  - 成功/失败均给出提示
- [ ] **修改图书** `PUT /api/books/:id`
  - 同上必填校验
  - 入库人 / 入库时间只读
  - 成功/失败提示
- [ ] **删除图书** `DELETE /api/books/:id`
  - 二次确认弹窗 "确定删除该图书信息?"
  - 删除后提示成功/失败,跳回列表
- [ ] **受保护路由**:未登录访问后台页跳登录
- [ ] **统一错误处理**:接口 4xx/5xx 时显示后端 `message`
- [ ] **零外部图片**:所有视觉元素用 CSS + 内联 SVG

## 任务清单

- [ ] 路由骨架(`App.tsx` + `react-router-dom`)
- [ ] API 封装(`src/api/index.ts`,统一 fetch + session)
- [ ] 公共组件:`Message`、`Pagination`、`Layout`
- [ ] `pages/Login.tsx`
- [ ] `pages/BookList.tsx`
- [ ] `pages/BookDetail.tsx`
- [ ] `pages/BookAdd.tsx`
- [ ] `pages/BookEdit.tsx`
- [ ] 样式与色板统一

## 非目标(MVP 不做)

- 真实图片资源 / Banner 大图
- 多语言、暗黑模式
- 移动端深度适配(只保证 PC 后台可用)
- 单元/E2E 测试(迭代 2 接入 Vitest + Playwright)
