import { Request , Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import { sendEmail } from "@utils/sendEmails";

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

    static async register (req : Request , res : Response ) {
        const type = Boolean(req.body.type);
        const password = await bcrypt.hash(req.body.password, 10);
        const { fullname, email } = req.body;
        const result = await prisma.user.create({
            data: {
                fullname,
                email,
                password,
                type
        },
    }).then((result)=>{
        return res.status(201).json(result);
    }).catch((error)=>{
        if (error.code == "P2002"){
            return res.status(409).json("This User is Already Exist!")
        }else{
            return res.status(520).json("Unknown Error, Please Try Again Later.")
        }
    })
    }

    static async senEmail (req : Request , res : Response ) {
        // const { email } = req.body;
        // const result = await prisma.user.create({})

        try {
            const { email, message } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email is required." });
            }

            const options = {
                to: email,
                subject: "Test",
                message: message,
            };

            await sendEmail(options);

            res.status(200).json({
                message: "Check your mail!",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }

    }

}
