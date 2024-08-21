import { Router } from 'express';
import { UserController } from '@controllers/api/v1/user/userController';
import { AdminUserController } from '@controllers/api/v1/user/adminUserController';
import {
    userRegisterSchema,
    userResendSchema,
    userVerifySchema,
    userForgetPasswordSchema,
    newPasswordSchema,
    userLoginSchema,
    userChangePasswordSchema,
    userUpdateSchema,
} from '@utils/validation/validationSchema';
import { validateRequestSchema } from '@utils/validation/validation';
import { authMiddleware } from '@middleware/auth';

const adminUserController = new AdminUserController();
const userController = new UserController();

const router = Router();

// User Router
router.get('/', authMiddleware, userController.singleUser);
router.post(
    '/register',
    userRegisterSchema,
    validateRequestSchema,
    userController.register,
);
router.post(
    '/resend',
    userResendSchema,
    validateRequestSchema,
    userController.resend,
);
router.post(
    '/verify',
    userVerifySchema,
    validateRequestSchema,
    userController.verify,
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
router.delete('/delete', authMiddleware, userController.delete);
router.post(
    '/login',
    userLoginSchema,
    validateRequestSchema,
    adminUserController.login,
);
router.put(
    '/change-password',
    userChangePasswordSchema,
    validateRequestSchema,
    authMiddleware,
    userController.changePassword,
);
router.put(
    '/update',
    userUpdateSchema,
    validateRequestSchema,
    authMiddleware,
    userController.update,
);

export default router;
