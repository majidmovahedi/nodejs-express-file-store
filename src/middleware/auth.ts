import { Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken";

const SecretKey = process.env.SECRET_KEY as string;

// interface JwtPayload {
//     id: string;
// }

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, SecretKey);
        // console.log(payload)
        // console.log(next(payload.id))
        return next();

    } catch (err) {
        res.sendStatus(403);
    }
}
