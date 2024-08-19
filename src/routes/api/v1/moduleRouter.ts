import { Router } from 'express';
import userBlogRouter from './blog/userBlogRouter';
import adminBlogRouter from './blog/adminBlogRouter';
import userRouter from './user/userRouter';
import adminUserRouter from './user/adminUserRouter';

const router = Router();

router.use('/blog', userBlogRouter);
router.use('/admin/blog', adminBlogRouter);

router.use('/user', userRouter);
router.use('/admin/user', adminUserRouter);

export default router;
