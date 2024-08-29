import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR as string;

// Set up Multer storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Use the original name or create a unique name
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

export default upload;
