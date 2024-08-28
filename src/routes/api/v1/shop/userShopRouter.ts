import { Router } from 'express';
import { UserShopController } from '@controllers/api/v1/shop/userShopController';
import { authMiddleware } from '@middleware/auth';
import {
    paramSchema,
    categorySchema,
} from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';

const userShopController = new UserShopController();

const router = Router();

// User Category Router
router.get('/category', userShopController.allCategory);

// User Blog Router
router.get('/', userShopController.allProduct);
router.get(
    '/:id',
    paramSchema,
    validateRequestSchema,
    userShopController.singleProduct,
);
// router.post('/payment', authMiddleware, userShopController.payment);
// router.post('/payment', authMiddleware, userShopController.payment);
// router.get('/payment/callback', authMiddleware, userShopController.verify);
export default router;
