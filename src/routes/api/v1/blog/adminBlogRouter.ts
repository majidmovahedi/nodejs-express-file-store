import { Router } from "express";
import { AdminBlogController } from "@controllers/api/v1/blog/adminBlogController";
import { schema } from "@utils/validationBlogCategory";
import { validateRequestSchema } from "@utils/validation";

const router = Router();

router.get('/', AdminBlogController.allBlog);

router.get('/category', AdminBlogController.allCategory);
router.post('/category', schema , validateRequestSchema ,AdminBlogController.createCategory);
router.put('/category/:id', schema , validateRequestSchema , AdminBlogController.updateCategory);
router.delete('/category/:id', AdminBlogController.deleteCategory);


export default router;
