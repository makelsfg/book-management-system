import { FormEvent, useState } from 'react';
import { BookType, BookPayload } from '../api';

interface BookFormProps {
  mode: 'create' | 'edit';
  types: BookType[];
  initial: BookPayload;
  /** 只读展示的入库人(新增为当前登录用户,修改为原值) */
  createdBy: string;
  /** 只读展示的入库时间 */
  creationTime: string;
  submitting: boolean;
  onSubmit: (payload: BookPayload) => void;
  onCancel: () => void;
}

/** 新增 / 修改共用的图书表单(入库人、入库时间只读) */
export default function BookForm({
  mode,
  types,
  initial,
  createdBy,
  creationTime,
  submitting,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const [form, setForm] = useState<BookPayload>(initial);
  const [error, setError] = useState('');

  function update<K extends keyof BookPayload>(key: K, value: BookPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.bookCode.trim()) {
      setError('请填写图书编号');
      return;
    }
    if (!form.bookName.trim()) {
      setError('请填写图书名称');
      return;
    }
    if (!form.bookType) {
      setError('请选择图书类型');
      return;
    }
    if (!form.bookAuthor.trim()) {
      setError('请填写图书作者');
      return;
    }
    if (!form.publishPress.trim()) {
      setError('请填写出版社');
      return;
    }
    if (!form.publishDate) {
      setError('请选择出版日期');
      return;
    }
    setError('');
    onSubmit({ ...form });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
      <div>
        <label className="label" htmlFor="bookCode">
          图书编号 <span className="text-red-500">*</span>
        </label>
        <input
          id="bookCode"
          className="input"
          value={form.bookCode}
          onChange={(event) => update('bookCode', event.target.value)}
          placeholder="如 BK-1001"
        />
      </div>

      <div>
        <label className="label" htmlFor="bookName">
          图书名称 <span className="text-red-500">*</span>
        </label>
        <input
          id="bookName"
          className="input"
          value={form.bookName}
          onChange={(event) => update('bookName', event.target.value)}
          placeholder="如 三体"
        />
      </div>

      <div>
        <label className="label" htmlFor="bookType">
          图书类型 <span className="text-red-500">*</span>
        </label>
        <select
          id="bookType"
          className="input"
          value={form.bookType || ''}
          onChange={(event) => update('bookType', Number(event.target.value))}
        >
          <option value="">请选择图书类型</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.typeName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="bookAuthor">
          图书作者 <span className="text-red-500">*</span>
        </label>
        <input
          id="bookAuthor"
          className="input"
          value={form.bookAuthor}
          onChange={(event) => update('bookAuthor', event.target.value)}
          placeholder="如 刘慈欣"
        />
      </div>

      <div>
        <label className="label" htmlFor="publishPress">
          出版社 <span className="text-red-500">*</span>
        </label>
        <input
          id="publishPress"
          className="input"
          value={form.publishPress}
          onChange={(event) => update('publishPress', event.target.value)}
          placeholder="如 重庆出版社"
        />
      </div>

      <div>
        <label className="label" htmlFor="publishDate">
          出版日期 <span className="text-red-500">*</span>
        </label>
        <input
          id="publishDate"
          type="date"
          className="input"
          value={form.publishDate}
          onChange={(event) => update('publishDate', event.target.value)}
        />
      </div>

      <div>
        <span className="label">
          是否借阅 <span className="text-red-500">*</span>
        </span>
        <div className="flex items-center gap-6 pt-1.5">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="borrowed"
              className="h-4 w-4 accent-brand-600"
              checked={form.borrowed === 0}
              onChange={() => update('borrowed', 0)}
            />
            未借阅
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="borrowed"
              className="h-4 w-4 accent-brand-600"
              checked={form.borrowed === 1}
              onChange={() => update('borrowed', 1)}
            />
            已借阅
          </label>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="createdBy">
          入库人
        </label>
        <input id="createdBy" className="input" value={createdBy} disabled readOnly />
      </div>

      <div>
        <label className="label" htmlFor="creationTime">
          入库时间
        </label>
        <input id="creationTime" className="input" value={creationTime} disabled readOnly />
      </div>

      {error && <p className="col-span-full text-sm text-red-600">{error}</p>}

      <div className="col-span-full mt-2 flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '提交中...' : mode === 'create' ? '保存' : '修改'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
          返回
        </button>
      </div>
    </form>
  );
}
