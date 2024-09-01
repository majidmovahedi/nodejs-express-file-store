import { Request, Response, NextFunction } from 'express';
import { productImageUpload, productFileUpload } from '@utils/upload/multer';
// // import multer from 'multer';

// Middleware to handle uploads to both locations
export const uploadMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const productImage = productImageUpload.single('imageurl');
    const productFile = productFileUpload.single('fileurl');

    productImage(req, res, (err) => {
        if (err) return next(err);

        productFile(req, res, (err) => {
            if (err) return next(err);

            next();
        });
    });
};
