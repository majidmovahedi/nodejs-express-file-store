import { Router } from "express";
import userBlogRouter from "./blog/userBlogRouter";
import adminBlogRouter from "./blog/adminBlogRouter";

const router = Router();

router.use('/blog', userBlogRouter);
router.use('/admin/blog', adminBlogRouter);

export default router;
