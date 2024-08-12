import { Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken";

const SecretKey = process.env.SECRET_KEY as string;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, SecretKey, (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            //@ts-ignore
            req.user = user;
            next();
        });
}
