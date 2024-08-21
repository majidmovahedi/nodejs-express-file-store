import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomError } from 'types';

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
        const { title, content, imageurl } = req.body;

        try {
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
        res.json(categories);
    }

    async createCategory(req: Request, res: Response) {
        const { title } = req.body;
        const category = await prisma.blogCategory
            .create({
                data: { title },
            })
            .then((category) => {
                return res.status(201).json(category);
            })
            .catch((error) => {
                if (error.code == 'P2002') {
                    return res
                        .status(409)
                        .json('This Category is Already Exist!');
                } else {
                    return res
                        .status(520)
                        .json('Unknown Error, Please Try Again Later.');
                }
            });
    }

    async updateCategory(req: Request, res: Response) {
        const { id } = req.params;
        const { title } = req.body;

        const category = await prisma.blogCategory
            .update({
                where: { id: parseInt(id) },
                data: { title },
            })
            .then((category) => {
                return res.status(201).json(category);
            })
            .catch((error) => {
                if (error.code == 'P2025') {
                    return res.status(409).json('This Id is Not Exist!');
                } else {
                    return res
                        .status(520)
                        .json('Unknown Error, Please Try Again Later.');
                }
            });
    }

    async deleteCategory(req: Request, res: Response) {
        const { id } = req.params;

        const category = await prisma.blogCategory
            .delete({
                where: { id: parseInt(id) },
            })
            .then((category) => {
                return res
                    .status(200)
                    .json('Category is Deleted Successfully.');
            })
            .catch((error) => {
                if (error.code == 'P2025') {
                    return res.status(409).json('This Id is Not Exist!');
                } else {
                    return res
                        .status(520)
                        .json('Unknown Error, Please Try Again Later.');
                }
            });
    }
}
