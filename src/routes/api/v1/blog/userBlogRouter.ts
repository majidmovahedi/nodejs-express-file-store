import { Router } from "express";
import { UserBlogController } from "@controllers/api/v1/blog/userBlogController";

const router = Router();

// User Blog Router
router.get('/', UserBlogController.allBlog);

// User Category Router
router.get('/category', UserBlogController.allCategory);

export default router;
