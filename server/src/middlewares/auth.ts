import { Request, Response, NextFunction } from 'express';

/** 登录态校验中间件:未登录返回 401 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.user) {
    next();
    return;
  }
  res.status(401).json({ code: 401, message: '未登录或登录已过期' });
}
