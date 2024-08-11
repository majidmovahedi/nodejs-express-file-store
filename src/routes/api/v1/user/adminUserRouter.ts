import { Router } from "express";
import { UserController } from "@controllers/api/v1/user/userController";
import { userSchema , userVerifySchema } from "@utils/validation/validationSchema";
import { validateRequestSchema } from "@utils/validation/validation";

const router = Router();

// User Router
router.get('/', UserController.allUser);
router.get('/:id', UserController.singleUser);
router.post('/register', userSchema , validateRequestSchema , UserController.register);
router.post('/resend', userSchema , validateRequestSchema , UserController.resend);
router.post('/verify', userSchema , userVerifySchema , validateRequestSchema , UserController.verify);
router.post('/forget-password', userSchema , validateRequestSchema , UserController.forgetPassword);
router.put('/new-password', userSchema , userVerifySchema , validateRequestSchema , UserController.newPassword);
router.delete('/delete/:id', UserController.delete);
router.post('/login', userSchema , validateRequestSchema , UserController.login);

export default router;
