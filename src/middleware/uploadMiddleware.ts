// import { Request, Response, NextFunction } from 'express';

// import { productImageUpload , productFileUpload } from '@utils/upload/multer';

// export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {

//     productFileUpload.single('fileurl')(req, res, (err) => {
//         if (err) {
//           return next(err);
//         }
//     productImageUpload.single('imageurl')(req, res, (err) => {
//         if (err) {
//         return next(err);
//         }

//       next();
//     });
//   });
// };

// Middleware to handle file uploads
// export const handleImageUpload = productImageUpload.single('imageurl');
// export const handleProductFileUpload = productFileUpload.single('fileurl');
