import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { CustomError } from 'types';
import path from 'path';
import fs from 'fs-extra';
import { s3Client } from '@utils/upload/multerFile';

const UPLOAD_DIR = process.env.UPLOAD_DIR;

const prisma = new PrismaClient();

export class AdminShopController {
    // Admin Shop CRUD

    async allProduct(req: Request, res: Response) {
        const products = await prisma.product.findMany();
        return res.status(200).json(products);
    }

    async singleProduct(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
            });

            if (!product) {
                return res.status(520).json('This Product is Not Exist!');
            }
            return res.status(200).json(product);
        } catch (error) {
            console.error('Error during get single product:', error);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    async createProduct(req: Request, res: Response) {
        const createdAt = new Date();
        const updatedAt = new Date();
        const authorId = Number(req.user?.id);
        const categoryId = parseInt(req.body.categoryId);
        const price = parseFloat(req.body.price);
        const { title, content, fileurl } = req.body;

        const productImage = req.file;
        const imageurl = productImage?.path.replace(/\\/g, '/') || '';

        try {
            if (!productImage) {
                return res.status(400).json('No image uploaded.');
            }
            const result = await prisma.product.create({
                data: {
                    title,
                    content,
                    imageurl,
                    fileurl,
                    price,
                    createdAt,
                    updatedAt,
                    authorId,
                    categoryId,
                },
            });

            return res.status(201).json(result);
        } catch (error) {
            const prismaError = error as CustomError;

            if (prismaError.code === 'P2003') {
                return res.status(404).json({
                    message: 'This Category does not exist!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    async updateProduct(req: Request, res: Response) {
        const { id } = req.params;
        const updatedAt = new Date();
        const authorId = Number(req.user?.id);
        // const categoryId = parseInt(req.body.categoryId);
        // const price = parseFloat(req.body.price);
        const { title, content, fileurl, categoryId, price } = req.body;
        const productImage = req.file;
        const imageurl = productImage?.path.replace(/\\/g, '/') || '';
        try {
            // Find Product
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
            });

            // Delete Old Image if Upload New Image
            if (product) {
                if (product.imageurl) {
                    const filePath = path.join(
                        `${UPLOAD_DIR}images`,
                        path.basename(product.imageurl),
                    );
                    await fs.remove(filePath);
                }
            }
            // Update Product
            const newProduct = await prisma.product.update({
                where: { id: product?.id },
                data: {
                    title,
                    content,
                    imageurl,
                    fileurl,
                    price,
                    categoryId,
                    updatedAt,
                    authorId,
                },
            });

            return res.status(200).json(newProduct);
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2025') {
                return res.status(404).json({
                    message: 'This Id does not exist!',
                    code: prismaError.code,
                });
            } else if (prismaError.code === 'P2003') {
                return res.status(404).json({
                    message: 'This Category does not exist!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    async deleteProduct(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
            });

            if (product) {
                if (product.imageurl) {
                    const filePath = path.join(
                        `${UPLOAD_DIR}images`,
                        path.basename(product.imageurl),
                    );
                    await fs.remove(filePath);
                }
            }

            await prisma.product.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).json('Product is Deleted Successfully.');
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2025') {
                return res.status(404).json({
                    message: 'This Id does not exist!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    //Upload file Product

    async uploadFileProduct(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const file = req.file;
        const bucketName = process.env.LIARA_BUCKET_NAME as string;
        const fileKey = `uploads/${Date.now()}_${file.originalname}`; // Unique file key

        // Prepare params for S3 upload
        const uploadParams = {
            Bucket: bucketName,
            Key: fileKey,
            Body: file.buffer, // Use the buffer for file upload
            ContentType: file.mimetype, // Set MIME type
        };

        try {
            // Upload file to S3 bucket
            const result = await s3Client.send(
                new PutObjectCommand(uploadParams),
            );
            console.log('File uploaded successfully:', result);

            // Send success response
            res.status(200).json({
                message: 'File uploaded successfully',
                //   fileUrl: `${process.env.LIARA_ENDPOINT}/${bucketName}/${fileKey}`, // Construct file URL
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({ message: 'Error uploading file', error });
        }
    }

    // Admin Category CRUD

    async allCategory(req: Request, res: Response) {
        const categories = await prisma.productCategory.findMany();
        return res.status(200).json(categories);
    }

    async createCategory(req: Request, res: Response) {
        const { title } = req.body;
        try {
            const category = await prisma.productCategory.create({
                data: { title },
            });

            return res.status(201).json(category);
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2002') {
                return res.status(404).json({
                    message: 'This Category is Already Exists!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    async updateCategory(req: Request, res: Response) {
        const { id } = req.params;
        const { title } = req.body;

        try {
            const category = await prisma.productCategory.update({
                where: { id: parseInt(id) },
                data: { title },
            });

            return res.status(200).json(category);
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2025') {
                return res.status(404).json({
                    message: 'This Id does not exist!',
                    code: prismaError.code,
                });
            } else if (prismaError.code === 'P2002') {
                return res.status(404).json({
                    message: 'This Category is Already Exists!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    async deleteCategory(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await prisma.productCategory.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).json('Category is Deleted Successfully.');
        } catch (error) {
            const prismaError = error as CustomError;
            if (prismaError.code === 'P2025') {
                return res.status(404).json({
                    message: 'This Id does not exist!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }
}
