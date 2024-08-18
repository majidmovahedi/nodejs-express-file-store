import { Router } from "express";
import { AdminBlogController } from "@controllers/api/v1/blog/adminBlogController";
import { categorySchema , blogSchema } from "@utils/validation/validationSchema";
import { validateRequestSchema } from "@utils/validation/validation";
import { authMiddleware , adminMiddleware } from "@middleware/auth";

const router = Router();

router.use( authMiddleware , adminMiddleware );

// Admin Category Router
router.get('/category', AdminBlogController.allCategory);
router.post('/category', categorySchema , validateRequestSchema ,AdminBlogController.createCategory);
router.put('/category/:id', categorySchema , validateRequestSchema , AdminBlogController.updateCategory);
router.delete('/category/:id', AdminBlogController.deleteCategory);

// Admin Blog Router
router.get('/', AdminBlogController.allBlog);
router.get('/:id', AdminBlogController.singleBlog);
router.post('/', blogSchema , validateRequestSchema ,AdminBlogController.createBlog);
router.put('/:id', blogSchema , validateRequestSchema ,AdminBlogController.updateBlog);
router.delete('/:id', AdminBlogController.deleteBlog);

export default router;
