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
        }).then(async (result)=>{
            res.status(201).json(result);


        // Add OTP Code to otp Table
        const userId = Number(result?.id);
        const code = getRandomInt();
        const otpCode =await prisma.otp.create({
            data:{
                userId,
                code,
            },
        })

        // Send Code to User Email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Activation Code',
            html: `<h1>Your Activation Code is : ${code}</h1>`
        })
        // .then(() => {
        //     res.json('OK, Email has been sent.');
        // })
        // .catch(()=>{ res.status(520).json("Unknown Error, Please Try Again Later.")})


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

        // Find User
        const user = await prisma.user.findUnique({
            where: { email : email }
        }).then(async(user)=>{

            // Add OTP Code to otp Table
            const userId = Number(user?.id);
            const code = getRandomInt();
            const result =await prisma.otp.create({
                data:{
                    userId,
                    code,
                },
            }).then((result)=>{
                res.status(200).json(result);
            }).catch((error)=>{
                return res.status(520).json("Unknown Error, Please Try Again Later.")
            })

            // Send Code to User Email
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Activation Code',
                html: `<h1>Your Activation Code is : ${code}</h1>`
            }).then(() => {
                res.json('OK, Email has been sent.');
            }).catch(()=>{ res.status(520).json("Unknown Error, Please Try Again Later.")})

        }).catch((user)=>{
            if(user === null){
                return res.status(520).json("This User is Not Exist!")
            }
        })

    };

    static async verify (req : Request , res : Response ) {
        const { email, code } = req.body;

        const user = await prisma.user.findUnique({
            where: { email : email }
        }).then(async(user)=>{
            const otpCode = await prisma.otp.findMany({
                where: { userId : user?.id }
            })
            .then((otpCode)=>{
                otpCode.map((item)=>{
                    if( item.code == code && (item.expire_time.getTime() + 30 * 60000) > Date.now()){

                        const updateUser = prisma.user.update({
                            where: {
                              email: email,
                            },
                            data: {
                              is_active: true,
                            },
                          }).then((updateUser)=>{
                            res.json("user activate")
                            
                          })

                    }else{
                        res.json("This Code is Invalid! or expired")
                    }
                })


            })
            .catch((otpCode)=>{
                // return res.status(520).json("This Code is Invalid!")
            })

        }).catch((user)=>{
            if(user === null){
                return res.status(520).json("This User is Not Exist!")
            }
        })

    };
}
