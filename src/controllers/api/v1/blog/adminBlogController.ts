import { Request , Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class AdminBlogController {

    static async allBlog (req : Request , res : Response ) {
        const blogs = await prisma.blog.findMany()
        res.json(blogs)
    }

    static async createBlog (req : Request , res : Response ) {
        const createdAt = new Date();
        const updatedAt = new Date();
        const authorId = 1;
        const categoryId = parseInt(req.body.categoryId)
        const { title, content, imageurl } = req.body
        const result = await prisma.blog.create({
            data: {
            title,
            content,
            imageurl,
            createdAt,
            updatedAt,
            authorId,
            categoryId
        },
    }).then((result)=>{
        return res.status(201).json(result);
    }).catch((error)=>{
        if (error.code == "P2003"){
            return res.status(520).json("This Category is Not Exist!")
        }else{
            return res.status(520).json("Unknown Error, Please Try Again Later.")
        }
    })
    }

    static async allCategory (req : Request , res : Response ) {
        const categories = await prisma.blogCategory.findMany()
        res.json(categories)
    }

    static async createCategory (req : Request , res : Response ) {

        const { title } = req.body
        const result = await prisma.blogCategory.create({
            data: { title },
        }).then((result)=>{
            return res.status(201).json(result);
        }).catch((error)=>{
            if (error.code == "P2002"){
                return res.status(409).json("This Category is Already Exist!")
            }else{
                return res.status(520).json("Unknown Error, Please Try Again Later.")
            }
        })


    }

    static async updateCategory (req : Request , res : Response ) {
        const { id } = req.params;
        const { title } = req.body;

        const result = await prisma.blogCategory.update({
            where: { id : Number(id) },
            data: { title: title }
        }).then((result)=>{
            return res.status(201).json(result);
        }).catch((error)=>{
            if (error.code == "P2025"){
                return res.status(409).json("This Id is Not Exist!")
            }else{
                return res.status(520).json("Unknown Error, Please Try Again Later.")
            }
        })
    }

    static async deleteCategory (req : Request , res : Response ) {
        const { id } = req.params;

        const result = await prisma.blogCategory.delete({
            where: { id : Number(id) },
        }).then((result)=>{
            return res.status(200).json("Category is Deleted Successfully.");
        }).catch((error)=>{
            if (error.code == "P2025"){
                return res.status(409).json("This Id is Not Exist!")
            }else{
                return res.status(520).json("Unknown Error, Please Try Again Later.")
            }
        })
    }


}
