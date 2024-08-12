import { Router } from "express";
import { UserBlogController } from "@controllers/api/v1/blog/userBlogController";

const router = Router();

// User Blog Router

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get a list of all blogs
 */
//Get All Blogs
router.get('/', UserBlogController.allBlog);
router.get('/:id', UserBlogController.singleBlog);

// User Category Router
router.get('/category', UserBlogController.allCategory);

export default router;
