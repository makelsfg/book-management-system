import { prisma } from '../../lib/prisma';

/** 每页显示条数(试卷要求:每页 5 条) */
export const PAGE_SIZE = 5;

export interface BookView {
  bookId: number;
  bookCode: string;
  bookName: string;
  bookType: number;
  bookTypeName: string;
  bookAuthor: string;
  publishPress: string;
  publishDate: Date;
  borrowed: number;
  createdBy: string;
  creationTime: Date;
  lastUpdatetime: Date | null;
}

export interface BookInput {
  bookCode?: unknown;
  bookName?: unknown;
  bookType?: unknown;
  bookAuthor?: unknown;
  publishPress?: unknown;
  publishDate?: unknown;
  borrowed?: unknown;
}

export interface ServiceResult<T = unknown> {
  ok: boolean;
  message: string;
  data?: T;
}

/** 读取图书类型字典(id -> 类型名),用于列表展示类型名 */
async function getTypeMap(): Promise<Map<number, string>> {
  const types = await prisma.bookType.findMany();
  return new Map(types.map((t) => [t.id, t.typeName]));
}

function toView(book: {
  bookId: number;
  bookCode: string;
  bookName: string;
  bookType: number;
  bookAuthor: string;
  publishPress: string;
  publishDate: Date;
  borrowed: number;
  createdBy: string;
  creationTime: Date;
  lastUpdatetime: Date | null;
}, typeMap: Map<number, string>): BookView {
  return { ...book, bookTypeName: typeMap.get(book.bookType) ?? '未知类型' };
}

/** 图书类型下拉列表 */
export async function listBookTypes() {
  return prisma.bookType.findMany({ orderBy: { id: 'asc' } });
}

/**
 * 分页查询图书。
 * 默认(bookName 为空)返回全部,按入库时间降序;传入 bookName 则模糊匹配。
 */
export async function listBooks(bookName?: string, page?: number) {
  const name = bookName?.trim() ?? '';
  const currentPage = page && page > 0 ? Math.floor(page) : 1;
  const where = name ? { bookName: { contains: name } } : {};

  const [total, records, typeMap] = await Promise.all([
    prisma.bookInfo.count({ where }),
    prisma.bookInfo.findMany({
      where,
      orderBy: { creationTime: 'desc' },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    getTypeMap(),
  ]);

  return {
    page: currentPage,
    pageSize: PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    list: records.map((b) => toView(b, typeMap)),
  };
}

/** 按 id 查询单本图书 */
export async function getBook(bookId: number): Promise<BookView | null> {
  const book = await prisma.bookInfo.findUnique({ where: { bookId } });
  if (!book) return null;
  const typeMap = await getTypeMap();
  return toView(book, typeMap);
}

/** 校验并规范化新增/修改入参,返回错误消息或规范化后的数据 */
async function normalizeInput(input: BookInput): Promise<
  { error: string } | {
    data: {
      bookCode: string;
      bookName: string;
      bookType: number;
      bookAuthor: string;
      publishPress: string;
      publishDate: Date;
      borrowed: number;
    };
  }
> {
  const bookCode = String(input.bookCode ?? '').trim();
  const bookName = String(input.bookName ?? '').trim();
  const bookAuthor = String(input.bookAuthor ?? '').trim();
  const publishPress = String(input.publishPress ?? '').trim();
  const publishDateRaw = String(input.publishDate ?? '').trim();
  const bookType = Number(input.bookType);
  const borrowed =
    input.borrowed === undefined || input.borrowed === null || input.borrowed === ''
      ? 0
      : Number(input.borrowed);

  if (!bookCode) return { error: '图书编号不能为空' };
  if (!bookName) return { error: '图书名称不能为空' };
  if (!Number.isInteger(bookType) || bookType <= 0) return { error: '请选择图书类型' };
  if (!bookAuthor) return { error: '图书作者不能为空' };
  if (!publishPress) return { error: '出版社不能为空' };
  if (!borrowed && borrowed !== 0) return { error: '是否借阅取值不合法' };
  if (borrowed !== 0 && borrowed !== 1) return { error: '是否借阅只能为 0 或 1' };

  const publishDate = publishDateRaw ? new Date(publishDateRaw) : new Date(NaN);
  if (Number.isNaN(publishDate.getTime())) return { error: '出版日期不能为空或格式不正确' };

  // 类型必须来源于 book_type 表
  const typeExists = await prisma.bookType.findUnique({ where: { id: bookType } });
  if (!typeExists) return { error: '图书类型不存在' };

  return { data: { bookCode, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed } };
}

/** 新增图书:入库时间默认当前时间,入库人取当前登录用户 */
export async function createBook(input: BookInput, createdBy: string): Promise<ServiceResult> {
  const normalized = await normalizeInput(input);
  if ('error' in normalized) {
    return { ok: false, message: normalized.error };
  }
  const created = await prisma.bookInfo.create({
    data: { ...normalized.data, createdBy, creationTime: new Date() },
  });
  return { ok: true, message: '保存成功', data: { bookId: created.bookId } };
}

/** 修改图书:入库人、入库时间为只读字段,忽略客户端传入 */
export async function updateBook(bookId: number, input: BookInput): Promise<ServiceResult> {
  const exists = await prisma.bookInfo.findUnique({ where: { bookId } });
  if (!exists) return { ok: false, message: '图书不存在或已被删除' };

  const normalized = await normalizeInput(input);
  if ('error' in normalized) {
    return { ok: false, message: normalized.error };
  }

  await prisma.bookInfo.update({ where: { bookId }, data: normalized.data });
  return { ok: true, message: '修改成功' };
}

/** 删除图书 */
export async function deleteBook(bookId: number): Promise<ServiceResult> {
  const exists = await prisma.bookInfo.findUnique({ where: { bookId } });
  if (!exists) return { ok: false, message: '图书不存在或已被删除' };

  await prisma.bookInfo.delete({ where: { bookId } });
  return { ok: true, message: '删除成功' };
}
