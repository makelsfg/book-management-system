import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookAdd from './pages/BookAdd';
import BookEdit from './pages/BookEdit';
import { fetchMe, type SessionUser } from './api';

interface ProtectedRouteProps {
  user: SessionUser | null;
  onLoggedOut: () => void;
}

/** 需要登录的路由:未登录跳登录页,已登录套用全局布局 */
function ProtectedRoute({ user, onLoggedOut }: ProtectedRouteProps) {
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Layout user={user} onLoggedOut={onLoggedOut}>
      <Outlet context={{ user }} />
    </Layout>
  );
}

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  // 启动时校验会话
  useEffect(() => {
    fetchMe()
      .then((result) => setUser(result))
      .catch((error) => {
        console.error('会话校验失败', error);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return <div className="flex h-full items-center justify-center text-gray-400">加载中...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login onLoggedIn={setUser} />}
      />

      <Route element={<ProtectedRoute user={user} onLoggedOut={() => setUser(null)} />}>
        <Route path="/" element={<BookList />} />
        <Route path="/books/new" element={<BookAdd />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/books/:id/edit" element={<BookEdit />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
