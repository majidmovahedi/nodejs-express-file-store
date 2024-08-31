import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR as string;

// // File filter for images (JPG, PNG, GIF)
// const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     if (['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };

//   // File filter for ZIP and RAR files
//   const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     if (['application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed'].includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Please upload a ZIP or RAR file.'), false);
//     }
//   };

// // Storage configuration for blog images
// const blogImageStorage: StorageEngine = multer.diskStorage({
//     destination: (req, file, cb) => {
//         if (!fs.existsSync(`${UPLOAD_DIR}images/blog`)) {
//             fs.mkdirSync(`${UPLOAD_DIR}images/blog`, { recursive: true });
//         }
//         cb(null, `${UPLOAD_DIR}images/blog`);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// Storage configuration for product images
const productImageStorage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(`${UPLOAD_DIR}images/product`)) {
            fs.mkdirSync(`${UPLOAD_DIR}images/product`, { recursive: true });
        }
        cb(null, `${UPLOAD_DIR}images/product`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Storage configuration for product files
const productFileStorage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(`${UPLOAD_DIR}products`)) {
            fs.mkdirSync(`${UPLOAD_DIR}products`, { recursive: true });
        }
        cb(null, `${UPLOAD_DIR}products`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// export const blogImageUpload = multer({ storage: blogImageStorage });
export const productImageUpload = multer({ storage: productImageStorage });
export const productFileUpload = multer({ storage: productFileStorage });
