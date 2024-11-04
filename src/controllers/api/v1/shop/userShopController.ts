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
            console.error('Error during search... ', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async payment(req: Request, res: Response) {
        const userId = Number(req.user?.id);
        try {
            const { productId } = req.body;
            const product = await prisma.product.findUnique({
                where: { id: parseInt(productId) },
            });

            if (!product) {
                return res.status(404).json('This Product is Not Exist!');
            }

            const response = await axios.post(ZIBAL_API_URL, {
                merchant: MERCHANT_ID,
                amount: product.price * 10,
                callbackUrl: `${ZIBAL_CALLBACK_URL}?productId=${product.id}`,
            });

            const { trackId, result } = response.data;

            if (result !== 100) {
                return res
                    .status(400)
                    .json({ error: 'Payment request failed' });
            }

            // Create a new Purchase and Payment record with "PENDING" status
            const purchase = await prisma.purchase.create({
                data: {
                    userId,
                    productId: product.id,
                    amount: product.price,
                    status: 'PENDING',
                },
            });

            await prisma.payment.create({
                data: {
                    purchaseId: purchase.id,
                    userId,
                    amount: product.price,
                    status: 'PENDING',
                    paymentMethod: 'Zibal',
                },
            });

            return res.status(200).json({
                message: 'Payment initiated',
                productId: product.id,
                paymentUrl: `https://gateway.zibal.ir/start/${trackId}`,
            });
        } catch (error) {
            console.error('Error during payment initiation:', error);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    async verifyPayment(req: Request, res: Response) {
        const userId = Number(req.user?.id);
        try {
            const { productId, trackId } = req.body;

            const product = await prisma.product.findUnique({
                where: { id: parseInt(productId) },
            });

            if (!product) {
                return res.status(404).json('This Product is Not Exist!');
            }
            const purchase = await prisma.purchase.findFirst({
                where: {
                    userId,
                    productId: product.id,
                },
            });

            if (!purchase) {
                return res.status(404).json('This purchase is Not Exist!');
            }

            try {
                const response = await axios.post(ZIBAL_VERIFY_URL, {
                    merchant: MERCHANT_ID,
                    trackId: trackId,
                });

                const { result, amount } = response.data;

                if (result !== 100) {
                    // Failed payment, mark records as "FAILED"
                    await prisma.purchase.update({
                        where: { id: purchase.id },
                        data: { status: 'FAILED' },
                    });

                    await prisma.payment.updateMany({
                        where: { userId, purchaseId: purchase.id },
                        data: { status: 'FAILED' },
                    });
                    return res
                        .status(400)
                        .json({ error: 'Payment verification failed' });
                }

                // Successful payment, update records
                await prisma.purchase.update({
                    where: { id: purchase.id },
                    data: { status: 'COMPLETED' },
                });

                await prisma.payment.updateMany({
                    where: { purchaseId: purchase.id, userId },
                    data: {
                        amount: amount / 10,
                        status: 'COMPLETED',
                        paymentDate: new Date().toISOString(),
                    },
                });

                return res
                    .status(200)
                    .json({ message: 'Payment verified successfully' });
            } catch (error) {
                console.error('Error during verify user payment:', error);
                return res.status(500).json('An unexpected error occurred.');
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async allCategory(req: Request, res: Response) {
        const categories = await prisma.productCategory.findMany();
        return res.status(200).json(categories);
    }
}
