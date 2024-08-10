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
router.post('/delete', userSchema , validateRequestSchema , UserController.delete);

export default router;
