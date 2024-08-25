import { Router } from 'express';
import { AdminShopController } from '@controllers/api/v1/shop/adminShopController';
import {
    paramSchema,
    categorySchema,
} from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';

const adminShopController = new AdminShopController();

const router = Router();

// Admin Category Router
router.get('/category', adminShopController.allCategory);


// Admin Blog Router
router.get('/', adminShopController.allProduct);
router.get(
    '/:id',
    paramSchema,
    validateRequestSchema,
    adminShopController.singleProduct,
);
export default router;
