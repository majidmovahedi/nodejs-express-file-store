import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const SecretKey = process.env.SECRET_KEY as string;

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, SecretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user as { id: number };

        next();
    });
}

export async function adminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const userId = req.user?.id;

    const user = await prisma.user
        .findUnique({
            where: { id: userId },
        })
        .then(async (user) => {
            if (user?.type == true) {
                next();
            } else {
                res.status(401).json('You Dont Have Permission!');
            }
        });
}
