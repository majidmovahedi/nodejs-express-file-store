import { Router } from 'express';
import { AdminUserController } from '@controllers/api/v1/user/adminUserController';
import {
    paramSchema,
    userLoginSchema,
    changePasswordSchema,
    adminUserUpdateSchema,
    adminUserRegisterSchema,
    userForgetPasswordSchema,
    newPasswordSchema,
} from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';
import { authMiddleware, adminMiddleware } from '@middleware/auth';

const router = Router();

// Admin User Router
router.get('/', authMiddleware, adminMiddleware, AdminUserController.allUser);
router.get(
    '/:id',
    authMiddleware,
    adminMiddleware,
    paramSchema,
    validateRequestSchema,
    AdminUserController.singleUser,
);
router.post(
    '/register',
    authMiddleware,
    adminMiddleware,
    adminUserRegisterSchema,
    validateRequestSchema,
    AdminUserController.register,
);

router.post(
    '/forget-password',
    userForgetPasswordSchema,
    validateRequestSchema,
    AdminUserController.forgetPassword,
);
router.put(
    '/new-password',
    newPasswordSchema,
    validateRequestSchema,
    AdminUserController.newPassword,
);

router.delete(
    '/delete/:id',
    authMiddleware,
    adminMiddleware,
    paramSchema,
    validateRequestSchema,
    AdminUserController.delete,
);
router.post(
    '/login',
    userLoginSchema,
    validateRequestSchema,
    AdminUserController.login,
);
router.put(
    '/change-password/:id',
    authMiddleware,
    adminMiddleware,
    paramSchema,
    changePasswordSchema,
    validateRequestSchema,
    AdminUserController.changePassword,
);
router.put(
    '/update/:id',
    authMiddleware,
    adminMiddleware,
    paramSchema,
    adminUserUpdateSchema,
    validateRequestSchema,
    AdminUserController.update,
);

export default router;
