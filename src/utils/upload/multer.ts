import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR as string;

// Storage configuration for blog images
const blogImageStorage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(`${UPLOAD_DIR}/images/blog`)) {
            fs.mkdirSync(`${UPLOAD_DIR}/images/blog`, { recursive: true });
        }
        cb(null, `${UPLOAD_DIR}/images/blog`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Storage configuration for product images
const productImageStorage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(`${UPLOAD_DIR}/images/product`)) {
            fs.mkdirSync(`${UPLOAD_DIR}/images/product`, { recursive: true });
        }
        cb(null, `${UPLOAD_DIR}/images/product`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const blogImageUpload = multer({ storage: blogImageStorage });
export const productImageUpload = multer({ storage: productImageStorage });
