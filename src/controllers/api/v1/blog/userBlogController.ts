import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserBlogController {
    // User Blog Read
    static async allBlog(req: Request, res: Response) {
        const blogs = await prisma.blog.findMany();
        res.json(blogs);
    }

    static async singleBlog(req: Request, res: Response) {
        const { id } = req.params;
        const blog = await prisma.blog
            .findUnique({
                where: { id: parseInt(id) },
            })
            .then((blog) => {
                if (blog === null) {
                    return res.status(520).json('This Blog is Not Exist!');
                } else {
                    return res.json(blog);
                }
            })
            .catch((error) => {
                return res.status(520).json('Invalid parameter');
            });
    }

    // User Category Read
    static async allCategory(req: Request, res: Response) {
        const categories = await prisma.blogCategory.findMany();
        res.json(categories);
    }
}
