import { Router } from 'express';
import { AdminShopController } from '@controllers/api/v1/shop/adminShopController';
import {
    paramSchema,
    categorySchema,
    productSchema,
    productUpdateSchema,
} from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';
import { authMiddleware, adminMiddleware } from '@middleware/auth';
import { uploadFile } from '@utils/upload/multerFile';
import { multerMiddleware } from '@middleware/multerMiddleware';

const adminShopController = new AdminShopController();

const router = Router();

router.use(authMiddleware, adminMiddleware);

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

// Upload File
router.post('/upload', uploadFile, adminShopController.uploadFileProduct);

// Admin Shop Router
router.get('/', adminShopController.allProduct);
router.get(
    '/:id',
    paramSchema,
    validateRequestSchema,
    adminShopController.singleProduct,
);
router.post(
    '/',
    multerMiddleware,
    productSchema,
    validateRequestSchema,
    adminShopController.createProduct,
);
router.put(
    '/:id',
    multerMiddleware,
    paramSchema,
    productUpdateSchema,
    validateRequestSchema,
    adminShopController.updateProduct,
);
router.delete('/:id', paramSchema, adminShopController.deleteProduct);

export default router;
