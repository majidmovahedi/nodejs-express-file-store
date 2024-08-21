declare namespace Express {
    export interface Request {
        user?: {
            id: number;
        };
    }
}

export interface CustomError extends Error {
    code?: string;
}
