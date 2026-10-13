import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import * as controller from './book.controller';

const router = Router();

// 本域所有接口均需登录
router.use(requireAuth);

router.get('/books', controller.listBooks);
router.get('/books/:id', controller.getBook);
router.post('/books', controller.createBook);
router.put('/books/:id', controller.updateBook);
router.delete('/books/:id', controller.deleteBook);

router.get('/book-types', controller.listBookTypes);

export default router;
