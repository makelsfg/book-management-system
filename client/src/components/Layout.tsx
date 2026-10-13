import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { logout, type SessionUser } from '../api';

interface LayoutProps {
  user: SessionUser | null;
  onLoggedOut: () => void;
  children: ReactNode;
}

/** 全局布局:固定顶栏 + 内容容器 + 页脚 */
export default function Layout({ user, onLoggedOut, children }: LayoutProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('退出登录失败', error);
    }
    onLoggedOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center border-b border-gray-100 bg-white/85 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold text-gray-800">图书借阅系统 · 后台管理</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-sm text-gray-600 sm:flex">
              <User className="h-4 w-4" />
              {user?.realName ?? '未登录'}
            </span>
            <button type="button" onClick={handleLogout} className="btn btn-ghost !px-3 !py-1.5">
              <LogOut className="h-4 w-4" />
              退出
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-10">{children}</main>

      <footer className="pb-6 text-center text-xs text-gray-400">
        图书借阅系统后台管理 · TypeScript + Express + Prisma + React
      </footer>
    </div>
  );
}
