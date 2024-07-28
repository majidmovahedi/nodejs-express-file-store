import { Router } from "express";
import { validateBody } from 'express-joi-validations';

import { AdminBlogController } from "../../../../controllers/api/v1/blog/adminBlogController";
import { schema } from "../../../../utils/validationBlogCategory";
const router = Router();

router.get('/', AdminBlogController.getBlog);

router.get('/category', validateBody(schema) , AdminBlogController.getCategory);
router.post('/category', AdminBlogController.createCategory);
router.put('/category/:id', AdminBlogController.updateCategory);
router.delete('/category/:id', AdminBlogController.deleteCategory);


export default router;
