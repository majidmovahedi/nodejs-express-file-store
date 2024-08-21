import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserBlogController {
    // User Blog Read
    async allBlog(req: Request, res: Response) {
        const blogs = await prisma.blog.findMany();
        return res.json(blogs);
    }

    async singleBlog(req: Request, res: Response) {
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
    async allCategory(req: Request, res: Response) {
        const categories = await prisma.blogCategory.findMany();
        return res.json(categories);
    }
}
