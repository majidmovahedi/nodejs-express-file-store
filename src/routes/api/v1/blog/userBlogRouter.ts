import { Router } from "express";
import { UserBlogController } from "../../../../controllers/api/v1/blog/userBlogController";

const router = Router();

router.get('/', UserBlogController.allBlog);
router.get('/category', UserBlogController.allCategory);


export default router;
