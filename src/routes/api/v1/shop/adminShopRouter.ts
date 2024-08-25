import { Router } from 'express';
import { AdminShopController } from '@controllers/api/v1/shop/adminShopController';
import {
    paramSchema,
    categorySchema,
} from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';
import { authMiddleware, adminMiddleware } from '@middleware/auth';

const adminShopController = new AdminShopController();

const router = Router();

// router.use(authMiddleware, adminMiddleware);

// Admin Category Router
router.get('/category', adminShopController.allCategory);
router.post(
    '/category',
    categorySchema,
    validateRequestSchema,
    adminShopController.createCategory,
);
router.put(
    '/category/:id',
    paramSchema,
    categorySchema,
    validateRequestSchema,
    adminShopController.updateCategory,
);
router.delete('/category/:id', paramSchema, adminShopController.deleteCategory);

// Admin Blog Router
router.get('/', adminShopController.allProduct);

export default router;
