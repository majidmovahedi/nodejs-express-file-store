import { Router } from 'express';
import userBlogRouter from './blog/userBlogRouter';
import adminBlogRouter from './blog/adminBlogRouter';
import userRouter from './user/userRouter';
import adminUserRouter from './user/adminUserRouter';
import userShopRouter from './shop/userShopRouter';
import adminShopRouter from './shop/adminShopRouter';

const router = Router();

router.use('/blog', userBlogRouter);
router.use('/admin/blog', adminBlogRouter);

router.use('/shop', userShopRouter);
router.use('/admin/shop', adminShopRouter);

router.use('/user', userRouter);
router.use('/admin/user', adminUserRouter);

export default router;
