import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, KeyRound, User } from 'lucide-react';
import { getErrorMessage, login, type SessionUser } from '../api';
import Message from '../components/Message';

interface LoginProps {
  onLoggedIn: (user: SessionUser) => void;
}

export default function Login({ onLoggedIn }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('请输入用户名和密码');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await login(username.trim(), password);
      onLoggedIn(user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-slate-100 via-canvas to-brand-50 px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-6 flex flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg">
            <BookOpen className="h-7 w-7" />
          </span>
          <h1 className="text-xl font-semibold text-gray-800">图书借阅系统</h1>
          <p className="text-sm text-gray-500">后台管理 · 请登录后使用</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div>
            <label className="label" htmlFor="username">
              用户名
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                className="input pl-9"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="password">
              密码
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                className="input pl-9"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <Message type="error" text={error} />}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>

          <p className="text-center text-xs text-gray-400">默认账号 admin / 123456</p>
        </form>
      </div>
    </div>
  );
}
