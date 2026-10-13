import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import { deleteBook, fetchBooks, getErrorMessage, type PagedBooks } from '../api';
import { formatDate } from '../lib/format';
import Message, { type MessageType } from '../components/Message';
import Pagination from '../components/Pagination';

interface Tip {
  type: MessageType;
  text: string;
}

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const bookName = searchParams.get('bookName') ?? '';
  const page = Number(searchParams.get('page')) || 1;

  const [keyword, setKeyword] = useState(bookName);
  const [data, setData] = useState<PagedBooks | null>(null);
  const [loading, setLoading] = useState(true);
  const [tip, setTip] = useState<Tip | null>(null);
  const [version, setVersion] = useState(0);

  // 新增 / 修改成功返回时展示提示
  useEffect(() => {
    const state = location.state as { tip?: Tip } | null;
    if (state?.tip) {
      setTip(state.tip);
      navigate(`${location.pathname}${location.search}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // 输入框跟随 URL 查询条件
  useEffect(() => {
    setKeyword(bookName);
  }, [bookName]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBooks({ bookName, page })
      .then((result) => {
        if (!active) return;
        // 当前页被删空时自动回退上一页
        if (result.list.length === 0 && result.page > 1 && result.total > 0) {
          const next = new URLSearchParams(searchParams);
          next.set('page', String(result.page - 1));
          setSearchParams(next, { replace: true });
          return;
        }
        setData(result);
      })
      .catch((error) => {
        if (active) setTip({ type: 'error', text: getErrorMessage(error) });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookName, page, version]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const next = new URLSearchParams();
    if (keyword.trim()) next.set('bookName', keyword.trim());
    next.set('page', '1');
    setSearchParams(next);
  }

  function handleReset() {
    setKeyword('');
    setSearchParams({});
  }

  function handlePageChange(target: number) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(target));
    setSearchParams(next);
  }

  async function handleDelete(bookId: number, name: string) {
    if (!window.confirm(`确定删除该图书信息?\n《${name}》`)) return;
    try {
      await deleteBook(bookId);
      setTip({ type: 'success', text: '删除成功' });
      setVersion((value) => value + 1);
    } catch (error) {
      setTip({ type: 'error', text: `删除失败:${getErrorMessage(error)}` });
    }
  }

  const query = searchParams.toString();
  const suffix = query ? `?${query}` : '';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">图书信息列表</h2>
          <p className="text-sm text-gray-500">按入库时间倒序展示,每页 5 条</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/books/new')}>
          <Plus className="h-4 w-4" />
          新增图书
        </button>
      </div>

      {tip && <Message type={tip.type} text={tip.text} />}

      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="输入图书名称进行查询"
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-primary">
              查询
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              重置
            </button>
          </div>
        </form>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">图书编号</th>
                <th className="px-4 py-3">图书名称</th>
                <th className="px-4 py-3">图书类型</th>
                <th className="px-4 py-3">作者</th>
                <th className="px-4 py-3">出版社</th>
                <th className="px-4 py-3">是否借阅</th>
                <th className="px-4 py-3">入库时间</th>
                <th className="px-4 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                    加载中...
                  </td>
                </tr>
              )}

              {!loading && data?.list.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                    暂无图书数据
                  </td>
                </tr>
              )}

              {!loading &&
                data?.list.map((book, index) => (
                  <tr
                    key={book.bookId}
                    className={`${index % 2 === 1 ? 'bg-zebra' : 'bg-white'} border-b border-gray-50 transition-colors hover:bg-brand-50`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">{book.bookCode}</td>
                    <td className="px-4 py-3 text-gray-800">{book.bookName}</td>
                    <td className="px-4 py-3 text-gray-600">{book.bookTypeName}</td>
                    <td className="px-4 py-3 text-gray-600">{book.bookAuthor}</td>
                    <td className="px-4 py-3 text-gray-600">{book.publishPress}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          book.borrowed === 1 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {book.borrowed === 1 ? '已借阅' : '未借阅'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(book.creationTime)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 hover:underline"
                          onClick={() => navigate(`/books/${book.bookId}${suffix}`)}
                        >
                          <Eye className="h-4 w-4" />
                          查看
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 hover:underline"
                          onClick={() => navigate(`/books/${book.bookId}/edit${suffix}`)}
                        >
                          <Pencil className="h-4 w-4" />
                          修改
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:underline"
                          onClick={() => handleDelete(book.bookId, book.bookName)}
                        >
                          <Trash2 className="h-4 w-4" />
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {data && data.total > 0 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
