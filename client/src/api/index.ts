import axios from 'axios';

/* ----------------------------- 类型定义 ----------------------------- */

export interface SessionUser {
  id: number;
  username: string;
  realName: string;
  role: string;
}

export interface BookType {
  id: number;
  typeName: string;
}

export interface BookView {
  bookId: number;
  bookCode: string;
  bookName: string;
  bookType: number;
  bookTypeName: string;
  bookAuthor: string;
  publishPress: string;
  publishDate: string;
  borrowed: number;
  createdBy: string;
  creationTime: string;
  lastUpdatetime: string | null;
}

export interface PagedBooks {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  list: BookView[];
}

export interface BookPayload {
  bookCode: string;
  bookName: string;
  bookType: number;
  bookAuthor: string;
  publishPress: string;
  publishDate: string;
  borrowed: number;
}

interface ApiResult<T> {
  code: number;
  message?: string;
  data: T;
}

/* ----------------------------- 请求实例 ----------------------------- */

const http = axios.create({ baseURL: '/api', withCredentials: true });

/** 统一解包后端 { code, message, data } 结构,返回 data */
async function unwrap<T>(request: Promise<{ data: ApiResult<T> }>): Promise<T> {
  const response = await request;
  return response.data.data;
}

/** 提取可读的错误消息 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message ?? error.message ?? '请求失败';
  }
  return '发生未知错误';
}

/* ----------------------------- 认证接口 ----------------------------- */

export function login(username: string, password: string): Promise<SessionUser> {
  return unwrap<SessionUser>(http.post('/auth/login', { username, password }));
}

export function logout(): Promise<void> {
  return unwrap<void>(http.post('/auth/logout'));
}

export function fetchMe(): Promise<SessionUser> {
  return unwrap<SessionUser>(http.get('/auth/me'));
}

/* ----------------------------- 图书接口 ----------------------------- */

export function fetchBooks(params: { bookName?: string; page?: number }): Promise<PagedBooks> {
  return unwrap<PagedBooks>(http.get('/books', { params }));
}

export function fetchBook(bookId: number): Promise<BookView> {
  return unwrap<BookView>(http.get(`/books/${bookId}`));
}

export function fetchBookTypes(): Promise<BookType[]> {
  return unwrap<BookType[]>(http.get('/book-types'));
}

export function createBook(payload: BookPayload): Promise<{ bookId: number }> {
  return unwrap<{ bookId: number }>(http.post('/books', payload));
}

export function updateBook(bookId: number, payload: BookPayload): Promise<void> {
  return unwrap<void>(http.put(`/books/${bookId}`, payload));
}

export function deleteBook(bookId: number): Promise<void> {
  return unwrap<void>(http.delete(`/books/${bookId}`));
}
