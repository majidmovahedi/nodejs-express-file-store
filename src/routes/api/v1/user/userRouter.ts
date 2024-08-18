import { Router } from "express";
import { UserController } from "@controllers/api/v1/user/userController";
import { AdminUserController } from "@controllers/api/v1/user/adminUserController";
import { userSchema , userVerifySchema , passwordSchema , updateSchema} from "@utils/validation/validationSchema";
import { validateRequestSchema } from "@utils/validation/validation";
import { authMiddleware } from "@middleware/auth";

const router = Router();

// User Router
router.get('/' , authMiddleware , UserController.singleUser);
router.post('/register', userSchema , validateRequestSchema , UserController.register);
router.post('/resend', userSchema , validateRequestSchema , UserController.resend);
router.post('/verify', userSchema , userVerifySchema , validateRequestSchema , UserController.verify);
router.post('/forget-password', userSchema , validateRequestSchema , AdminUserController.forgetPassword);
router.put('/new-password', userSchema , userVerifySchema , validateRequestSchema , AdminUserController.newPassword);
router.delete('/delete', authMiddleware ,UserController.delete);
router.post('/login', userSchema , validateRequestSchema , AdminUserController.login);
router.put('/change-password', passwordSchema , validateRequestSchema , authMiddleware , UserController.changePassword);
router.put('/update', authMiddleware , UserController.update);
// router.put('/update', updateSchema , validateRequestSchema , authMiddleware , UserController.update);

export default router;
