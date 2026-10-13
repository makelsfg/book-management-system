import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createBook, fetchBookTypes, getErrorMessage, type BookPayload, type BookType, type SessionUser } from '../api';
import { formatDate } from '../lib/format';
import BookForm from '../components/BookForm';
import Message from '../components/Message';

const EMPTY_FORM: BookPayload = {
  bookCode: '',
  bookName: '',
  bookType: 0,
  bookAuthor: '',
  publishPress: '',
  publishDate: '',
  borrowed: 0,
};

export default function BookAdd() {
  const navigate = useNavigate();
  const { user } = useOutletContext<{ user: SessionUser }>();

  const [types, setTypes] = useState<BookType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookTypes()
      .then((result) => setTypes(result))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  async function handleSubmit(payload: BookPayload) {
    setSubmitting(true);
    setError('');
    try {
      await createBook(payload);
      // 无论成功与否都要提示:成功后在列表页展示提示
      navigate('/', { state: { tip: { type: 'success', text: '保存成功' } } });
    } catch (err) {
      setError(`保存失败:${getErrorMessage(err)}`);
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">新增图书</h2>
          <p className="text-sm text-gray-500">入库人与入库时间默认为当前登录信息</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </button>
      </div>

      {error && <Message type="error" text={error} />}

      <div className="card p-6">
        <BookForm
          mode="create"
          types={types}
          initial={EMPTY_FORM}
          createdBy={user?.realName ?? '系统管理员'}
          creationTime={formatDate(new Date())}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
        />
      </div>
    </div>
  );
}
