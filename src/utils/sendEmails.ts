import nodeMailer from "nodemailer";

// import dotenv from "dotenv";
// dotenv.config();

export const sendEmail = async (options: any) => {
    const transporter = nodeMailer.createTransport({
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        host: "1.2.3.4",
        port: 465,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_APP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.to,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};
