import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


export const sendMail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: 'mothishprojectemail@gmail.com',
            to: to,
            subject: subject,
            text: text
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        return null;
    }
};