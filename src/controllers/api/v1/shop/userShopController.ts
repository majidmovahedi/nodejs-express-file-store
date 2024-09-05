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

    // async payment(req: Request, res: Response) {
    //     const API_KEY = 'QGVARFN-YNKMMSD-P5K26PM-NF2CNG0';
    //     const { amount, currency, order_id } = req.body;

    //     try {
    //         const response = await axios.post(
    //           'https://api.coingate.com/v2/orders',
    //           {
    //             price_amount: amount,
    //             price_currency: currency,
    //             order_id: order_id,
    //             order_description: 'Description of the product',
    //             success_url: 'https://majidmovahedi.ir',
    //             cancel_url: 'https://your-cancel-url.com',
    //           },
    //           {
    //             headers: {
    //               'Content-Type': 'application/json',
    //               'Authorization': `Bearer ${API_KEY}`,
    //             }
    //           }
    //         );

    //         res.json(response.data);
    //       } catch (error) {
    //         console.error(error);
    //         res.status(500).send('Error creating payment');
    //       }
    // }

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
