import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { NextFunction } from 'express';

const UPLOAD_DIR = process.env.UPLOAD_DIR as string;

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

// export const blogImageUpload = multer({  storage: blogImageStorage });
export const productImageUpload = multer({ storage: productImageStorage });
export const productFileUpload = multer({ storage: productFileStorage });

// export const blogImageUpload = multer({
//     storage: blogImageStorage,
//     limits: {
//       fileSize: 5000000 // 5000000 Bytes = 5 MB
//     },
//     fileFilter(req, file, cb) {
//       if (!file.originalname.match(/\.(png|jpg)$/)) {
//          // upload only png and jpg format
//          return cb(new Error('Please upload a Image'))
//        }
//      cb(null, true)
//   }
//  });
