import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';

export interface SessionUser {
  id: number;
  username: string;
  realName: string;
  role: string;
}

export interface LoginResult {
  ok: boolean;
  user?: SessionUser;
  message?: string;
}

/**
 * 校验用户名密码。
 * 账号不存在与密码错误统一返回同一提示,避免暴露账号是否存在。
 */
export async function login(username: string, password: string): Promise<LoginResult> {
  const user = await prisma.sysUser.findUnique({ where: { username } });
  if (!user) {
    return { ok: false, message: '用户名或密码错误' };
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return { ok: false, message: '用户名或密码错误' };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      username: user.username,
      realName: user.realName,
      role: user.role,
    },
  };
}
