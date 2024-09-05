import { Router } from 'express';
import { AdminBlogController } from '@controllers/api/v1/blog/adminBlogController';
import {
    categorySchema,
    blogSchema,
    blogUpdateSchema,
    paramSchema,
} from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';
import { authMiddleware, adminMiddleware } from '@middleware/auth';
import { blogImageUpload } from '@utils/upload/multer';

const adminBlogController = new AdminBlogController();

const router = Router();

router.use(authMiddleware, adminMiddleware);

// Admin Category Router
router.get('/category', adminBlogController.allCategory);
router.post(
    '/category',
    categorySchema,
    validateRequestSchema,
    adminBlogController.createCategory,
);
router.put(
    '/category/:id',
    paramSchema,
    categorySchema,
    validateRequestSchema,
    adminBlogController.updateCategory,
);
router.delete('/category/:id', paramSchema, adminBlogController.deleteCategory);

// Admin Blog Router
router.get('/', adminBlogController.allBlog);
router.get(
    '/:id',
    paramSchema,
    validateRequestSchema,
    adminBlogController.singleBlog,
);
router.post(
    '/',
    blogImageUpload,
    blogSchema,
    validateRequestSchema,
    adminBlogController.createBlog,
);
router.put(
    '/:id',
    blogImageUpload,
    paramSchema,
    blogUpdateSchema,
    validateRequestSchema,
    adminBlogController.updateBlog,
);
router.delete('/:id', paramSchema, adminBlogController.deleteBlog);

export default router;
