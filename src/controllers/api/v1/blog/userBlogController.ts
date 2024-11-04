import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserBlogController {
    // User Blog Read
    async allBlog(req: Request, res: Response) {
        const blogs = await prisma.blog.findMany();
        return res.status(200).json(blogs);
    }

    async singleBlog(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const blog = await prisma.blog.findUnique({
                where: { id: parseInt(id) },
            });

            if (!blog) {
                return res.status(404).json('This Blog is Not Exist!');
            }
            return res.status(200).json(blog);
        } catch (error) {
            console.error('Error during get single blog:', error);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    // User Category Read
    async allCategory(req: Request, res: Response) {
        const categories = await prisma.blogCategory.findMany();
        return res.status(200).json(categories);
    }
}
