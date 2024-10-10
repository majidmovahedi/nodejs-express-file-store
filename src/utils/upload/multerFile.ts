import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';

// Multer setup for handling file uploads
const storage = multer.memoryStorage();

const allowedMimeTypes = [
    'application/zip',
    'application/x-rar-compressed',
    'application/octet-stream',
];

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // cb(new Error('Invalid file type. Only PNG and JPEG are allowed.'), false);
        cb(null, false);
    }
};

export const uploadFile = multer({
    storage: storage,
    fileFilter: fileFilter,
}).single('file');

// Initialize S3 client for Liara's object storage
export const s3Client = new S3Client({
    region: 'default',
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY as string,
        secretAccessKey: process.env.LIARA_SECRET_KEY as string,
    },
});
