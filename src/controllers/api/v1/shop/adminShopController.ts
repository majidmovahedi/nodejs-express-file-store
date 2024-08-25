import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomError } from 'types';

const prisma = new PrismaClient();

export class AdminShopController {
    // Admin Shop CRUD

    async allProduct(req: Request, res: Response) {
        const products = await prisma.product.findMany();
        return res.status(200).json(products);
    }

    async singleProduct(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
            });

            if (!product) {
                return res.status(520).json('This Product is Not Exist!');
            }
            return res.status(200).json(product);
        } catch (error) {
            console.error('Error during get single product:', error);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    // Admin Category CRUD

    async allCategory(req: Request, res: Response) {
        const categories = await prisma.productCategory.findMany();
        return res.status(200).json(categories);
    }

    async createCategory(req: Request, res: Response) {
        const { title } = req.body;
        try {
            const category = await prisma.productCategory.create({
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
            const category = await prisma.productCategory.update({
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
            await prisma.productCategory.delete({
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
