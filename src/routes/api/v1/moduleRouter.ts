import { Router } from "express";
import userBlogRouter from "./blog/userBlogRouter";
import adminBlogRouter from "./blog/adminBlogRouter";
// import userBlogRouter from "./blog/userBlogRouter";
import adminUserRouter from "./user/adminUserRouter";


const router = Router();

router.use('/blog', userBlogRouter);
router.use('/admin/blog', adminBlogRouter);

// router.use('/user', );
router.use('/admin/user', adminUserRouter);


export default router;
