import upload from '@utils/upload/multer';

export const uploadMiddleware = upload.single('imageurl');
