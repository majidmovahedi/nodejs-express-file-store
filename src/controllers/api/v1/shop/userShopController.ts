import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const ZIBAL_API_URL = process.env.ZIBAL_API_URL as string;
const ZIBAL_VERIFY_URL = process.env.ZIBAL_VERIFY_URL as string;
const ZIBAL_CALLBACK_URL = process.env.ZIBAL_CALLBACK_URL as string;
const MERCHANT_ID = process.env.MERCHANT_ID as string;

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
                return res.status(404).json('This Product is Not Exist!');
            }
            return res.status(200).json(product);
        } catch (error) {
            console.error('Error during get single product:', error);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    async search(req: Request, res: Response) {
        const query = req.query.q as string;

        if (!query) {
            return res
                .status(400)
                .json({ error: 'Query parameter "q" is required' });
        }

        try {
            const results = await prisma.product.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } },
                    ],
                },
            });

            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async payment(req: Request, res: Response) {
        const userId = Number(req.user?.id);
        const { productId } = req.body;
        try {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(productId) },
            });

            if (!product) {
                return res.status(404).json('This Product is Not Exist!');
            }

            const response = await axios.post(ZIBAL_API_URL, {
                merchant: MERCHANT_ID,
                amount: product.price,
                callbackUrl: `${ZIBAL_CALLBACK_URL}?productId=${product.id}`,
            });

            const { trackId, result } = response.data;
            if (result !== 100) {
                return res
                    .status(400)
                    .json({ error: 'Payment request failed' });
            }
            return res.status(200).json({
                message: 'Payment initiated',
                productId: product.id,
                paymentUrl: `https://gateway.zibal.ir/start/${trackId}`,
            });
        } catch (error) {
            console.error('Error during user payment:', error);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    async verifyPayment(req: Request, res: Response) {}

    async allCategory(req: Request, res: Response) {
        const categories = await prisma.productCategory.findMany();
        return res.status(200).json(categories);
    }
}
