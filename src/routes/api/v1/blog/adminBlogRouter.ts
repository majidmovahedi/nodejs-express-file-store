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

const router = Router();

router.use(authMiddleware, adminMiddleware);

// Admin Category Router
router.get('/category', AdminBlogController.allCategory);
router.post(
    '/category',
    categorySchema,
    validateRequestSchema,
    AdminBlogController.createCategory,
);
router.put(
    '/category/:id',
    paramSchema,
    categorySchema,
    validateRequestSchema,
    AdminBlogController.updateCategory,
);
router.delete('/category/:id', paramSchema, AdminBlogController.deleteCategory);

// Admin Blog Router
router.get('/', AdminBlogController.allBlog);
router.get(
    '/:id',
    paramSchema,
    validateRequestSchema,
    AdminBlogController.singleBlog,
);
router.post(
    '/',
    blogSchema,
    validateRequestSchema,
    AdminBlogController.createBlog,
);
router.put(
    '/:id',
    paramSchema,
    blogUpdateSchema,
    validateRequestSchema,
    AdminBlogController.updateBlog,
);
router.delete('/:id', paramSchema, AdminBlogController.deleteBlog);

export default router;
