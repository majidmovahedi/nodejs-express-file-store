import { Request , Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export class BlogController {

    static async getBlog (req : Request , res : Response ) {
        const blogs = await prisma.blog.findMany()
        console.log(Date.now());
        res.json(blogs)
    }

    // static async insertBlog (req : Request , res : Response ) {
    //     const createdAt = new Date();
    //     const updatedAt = new Date();

    //     const { title, content, imageurl, authorId, categoryId } = req.body
    //     const result = await prisma.blog.create({
    //         data: {
    //         title,
    //         content,
    //         imageurl,
    //         createdAt,
    //         updatedAt,
    //         authorId,
    //         categoryId
    //     },
    // })
    // res.json(result)
    // }
}
