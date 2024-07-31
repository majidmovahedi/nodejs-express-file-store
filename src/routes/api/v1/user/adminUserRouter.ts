import { Router } from "express";
import { UserController } from "@controllers/api/v1/user/userController";

const router = Router();

// User Router
router.get('/', UserController.allUser);
router.get('/:id', UserController.singleUser);

export default router;
