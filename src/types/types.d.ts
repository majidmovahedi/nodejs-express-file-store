import { Request, Response, NextFunction } from 'express';
import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}