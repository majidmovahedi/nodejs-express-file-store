import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { transporter } from '@utils/auth/sendEmails';
import { getRandomInt } from '@utils/auth/codeGenerator';
const prisma = new PrismaClient();

export class UserController {
    static async singleUser(req: Request, res: Response) {
        const userId = req.user.id;
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error during get single user :', error);
            return res.status(520).json(error);
        }
    }

    static async register(req: Request, res: Response) {
        const { fullname, email } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);

        // Create the user
        const result = await prisma.user
            .create({
                data: {
                    fullname,
                    email,
                    password,
                },
            })
            .then(async (result) => {
                // Add OTP Code to otp Table
                const userId = result?.id;
                const code = getRandomInt();
                await prisma.otp.create({
                    data: {
                        userId,
                        code,
                    },
                });

                // Send Code to User Email
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Activation Code',
                    html: `<h1>Your Activation Code is : ${code}</h1>`,
                });

                return res.status(201).json(result);
            })
            .catch((error) => {
                if (error.code == 'P2002') {
                    return res.status(409).json('This User is Already Exist!');
                } else if (error.code == 'EMESSAGE') {
                    return res.status(500).json('Email server error');
                } else {
                    return res
                        .status(520)
                        .json('Unknown Error, Please Try Again Later.');
                }
            });
    }

    static async resend(req: Request, res: Response) {
        const { email } = req.body;

        // Find User
        const user = await prisma.user
            .findUnique({
                where: { email: email },
            })
            .then(async (user) => {
                if (user?.is_active == true) {
                    return res.status(400).json('Your Account is Active!');
                }

                try {
                    // Add OTP Code to otp Table
                    const userId = Number(user?.id);
                    const code = getRandomInt();
                    const result = await prisma.otp.create({
                        data: {
                            userId,
                            code,
                        },
                    });

                    // Send Code to User Email
                    await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: email,
                        subject: 'Activation Code',
                        html: `<h1>Your Activation Code is : ${code}</h1>`,
                    });
                    return res.json(result);
                } catch (error) {
                    if (!user) {
                        return res.status(404).json('This User is Not Exist!');
                    }
                    return res
                        .status(520)
                        .json('Unknown Error, Please Try Again Later.');
                }
            });
        // .catch((user)=>{
        //     if(!user){
        //         return res.status(404).json("This User is Not Exist!");
        //     }
        //     return res.status(520).json("Unknown Error, Please Try Again Later.");
        // })
    }

    static async verify(req: Request, res: Response) {
        const { email, code } = req.body;

        const user = await prisma.user
            .findUnique({
                where: { email: email },
            })
            .then(async (user) => {
                if (user?.is_active == true) {
                    return res.status(200).json('Your Account is Active!');
                }

                const latestOtp = await prisma.otp
                    .findFirst({
                        where: { userId: user?.id },
                        orderBy: {
                            id: 'desc',
                        },
                        take: 1,
                    })
                    .then(async (latestOtp) => {
                        if (
                            latestOtp?.code == code &&
                            Number(latestOtp?.expire_time.getTime()) +
                                10 * 1000 * 60 >
                                Date.now()
                        ) {
                            await prisma.user
                                .update({
                                    where: { email: email },
                                    data: { is_active: true },
                                })
                                .then(async () => {
                                    await prisma.otp.deleteMany({
                                        where: { userId: user?.id },
                                    });
                                    return res
                                        .status(200)
                                        .json('Your Account is Activate');
                                });
                        } else {
                            return res
                                .status(408)
                                .json('This Code is Invalid or expired!');
                        }
                    });
            })
            .catch((user) => {
                if (email != user.email) {
                    return res.status(520).json('This User is Not Exist!');
                }
            });
    }

    static async delete(req: Request, res: Response) {
        const userId = req.user.id;

        const user = await prisma.user
            .findUnique({
                where: { id: userId },
            })
            .then(async (user) => {
                //Delete User's Blog
                await prisma.blog.deleteMany({
                    where: { authorId: user?.id },
                });

                //Delete User's Product
                ////////

                //Delete Otp
                await prisma.otp.deleteMany({
                    where: { userId: user?.id },
                });

                //Delete User
                await prisma.user
                    .delete({
                        where: { id: user?.id },
                    })
                    .then(() => {
                        res.status(200).json('User is Deleted Successfully.');
                    });
            })
            .catch((error) => {
                return res.json(error);
            });
    }

    static async changePassword(req: Request, res: Response) {
        const userId = req.user.id;

        const { password, newPassword, repeatNewPassword } = req.body;

        if (newPassword != repeatNewPassword) {
            return res.json('New Password Does Not Match');
        }

        const user = await prisma.user
            .findUnique({
                where: { id: userId },
            })
            .then(async (user) => {
                const newPass = await bcrypt.hash(newPassword, 10);
                const userPassword: any = user?.password;

                const match = await bcrypt.compare(password, userPassword);

                if (!match) {
                    return res.status(401).json('Password is Incorrect');
                }

                await prisma.user
                    .update({
                        where: { id: user?.id },
                        data: { password: newPass },
                    })
                    .then(() => {
                        return res.status(200).json('Password changed');
                    })
                    .catch((error) => {
                        return res.json(error);
                    });
            });
    }

    static async update(req: Request, res: Response) {
        const userId = req.user.id;

        const { fullname } = req.body;

        const user = await prisma.user
            .findUnique({
                where: { id: userId },
            })
            .then(async (user) => {
                const update = await prisma.user
                    .update({
                        where: { id: user?.id },
                        data: {
                            fullname,
                        },
                    })
                    .then((update) => {
                        return res.status(200).json(update);
                    })
                    .catch((error) => {
                        // if (error.code == 'P2002') {
                        //     return res
                        //         .status(409)
                        //         .json('This Email is Already Taken!');
                        // }
                        return res.json(error);
                    });
            });
    }
}
