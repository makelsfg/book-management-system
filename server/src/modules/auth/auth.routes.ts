import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { getMe, postLogin, postLogout } from './auth.controller';

const router = Router();

router.post('/login', asyncHandler(postLogin));
router.post('/logout', postLogout);
router.get('/me', getMe);

export default router;
