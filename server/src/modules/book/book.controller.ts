import { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import * as service from './book.service';

/** 解析并校验路径参数中的图书 id */
function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ code: 400, message: '图书 ID 不合法' });
    return null;
  }
  return id;
}

/** GET /api/books —— 分页 + 名称模糊查询,按入库时间降序 */
export const listBooks = asyncHandler(async (req: Request, res: Response) => {
  const bookName = typeof req.query.bookName === 'string' ? req.query.bookName : undefined;
  const page = Number(req.query.page);
  const result = await service.listBooks(bookName, Number.isFinite(page) ? page : 1);
  res.json({ code: 0, data: result });
});

/** GET /api/books/:id —— 图书详情 */
export const getBook = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req, res);
  if (id === null) return;

  const book = await service.getBook(id);
  if (!book) {
    res.status(404).json({ code: 404, message: '图书不存在' });
    return;
  }
  res.json({ code: 0, data: book });
});

/** GET /api/book-types —— 图书类型下拉数据 */
export const listBookTypes = asyncHandler(async (_req: Request, res: Response) => {
  const types = await service.listBookTypes();
  res.json({ code: 0, data: types });
});

/** POST /api/books —— 新增图书 */
export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.session.user?.realName ?? '系统管理员';
  const result = await service.createBook(req.body ?? {}, createdBy);
  res
    .status(result.ok ? 200 : 400)
    .json({ code: result.ok ? 0 : 400, message: result.message, data: result.data });
});

/** PUT /api/books/:id —— 修改图书(入库人、入库时间只读) */
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req, res);
  if (id === null) return;

  const result = await service.updateBook(id, req.body ?? {});
  res.status(result.ok ? 200 : 400).json({ code: result.ok ? 0 : 400, message: result.message });
});

/** DELETE /api/books/:id —— 删除图书 */
export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req, res);
  if (id === null) return;

  const result = await service.deleteBook(id);
  res.status(result.ok ? 200 : 400).json({ code: result.ok ? 0 : 400, message: result.message });
});
