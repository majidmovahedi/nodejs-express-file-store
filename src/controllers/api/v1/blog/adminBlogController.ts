import { Request , Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class AdminBlogController {

    // Admin Blog CRUD

    static async allBlog (req : Request , res : Response ) {
        const blogs = await prisma.blog.findMany();
        res.json(blogs);
    }

    static async singleBlog (req : Request , res : Response ) {
        const { id } = req.params;
        const blog = await prisma.blog.findUnique({
            where: { id : parseInt(id) }
        }).then((blog)=>{
            if(!blog){
                return res.status(520).json("This Blog is Not Exist!");
            }
            return res.json(blog);

        }).catch((error)=>{
            return res.json(error);
            // return res.status(520).json("Invalid parameter")
        })

    }

    static async createBlog (req : Request , res : Response ) {
        const createdAt = new Date();
        const updatedAt = new Date();

        const authorId = req.user.id;

        const categoryId = parseInt(req.body.categoryId);
        const { title, content, imageurl } = req.body;
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
        }
        return res.status(520).json("Unknown Error, Please Try Again Later.")

    })
    }

    static async updateBlog (req : Request , res : Response ) {
        const { id } = req.params;
        const updatedAt = new Date();

        const authorId = req.user.id;

        const categoryId = parseInt(req.body.categoryId);
        const { title, content, imageurl } = req.body;

        const blog = await prisma.blog.update({
            where: { id : parseInt(id) },
            data: {
            title,
            content,
            imageurl,
            categoryId,
            updatedAt,
            authorId
        },
        }).then((blog)=>{
            return res.status(201).json(blog);
        }).catch((error)=>{
            if (error.code == "P2025"){
                return res.status(409).json("This Id is Not Exist!")
            }
            return res.status(520).json("Unknown Error, Please Try Again Later.")

        })
    }

    static async deleteBlog (req : Request , res : Response ) {
        const { id } = req.params;

        const blog = await prisma.blog.delete({
            where: { id : parseInt(id) },
        }).then((blog)=>{
            return res.status(200).json("Blog is Deleted Successfully.");
        }).catch((error)=>{
            if (error.code == "P2025"){
                return res.status(409).json("This Id is Not Exist!")
            }else{
                return res.status(520).json("Unknown Error, Please Try Again Later.")
            }
        })
    }


    // Admin Category CRUD

    static async allCategory (req : Request , res : Response ) {
        const categories = await prisma.blogCategory.findMany();
        res.json(categories);
    }

    static async createCategory (req : Request , res : Response ) {

        const { title } = req.body;
        const category = await prisma.blogCategory.create({
            data: { title },
        }).then((category)=>{
            return res.status(201).json(category);
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

        const category = await prisma.blogCategory.update({
            where: { id : parseInt(id) },
            data: { title },
        }).then((category)=>{
            return res.status(201).json(category);
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

        const category = await prisma.blogCategory.delete({
            where: { id : parseInt(id) },
        }).then((category)=>{
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
