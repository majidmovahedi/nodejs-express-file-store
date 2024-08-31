import { productImageUpload, blogImageUpload } from '@utils/upload/multer';

export const uploadProductImageMiddleware =
    productImageUpload.single('imageurl');
export const uploadBlogImageMiddleware = blogImageUpload.single('imageurl');
