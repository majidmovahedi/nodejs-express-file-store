import { Router } from "express";
import { BlogController } from "../../../../controllers/api/v1/blog/userBlogController";

const router = Router();

router.get('/', BlogController.getBlog);
// router.post('/', BlogController.insertBlog);


export default router;
