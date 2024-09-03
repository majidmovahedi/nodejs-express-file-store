import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomError } from 'types';
import path from 'path';
import fs from 'fs-extra';

const UPLOAD_DIR = process.env.UPLOAD_DIR;

const prisma = new PrismaClient();

export class AdminBlogController {
    // Admin Blog CRUD

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
                return res.status(520).json('This Blog is Not Exist!');
            }
            return res.status(200).json(blog);
        } catch (error) {
            console.error('Error during get single blog:', error);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    async createBlog(req: Request, res: Response) {
        const createdAt = new Date();
        const updatedAt = new Date();
        const authorId = Number(req.user?.id);
        const categoryId = parseInt(req.body.categoryId);
        const { title, content } = req.body;

        const blogImage = req.file;
        const imageurl = blogImage?.path.replace(/\\/g, '/') || '';

        try {
            if (!blogImage) {
                return res.status(400).json('No image uploaded.');
            }

            const result = await prisma.blog.create({
                data: {
                    title,
                    content,
                    imageurl,
                    createdAt,
                    updatedAt,
                    authorId,
                    categoryId,
                },
            });

            return res.status(201).json(result);
        } catch (error) {
            const prismaError = error as CustomError;

            if (prismaError.code === 'P2003') {
                return res.status(404).json({
                    message: 'This Category does not exist!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    async updateBlog(req: Request, res: Response) {
        const { id } = req.params;
        const updatedAt = new Date();
        const authorId = Number(req.user?.id);
        const categoryId = parseInt(req.body.categoryId);
        const { title, content, imageurl } = req.body;

        try {
            const blog = await prisma.blog.update({
                where: { id: parseInt(id) },
                data: {
                    title,
                    content,
                    imageurl,
                    categoryId,
                    updatedAt,
                    authorId,
                },
            });

            return res.status(200).json(blog);
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2025') {
                return res.status(404).json({
                    message: 'This Id does not exist!',
                    code: prismaError.code,
                });
            } else if (prismaError.code === 'P2003') {
                return res.status(404).json({
                    message: 'This Category does not exist!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    async deleteBlog(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const blog = await prisma.blog.findUnique({
                where: { id: parseInt(id) },
            });

            if (blog) {
                if (blog.imageurl) {
                    const filePath = path.join(
                        `${UPLOAD_DIR}images/blog`,
                        path.basename(blog.imageurl),
                    );
                    await fs.remove(filePath);
                }
            }

            await prisma.blog.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).json('Blog is Deleted Successfully.');
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2025') {
                return res.status(404).json({
                    message: 'This Id does not exist!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    // Admin Category CRUD

    async allCategory(req: Request, res: Response) {
        const categories = await prisma.blogCategory.findMany();
        return res.status(200).json(categories);
    }

    async createCategory(req: Request, res: Response) {
        const { title } = req.body;
        try {
            const category = await prisma.blogCategory.create({
                data: { title },
            });

            return res.status(201).json(category);
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2002') {
                return res.status(404).json({
                    message: 'This Category is Already Exists!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    async updateCategory(req: Request, res: Response) {
        const { id } = req.params;
        const { title } = req.body;

        try {
            const category = await prisma.blogCategory.update({
                where: { id: parseInt(id) },
                data: { title },
            });

            return res.status(200).json(category);
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2025') {
                return res.status(404).json({
                    message: 'This Id does not exist!',
                    code: prismaError.code,
                });
            } else if (prismaError.code === 'P2002') {
                return res.status(404).json({
                    message: 'This Category is Already Exists!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    async deleteCategory(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await prisma.blogCategory.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).json('Category is Deleted Successfully.');
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2025') {
                return res.status(404).json({
                    message: 'This Id does not exist!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }
}
