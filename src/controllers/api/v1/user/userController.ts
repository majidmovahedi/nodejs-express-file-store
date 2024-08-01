import { Request , Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

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
        const { email, message } = req.body;

        const MAIL_HOST = "smtp.liara.ir";
        const MAIL_PORT = 587;
        const MAIL_USER = process.env.MAIL_USER;
        const MAIL_PASSWORD = process.env.MAIL_PASSWORD;


        const transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            secure: false,
            auth: {
              user: MAIL_USER,
              pass: MAIL_PASSWORD,
            }
          });

          transporter.sendMail({
            from: 'MyName <support@mail.tadvir.ir>',
            to: email,
            subject: 'Test Email Subject',
            html: `<h1>${message}</h1>`
          })
            .then(() => res.json('OK, Email has been sent.'))
            .catch(console.error);


    };
}
