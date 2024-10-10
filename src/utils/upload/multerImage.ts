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

// Storage configuration for images
const imageStorage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(`${UPLOAD_DIR}images`)) {
            fs.mkdirSync(`${UPLOAD_DIR}images`, { recursive: true });
        }
        cb(null, `${UPLOAD_DIR}images`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const imageUpload = multer({
    storage: imageStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
}).single('imageurl');
