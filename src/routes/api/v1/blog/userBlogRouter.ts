import { Router } from "express";
import { UserBlogController } from "@controllers/api/v1/blog/userBlogController";

const router = Router();

// User Blog Router

/**
 * @swagger
 * /api/v1/blog:
 *   get:
 *     summary: Get a list of all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{}]
 *       400:
 *         description: Bad Request
 *         content:
 *          application/json:
 *            example:
 *             error:
 *              message: "Bad Request"
 */
//Get All Blogs
router.get('/', UserBlogController.allBlog);
router.get('/:id', UserBlogController.singleBlog);

// User Category Router
router.get('/category', UserBlogController.allCategory);

export default router;
