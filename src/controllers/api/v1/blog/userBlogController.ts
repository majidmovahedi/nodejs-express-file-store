import { Request , Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class UserBlogController {

    // User Blog Read
    static async allBlog (req : Request , res : Response ) {
        const blogs = await prisma.blog.findMany()
        res.json(blogs)
    }

    // User Category Read
    static async allCategory (req : Request , res : Response ) {
        const categories = await prisma.blogCategory.findMany()
        res.json(categories)
    }

}
