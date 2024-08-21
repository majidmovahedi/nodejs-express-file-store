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

const router = Router();

// User Router
router.get('/', authMiddleware, UserController.singleUser);
router.post(
    '/register',
    userRegisterSchema,
    validateRequestSchema,
    UserController.register,
);
router.post(
    '/resend',
    userResendSchema,
    validateRequestSchema,
    UserController.resend,
);
router.post(
    '/verify',
    userVerifySchema,
    validateRequestSchema,
    UserController.verify,
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
router.delete('/delete', authMiddleware, UserController.delete);
router.post(
    '/login',
    userLoginSchema,
    validateRequestSchema,
    AdminUserController.login,
);
router.put(
    '/change-password',
    userChangePasswordSchema,
    validateRequestSchema,
    authMiddleware,
    UserController.changePassword,
);
router.put(
    '/update',
    userUpdateSchema,
    validateRequestSchema,
    authMiddleware,
    UserController.update,
);

export default router;
