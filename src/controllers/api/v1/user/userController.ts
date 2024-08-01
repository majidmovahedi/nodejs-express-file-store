import { Request , Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import { transporter } from "@utils/sendEmails";
import { getRandomInt } from "@utils/codeGenerator";
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

    static async resend (req : Request , res : Response ) {
        const { email } = req.body;
        const generateCode = getRandomInt();

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Activation Code',
            html: `<h1>Your Activation Code is : ${generateCode}</h1>`
        }).then(() => res.json('OK, Email has been sent.'))
          .catch(console.error);


    };
}
