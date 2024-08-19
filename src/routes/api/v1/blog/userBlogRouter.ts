import { Router } from 'express';
import { UserBlogController } from '@controllers/api/v1/blog/userBlogController';
import { paramSchema } from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';

const router = Router();

// User Category Router
router.get('/category', UserBlogController.allCategory);

// User Blog Router
router.get('/', UserBlogController.allBlog);
router.get(
    '/:id',
    paramSchema,
    validateRequestSchema,
    UserBlogController.singleBlog,
);

export default router;
