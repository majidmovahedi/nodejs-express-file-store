import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR as string;

const allowedMimeTypes = ['image/png', 'image/jpeg'];

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // cb(new Error('Invalid file type. Only PNG and JPEG are allowed.'), false);
        cb(null, false);
    }
};

// Storage configuration for blog images
const blogImageStorage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(`${UPLOAD_DIR}images/blog`)) {
            fs.mkdirSync(`${UPLOAD_DIR}images/blog`, { recursive: true });
        }
        cb(null, `${UPLOAD_DIR}images/blog`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const blogImageUpload = multer({
    storage: blogImageStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
}).single('imageurl');
