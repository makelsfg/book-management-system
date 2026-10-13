import { Request, Response } from 'express';
import { login } from './auth.service';

/** POST /api/auth/login */
export async function postLogin(req: Request, res: Response): Promise<void> {
  const body = req.body ?? {};
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!username || !password) {
    res.status(400).json({ code: 400, message: '请输入用户名和密码' });
    return;
  }

  const result = await login(username, password);
  if (!result.ok || !result.user) {
    res.status(401).json({ code: 401, message: result.message ?? '登录失败' });
    return;
  }

  req.session.user = result.user;
  res.json({ code: 0, message: '登录成功', data: result.user });
}

/** POST /api/auth/logout */
export function postLogout(req: Request, res: Response): void {
  req.session.destroy(() => {
    res.json({ code: 0, message: '已退出登录' });
  });
}

/** GET /api/auth/me */
export function getMe(req: Request, res: Response): void {
  if (req.session?.user) {
    res.json({ code: 0, data: req.session.user });
    return;
  }
  res.status(401).json({ code: 401, message: '未登录' });
}
