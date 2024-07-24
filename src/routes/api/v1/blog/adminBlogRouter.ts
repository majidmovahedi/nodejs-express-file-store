import { Router , Request , Response } from "express";
import { AdminBlogController } from "../../../../controllers/api/v1/blog/adminBlogController";

const router = Router();

router.get('/', AdminBlogController.getBlog);


router.get('/category', AdminBlogController.getCategory);
router.post('/category', AdminBlogController.createCategory);
router.put('/category/:id', AdminBlogController.updateCategory);
router.delete('/category/:id', AdminBlogController.deleteCategory);

export default router;
