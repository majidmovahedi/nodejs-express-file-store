import { Router } from 'express';
import { AdminUserController } from '@controllers/api/v1/user/adminUserController';
import {
    paramSchema,
    userLoginSchema,
    adminChangePasswordSchema,
    adminUserUpdateSchema,
    adminUserRegisterSchema,
    userForgetPasswordSchema,
    newPasswordSchema,
} from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';
import { authMiddleware, adminMiddleware } from '@middleware/auth';

const adminUserController = new AdminUserController();

const router = Router();

// Admin User Router
router.get('/', authMiddleware, adminMiddleware, adminUserController.allUser);
router.get(
    '/:id',
    authMiddleware,
    adminMiddleware,
    paramSchema,
    validateRequestSchema,
    adminUserController.singleUser,
);
router.post(
    '/register',
    authMiddleware,
    adminMiddleware,
    adminUserRegisterSchema,
    validateRequestSchema,
    adminUserController.register,
);

router.post(
    '/forget-password',
    userForgetPasswordSchema,
    validateRequestSchema,
    adminUserController.forgetPassword,
);
router.put(
    '/new-password',
    newPasswordSchema,
    validateRequestSchema,
    adminUserController.newPassword,
);

router.delete(
    '/delete/:id',
    authMiddleware,
    adminMiddleware,
    paramSchema,
    validateRequestSchema,
    adminUserController.delete,
);
router.post(
    '/login',
    userLoginSchema,
    validateRequestSchema,
    adminUserController.login,
);
router.put(
    '/change-password/:id',
    authMiddleware,
    adminMiddleware,
    paramSchema,
    adminChangePasswordSchema,
    validateRequestSchema,
    adminUserController.changePassword,
);
router.put(
    '/update/:id',
    authMiddleware,
    adminMiddleware,
    paramSchema,
    adminUserUpdateSchema,
    validateRequestSchema,
    adminUserController.update,
);

export default router;
