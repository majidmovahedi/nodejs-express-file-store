import { Router } from "express";
import { AdminBlogController } from "@controllers/api/v1/blog/adminBlogController";
import { categorySchema , blogSchema } from "@utils/validationSchema";
import { validateRequestSchema } from "@utils/validation";

const router = Router();

router.get('/', AdminBlogController.allBlog);
router.post('/', blogSchema , validateRequestSchema ,AdminBlogController.createBlog);


router.get('/category', AdminBlogController.allCategory);
router.post('/category', categorySchema , validateRequestSchema ,AdminBlogController.createCategory);
router.put('/category/:id', categorySchema , validateRequestSchema , AdminBlogController.updateCategory);
router.delete('/category/:id', AdminBlogController.deleteCategory);

export default router;
