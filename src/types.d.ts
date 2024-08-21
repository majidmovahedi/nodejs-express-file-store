import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
            };
        }
    }
}

export interface CustomError extends Error {
    code?: string;
}
