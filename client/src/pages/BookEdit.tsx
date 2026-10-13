import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchBook, fetchBookTypes, getErrorMessage, updateBook, type BookPayload, type BookType, type BookView } from '../api';
import { formatDate } from '../lib/format';
import BookForm from '../components/BookForm';
import Message from '../components/Message';

export default function BookEdit() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookView | null>(null);
  const [types, setTypes] = useState<BookType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const query = searchParams.toString();
  const backTo = query ? `/?${query}` : '/';

  useEffect(() => {
    fetchBookTypes()
      .then((result) => setTypes(result))
      .catch((err) => setError(getErrorMessage(err)));
    fetchBook(Number(id))
      .then((result) => setBook(result))
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  async function handleSubmit(payload: BookPayload) {
    setSubmitting(true);
    setError('');
    try {
      await updateBook(Number(id), payload);
      navigate(backTo, { state: { tip: { type: 'success', text: '修改成功' } } });
    } catch (err) {
      setError(`修改失败:${getErrorMessage(err)}`);
      setSubmitting(false);
    }
  }

  const initial: BookPayload | null = book
    ? {
        bookCode: book.bookCode,
        bookName: book.bookName,
        bookType: book.bookType,
        bookAuthor: book.bookAuthor,
        publishPress: book.publishPress,
        publishDate: formatDate(book.publishDate),
        borrowed: book.borrowed,
      }
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">修改图书</h2>
          <p className="text-sm text-gray-500">入库人与入库时间为只读,不可修改</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => navigate(backTo)}>
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </button>
      </div>

      {error && <Message type="error" text={error} />}

      <div className="card p-6">
        {book && initial ? (
          <BookForm
            mode="edit"
            types={types}
            initial={initial}
            createdBy={book.createdBy}
            creationTime={formatDate(book.creationTime)}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => navigate(backTo)}
          />
        ) : (
          <p className="text-gray-400">加载中...</p>
        )}
      </div>
    </div>
  );
}
