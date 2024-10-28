import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID as string;
const CALLBACK_URL = process.env.CALLBACK_URL as string;
const ZARINPAL_API_BASE = process.env.ZARINPAL_API_BASE as string;

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

            const response = await axios.post(
                `${ZARINPAL_API_BASE}request.json`,
                {
                    MerchantID: ZARINPAL_MERCHANT_ID,
                    Amount: product.price,
                    CallbackURL: CALLBACK_URL,
                },
            );

            const { Authority, Status } = response.data;

            console.log(Status.code);
            //   if (Status === 100) {
            //     const paymentUrl = `https://sandbox.zarinpal.com/pg/StartPay/${Authority}`;
            //     res.json({ paymentUrl });
            //   } else {
            //     res.status(400).json({ error: 'Payment request failed' });
            //   }

            console.log('product log =>' + product.id);
            console.log('user log =>' + userId);
        } catch (error) {
            console.error('Error during user payment:', error);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    // async verifyPayment (req: Request, res: Response){

    // }

    async allCategory(req: Request, res: Response) {
        const categories = await prisma.productCategory.findMany();
        return res.status(200).json(categories);
    }
}
