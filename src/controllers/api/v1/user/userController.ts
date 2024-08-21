import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { transporter } from '@utils/auth/sendEmails';
import { getRandomInt } from '@utils/auth/codeGenerator';
import { CustomError } from 'types';
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

        try {
            // Create the user
            const result = await prisma.user.create({
                data: {
                    fullname,
                    email,
                    password,
                },
            });

            // Add OTP Code to otp Table
            const userId = result.id;
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
        } catch (error) {
            const prismaError = error as CustomError;

            if (prismaError.code === 'P2002') {
                return res.status(409).json({
                    message: 'This user already exists!',
                    code: prismaError.code,
                });
            } else if (prismaError.code === 'EMESSAGE') {
                return res.status(500).json({
                    message: 'Email server error!',
                    code: prismaError.code,
                });
            } else {
                console.error('Unexpected error:', prismaError);
                return res.status(520).json({
                    message: 'Unknown error, please try again later.',
                    details: prismaError.message,
                });
            }
        }
    }

    static async resend(req: Request, res: Response) {
        const { email } = req.body;

        try {
            // Find User
            const user = await prisma.user.findUnique({
                where: { email: email },
            });

            if (!user) {
                return res.status(404).json('This User Does Not Exist!');
            }

            if (user.is_active) {
                return res.status(400).json('Your Account is Active!');
            }

            // Add OTP Code to otp Table
            const userId = Number(user.id);
            const code = getRandomInt();
            const otpResult = await prisma.otp.create({
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

            return res.json(otpResult);
        } catch (error) {
            console.error('Error during resend code for user:', error);
            return res
                .status(520)
                .json('An error occurred while resend code for user.');
        }
    }

    static async verify(req: Request, res: Response) {
        const { email, code } = req.body;

        try {
            // Find User
            const user = await prisma.user.findUnique({
                where: { email: email },
            });

            if (!user) {
                return res.status(520).json('This User Does Not Exist!');
            }

            if (user.is_active) {
                return res.status(200).json('Your Account is Active!');
            }

            // Find the latest OTP for the user
            const latestOtp = await prisma.otp.findFirst({
                where: { userId: user.id },
                orderBy: { id: 'desc' },
                take: 1,
            });

            if (
                latestOtp?.code == code &&
                Number(latestOtp?.expire_time.getTime()) + 10 * 1000 * 60 >
                    Date.now()
            ) {
                // Update user to set the account as active
                await prisma.user.update({
                    where: { email: email },
                    data: { is_active: true },
                });

                // Delete all OTPs for the user
                await prisma.otp.deleteMany({
                    where: { userId: user.id },
                });

                return res.status(200).json('Your Account is Activated');
            } else {
                return res.status(408).json('This Code is Invalid or Expired!');
            }
        } catch (error) {
            console.error('Error during account activation:', error);
            return res
                .status(520)
                .json('Unknown Error, Please Try Again Later.');
        }
    }

    static async delete(req: Request, res: Response) {
        const userId = req.user.id;

        try {
            // Find the user by ID
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            // Delete User's Blog
            await prisma.blog.deleteMany({
                where: { authorId: user?.id },
            });

            // Delete User's Products
            // Uncomment and implement as needed
            // await prisma.product.deleteMany({
            //     where: { authorId: user?.id },
            // });

            // Delete Otp
            await prisma.otp.deleteMany({
                where: { userId: user?.id },
            });

            // Delete User
            await prisma.user.delete({
                where: { id: user?.id },
            });

            return res.status(200).json('User is deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
            return res
                .status(500)
                .json('An error occurred while deleting the user.');
        }
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
