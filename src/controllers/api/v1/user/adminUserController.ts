import { Request , Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import { transporter } from "@utils/auth/sendEmails";
import { getRandomInt } from "@utils/auth/codeGenerator";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient()

export class AdminUserController {

    // User CRUD

    static async allUser (req : Request , res : Response ) {
        const Users = await prisma.user.findMany();
        res.json(Users);
    }

    static async singleUser (req : Request , res : Response ) {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id : parseInt(id) }
        }).then((user)=>{
            if(!user){
                return res.status(520).json("This User is Not Exist!")
            }
            return res.json(user);

        }).catch((error)=>{
            return res.status(520).json(error);
        })

    }

    static async register (req : Request , res : Response ) {
        // const type = Boolean(req.body.type);
        const password = await bcrypt.hash(req.body.password, 10);
        const { fullname, email , is_active , type} = req.body;

        const result = await prisma.user.create({
            data: {
                fullname,
                email,
                password,
                type,
                is_active
        },
        }).then(async (result)=>{

            return res.status(201).json(result);

        }).catch((error)=>{
            if (error.code == "P2002"){
                return res.status(409).json("This User is Already Exist!")
            }
            else{
                return res.status(520).json("Unknown Error, Please Try Again Later.")
            }
        })
    }

    // static async resend (req : Request , res : Response ) {
    //     const { email } = req.body;

    //     // Find User
    //     const user = await prisma.user.findUnique({
    //         where: { email : email , is_active: false }
    //     }).then(async(user)=>{

    //         // Add OTP Code to otp Table
    //         const userId = parseInt(user?.id);
    //         const code = getRandomInt();
    //         const result =await prisma.otp.create({
    //             data:{
    //                 userId,
    //                 code,
    //             },
    //         }).then((result)=>{
    //             res.status(200).json(result);
    //         }).catch((error)=>{
    //             return res.status(520).json("Unknown Error, Please Try Again Later.")
    //         })

    //         // Send Code to User Email
    //         await transporter.sendMail({
    //             from: process.env.EMAIL,
    //             to: email,
    //             subject: 'Activation Code',
    //             html: `<h1>Your Activation Code is : ${code}</h1>`
    //         }).then(() => {
    //             res.json('OK, Email has been sent.');
    //         }).catch(()=>{ res.status(520).json("Unknown Error, Please Try Again Later.")})

    //     }).catch((user)=>{
    //         if(user === null){
    //             return res.status(520).json("This User is Not Exist!")
    //         }
    //     })

    // };

    // static async verify (req : Request , res : Response ) {
    //     const { email, code } = req.body;

    //     const user = await prisma.user.findUnique({
    //         where: { email : email , is_active: false }
    //     })
    //     .then(async (user)=>{
    //         const latestOtp = await prisma.otp.findFirst({
    //             where: { userId : user?.id },
    //             orderBy: {
    //                 id: 'desc',
    //             },
    //             take: 1,
    //     })
    //     .then(async (latestOtp)=>{
    //         if( latestOtp?.code == code && (parseInt(latestOtp?.expire_time.getTime()) + 10 * 1000 * 60) > Date.now()){

    //             await prisma.user.update({
    //                 where: { email: email },
    //                 data: { is_active: true },
    //             })
    //             .then(async ()=>{
    //                 await prisma.otp.deleteMany({
    //                     where: { userId: user?.id }
    //                 })
    //                 return res.json("user activate")
    //             })

    //         }else{
    //             return res.status(520).json("This Code is Invalid or expired!")
    //         }
    //     })

    //     }).catch((user)=>{
    //         if(user === null){
    //             return res.status(520).json("This User is Not Exist!")
    //         }
    //     })

    // };

    static async delete (req : Request , res : Response ) {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id : parseInt(id) }
        })
        .then(async(user)=>{

            //Delete User's Blog
            await prisma.blog.deleteMany({
                where: { authorId: user?.id },
            })

            //Delete User's Product
            ////////


            //Delete Otp
            await prisma.otp.deleteMany({
                where: { userId: user?.id }
            })

            //Delete User
            await prisma.user.delete({
                    where: { id : user?.id },
                }).then(()=>{
                    res.status(200).json("User is Deleted Successfully.");
                })

        })
        .catch((error)=>{
            return res.status(409).json("This User is Not Exist!")
        })

    }

    static async forgetPassword (req : Request , res : Response ) {
        const { email } = req.body;

        // Find User
        const user = await prisma.user.findUnique({
            where: { email : email , is_active: true }
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
                res.status(520).json("Unknown Error, Please Try Again Later.")
            })

            // Send Code to User Email
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Reset Password Code',
                html: `<h1>Your Reset Password Code is : ${code}</h1>`
            }).then(() => {
                res.json('OK, Email has been sent.');
            }).catch(()=>{ res.status(520).json("Unknown Error, Please Try Again Later.")})

        }).catch((user)=>{
            if(user === null){
                return res.status(520).json("This User is Not Exist!")
            }
        })

    };

    static async newPassword (req : Request , res : Response ) {
        const { email, code } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);

        const user = await prisma.user.findUnique({
            where: { email : email }
        })
        .then(async(user)=>{
            const latestOtp = await prisma.otp.findFirst({
                where: { userId : user?.id },
                orderBy: {
                    id: 'desc',
                },
                take: 1,
        })
        .then(async (latestOtp)=>{
            if( latestOtp?.code == code && (Number(latestOtp?.expire_time.getTime()) + 10 * 1000 * 60) > Date.now()){

                await prisma.user.update({
                    where: { email: email },
                    data: { password: password },
                })
                .then(async ()=>{
                    await prisma.otp.deleteMany({
                        where: { userId: user?.id }
                    })
                    return res.json("Your Password is Changed!")
                })

            }else{
                return res.status(520).json("This Code is Invalid or expired!")
            }
        })

        }).catch((user)=>{
            if(user === null){
                return res.status(520).json("This User is Not Exist!")
            }
        })

    }

    static async login (req : Request , res : Response ) {
        const { email , password } = req.body;
        const SecretKey = process.env.SECRET_KEY as string;
        // Find User
        const user = await prisma.user.findUnique({
            where: { email : email , is_active: true}
        }).then(async (user)=>{

            const userPassword : any = user?.password;
            const match = await bcrypt.compare(password , userPassword );

            if(match) {
                const token = jwt.sign({id: user?.id}, SecretKey , {expiresIn: '24h'})
                res.json({ token })
            }else{
                res.json("Username Or Password is Incorrect!")
            }

        }).catch((user)=>{
            if(user === null){
                return res.status(520).json("This User is Not Exist!")
            }
        })

    };

    static async changePassword (req : Request , res : Response ) {
        const userId = req.params.id;


        const { newPassword , repeatNewPassword } = req.body;

        if(newPassword != repeatNewPassword){
            return res.json("New Password Does Not Match");
        }

        const user = await prisma.user.findUnique({
            where: { id : parseInt(userId) }
        }).then(async (user)=>{

            const newPass = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: user?.id },
                data: { password: newPass },
            }).then(()=>{
                return res.status(200).json("Password changed");
            }).catch((error)=>{
                return res.json(error);
            })

        })

    };

    static async update (req : Request , res : Response ) {
        const userId = parseInt(req.params.id);

        const { fullname , email , type , is_active} = req.body;

        const user = await prisma.user.findUnique({
            where: { id : userId }
        }).then(async (user)=>{

            const update = await prisma.user.update({
                where: { id: user?.id },
                data: {
                    fullname,
                    email,
                    type,
                    is_active
                },
            }).then((update)=>{
                return res.status(200).json(update);
            }).catch((error)=>{
                if (error.code == "P2002"){
                    return res.status(409).json("This Email is Already Taken!");
                }
                return res.json(error);
            })

        })

    };

}
