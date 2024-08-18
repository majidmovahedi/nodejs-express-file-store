import { Router } from "express";
import { UserController } from "@controllers/api/v1/user/userController";
import { AdminUserController } from "@controllers/api/v1/user/adminUserController";
import { userLoginSchema , commonSchema , passwordSchema , updateSchema, userRegisterSchema} from "@utils/validation/validationSchema";
import { validateRequestSchema } from "@utils/validation/validation";
import { authMiddleware } from "@middleware/auth";

const router = Router();

// User Router
router.get('/' , authMiddleware , UserController.singleUser);
router.post('/register', userRegisterSchema , validateRequestSchema , UserController.register);
router.post('/resend', commonSchema , validateRequestSchema , UserController.resend);
router.post('/verify', commonSchema , validateRequestSchema , UserController.verify);
router.post('/forget-password', commonSchema , validateRequestSchema , AdminUserController.forgetPassword);
router.put('/new-password', commonSchema , passwordSchema , validateRequestSchema , AdminUserController.newPassword);
router.delete('/delete', authMiddleware ,UserController.delete);
router.post('/login', userLoginSchema , validateRequestSchema , AdminUserController.login);
router.put('/change-password', passwordSchema , validateRequestSchema , authMiddleware , UserController.changePassword);
router.put('/update', updateSchema , validateRequestSchema , authMiddleware , UserController.update);

export default router;
