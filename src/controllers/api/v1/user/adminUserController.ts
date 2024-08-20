import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { transporter } from '@utils/auth/sendEmails';
import { getRandomInt } from '@utils/auth/codeGenerator';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

interface CustomError extends Error {
    code?: string;
}

export class AdminUserController {
    // User CRUD

    static async allUser(req: Request, res: Response) {
        const Users = await prisma.user.findMany();
        return res.json(Users);
    }

    static async singleUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const user = await prisma.user
                .findUnique({
                    where: { id: parseInt(id) },
                });

                if (!user) {
                    return res.status(520).json('This User is Not Exist!');
                }
                return res.json(user);

            } catch (error) {
                console.error('Error during get single user :', error);
                return res.status(520).json(error);
            }

    }

    static async register(req: Request, res: Response) {
        const password = await bcrypt.hash(req.body.password, 10);
        const { fullname, email, is_active, type } = req.body;

        try {
            const result = await prisma.user
            .create({
                data: {
                    fullname,
                    email,
                    password,
                    type,
                    is_active,
                },
            });
            return res.status(201).json(result);

        } catch (error) {
            const prismaError = error as CustomError;

            if (prismaError.code === 'P2002') {
                return res.status(409).json({
                    message: 'This user already exists!',
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

    static async delete(req: Request, res: Response) {
        const { id } = req.params;

        try {
            // Find the user by ID
            const user = await prisma.user.findUnique({
                where: { id: parseInt(id) },
            });

            if (!user) {
                return res.status(404).json('This User does not exist!');
            }

            // Delete User's Blog
            await prisma.blog.deleteMany({
                where: { authorId: user.id },
            });

            // Delete User's Products
            // Uncomment and implement as needed
            // await prisma.product.deleteMany({
            //     where: { authorId: user.id },
            // });

            // Delete Otp
            await prisma.otp.deleteMany({
                where: { userId: user.id },
            });

            // Delete User
            await prisma.user.delete({
                where: { id: user.id },
            });

            return res.status(200).json('User is deleted successfully.');

        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json('An error occurred while deleting the user.');
        }
    }

    static async forgetPassword(req: Request, res: Response) {
        const { email } = req.body;

        try {
            // Find User
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(404).json('This User does not exist!');
            }

            if (!user.is_active) {
                return res.json('Your account is deactive!');
            }

            // Generate OTP Code and Save to OTP Table
            const userId = Number(user.id);
            const code = getRandomInt();
            const otpResult = await prisma.otp.create({
                data: {
                    userId,
                    code,
                },
            });

            // Send OTP Code to User's Email
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Reset Password Code',
                html: `<h1>Your Reset Password Code is: ${code}</h1>`,
            });

            return res.json(otpResult);

        } catch (error) {
            console.error('Error processing password reset request:', error);
            return res.status(520).json('Unknown error, please try again later.');
        }
    }

    static async newPassword(req: Request, res: Response) {
        const { email, code } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);

        const user = await prisma.user
            .findUnique({
                where: { email: email },
            })
            .then(async (user) => {
                if (user?.is_active == false) {
                    return res.json('Your Account is Deactive!');
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
                                    data: { password: password },
                                })
                                .then(async () => {
                                    await prisma.otp.deleteMany({
                                        where: { userId: user?.id },
                                    });
                                    return res
                                        .status(200)
                                        .json('Your Password is Changed!');
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
                    return res.status(404).json('This User is Not Exist!');
                }
            });
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const SecretKey = process.env.SECRET_KEY as string;

        try {
            // Find User
            const user = await prisma.user.findUnique({
                where: { email: email },
            });

            // Handle case where user is not found
            if (!user) {
                return res.status(404).json('This User does not exist!');
            }

            // Check if the user is active
            if (!user.is_active) {
                return res.json('Your account is deactivated!');
            }

            // Check password
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const token = jwt.sign({ id: user.id }, SecretKey, {
                    expiresIn: '24h',
                });
                return res.json({ token });
            }
            return res.status(401).json('Username or password is incorrect!');
        } catch (error) {
            // Log the error and send a generic error response
            console.error('Error during login:', error);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    static async changePassword(req: Request, res: Response) {
        const userId = req.params.id;

        const { newPassword, repeatNewPassword } = req.body;

        if (newPassword != repeatNewPassword) {
            return res.json('New Password Does Not Match');
        }

        const user = await prisma.user
            .findUnique({
                where: { id: parseInt(userId) },
            })
            .then(async (user) => {
                const newPass = await bcrypt.hash(newPassword, 10);

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
        const userId = parseInt(req.params.id);

        const { fullname, email, type, is_active } = req.body;

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
                            email,
                            type,
                            is_active,
                        },
                    })
                    .then((update) => {
                        return res.status(200).json(update);
                    })
                    .catch((error) => {
                        if (error.code == 'P2002') {
                            return res
                                .status(409)
                                .json('This Email is Already Taken!');
                        }
                        return res.json(error);
                    });
            });
    }
}
