import 'dotenv/config';
import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import bookRoutes from './modules/book/book.routes';

/**
 * 组装 Express 应用:
 * 会话 → 解析 → 业务路由 → 前端静态托管 → 兜底错误处理。
 */
export function createApp() {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 }, // 8 小时
    }),
  );

  // 健康检查
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ code: 0, message: 'ok' });
  });

  // 业务路由
  app.use('/api/auth', authRoutes);
  app.use('/api', bookRoutes);

  // 生产环境托管前端构建产物(client/dist)
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }
    res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) next();
    });
  });

  // 兜底错误处理:统一返回结构化错误与可读消息
  app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[server error]', err);
    const status = err.status ?? 500;
    res.status(status).json({ code: status, message: err.message || '服务器内部错误' });
  });

  return app;
}
