import { Request , Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class UserController {

    // User CRUD

    static async allUser (req : Request , res : Response ) {
        const Users = await prisma.user.findMany();
        res.json(Users);
    }

    static async singleUser (req : Request , res : Response ) {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id : Number(id) }
        }).then((user)=>{
            if(user === null){
                return res.status(520).json("This User is Not Exist!")
            }else{
                return res.json(user);
            }
        }).catch((error)=>{
            return res.status(520).json("Invalid parameter")
        })

    }

}
