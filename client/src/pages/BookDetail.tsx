import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchBook, getErrorMessage, type BookView } from '../api';
import { formatDate } from '../lib/format';
import Message from '../components/Message';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm text-gray-800">{value || '-'}</dd>
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookView | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBook(Number(id))
      .then((result) => setBook(result))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const query = searchParams.toString();
  const backTo = query ? `/?${query}` : '/';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">图书详细信息</h2>
          <p className="text-sm text-gray-500">只读展示,不可编辑</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => navigate(backTo)}>
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </button>
      </div>

      {error && <Message type="error" text={error} />}

      <div className="card p-6">
        {loading && <p className="text-gray-400">加载中...</p>}
        {!loading && book && (
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field label="图书编号" value={book.bookCode} />
            <Field label="图书名称" value={book.bookName} />
            <Field label="图书类型" value={book.bookTypeName} />
            <Field label="作者" value={book.bookAuthor} />
            <Field label="出版社" value={book.publishPress} />
            <Field label="出版日期" value={formatDate(book.publishDate)} />
            <Field label="是否借阅" value={book.borrowed === 1 ? '已借阅' : '未借阅'} />
            <Field label="入库人" value={book.createdBy} />
            <Field label="入库时间" value={formatDate(book.creationTime)} />
          </dl>
        )}
      </div>

      <div className="flex justify-end">
        <button type="button" className="btn btn-primary" onClick={() => navigate(backTo)}>
          返回
        </button>
      </div>
    </div>
  );
}
