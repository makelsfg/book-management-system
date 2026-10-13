import { RequestHandler } from 'express';

/**
 * 包装 async 路由处理器,把 Promise 异常转交给 Express 错误中间件,
 * 避免在每个控制器里重复写 try/catch。
 */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
