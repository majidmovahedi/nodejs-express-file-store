import { Router } from "express";
import { AdminUserController } from "@controllers/api/v1/user/adminUserController";
import { userSchema , userVerifySchema , passwordSchema , paramSchema , updateSchema} from "@utils/validation/validationSchema";
import { validateRequestSchema } from "@utils/validation/validation";
import { authMiddleware , adminMiddleware } from "@middleware/auth";

const router = Router();

router.use( authMiddleware , adminMiddleware );

// Admin User Router
router.get('/', AdminUserController.allUser);
router.get('/:id', paramSchema , validateRequestSchema , AdminUserController.singleUser);
router.post('/register', userSchema , validateRequestSchema , AdminUserController.register);
// router.post('/resend', userSchema , validateRequestSchema , AdminUserController.resend);
// router.post('/verify', userSchema , userVerifySchema , validateRequestSchema , AdminUserController.verify);

// router.post('/forget-password', userSchema , validateRequestSchema , AdminUserController.forgetPassword);
// router.put('/new-password', userSchema , userVerifySchema , validateRequestSchema , AdminUserController.newPassword);

router.delete('/delete/:id', paramSchema , validateRequestSchema , AdminUserController.delete);
router.post('/login', userSchema , validateRequestSchema , AdminUserController.login);
router.put('/change-password/:id', paramSchema , passwordSchema , validateRequestSchema , AdminUserController.changePassword);
router.put('/update/:id', updateSchema , paramSchema , validateRequestSchema , AdminUserController.update);

export default router;
