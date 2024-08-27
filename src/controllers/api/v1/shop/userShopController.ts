import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
// import createPaymentLink from '@utils/payment/pay.ir';
import axios from 'axios';

const prisma = new PrismaClient();

export class UserShopController {
    // User Shop CRUD

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

    // async payment(req: Request, res: Response) {
    //     const { amount } = req.body;
    // }

    // async verify(req: Request, res: Response) {
    //     const { token, ref_id } = req.query;
    // }

    // User Category CRUD

    async allCategory(req: Request, res: Response) {
        const categories = await prisma.productCategory.findMany();
        return res.status(200).json(categories);
    }
}
