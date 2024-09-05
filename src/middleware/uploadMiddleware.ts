// import { NextFunction, Request, Response } from 'express';

// import { blogImageUpload } from "@utils/upload/multer";
// import { MulterError } from "multer";

// export const uploadMiddlware = blogImageUpload(req, res, (err: MulterError | any) => {
//     if (err instanceof MulterError) {
//       // Handle Multer-specific errors
//       if (err.code === 'LIMIT_FILE_SIZE') {
//         return res.status(413).json({ error: 'File size exceeds limit' });
//       }
//       // Handle other Multer errors
//       return res.status(400).json({ error: 'A Multer error occurred during upload' });
//     } else if (err) {
//       // Handle non-Multer errors
//       return res.status(500).json({ error: 'An unknown error occurred' });
//     }
// });
