import nodemailer from "nodemailer";

const MAIL_HOST = process.env.MAIL_HOST ;
const MAIL_PORT = 587;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

    export const transporter = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: false,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASSWORD,
        }
    });
