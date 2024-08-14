import { Router } from "express";
import { AdminUserController } from "@controllers/api/v1/user/adminUserController";
import { userSchema , userVerifySchema } from "@utils/validation/validationSchema";
import { validateRequestSchema } from "@utils/validation/validation";
import { authMiddleware , adminMiddleware } from "@middleware/auth";

const router = Router();

// Admin User Router
router.get('/' , authMiddleware , adminMiddleware , AdminUserController.allUser);
router.get('/:id', AdminUserController.singleUser);
router.post('/register', userSchema , validateRequestSchema , authMiddleware , adminMiddleware , AdminUserController.register);
router.post('/resend', userSchema , validateRequestSchema , AdminUserController.resend);
router.post('/verify', userSchema , userVerifySchema , validateRequestSchema , AdminUserController.verify);
router.post('/forget-password', userSchema , validateRequestSchema , AdminUserController.forgetPassword);
router.put('/new-password', userSchema , userVerifySchema , validateRequestSchema , AdminUserController.newPassword);
router.delete('/delete/:id', AdminUserController.delete);
router.post('/login', userSchema , validateRequestSchema , AdminUserController.login);
router.put('/change-password/:id', authMiddleware , adminMiddleware , AdminUserController.changePassword);

export default router;
