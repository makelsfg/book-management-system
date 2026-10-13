import 'express-session';

/** 扩展会话类型:记录当前登录用户 */
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      realName: string;
      role: string;
    };
  }
}
