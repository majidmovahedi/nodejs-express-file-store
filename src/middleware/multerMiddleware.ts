import { imageUpload } from '@utils/upload/multerImage';
import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

export const multerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    imageUpload(req, res, (err) => {
        if (err instanceof MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res
                    .status(400)
                    .json({ message: 'File size exceeds 5MB limit.' });
            }
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        next();
    });
};
