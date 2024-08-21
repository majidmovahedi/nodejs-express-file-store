import { Router } from 'express';
import { UserBlogController } from '@controllers/api/v1/blog/userBlogController';
import { paramSchema } from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';

const userBlogController = new UserBlogController();

const router = Router();

// User Category Router
router.get('/category', userBlogController.allCategory);

// User Blog Router
router.get('/', userBlogController.allBlog);
router.get(
    '/:id',
    paramSchema,
    validateRequestSchema,
    userBlogController.singleBlog,
);

export default router;
